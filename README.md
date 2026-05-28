# Angular Admin SPA 🛡️

A full-stack Single Page Application built with **Angular 15** (frontend) and **Node.js + Express** (backend).

## ✅ Features

### 1. Login Page
- User ID, Password, and Role selection (General User / Admin)
- Form validation with reactive forms
- JWT-based authentication
- Demo credentials displayed on login page

### 2. Dashboard (Logged-in Page)
- **User Details** — shows profile info (name, email, role, department, status, join date)
- **Records Table** — API call fetches records based on user role:
  - **General User** sees 5 records (General User access level only)
  - **Admin** sees all 12 records (both access levels)
- Loading skeletons while data loads

### 3. Admin Features (Admin role only)
- **User Management** — CRUD operations on all users in the database
  - Add new users with role assignment
  - Inline edit (name, email, role, department, status)
  - Delete users with confirmation
- **Configurable API Delay** — set delay parameter (0–5000ms) on both Dashboard and Admin pages to demonstrate async processing
- **Async Loading** — User profile and records load independently on dashboard page load
- **Lazy-loaded Admin Module** — admin module code-splits automatically

## 📂 Project Structure

```
angular-admin-app/
├── backend/                    # Node.js Express API
│   ├── server.js               # Express server entry
│   ├── data/
│   │   ├── users.json          # User data store
│   │   └── records.json        # Records data store
│   ├── routes/
│   │   ├── auth.js             # Login / Register / Profile
│   │   ├── users.js            # CRUD users (Admin only)
│   │   └── records.js          # Get records (role-filtered)
│   ├── middleware/
│   │   └── auth.js             # JWT verify + adminOnly guard
│   └── package.json
│
├── frontend/                   # Angular 15 SPA
│   ├── src/app/
│   │   ├── components/
│   │   │   ├── login/          # Login page
│   │   │   ├── dashboard/      # Dashboard with user details + records table
│   │   │   ├── navbar/         # Navigation bar
│   │   │   └── admin/          # Lazy-loaded admin module
│   │   │       └── user-management/  # Admin user CRUD
│   │   ├── services/
│   │   │   ├── auth.service.ts     # Login, logout, token, profile
│   │   │   ├── user.service.ts     # User CRUD (admin)
│   │   │   └── records.service.ts  # Fetch records
│   │   ├── guards/
│   │   │   └── auth.guard.ts       # Route protection + role check
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts # JWT token injection
│   │   └── models/
│   │       └── user.model.ts       # TypeScript interfaces
│   └── package.json
│
└── README.md
```

## 🚀 How to Run

### Prerequisites
- Node.js 16+ (installed via `brew install node@18`)

### 1. Start Backend (Terminal 1)
```bash
export PATH="/opt/homebrew/opt/node@18/bin:$PATH"
cd angular-admin-app/backend
npm install
node server.js
```
Server runs on **http://localhost:3000**

### 2. Start Frontend (Terminal 2)
```bash
export PATH="/opt/homebrew/opt/node@18/bin:$PATH"
cd angular-admin-app/frontend
npm install    # already done if you built before
npx ng serve
```
App runs on **http://localhost:4200**

## 🔐 Demo Credentials

| User ID | Password | Role         |
|---------|----------|--------------|
| admin   | admin123 | Admin        |
| john    | john123  | General User |
| jane    | jane123  | General User |
| bob     | bob123   | General User |

## 🔌 API Endpoints

| Method | Endpoint          | Auth     | Description                        |
|--------|-------------------|----------|------------------------------------|
| POST   | /api/auth/login   | No       | Login with userId, password, role  |
| POST   | /api/auth/register| No       | Register a new user                |
| GET    | /api/auth/profile | JWT      | Get current user's profile         |
| GET    | /api/records?delay=ms | JWT  | Get records (role-filtered)        |
| GET    | /api/users?delay=ms   | Admin| List all users                     |
| PUT    | /api/users/:id    | Admin    | Update a user                      |
| DELETE | /api/users/:id    | Admin    | Delete a user                      |

## 💡 Key Technical Highlights
- **Reactive Forms** with validation
- **JWT Authentication** with HTTP interceptor
- **Route Guards** with role-based access control
- **Lazy-loaded module** (Admin)
- **Configurable API delay** to demonstrate async/loading states
- **Independent async calls** — profile & records load in parallel on dashboard
- **Local JSON file** as data store (no database required)

