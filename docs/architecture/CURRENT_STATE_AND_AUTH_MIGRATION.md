# VidyaCore: Current State & Auth Migration Plan 🔐🚀

This document details the existing authentication system and the roadmap for migrating it from MongoDB to PostgreSQL.

---

## 🟢 1. The Current State (What's Working)
Currently, the project has a fully functional **User Management System**:
- **Tech Stack**: Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt.
- **Features**:
    - User Registration (`/api/auth/register`) with password hashing.
    - User Login (`/api/auth/login`) returning a JWT.
    - Secure Frontend routing using an `AuthProvider`.
    - Backend middleware to protect routes.

---

## 🛠️ 2. The Migration Objective
We need to swap **Mongoose (Mongo)** for **Drizzle (Postgres)** while keeping the authentication flow exactly the same.

### Step 1: Postgres User Table
Create a `users` table in your local PostgreSQL:
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  uuid UUID DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
```

### Step 2: Swap the Logic
Update `authController.js`:
- **Old (Mongo)**: `User.findOne({ email })`
- **New (Postgres)**: `db.select().from(users).where(eq(users.email, email))`

---

## 🧪 3. Verification Plan (The "Success Test")
The migration is successful ONLY if:
1.  A new user can be registered and appears in the **Postgres** table.
2.  The existing Frontend login page still works without any modifications to the React code.
3.  The JWT generated from the Postgres user is accepted by the existing middleware.

**This is the very first technical hurdle we must cross before implementing the Vidya layers.**
