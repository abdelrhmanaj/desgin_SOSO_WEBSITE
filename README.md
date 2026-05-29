# SOSO Style

Full-stack boutique catalog and booking app for SOSO Style.

## Project Structure

- `frontend` - React/Vite customer site and admin dashboard.
- `backend` - Express/MongoDB API, auth, bookings, products, categories, contact messages, and customer opinions.

## Local Development

Backend:

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Frontend:

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

## Deployment Notes

GitHub Pages can host the frontend only. The backend needs a Node host such as Render, Railway, Azure, or a VPS, plus a MongoDB database.

For GitHub Pages, add these repository secrets before running the workflow:

- `VITE_API_URL` - backend API URL, for example `https://your-backend-domain.com/api`
- `VITE_API_ORIGIN` - backend origin, for example `https://your-backend-domain.com`

