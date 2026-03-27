# AWS deployment checklist – what to do in order

Do these in order. Your frontend is on Vercel; you only need to deploy **backend + database** on AWS.

---

## 1. Database (RDS)

| # | Where | What to do |
|---|--------|------------|
| 1.1 | AWS Console → **RDS** → Create database | Engine: **PostgreSQL 15** |
| 1.2 | Template | **Dev/Test** (cheaper) or Production |
| 1.3 | Settings | DB identifier: `tripmate-db`, Master username: `tripuser`, **set and save** a strong Master password |
| 1.4 | Instance | e.g. **db.t3.micro** |
| 1.4 | Connectivity | **Public access: Yes**, create new security group (e.g. `tripmate-db-sg`) |
| 1.5 | Additional | **Database name**: `tripmate` |
| 1.6 | Create database | Wait until status **Available** |
| 1.7 | Copy | **Endpoint** (e.g. `tripmate-db.xxxxx.us-east-1.rds.amazonaws.com`) and the **password** you set |
| 1.8 | RDS → your DB → **Connectivity & security** | Click the **VPC security group** link |
| 1.9 | Security group → **Inbound rules** → Edit | Add rule: Type **PostgreSQL**, Port **5432**, Source **0.0.0.0/0** (for testing; restrict to your ECS/ALB in production) → Save |

---

## 2. Backend image (ECR + Docker)

| # | Where | What to do |
|---|--------|------------|
| 2.1 | Terminal (AWS CLI configured) | `AWS_REGION=us-east-1` (or your region) |
| 2.2 | Terminal | `aws ecr create-repository --repository-name tripmate-backend --region $AWS_REGION` |
| 2.3 | Terminal | `AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)` |
| 2.4 | Terminal | `aws ecr get-login-password --region $AWS_REGION \| docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com` |
| 2.5 | Terminal | `cd tripmate-backend` |
| 2.6 | Terminal | `docker build -t tripmate-backend .` |
| 2.7 | Terminal | `docker tag tripmate-backend:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/tripmate-backend:latest` |
| 2.8 | Terminal | `docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/tripmate-backend:latest` |
| 2.9 | Note | Your image URI: `$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/tripmate-backend:latest` |

---

## 3. Run backend (ECS Fargate)

| # | Where | What to do |
|---|--------|------------|
| 3.1 | AWS Console → **ECS** → Clusters | **Create cluster** → Name: `tripmate-cluster` → Create |
| 3.2 | ECS → **Task definitions** → Create new | Family: `tripmate-backend`, Launch type: **Fargate**, Task role & Execution role: **ecsTaskExecutionRole** (create if missing) |
| 3.3 | Add container | Name: `backend`, Image URI: **paste the ECR image URI from 2.9**, Port: **8000** |
| 3.4 | Same container → **Environment variables** | Add (replace placeholders): |
| | | `DJANGO_SECRET_KEY` = run `openssl rand -base64 48` and paste |
| | | `DEBUG` = `False` |
| | | `ALLOWED_HOSTS` = `*` |
| | | `DB_HOST` = **RDS endpoint from 1.7** |
| | | `DB_PORT` = `5432` |
| | | `DB_NAME` = `tripmate` |
| | | `DB_USER` = `tripuser` |
| | | `DB_PASSWORD` = **RDS password from 1.7** |
| | | `CORS_ALLOWED_ORIGINS` = **your Vercel URL**, e.g. `https://your-app.vercel.app` |
| | | `GEMINI_API_KEY` = your key (if you use it) |
| | | `GOOGLE_PLACES_API_KEY` = your key (if you use it) |
| 3.5 | Create task definition | |
| 3.6 | ECS → Clusters → **tripmate-cluster** → Create service | Launch type: Fargate, Task definition: **tripmate-backend**, Service name: `tripmate-backend`, Number of tasks: **1** |
| 3.7 | Networking | Same VPC as RDS, **Public subnets**, Security group: create new (allow **inbound 8000** from **0.0.0.0/0** so you can hit the backend URL) |
| 3.8 | Create service | |
| 3.9 | ECS → Clusters → tripmate-cluster → **Services** → **tripmate-backend** → **Tasks** | Open the running task → **Public IP** = your backend URL. Base URL = `http://<Public-IP>:8000` |

---

## 4. Run migrations (one-time)

| # | Where | What to do |
|---|--------|------------|
| 4.1 | ECS → Clusters → tripmate-cluster → **Task definitions** → **tripmate-backend** → **Create new revision** | Under container **backend** → **Command override**: `sh,-c,python manage.py migrate --noinput` |
| 4.2 | ECS → Clusters → tripmate-cluster → **Tasks** → **Run new task** | Task definition: latest **tripmate-backend**, same VPC/subnets as service, launch type Fargate. Run task. |
| 4.3 | Wait | Task runs, runs migrations, then stops. Check **Logs** for success. |
| 4.4 | Optional | Change task definition back (remove command override) so the service keeps using the normal gunicorn command. |

Or from your laptop (if RDS has **public access** and security group allows your IP on 5432):

```bash
cd tripmate-backend
# In .env set DB_HOST=<RDS endpoint>, DB_PASSWORD=<RDS password>, etc.
python manage.py migrate --noinput
```

---

## 5. Connect frontend (Vercel)

| # | Where | What to do |
|---|--------|------------|
| 5.1 | **Vercel** → Project → Settings → Environment variables | Add `VITE_API_URL` = `http://<ECS-task-public-IP>:8000` (or your ALB/domain later). Redeploy. |
| 5.2 | **Backend** (already set in 3.4) | `CORS_ALLOWED_ORIGINS` = your Vercel URL (e.g. `https://your-app.vercel.app`) |

---

## 6. Optional: HTTPS and a fixed URL

- **Application Load Balancer (ALB)** in front of ECS, with an **ACM certificate** for HTTPS.
- Or put **CloudFront** in front of the ALB and use a custom domain (e.g. `api.yourdomain.com`).

Then set **VITE_API_URL** to that URL (e.g. `https://api.yourdomain.com`) and **ALLOWED_HOSTS** / **CORS** to match.

---

## Quick reference

| Item | Value |
|------|--------|
| RDS endpoint | From step 1.7 |
| RDS password | The one you set in 1.3 |
| Backend URL (for now) | `http://<ECS-task-public-IP>:8000` |
| Vercel env var | `VITE_API_URL` = backend URL |
| Backend env var | `CORS_ALLOWED_ORIGINS` = Vercel URL |

Full details and App Runner option: see **DEPLOY_AWS.md**.
