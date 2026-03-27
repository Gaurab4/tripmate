# Push backend image to Docker Hub

Replace `YOUR_DOCKERHUB_USERNAME` with your Docker Hub username (e.g. `gaurab`).

## 1. Log in to Docker Hub

```bash
docker login
```

Enter your Docker Hub username and password (or access token).

## 2. Build the image

From the **tripmate-backend** directory:

```bash
cd tripmate-backend
docker build -t tripmate-backend .
```

## 3. Tag for Docker Hub

```bash
docker tag tripmate-backend:latest YOUR_DOCKERHUB_USERNAME/tripmate-backend:latest
```

Example: `docker tag tripmate-backend:latest gaurab/tripmate-backend:latest`

## 4. Push to Docker Hub

```bash
docker push YOUR_DOCKERHUB_USERNAME/tripmate-backend:latest
```

Example: `docker push gaurab/tripmate-backend:latest`

---

## One-liner (after `cd tripmate-backend`)

```bash
docker build -t tripmate-backend . && \
docker tag tripmate-backend:latest YOUR_DOCKERHUB_USERNAME/tripmate-backend:latest && \
docker push YOUR_DOCKERHUB_USERNAME/tripmate-backend:latest
```

---

## Create the repo on Docker Hub first (optional)

If the repo doesn't exist, either:

- Go to [hub.docker.com](https://hub.docker.com) → **Create Repository** → name: `tripmate-backend`, or  
- Push anyway; Docker Hub will create a new **private** repo. For a **public** repo, create it on the website first and set visibility to Public.

After push, the image will be at:  
`https://hub.docker.com/r/YOUR_DOCKERHUB_USERNAME/tripmate-backend`
