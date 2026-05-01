# 🌿 VidyaCore Master Schema: Setup & Architecture Guide

Welcome to the **VidyaCore Knowledge Operating System**. This guide explains the logic behind your 16-file consolidated PostgreSQL schema and how to maintain its shastric integrity.

---

## 🏛️ 1. The "7-Layer" Architecture
VidyaCore is organized into logical layers that separate immutable scripture from mutable human interpretation.

| Order | Layer | File | Purpose |
| :--- | :--- | :--- | :--- |
| **00** | **Auth** | `VIDYA_00_AUTH.sql` | User management and security. |
| **01** | **Foundation** | `VIDYA_01_FOUNDATION.sql` | Extensions (ltree, vector), shared Enums, and Auditing. |
| **02** | **Structure** | `VIDYA_02_KALPATARU.sql` | The geography of the library (Rig Veda, Gita, etc.). |
| **03-04** | **Content** | `VIDYA_03_MULA.sql`, `04` | Original text and its commentaries. |
| **05-06** | **Intelligence** | `VIDYA_05_TAXONOMY.sql`, `06` | Conceptual ontology and the cross-text graph. |
| **07-09** | **Authority** | `VIDYA_07_PERSON.sql`, `08`, `09` | Lineages (Sampradaya) and Authorship. |
| **10-12** | **Curation** | `VIDYA_10_EDITION.sql`, `11`, `12` | Manuscripts, AI Embeddings, and Languages. |
| **13-14** | **Trust/UI** | `VIDYA_13_QUALITY.sql`, `14` | Content flags and the Wiki/Blogging layer. |
| **15** | **Integrity** | `VIDYA_15_INTEGRITY.sql` | **The Wiring Layer** (Foreign Keys). |

---

## ⚙️ 2. Why the "Integrity Layer" (File 15) is Necessary

### The "Chicken and Egg" Problem
In complex databases, tables often refer to each other in circles. For example:
- **`mula`** (File 03) needs to know which **`edition`** (File 10) it belongs to.
- **`vedic_person`** (File 07) needs to know their **`sampradaya`** (File 08).
- **`sampradaya`** (File 08) needs to know its founding **`vedic_person`** (File 07).

If we tried to create these links inside the initial `CREATE TABLE` commands, the sequence would break because the "Target" table wouldn't exist yet.

### The Solution: De-Coupling
We use a **two-phase deployment strategy**:
1.  **Phase 1 (Files 00–14)**: Create the "Skeletons." Every table is created successfully as an independent entity. No cross-table constraints are enforced yet.
2.  **Phase 2 (File 15)**: The "Wiring." Once all tables are standing, we run `ALTER TABLE` commands to "plug in" all the Foreign Keys and relationships.

This ensures a **flawless, repeatable deployment** every time.

---

## 🚀 3. Deployment Instructions

To reset and redeploy the entire system, run the files in strict numerical order:

```bash
# 1. Reset Database
dropdb vidyacore && createdb vidyacore

# 2. Sequential Deployment
for file in vidya_schema_v2/*.sql; do 
  psql -d vidyacore -f "$file"
done
```

---

## 💎 4. Key Hardening Features
- **UUIDs Everywhere**: Every entity has a global UUID for API and Graph compatibility.
- **LTREE Hierarchies**: Kalpataru and Sampradayas use PostgreSQL's `ltree` for infinite-depth branching.
- **AI-Ready**: Vector embeddings are indexed using `IVFFlat` for semantic similarity search.
- **Auditing**: Every table has a `updated_at` trigger that updates automatically on any change.

---

**VidyaCore is now a production-grade relational knowledge graph. Use it wisely.** 🌿🏛️✨
