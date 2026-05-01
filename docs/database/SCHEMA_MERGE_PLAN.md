# VidyaCore: Schema Consolidation Plan 🛠️🏛️

The goal is to merge each "Initial Schema" file with its "Addendum V2" counterpart to create a single set of 13 "Master" SQL files.

---

## 🏗️ 1. The Consolidation Logic
For each of the 13 components, follow this order when merging:

1.  **Table Definition**: Use the initial CREATE TABLE script.
2.  **Constraints & Defaults**: Add any NOT NULL or DEFAULT values from the Addendum.
3.  **ENUMs & Types**: Move all ENUM creation to the top of the file (using the `DO $$ ...` blocks for safety).
4.  **Indexes**: Group all standard and specialized (GIN/GIST) indexes at the bottom.
5.  **Triggers**: Add the `updated_at` and specialized triggers (like Leaf Detection or Path Enforcement) as the final section.
6.  **Comments**: Ensure the architectural comments are preserved at the very top and for each column.

---

## 📂 2. Target File List
| Merged File Name | Component | Key Hardening to Include |
| :--- | :--- | :--- |
| **`VIDYA_01_FOUNDATION.sql`** | Global | UUID-ossp, ENUMs, Auditing Trigger. |
| **`VIDYA_02_KALPATARU.sql`** | Structure | LTREE path, Depth, Leaf Trigger. |
| **`VIDYA_03_MULA.sql`** | Canon | Fulltext, Word Count, Canonical Flags. |
| **`VIDYA_04_VYAKHYA.sql`** | Interpretation | Language FK, Chunking, Confidence Score. |
| **`VIDYA_05_TAXONOMY.sql`** | Concepts | Domain/Class ENUMs, Alias Uniqueness. |
| **`VIDYA_06_RELATIONS.sql`** | Graph | Symmetry Check, Weights. |
| **`VIDYA_07_PERSON.sql`** | Authority | Alt-name GIN, Historical Flag. |
| **`VIDYA_08_SAMPRADAYA.sql`** | Lineage | LTREE hierarchy, Self-parenting check. |
| **`VIDYA_09_ATTRIBUTION.sql`**| Roles | Drashta (Seer) logic, Primary flag. |
| **`VIDYA_10_EDITION.sql`** | Sources | Base Edition (Derivation) links. |
| **`VIDYA_11_INTELLIGENCE.sql`**| AI Layer | IVFFlat Vector Index, Chunking. |
| **`VIDYA_12_LANGUAGE.sql`** | Support | ISO Validation, Endonyms, Native Script. |
| **`VIDYA_13_QUALITY.sql`** | Trust | Content Flags, Guru-Shishya, Search Logs. |

---

## 🧪 3. Verification Post-Merge
Once a file is merged, it should be tested against a local Postgres instance to ensure:
1.  **No Syntax Errors**.
2.  **No Table/Enum Duplicates** (handled by `IF NOT EXISTS` and `DO $$` blocks).
3.  **Trigger Validity** (test by inserting a dummy row and checking `updated_at` or `path`).

---

## 🚀 4. The Next Step
After these 13 Master Files are ready, we will use them to generate our **Drizzle Schemas** in TypeScript. This will be the "Big Bang" of our codebase.
