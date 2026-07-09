# Employee Leave Management Portal

A full-stack web app where employees apply for leave and track their requests,
and managers/admins approve or reject them. Built with React (frontend) and
Node/Express/MongoDB (backend).

> This project is split into two clearly separated folders so it's easy to follow:
>
> - `server/` — the backend REST API (Node.js + Express + MongoDB)
> - `client/` — the frontend single-page app (React + Vite)

---

## Features

- Register & login with two roles: employee and admin
- Employees apply for leave (Casual / Sick / Earned), with dates & reason
- Employees see their remaining balance per leave type and their full history
- Admins see all requests, filter them, and Approve / Reject
- On approval, days are deducted from that employee's balance for that type
- Passwords are hashed (bcrypt); sessions use JWT tokens
- Responsive UI that works on phone, tablet, and desktop

---

## Tech Stack

| Layer     | Technology                                   |
| --------- | -------------------------------------------- |
| Frontend  | React  |
| Backend   | Node.js,                              |
| Database  | MongoDB + Mongoose                           |


---



## Getting Started

Open 2 terminals — one for the backend, one for the frontend.

### 1. Backend (`server/`)

```bash
cd server
npm install

# Create your environment file from the template and edit if needed
cp .env.example .env

# Create an admin account so you can use the Admin Dashboard
# (defaults to admin@company.com / admin123)
npm run seed:admin

# Start the API (auto-reloads on changes)
npm run dev
```

The API runs at http://localhost:3000.

### 2. Frontend (`client/`)

```bash
cd client
npm install
npm run dev
```

The app runs at http://localhost:5173 and automatically forwards `/api`
requests to the backend.

---

## How to Use

1. Open http://localhost:5173.
2. Register a new employee account (or log in as the seeded admin:
   `admin@company.com` / `admin123`).
3. As an employee: view your balances, Apply for Leave and check History.
4. As an admin: open the Admin tab to Approve/Reject pending requests.
   Approving deducts days from that employee's balance for that leave type.

---

## Project Structure

```
.
├── server/                 # Backend (Node/Express)
│   ├── config/             # DB connection + leave-type constants
│   ├── models/             # Mongoose schemas (User, LeaveRequest)
│   ├── controllers/        # Business logic
│   ├── routes/             # URL → controller mappings
│   ├── middleware/         # JWT auth + admin check
│   ├── seedAdmin.js        # Helper to create an admin
│   └── server.js           # App entry point
│
└── client/                 # Frontend (React + Vite)
    └── src/
        ├── api/            # Axios instance + token interceptor
        ├── context/        # AuthContext (logged-in user)
        ├── components/     # Navbar, badges, ProtectedRoute
        ├── pages/          # Login, Register, dashboards, etc.
        ├── App.jsx         # Routes
        └── main.jsx        # Entry point
```

---

---

