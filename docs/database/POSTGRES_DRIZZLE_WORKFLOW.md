# 🐘 VidyaCore: PostgreSQL & Drizzle Setup Guide

This guide documents the transition from raw SQL schema modules to a fully integrated **Drizzle ORM** engine running parallel to MongoDB.

---

## 🛠️ 1. Database Construction (The "Foundations")

We consolidated 14+ migration scripts into a strict **00 to 15** sequential deployment.

### 📜 Deployment Sequence:
1.  **`00_AUTH`**: Schema creation, users, and shared auditing functions.
2.  **`01-14`**: Epistemic layers (Kalpataru, Mula, Vyakhya, Taxonomy, etc.).
3.  **`15_INTEGRITY`**: The "Wiring" layer that establishes all Foreign Key constraints.

### 💻 Terminal Commands Used:
```bash
# 1. Reset and Create Database
dropdb vidyacore && createdb vidyacore

# 2. Deploy all layers in sequence
for file in vidya_schema_v2/*.sql; do 
  psql -d vidyacore -f "$file"
done
```

---

## 🏗️ 2. Drizzle ORM Integration (The "Bridge")

To make the database usable in Node.js, we used **Drizzle Kit** to introspect the 23 tables.

### 📂 File Structure:
- **`server/drizzle.config.js`**: Configuration for the Drizzle toolkit.
- **`server/db/schema.js`**: The JavaScript structural map of the database.
- **`server/db/relations.js`**: The mapping of all scholarly relationships.
- **`server/db/index.js`**: The main Postgres connection pool.

### ⚡ Steps Followed:
1.  **Introspection**: `npx drizzle-kit pull` was used to read the live `vidyacore` database.
2.  **Conversion**: Since the server uses **CommonJS**, we converted the generated `.ts` files into clean `.js` files.
3.  **Schema Filtering**: We configured Drizzle to only look inside the **`vidya`** schema.

---

## 🐘 3. Local Access (DBeaver/GUI)

To observe the knowledge graph visually, use the following credentials in **DBeaver** or **pgAdmin**:

| Field | Value |
| :--- | :--- |
| **Driver** | PostgreSQL |
| **Host** | `localhost` |
| **Port** | `5432` |
| **Database** | `vidyacore` |
| **User** | `ppublications` |
| **Password** | (Empty) |
| **Default Schema**| `vidya` |

---

## 🌓 4. Shadow Database (Best Practices)

We recommend maintaining a **Shadow Database** (`vidyacore_shadow`) for safe development:
- **Purpose**: To test new SQL migrations before they touch the main Knowledge Graph.
- **Setup**: Run the `00-15` sequence against a new database named `vidyacore_shadow`.

---

**Your VidyaCore engine is now production-hardened and documented.** 🌿🏛️💎🚀🚣‍♂️
