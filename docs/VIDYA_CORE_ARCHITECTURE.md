# VidyaCore: Technical Architecture 🏛️⚙️

VidyaCore is a high-performance, type-safe "Vedic Knowledge Operating System" built on the **T3 Stack**.

---

## 🏗️ 1. The Technology Stack (T3+)

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | React / Next.js | Modern, server-side rendered UI. |
| **API Layer** | tRPC | End-to-end type safety (Backend ↔ Frontend). |
| **ORM** | Drizzle ORM | Light, SQL-first database management. |
| **Database** | PostgreSQL | Relational engine with `ltree` & `pgvector`. |
| **Validation** | Zod | Strict input validation for API safety. |
| **Styling** | Tailwind CSS | Utility-first, responsive design. |

---

## 🧬 2. The 11-Layer Data Model
VidyaCore organizes information into strictly separated layers to ensure integrity and scalability.

1.  **🌳 Kalpataru (Structure)**: Hierarchical tree using `ltree`.
2.  **🍎 Mula (Canon)**: Atomic canonical text units (Shloka/Mantra).
3.  **🍲 Vyakhya (Interpretation)**: Many-to-Many translations and commentaries.
4.  **🔗 Sambandha (Relation)**: Semantic links between canonical units.
5.  **👤 Purusha (Authority)**: Rishis, Acharyas, and contributors.
6.  **🌿 Sampradaya (Lineage)**: Hierarchical traditional lineages.
7.  **🎭 Role (Context)**: Defines how a person relates to a text.
8.  **📚 Edition (Lineage)**: Specific manuscripts or printed versions.
9.  **🌐 Bhasha (Language)**: Controlled list of supported languages.
10. **🤖 Bodha (Intelligence)**: Semantic vector embeddings (`pgvector`).
11. **🧠 Taxonomy (Concept)**: Curated hierarchical ontology.

---

## 🌐 3. API Communication (tRPC)
Instead of traditional REST endpoints, VidyaCore uses **tRPC procedures**. This allows the frontend to call backend functions directly:
- `api.vidya.getVerse({ id: 2.47 })` ➡️ Returns a typed object with `text_mula` and `vyakhya` arrays.

---

## 🤖 4. Intelligence Layer
Using `pgvector`, VidyaCore enables "Meaning-Based Search."
- **Process**: Text ➡️ OpenAI/Gemini Embedding ➡️ Postgres Vector ➡️ Similarity Search.
- **Goal**: Allows users to "Ask the Shastra" in natural language.

---

## 🚀 5. Deployment Strategy
- **Backend/Frontend**: Vercel (Optimized for Next.js).
- **Database**: Neon (Serverless PostgreSQL).
- **Security**: JWT-based authentication with session management.
