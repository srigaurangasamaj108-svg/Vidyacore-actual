# Vidya: Knowledge Architecture Guide 🌿🏛️

This document explains how your **Vidya Schema** transitions between different database technologies and how your current tech stack (Node.js/React) can power it.

---

## 1. The Postgres Foundation (The "Dharma" Layer)
**Current Setup**: Postgres + Drizzle ORM.
- **Why it works**: Your schema relies on **Relational Integrity**. The `parent_id` and `node_type` constraints are "Dharma" (laws) that prevent the knowledge tree from becoming corrupted.
- **Key Feature**: `ltree` is unique to Postgres. It allows you to query an entire lineage (e.g., "Get everything under the Rig Veda") in a single, fast operation.
- **Implementation**: Drizzle will map your `kalpataru` table and ensure that every "Mula" record is correctly attached to a "Pallava" (terminal node).

---

## 2. The MongoDB Alternative (The "Expansion" Layer)
**Scenario**: If you had billions of "Vyakhya" (interpretations) with very different structures (images, audio, complex JSON).
- **Trade-off**: You lose the strict SQL constraints and `ltree` performance. 
- **Mapping**: In Mongo, you would use the "Materialized Path" pattern (storing `path` as a string) to simulate the tree.
- **Verdict**: Keep the **Structure (Kalpataru)** and **Canon (Mula)** in Postgres, but consider MongoDB only if your **Metadata/Vyakhya** becomes too unstructured for SQL.

---

## 3. The Neo4j Future (The "Sambandha" Layer)
**Scenario**: You want to map the deep semantic links between texts (e.g., "This verse in the Gita is an interpretation of this specific Mantra in the Upanishads").
- **Design Ready**: Your rule **"Every FK = Potential Edge"** means your Postgres schema is already a Graph!
- **Migration**:
    - **Nodes**: Every row in `kalpataru`, `mula`, and `person` becomes a Node in Neo4j.
    - **Edges**: The `parent_id` becomes a `:CHILD_OF` edge. The `kalpataru_id` in `mula` becomes a `:TEXT_FOR` edge.
- **The "Hybrid" Approach**: Many modern systems use **Postgres for storage** and **Neo4j for discovery**. Your Node.js API can query Postgres for the text and Neo4j for the "Related Verses" map.

---

## 4. How the Tech Stack Powers Vidya

### A. The "Navigator" API (Node.js + Express)
The backend acts as the "Shastra Gateway."
- **Path Logic**: It uses Drizzle to perform `ltree` queries.
- **Security**: Uses the `authMiddleware` to manage who can contribute new `Vyakhya` (interpretations) or `Taxonomy` nodes.
- **Versioning**: Uses the `edition_id` to allow users to toggle between different recensions of the same text.

### B. The "Interaction" Layer (React)
- **Tree Visualizer**: React can render the `kalpataru` as a dynamic, searchable tree.
- **Comparison View**: Use React's state management to show two different `Vyakhya` (interpretations) side-by-side for a single `Mula`.
- **Semantic Search**: A simple search bar that calls the `pgvector` intelligence layer in the backend.

---

## 🏁 Summary
Your schema is **Future-Proof**. 
- It has the **Strictness** of SQL (Dharma).
- It has the **Flexibility** of JSONB (Vritta).
- It has the **Connectivity** of a Graph (Sambandha).

**By starting with Postgres + Drizzle, you are building the strongest possible foundation.**
