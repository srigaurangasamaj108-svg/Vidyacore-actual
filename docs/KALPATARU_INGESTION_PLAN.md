# Kalpataru Ingestion Plan: From Mula to Pallava 🌳🏛️

This plan outlines the most effective way to populate the `kalpataru` table with your 200+ books and hierarchical structures.

---

## 📊 1. The Column Responsibility Matrix

| Column Name | Responsibility | Description |
| :--- | :--- | :--- |
| **`id`** | 🤖 System (Auto) | Unique internal ID. |
| **`uuid`** | 🤖 System (Auto) | Global ID for external APIs. |
| **`name`** | ✍️ Human (Manual) | Display name (e.g., "Rig Veda", "Sukta 1"). |
| **`parent_id`** | ✍️ Human (Manual) | The ID of the node directly above. |
| **`node_type`** | ✍️ Human (Manual) | MULA, SKANDHA, SHAKHA, PRASHAKHA, or PALLAVA. |
| **`seq`** | ✍️ Human (Manual) | The sorting order among siblings (1, 2, 3...). |
| **`path`** | 🤖 System (Auto) | The LTREE path for fast hierarchical searching. |
| **`shastra_pramana`**| ✍️ Human (Manual) | Classification (SHRUTI, SMRITI, etc.). |
| **`is_grantha`** | ✍️ Human (Manual) | Mark as TRUE for book-level identities (e.g., "Gita"). |
| **`grantha_id`** | 🤖 System (Auto) | Automatically inherited from the `is_grantha` parent. |
| **`grantha_unit`** | ✍️ Human (Manual) | The unit type (adhyaya, mandala, sukta, etc.). |
| **`system_code`** | ✍️ Human (Manual) | Short citation code (e.g., RV, BG, VP). |

---

## 🏛️ 2. Sample Ingestion Hierarchy

### Level 1: Root (MULA)
- **Name**: Vedic Knowledge System
- **Node Type**: MULA
- **Parent ID**: NULL
- **System Code**: `ROOT`

### Level 2: Trunk (SKANDHA)
- **Name**: Nigama (Veda)
- **Node Type**: SKANDHA
- **Parent ID**: [Root ID]
- **Pramana**: SHRUTI

### Level 3: Branch (SHAKHA)
- **Name**: Rig Veda
- **Node Type**: SHAKHA
- **Parent ID**: [Nigama ID]
- **is_grantha**: TRUE
- **system_code**: `RV`

### Level 4: Sub-branch (PRASHAKHA)
- **Name**: Mandala 1
- **Node Type**: PRASHAKHA
- **Parent ID**: [Rig Veda ID]
- **grantha_unit**: `mandala`

### Level 5: Terminal Node (PALLAVA)
- **Name**: Sukta 1
- **Node Type**: PALLAVA
- **Parent ID**: [Mandala 1 ID]
- **grantha_unit**: `sukta`
- **system_code**: `RV.1.1`

---

## 📥 3. How to Prepare Your Data (CSV Method)

You can build a spreadsheet with these columns and import it in batches:

1.  **Batch 1 (Roots)**: Insert the MULA and SKANDHA levels.
2.  **Batch 2 (Granthas)**: Insert all SHAKHA nodes (The 4 Vedas, 18 Puranas, 108 Upanishads). Mark `is_grantha: TRUE`.
3.  **Batch 3 (Structure)**: Insert all PRASHAKHA and PALLAVA nodes. 

**Pro-Tip**: Use the **`system_code`** as your anchor. When inserting a child, you can easily look up the `parent_id` by searching for its `system_code`.

---

## ⚖️ The Trigger's Role
Your `kalpataru_enforce_rules()` trigger is the "Dharma" of this process. If you try to insert a "Sukta" (PALLAVA) under a "Nigama" (SKANDHA) without a "Shakha" in between, the database will **REJECT** the insertion to preserve the traditional integrity.
