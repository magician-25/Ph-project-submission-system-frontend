# PH Instructor

Frontend for the PH instructor assignment and submission system. Built with Next.js App Router, TypeScript, Tailwind CSS v4, shadcn-style UI primitives, TanStack Query/Form, Zod, and `ofetch`.

## Getting started

Install dependencies and configure the backend API root:

```bash
npm install
Copy-Item .env.example .env.local
```

Set `NEXT_PUBLIC_API_BASE_URL` in `.env.local` to the API root that serves `/auth/login`, `/auth/signup`, and `/auth/logout`. Then start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes and layouts

Route groups keep authentication pages separate from the dashboard shell without adding URL segments:

- `/login` and `/register` use the standalone authentication layout.
- `/dashboard`, `/batches`, `/assignments`, and `/submissions` share the dashboard layout and navigation.
- The root route redirects to `/login`.

The dashboard uses `GET /auth/me` to verify the backend-managed session and load the signed-in user's role. `RoleGuard` keeps role-restricted pages out of the wrong workspace; the batches page is administrator-only. The API must also enforce authorization for every protected operation.

## Source structure

```text
src/
  api/             Backend API functions
  app/
    (authentication)/  Login and registration routes
    (dashboard)/       Protected dashboard routes
  components/
    authentication/    Auth forms and guards
    dashboard/         Dashboard shell and page blocks
    ui/                Reusable shadcn-style primitives
  hooks/           TanStack Query mutation hooks
  lib/             API client, session token helpers, and utilities
  providers/       TanStack Query provider
  schemas/         Zod input validation schemas
  types/           Inferred form and API types
```

Login, registration, logout, and profile lookup use the auth endpoints in the Postman collection. The backend owns the session; API requests include credentials and do not read or store access tokens in browser storage. The profile type deliberately excludes password fields.

Authentication API operations use typed response contracts and TanStack Query mutation hooks. API success and failure messages are surfaced with the shared shadcn-style toast component.

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve a production build |
| `npm run lint` | Run Biome checks |
| `npm run format` | Format supported project files |
