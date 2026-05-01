# 🌿 VidyaCore Actual: The Knowledge Operating System 🏛️✨

**VidyaCore** is a production-grade relational knowledge graph and educational platform designed to map the infinite geography of Vedic Shastra. It serves as the "Operating System" for the **Vedic Library**, providing a structured, machine-readable foundation for scriptures, commentaries, and philosophical ontologies.

---

## 🏛️ 1. Core Architecture
VidyaCore uses a unique **7-Layer Epistemic Model** to separate immutable canon from human interpretation:

1.  **Structure**: The `Kalpataru` tree (Veda, Shakha, Purana).
2.  **Canon**: The `Mula` (Original Verses/Mantras).
3.  **Interpretation**: The `Vyakhya` (Commentaries and Tikas).
4.  **Intelligence**: The `Taxonomy` (Ontological Knowledge Graph).
5.  **Authority**: The `Vedic Person` & `Sampradaya` (Lineage tracking).
6.  **Curation**: `Edition` & `Language` (Manuscript precision).
7.  **Trust**: `Quality Flags` & `AI Embeddings`.

---

## 🛠️ 2. Parallel Database Engine
VidyaCore operates on a dual-engine architecture to ensure both stability and high-performance retrieval:

- **🐘 PostgreSQL (Primary)**: Houses the complex 23-table Relational Knowledge Graph. Managed via **Drizzle ORM**.
- **🍃 MongoDB (Legacy)**: Maintained as a stable layer for donation tracking and legacy user data.

---

## 📜 3. Documentation Guide (Source of Truth)
The project documentation is organized into thematic clusters within the [`/docs`](./docs) folder:

### 🏛️ [Architecture](./docs/architecture)
- **[VidyaCore Foundation](./docs/architecture/VIDYA_CORE_FOUNDATION.md)**: The epistemic philosophy.
- **[Knowledge Architecture](./docs/architecture/VIDYA_KNOWLEDGE_ARCHITECTURE.md)**: The 7-layer design.
- **[Backend Design](./docs/architecture/BACKEND_ARCHITECTURE.md)**: Server and API logic.

### 🐘 [Database & Schema](./docs/database)
- **[Master Schema Breakdown](./docs/database/VIDYA_SCHEMA_BREAKDOWN.md)**: Details of the 23 tables.
- **[Postgres & Drizzle Workflow](./docs/database/POSTGRES_DRIZZLE_WORKFLOW.md)**: How the DB and ORM are synced.
- **[Database Credentials](./docs/database/DATABASE_CREDENTIALS.md)**: Access keys for local/cloud instances.

### ⚙️ [Setup & Workflows](./docs/guides)
- **[Schema Setup Guide](./vidya_schema_v2/SCHEMA_SETUP_GUIDE.md)**: The 00-15 deployment sequence.
- **[Git Save Guide](./docs/guides/GIT_SAVE_GUIDE.md)**: Professional version control workflow.
- **[Deployment Manual](./docs/guides/DEPLOYMENT.md)**: Production release instructions.

### 📖 [Content & Ingestion](./docs/content)
- **[Kalpataru Ingestion Plan](./docs/content/KALPATARU_INGESTION_PLAN.md)**: Strategies for populating the tree.
- **[Blogging & Wiki System](./docs/content/VIDYA_BLOGGING_SYSTEM.md)**: Turning the tree into an educational platform.

---

## 🚀 4. Technical Stack
- **Frontend**: React.js, TailwindCSS.
- **Backend**: Node.js, Express.js.
- **ORM**: Drizzle ORM (Postgres), Mongoose (Mongo).
- **Search**: PostgreSQL Vector Embeddings (IVFFlat) for AI similarity.

---

**VidyaCore is a work of digital devotion, built to preserve and project the light of Shastra for generations.** 🌿🏛️✨💎
