# Employee Leave Management Portal — Project Plan

## 1. Project Overview

**Client:** IBM (on behalf of a small organization)

IBM has been approached by a small organization that requires a web-based portal for
employees to apply for leave and for managers to review and act on those requests.
This document is the development plan for building that portal.

**Purpose:** Replace manual, email/paper-based leave requests with a centralized web
application where:

- **Employees** register, log in, apply for leave, and track the status/history of their requests.
- **Managers/Admins** review incoming requests from a dashboard and **approve or reject** them.

**Goals:**

- Simple, intuitive, responsive **React** interface usable on desktop and mobile.
- Secure authentication with role-based access (Employee vs. Admin).
- Persistent storage of users and leave records in a database.
- A clean REST API separating the React frontend from backend logic.

---

## 2. Objectives / Core Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | **User Registration & Login** | Users sign up and authenticate. Two roles: `employee` and `admin` (manager). |
| 2 | **Apply for Leave** | Employees submit a leave request choosing a **leave type**, dates, and reason. |
| 3 | **View Leave History (List)** | Employees see a list of all their past and pending requests with current status. |
| 4 | **Admin Dashboard** | Admins view all requests and **Approve** or **Reject** them. |
| 5 | **Responsive UI (React)** | React single-page app with responsive styling for phones, tablets, and desktops. |
| 6 | **Database Integration** | All users and leave requests persisted in MongoDB. |

### Leave Types & Per-User Quotas

The portal supports the following leave types. **Each user has a separate balance
(quota) for every type**, tracked individually rather than as one pooled number.
When a request is **approved**, the days are deducted from that user's balance for
that specific type.

| Type | Value | Default Quota (days/yr) | Notes |
|------|-------|-------------------------|-------|
| **Casual Leave** | `casual` | 12 | Short-notice personal leave. |
| **Sick Leave** | `sick` | 10 | Medical/health-related leave. |
| **Earned Leave** | `earned` | 15 | Accrued/privilege leave. |

*(Default quotas are configurable per user; an admin can adjust them.)*

---

## 3. Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | **React** (Vite or Create React App), React Router, Axios/Fetch, component CSS (optionally Bootstrap/React-Bootstrap or plain CSS) |
| **Backend** | Node.js, Express.js (REST API) |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens) for sessions, bcrypt for password hashing |
| **State (client)** | React Context (or Redux) for auth/user state |
| **Config / Env** | dotenv for environment variables |
| **Tooling (optional)** | nodemon (dev auto-reload), Postman (API testing) |

---

## 4. System Architecture

```
┌──────────────────────┐       HTTP / JSON        ┌──────────────────────┐
│   React SPA           │ ───────────────────────► │   Express REST API   │
│   (Vite build)        │                          │   (Node.js server)   │
│                       │ ◄─────────────────────── │                      │
│  - Components/Pages   │       JSON + JWT         │  - Auth middleware   │
│  - React Router       │                          │  - Controllers       │
│  - Axios API client   │                          │  - Routes            │
└──────────────────────┘                           └──────────┬───────────┘
                                                              │ Mongoose
                                                              ▼
                                                   ┌──────────────────────┐
                                                   │      MongoDB          │
                                                   │  users, leaverequests │
                                                   └──────────────────────┘
```

**Request flow:**

1. The React SPA runs in the browser and calls the Express API over HTTP (JSON).
2. On login, the API returns a **JWT**; React stores it (localStorage) and attaches it
   as an `Authorization: Bearer <token>` header on subsequent requests via an Axios interceptor.
3. Express **auth middleware** verifies the token and, for admin-only routes, checks the role.
4. Controllers read/write data via **Mongoose** models and respond with JSON.
5. React Router guards routes: employees and admins see different pages based on role.

> During development, React (e.g. `localhost:5173`) proxies API calls to Express
> (`localhost:3000`). In production, the built React bundle can be served as static
> files by Express.

---

## 5. Data Models (MongoDB Collections)

### `User`

| Field | Type | Notes |
|-------|------|-------|
| `name` | String | Required |
| `email` | String | Required, unique |
| `passwordHash` | String | bcrypt hash — never store plain text |
| `role` | String | `"employee"` (default) or `"admin"` |
| `leaveBalance` | Object | **Per-type remaining balances**, e.g. `{ casual: 12, sick: 10, earned: 15 }` |
| `createdAt` / `updatedAt` | Date | Auto timestamps |

> On approval, the backend decrements `leaveBalance[type]` by the number of requested
> days and rejects the request if the user has insufficient balance for that type.
> The employee dashboard shows the remaining balance **per leave type**.

### `LeaveRequest`

| Field | Type | Notes |
|-------|------|-------|
| `userId` | ObjectId (ref `User`) | The requesting employee |
| `type` | String (enum) | `"casual"`, `"sick"`, or `"earned"` |
| `startDate` | Date | Required |
| `endDate` | Date | Required |
| `reason` | String | Optional note |
| `status` | String (enum) | `"pending"` (default), `"approved"`, `"rejected"` |
| `reviewedBy` | ObjectId (ref `User`) | Admin who acted on it |
| `createdAt` / `updatedAt` | Date | Auto timestamps |

---

## 6. API Routes

All routes are prefixed with `/api`. Protected routes require a valid JWT;
admin routes additionally require `role: "admin"`.

### Auth

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/auth/register` | Public | Create a new account |
| `POST` | `/api/auth/login` | Public | Authenticate, return JWT + user info |

### Leave

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/leaves` | Employee | Apply for leave (type, dates, reason) |
| `GET` | `/api/leaves/my` | Employee | List the current user's requests (history) |
| `GET` | `/api/leaves` | Admin | List all requests (filter by status/type) |
| `PATCH` | `/api/leaves/:id/status` | Admin | **Approve** or **Reject** a request |

