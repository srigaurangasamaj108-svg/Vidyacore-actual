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

## 🟡 2. The Migration Progress
We have successfully built the **PostgreSQL Bridge**.

### ✅ Step 1: Postgres User Table (COMPLETE)
We have established a production-grade `vidya.users` table in File **`VIDYA_00_AUTH.sql`**.
- **Features**: UUIDs, Role-Based Access (RBAC), Metadata support, and Auditing triggers.
- **Drizzle Sync**: The table is already introspected and ready in `server/db/schema.js`.

### 🔄 Step 2: Swap the Logic (UP NEXT)
We are now ready to update `authController.js`:
- **Old (Mongo)**: `User.findOne({ email })`
- **New (Postgres)**: `db.select().from(users).where(eq(users.email, email))`

---

## 🧪 3. Verification Plan (The "Success Test")
The migration is successful ONLY if:
1.  A new user can be registered and appears in the **Postgres** table.
2.  The existing Frontend login page still works without any modifications to the React code.
3.  The JWT generated from the Postgres user is accepted by the existing middleware.

**This is the very first technical hurdle we must cross before implementing the Vidya layers.**
