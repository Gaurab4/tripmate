# Deploy Backend + Database to AWS

This guide deploys the Django backend and PostgreSQL on AWS using **RDS** (database) and **ECS Fargate** (backend container). Alternative: **App Runner** instead of ECS if you prefer a simpler setup.

---

## Overview

| Component | AWS service | Purpose |
|-----------|-------------|---------|
| Database | **RDS for PostgreSQL** | Managed PostgreSQL; backups, security |
| Backend  | **ECS Fargate** or **App Runner** | Runs your Docker image; scales, no servers to manage |

You will:
1. Create a PostgreSQL database on RDS.
2. Push your backend Docker image to **Amazon ECR**.
3. Run the image on **ECS Fargate** (or App Runner), connected to RDS.
4. Expose the backend via **Application Load Balancer (ALB)** and get a URL (e.g. `https://api.yourdomain.com`).

---

## Prerequisites

- AWS account and CLI configured (`aws configure`).
- Docker installed (to build and push the image).

---

## Step 1: Create PostgreSQL on RDS

1. In **AWS Console** → **RDS** → **Create database**.
2. Choose **PostgreSQL 15**.
3. **Templates**: Production (or Dev/Test for cheaper).
4. **Settings**:
   - DB instance identifier: e.g. `tripmate-db`
   - Master username: e.g. `tripuser`
   - Master password: set a strong password (save it).
5. **Instance configuration**: e.g. `db.t3.micro` for dev.
6. **Storage**: default (e.g. 20 GB).
7. **Connectivity**:
   - VPC: default (or your custom VPC).
   - **Public access**: Yes (for simplicity; for production prefer private subnet + NAT or VPC peering).
   - VPC security group: create new, e.g. `tripmate-db-sg`.
8. **Database name**: `tripmate`.
9. Create database.

After creation:

- Note the **Endpoint** (e.g. `tripmate-db.xxxxx.us-east-1.rds.amazonaws.com`).
- In **Security group** → Inbound rules: add **PostgreSQL (5432)** from the security group you will use for ECS (or from `0.0.0.0/0` only for quick dev testing; restrict in production).

---

## Step 2: Create ECR repository and push image

```bash
# Set your AWS region and account ID
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_URI=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/tripmate-backend

# Create ECR repo
aws ecr create-repository --repository-name tripmate-backend --region $AWS_REGION

# Log in Docker to ECR
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Build and push (from tripmate-backend directory)
cd tripmate-backend
docker build -t tripmate-backend .
docker tag tripmate-backend:latest $ECR_URI:latest
docker push $ECR_URI:latest
```

---

## Step 3: Run backend on ECS Fargate

### 3a. Create cluster and task execution role (if needed)

- **ECS** → Clusters → Create cluster → name e.g. `tripmate-cluster` (Networking: default VPC).
- Ensure you have a **task execution role** that can pull from ECR and write logs (e.g. `ecsTaskExecutionRole`). Create from ECS first-run wizard if missing.

### 3b. Task definition

1. **ECS** → Task definitions → Create new.
2. **Task definition family**: `tripmate-backend`.
3. **Task role**: same as execution role or a role with no extra permissions for now.
4. **Container**:
   - Name: `backend`
   - Image URI: `$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/tripmate-backend:latest`
   - Port: `8000`.
   - **Environment variables** (add all):

     | Name | Value |
     |------|--------|
     | DJANGO_SECRET_KEY | (generate: `openssl rand -base64 48`) |
     | DEBUG | False |
     | ALLOWED_HOSTS | * (or your ALB/domain later) |
     | DB_HOST | `<RDS endpoint>` |
     | DB_PORT | 5432 |
     | DB_NAME | tripmate |
     | DB_USER | tripuser |
     | DB_PASSWORD | `<RDS master password>` |
     | CORS_ALLOWED_ORIGINS | https://your-frontend-domain.com |

   - **Secrets** (recommended for production): put `DJANGO_SECRET_KEY` and `DB_PASSWORD` in **Secrets Manager** or **SSM Parameter Store** and reference them in the task definition instead of plain env.