---

## 7. Frontend Pages (React Components)

| Route | Component | Purpose |
|-------|-----------|---------|
| `/register` | `Register` | Sign-up form (name, email, password). |
| `/login` | `Login` | Authentication form; stores JWT + user in context. |
| `/dashboard` | `EmployeeDashboard` | Landing page: **per-type leave balances** (casual/sick/earned) + quick links. |
| `/apply` | `ApplyLeave` | Form with **leave-type dropdown** (Casual/Sick/Earned), start/end dates, reason. |
| `/history` | `LeaveHistory` | List/table of the employee's requests with status badges. |
| `/admin` | `AdminDashboard` | List of all requests with **Approve / Reject** actions and filters. |

**Shared building blocks:**

- `AuthContext` — holds JWT + current user, exposes login/logout.
- `ProtectedRoute` / `AdminRoute` — route guards based on auth and role.
- `api.js` — Axios instance with base URL + JWT interceptor.
- `Navbar` — responsive navigation reflecting the logged-in role.
- `StatusBadge`, `LeaveTypeBadge` — small reusable UI components.

---

## 8. Proposed Folder Structure

```
employee-leave-portal/
├── server/                       # Backend (Node/Express)
│   ├── models/
│   │   ├── User.js
│   │   └── LeaveRequest.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── leaveController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── leaveRoutes.js
│   ├── middleware/
│   │   └── auth.js               # JWT verification + role check
│   ├── config/
│   │   └── db.js                 # Mongoose connection
│   ├── .env                      # MONGO_URI, JWT_SECRET, PORT
│   └── server.js                 # App entry point
│
└── client/                       # Frontend (React + Vite)
    ├── src/
    │   ├── api/
    │   │   └── api.js            # Axios instance + interceptor
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── StatusBadge.jsx
    │   │   └── LeaveTypeBadge.jsx
    │   ├── pages/
    │   │   ├── Register.jsx
    │   │   ├── Login.jsx
    │   │   ├── EmployeeDashboard.jsx
    │   │   ├── ApplyLeave.jsx
    │   │   ├── LeaveHistory.jsx
    │   │   └── AdminDashboard.jsx
    │   ├── App.jsx               # Routes
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js            # dev proxy to /api
    └── package.json
```

---

## 9. Milestones / Timeline

| Phase | Milestone | Key Tasks |
|-------|-----------|-----------|
| **1. Setup** | Project scaffolding | Init server (npm, Express, MongoDB) and client (Vite + React + Router). |
| **2. Authentication** | Register & Login | User model, bcrypt hashing, JWT issue/verify, auth middleware, AuthContext + guards. |
| **3. Apply & History** | Employee flow | LeaveRequest model with **type enum**, create/list-my endpoints, ApplyLeave + LeaveHistory pages. |
| **4. Admin Dashboard** | Approve/Reject | List-all + status-update endpoints, AdminDashboard with **Approve/Reject** buttons & filters. |
| **5. UI Polish** | Responsive design | Styling, navbar, status & leave-type badges, mobile testing. |
| **6. Testing & Deploy** | Ship it | Manual + API tests, seed an admin user, build client, deploy, write README. |

*(Phases are sequential; each builds on the previous. A small team can complete this in roughly 2–3 weeks.)*

---

## 10. Setup & Run Instructions

### Prerequisites

- Node.js (v18+) and npm
- MongoDB (local instance or MongoDB Atlas connection string)

### Backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/leave_portal
JWT_SECRET=replace_with_a_long_random_secret
```

Run it:

```bash
npm run dev      # nodemon (development)
# or
npm start        # production
```

### Frontend

```bash
cd client
npm install
npm run dev      # Vite dev server (e.g. http://localhost:5173)
```

`client/vite.config.js` proxies `/api` requests to the Express server so the SPA and API
work together in development. For production, run `npm run build` and serve the `dist/`
output (optionally via Express as static files).

> **Tip:** Seed an initial admin account (via a script or by manually setting
> `role: "admin"` on a registered user) so you can access the Admin Dashboard.

---

## 11. Version Control (Git Workflow)

**Every code change must be committed to git** — the repository is the single source of
truth and every step of development should be tracked.

- **Initialize** a git repo at the project root (`git init`) with a `.gitignore` covering
  `node_modules/`, `.env`, and build output (`dist/`, `client/dist/`).
- **Commit frequently** — one focused commit per logical change (feature, fix, refactor),
  never large mixed dumps.
- **Clear commit messages** — imperative and descriptive, e.g.:
  - `feat(auth): add JWT login and register endpoints`
  - `feat(leave): add apply-leave form with type dropdown`
  - `feat(admin): approve/reject with per-type balance deduction`
  - `fix(leave): prevent apply when balance is insufficient`
- **Branching** — feature branches off `main` (e.g. `feature/admin-dashboard`), merged
  via pull request once reviewed/tested.
- **Never commit secrets** — keep `.env` out of git; provide a `.env.example` template instead.

Example starting `.gitignore`:

```gitignore
node_modules/
.env
dist/
client/dist/
*.log
```

---

## 12. Future Enhancements

- **Email notifications** — notify employees on approval/rejection and admins on new requests.
- **Leave-balance rules** — auto-deduct approved days, prevent over-booking, per-type quotas.
- **Calendar view** — visualize team leave to avoid scheduling conflicts.
- **Reporting & analytics** — export leave summaries (CSV/PDF), usage dashboards.
- **Multi-level approval** — route requests through multiple managers.
- **Profile management** — password reset, avatar, department/team fields.
```
