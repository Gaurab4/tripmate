# Backend Docker workflow

## First time / after pulling

```bash
cd tripmate-backend
docker compose up --build
```

- API: http://localhost:8000  
- Migrations run automatically on startup.

---

## When you change **code** (views, serializers, settings, etc.)

- **No rebuild needed.** Your project is mounted into the container.
- Save the file; `runserver` reloads automatically.
- If it doesn’t, restart: `docker compose restart backend`.

---

## When you change **models** (migrations)

1. **Create migrations** (choose one):

   **Option A – on your machine (with venv):**
   ```bash
   source venv/bin/activate
   python manage.py makemigrations
   ```

   **Option B – inside the running container:**
   ```bash
   docker compose exec backend python manage.py makemigrations
   ```
   New migration files will appear in your repo (because the app is mounted).

2. **Apply migrations** (choose one):

   - Restart so the default command runs migrate again:
     ```bash
     docker compose restart backend
     ```
   - Or run migrate once without restart:
     ```bash
     docker compose exec backend python manage.py migrate
     ```

---

## When you change **dependencies** (e.g. `requirements.txt`)

Rebuild the image so the new packages are installed:

```bash
docker compose up --build
```

---

## Useful commands

| Task | Command |
|------|--------|
| Run backend + DB | `docker compose up -d` |
| View logs | `docker compose logs -f backend` |
| Stop everything | `docker compose down` |
| Shell in backend | `docker compose exec backend sh` |
| Create superuser | `docker compose exec backend python manage.py createsuperuser` |
