# Frontend on Vercel – connect to your backend

## 1. Set the API URL in Vercel

1. Open your project on [Vercel](https://vercel.com) → **Settings** → **Environment Variables**.
2. Add:

   | Name            | Value                    | Environments   |
   |-----------------|---------------------------|----------------|
   | `VITE_API_URL`  | `https://your-backend-url`| Production, Preview |

   Use your real backend URL (e.g. AWS ALB/App Runner URL), **no trailing slash**.

3. **Redeploy** the project (Deployments → ⋮ → Redeploy) so the new variable is used in the build.

---

## 2. Allow your Vercel app in backend CORS

On the **backend** (e.g. in AWS env vars or `.env`), set:

```bash
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app-*.vercel.app
```

- Replace `your-app` with your Vercel project name.
- If you use a **custom domain**, add it too:  
  `CORS_ALLOWED_ORIGINS=https://your-app.vercel.app,https://www.yourdomain.com`

Then restart/redeploy the backend.

---

## Summary

| Where   | What to set |
|--------|------------------|
| **Vercel** (frontend) | `VITE_API_URL` = backend URL (e.g. `https://api.yourdomain.com`) |
| **Backend** (AWS env) | `CORS_ALLOWED_ORIGINS` = Vercel URL(s) and custom domain(s) |

After both are set and you redeploy frontend and backend, the Vercel app will call your API correctly.
