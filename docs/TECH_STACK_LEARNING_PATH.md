# VidyaCore: Tech Stack Learning Path 📚🚀

Based on the Drizzle + tRPC architecture, here is your roadmap to mastering the technology behind VidyaCore.

---

## 🏛️ 1. TypeScript: The "Dharma" of the Code
Everything in this stack depends on TypeScript. It ensures that your frontend and backend speak the same language.
- **Key Concepts to Learn**:
    - Types vs. Interfaces.
    - Generics (used heavily in Drizzle and tRPC).
    - Optional vs. Required properties.
- **Why?**: So that when you fetch a `Mula`, your IDE knows exactly which columns exist without you checking the database.

---

## 🛡️ 2. Zod: The "Gatekeeper"
Zod is used by tRPC to validate data *before* it hits your database.
- **Key Concepts to Learn**:
    - `z.string()`, `z.number()`, `z.enum()`.
    - `z.object()` to define complex inputs like a new `Kalpataru` node.
- **Why?**: To prevent "dirty data" from breaking your strict database constraints.

---

## ⚡ 3. Drizzle ORM: The "Database Bridge"
Drizzle is how you will implement your SQL schema in code.
- **Key Concepts to Learn**:
    - **Schema Definition**: Mapping your Postgres types (serial, uuid, ltree, jsonb) to Drizzle code.
    - **Queries**: Using `db.select()`, `db.insert()`, and `.leftJoin()`.
    - **Migrations**: Using `drizzle-kit` to keep your database in sync with your code.
- **Why?**: To perform complex hierarchical queries on your `kalpataru` tree with 100% type safety.

---

## 🌐 4. tRPC vs. REST: The "Knowledge Gateway"
Understanding why we choose tRPC over traditional REST APIs is vital for VidyaCore's complexity.

### 🧱 The REST Way (Traditional)
- **Style**: URLs and JSON. e.g., `GET /api/mula/2.47`.
- **Pain Point**: No automatic type safety. If the backend changes a field name, the frontend breaks silently.
- **Complexity**: Hard to manage with deep relationships (like Kalpataru ➡️ Mula ➡️ Vyakhya).

### ⚡ The tRPC Way (Modern RPC)
- **Style**: Direct function calls. e.g., `api.mula.getByRef("2.47")`.
- **Win**: **End-to-End Type Safety**. If you change a column in Postgres, your React code will immediately show a red underline (error).
- **Simplicity**: No need to manage URLs, HTTP methods, or manual JSON parsing.

---

## 🎨 5. Integration: The "Complete System"
Finally, you learn how to put them together.
- **The Flow**:
    1.  Define a **Zod** schema for the input.
    2.  Write a **tRPC** procedure that takes that input.
    3.  Use **Drizzle** inside that procedure to talk to Postgres.
    4.  Call the procedure from **React** using a simple hook.

---

## 🌟 Recommended Learning Sequence
1.  **Week 1**: Basic TypeScript & Zod (Learn to define structures).
2.  **Week 2**: Drizzle Schema (Map your SQL to Code).
3.  **Week 3**: tRPC Basics (Connect the Frontend to the Backend).
4.  **Week 4**: Advanced Postgres with Drizzle (Implementation of `ltree` and `pgvector`).

**Your VidyaCore system is not just a database—it is a type-safe ecosystem.** Master these tools, and you will have the power to build any complex knowledge system with ease.