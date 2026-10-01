# Nursify Admin Panel

A private, responsive admin dashboard for managing Nursify's educational content — Subjects, Chapters and Questions — built with React, TypeScript, React Router, Axios, Tailwind CSS and Framer Motion, per the Frontend PRD.

## Getting started

```bash
npm install
cp .env.example .env   # then set VITE_API_BASE_URL to your backend
npm run dev
```

The app runs at `http://localhost:5173`. It expects a backend that implements the endpoints below.

## Environment variables

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the Nursify backend API |

## Expected backend endpoints

These are the endpoints the frontend calls (see `src/api/*.ts`). Adjust the API layer to match your backend if the paths differ — everything else in the app is decoupled from these details.

```
POST   /auth/login                             { email, password } -> { accessToken, refreshToken, admin? }
POST   /auth/refresh                           { refreshToken }    -> { accessToken }
POST   /auth/logout

GET    /subjects
POST   /subjects                               { name, image }
DELETE /subjects/:id

GET    /subjects/:subjectId/chapters
POST   /subjects/:subjectId/chapters           { name }
DELETE /chapters/:id

GET    /chapters/:chapterId/questions
POST   /chapters/:chapterId/questions          { type, text, answers, choices }
DELETE /questions/:id
```

## What's implemented

- **Auth**: login, LocalStorage-persisted access/refresh tokens (`nursify_access_token`, `nursify_refresh_token`), an Axios request interceptor that attaches `Authorization: Bearer <token>`, and a response interceptor that on a 401 refreshes the token once and retries the original request. Concurrent 401s share a single in-flight refresh call. A failed refresh clears auth state and the app redirects to `/login`.
- **Protected routing**: everything except `/login` requires authentication (`src/routes/ProtectedRoute.tsx`).
- **Theme**: light/dark via Tailwind's `class` strategy, toggled from the Navbar, persisted under `nursify_theme`, defaulting to the OS preference on first visit.
- **Subjects / Chapters / Questions modules**: list, add, and delete (with a confirmation dialog) for each, with loading, empty and error states and retry on failure.
- **Dynamic question builder**: `AddQuestion.tsx` is a thin orchestrator; each question type has its own form component under `src/components/QuestionForms/`. The orchestrator owns validation and shapes the exact API payload per type — `answers`/`choices` are always plain string arrays or `null`, never objects.
- **Reusable components**: Navbar, Sidebar (with a mobile drawer), Footer, Button, Input, Textarea, Select, RadioGroup, Card, Table, Modal, Toast, Loading/Skeletons, EmptyState, ConfirmDialog.
- **Animations**: page transitions, button hover/tap, modal enter/exit, staggered card entrance — all via Framer Motion, subtle by default.

## Design notes

The palette (`tailwind.config.js`) pairs a clinical teal (`clinical-*`) with a warm rose accent (`pulse-*`) — trustworthy and precise for the admin chrome, with warmth reserved for calls to action and destructive states. Headings use **Lexend** (chosen for its legibility research in reading/education contexts); body and UI text use **Inter**.

## Project structure

```
src/
├── api/            Axios instance + interceptors, one module per resource
├── components/      Reusable UI + QuestionForms/ (one file per question type)
├── context/         Auth, Theme, Toast
├── hooks/           Thin re-exports of the above contexts
├── layouts/          AuthLayout, DashboardLayout
├── pages/            Login, Subjects/, Chapters/, Questions/
├── routes/           AppRoutes, ProtectedRoute
├── types/            Subject, Chapter, Question, Auth
└── utils/storage.ts  Centralized LocalStorage keys
```

## Not yet built (out of this pass's scope)

Editing existing Subjects/Chapters/Questions, search & pagination, bulk import, analytics, audit logs and real-time updates are all called out in the PRD as P1/P2 or future scope — the folder structure and API layer are set up so any of these can be added without restructuring.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — type-check and build for production
- `npm run preview` — preview the production build locally
