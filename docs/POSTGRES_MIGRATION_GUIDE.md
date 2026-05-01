# Migration Guide: MongoDB (Mongoose) to PostgreSQL (Drizzle ORM) 🐘

This guide explains how to migrate the **TrackMyFunds** backend from a NoSQL database (MongoDB) to a Relational database (PostgreSQL) using **Drizzle ORM**.

---

## 🚫 Files that will NOT Change
The beauty of a modular architecture is that most of your app remains untouched:
- **All Frontend Files (`/client`)**: Since the API endpoints stay the same, the frontend doesn't care about the database change.
- **Middleware (`/server/middleware`)**: Auth logic remains identical.
- **Routes (`/server/routes`)**: The URL paths stay the same.

---

## 🛠️ Files that WILL Change

### 1. `package.json`
You will remove `mongoose` and add:
- `drizzle-orm`: The core ORM.
- `pg`: The PostgreSQL driver.
- `drizzle-kit`: For handling migrations.

### 2. `server.js`
- **Current**: Connects via `mongoose.connect()`.
- **New**: Initializes the Drizzle client using a connection string from Neon.

### 3. `models/` ➡️ `db/schema.js`
In Drizzle, we define tables instead of Mongoose schemas.
- **Mongoose**: 
  ```javascript
  const UserSchema = new mongoose.Schema({ name: String, ... });
  ```
- **Drizzle**: 
  ```javascript
  export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').unique().notNull(),
    password: text('password').notNull(),
  });
  ```

### 4. `controllers/`
The syntax for database queries will change.
- **Mongoose**: `await User.find({ email })`
- **Drizzle**: `await db.select().from(users).where(eq(users.email, email))`

---

## 🚀 Migration Steps

### 1. Database Setup
- Create a new project on **Neon.tech**.
- Copy the connection string to your `.env` as `DATABASE_URL`.

### 2. Define the Schema
Create a new folder `/server/db/` and add `schema.js`. This is where you define your `users`, `transactions`, and `goals` tables.

### 3. Generate Migrations
Use `drizzle-kit` to "push" your schema to the Neon database. This automatically creates the tables for you.
```bash
npx drizzle-kit push:pg
```

### 4. Update Controllers
Update each function in your controllers to use the `db` instance from Drizzle instead of Mongoose models.

---

## Why Drizzle for your project?
- **Relational Integrity**: You can use "Foreign Keys" to ensure every transaction *must* belong to a real user.
- **Speed**: Drizzle has almost zero overhead, making your API faster.
- **Type Safety**: If you ever switch to TypeScript, Drizzle provides world-class type safety.

**This setup is incredibly powerful for complex, high-performance applications!**