5. **Health check** (optional): command `CMD-SHELL curl -f http://localhost:8000/api/ || exit 1` or a simple path you expose.
6. Create task definition.

### 3c. Create ALB (optional but recommended)

- **EC2** → Load Balancing → Load Balancers → Create **Application Load Balancer**.
- Name: `tripmate-alb`, scheme Internet-facing, subnets: at least 2.
- Security group: allow 80/443 from 0.0.0.0/0 (or your frontend only).
- Target group: new, name `tripmate-tg`, target type IP, port 8000, protocol HTTP.
- Create ALB; note its DNS name and ARN.

### 3d. Create ECS service

1. **ECS** → Clusters → `tripmate-cluster` → Create service.
2. **Compute**: Fargate.
3. **Task definition**: `tripmate-backend` (latest).
4. **Service name**: `tripmate-backend`.
5. **Desired tasks**: 1.
6. **Networking**: same VPC as RDS; subnets that can reach RDS; security group that allows outbound to RDS:5432 and inbound 8000 from ALB (or 0.0.0.0/0 for quick dev).
7. **Load balancing**: Application Load Balancer → existing ALB → existing target group `tripmate-tg`, listener 80 (or 443), path `/` or empty.
8. Create service.

### 3e. Run migrations (one-off)

Run a one-off ECS task with the same task definition and the following **override** command:

```text
sh -c "python manage.py migrate --noinput && python manage.py runserver 0.0.0.0:8000"
```

Or use **ECS Exec** or a temporary task that runs:

```bash
python manage.py migrate --noinput
```

Then stop that task. The Fargate service will keep running the normal image (gunicorn).

---

## Step 4: Get backend URL and frontend config

- **With ALB**: Backend URL = `http://<ALB-DNS-name>` (or `https://...` if you attach a certificate to the listener).
- **Without ALB** (dev only): Use the ECS task’s public IP and port 8000 (if the security group allows it).

Set in your **frontend** (e.g. in build env or `.env.production`):

```bash
VITE_API_URL=https://your-alb-dns-name-or-domain
```

Rebuild the frontend so it uses this API base URL.

---

## Step 5: CORS and ALLOWED_HOSTS

- **ALLOWED_HOSTS**: Set to your backend host (ALB DNS or domain), e.g. `api.yourdomain.com`, or `*` only for quick testing.
- **CORS_ALLOWED_ORIGINS**: Set to your frontend origin(s), e.g. `https://your-app.vercel.app` or `https://yourdomain.com`. No trailing slash.

---

## Alternative: AWS App Runner (simpler than ECS)

1. **App Runner** → Create service → Source: **Container registry** → ECR → select `tripmate-backend:latest`.
2. **Configure**:
   - Port 8000.
   - Add the same environment variables as in the ECS task (DB_HOST = RDS endpoint, etc.).
3. **Networking**: Use a VPC connector to the same VPC as RDS so the container can reach the database.
4. Create; App Runner gives you a URL. Run migrations once (e.g. via a one-off task or a management command invoked elsewhere).
5. Set **VITE_API_URL** to the App Runner URL and **CORS_ALLOWED_ORIGINS** to your frontend URL.

---

## Checklist

- [ ] RDS PostgreSQL created; security group allows ECS/App Runner → 5432.
- [ ] Backend image in ECR; ECS task (or App Runner) uses that image and env vars (DB_*, DJANGO_SECRET_KEY, CORS, ALLOWED_HOSTS).
- [ ] Migrations run once.
- [ ] Backend URL reachable (ALB or App Runner URL).
- [ ] Frontend built with `VITE_API_URL` set; CORS includes that frontend origin.
- [ ] For production: use HTTPS (ALB + ACM certificate), strong secrets, and restrict DB access to the backend security group only.
