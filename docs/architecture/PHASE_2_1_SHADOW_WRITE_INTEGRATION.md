# 🏛️ VidyaCore: Phase 2.1 — Shadow Write & Full-Stack TS

This document details the technical implementation of the **Shadow Write** system and the completion of the **Full-Stack TypeScript** migration.

---

## 🌓 1. The Shadow Write Architecture
The Shadow Write allows VidyaCore to populate the new PostgreSQL Knowledge Graph while maintaining 100% stability in the legacy MongoDB system.

### 🧩 Logic Flow (Auth Registration):
1.  **Incoming Request**: User submits name, email, and password.
2.  **Primary Write (Legacy)**: The user is saved to **MongoDB** via Mongoose. This ensures the current app works exactly as before.
3.  **Shadow Write (New Engine)**: The user is simultaneously saved to **PostgreSQL** via Drizzle.
    - **Mapping**: `name` ➡️ `username`, `email` ➡️ `email`, `hashedPassword` ➡️ `password_hash`.
4.  **Error Isolation**: The Shadow Write is wrapped in a `try/catch` block. If the Postgres save fails, we log the error but allow the MongoDB save to succeed. This prevents any "migration friction" for the user.

---

## ⚡ 2. Full-Stack TypeScript Migration
We have achieved 100% TypeScript coverage for the backend logic:

- **Controllers**: All `.js` controllers migrated to `.ts` with proper `Request` and `Response` types.
- **Routes**: Switched to modern ESM `import/export` syntax, resolving the `argument handler must be a function` conflict.
- **Middleware**: The `authMiddleware` is now a typed module, providing the `req.user` ID to both legacy and new procedures.

---

## 🛠️ 3. Environment Sync
The system now uses **`tsx`** for development, which provides:
- **Watch Mode**: Instant server restarts when code changes.
- **Type Checking**: Real-time verification of database models and API shapes.

---

## 🚀 4. Milestone: `v1.2.0-shadow-write-active`
- **Primary Goal**: Verified dual-database data persistence.
- **Achievement**: New users are now residents of both the NoSQL and Relational worlds.
- **State**: Perfectly Functional.

---

**With the "Shadow Write" active, we are now ready to begin the first Shastric Ingestion into the Kalpataru tree.** 🌿🏛️💎🚀🚣‍♂️
