# Kalpataru: Deep Dive & Data Ingestion Guide 🌳🏛️

The `kalpataru` table is the "skeleton" of the Vidya system. It defines the hierarchy of knowledge without storing the text itself.

---

## 🌳 1. Feature Breakdown

### A. The Hierarchy Layer (`ltree`)
- **Feature**: The `path` column uses the `LTREE` extension.
- **Why it matters**: It allows for "Subtree Queries." 
- **Example Query**: `SELECT * FROM kalpataru WHERE path <@ '1.5'` will find every single node under node #5, no matter how deep it goes.

### B. The Botanical "Dharma" (`node_type`)
- **Feature**: A strict ENUM hierarchy (MULA ➡️ SKANDHA ➡️ SHAKHA ➡️ PRASHAKHA ➡️ PALLAVA).
- **The Engine**: Your `kalpataru_enforce_rules()` trigger ensures that you can't attach a leaf (Pallava) directly to a root (Mula). It forces the knowledge to follow a traditional "structural discipline."

### C. The Grantha Identity (`is_grantha`)
- **Feature**: Marks a node as a standalone "Book."
- **Why it matters**: A Grantha can be a sub-part of another Grantha (e.g., the Bhagavad Gita is a Grantha inside the Mahabharata). Your trigger automatically propagates the `grantha_id` downwards, so every sub-node knows its "Parent Book."

### D. System Codes & UUIDs
- **Feature**: `uuid` for machines, `system_code` for humans.
- **Why it matters**: It allows for traditional citations (e.g., `BG.2.47`) to be used as unique identifiers in your API without relying on internal database IDs.

---

## 📥 2. Effective Data Ingestion Strategies

### Strategy 1: The "Recursive Ingester" (Best for Large Texts)
Instead of manual entry, use a Node.js script that reads a structured JSON file.

**Sample Data Structure**:
```json
{
  "name": "Mahabharata",
  "node_type": "SHAKHA",
  "is_grantha": true,
  "children": [
    {
      "name": "Bhishma Parva",
      "node_type": "PRASHAKHA",
      "children": [...]
    }
  ]
}
```
**The Script**: The script inserts the parent, gets the `id`, and then calls itself recursively for every child. This is the fastest way to build the tree.

### Strategy 2: Bulk CSV Import with "Self-Healing" Paths
1. Prepare a CSV with `name`, `parent_code`, `node_type`, and `seq`.
2. Use a "Find or Create" logic: 
   - Look for the node with `parent_code`.
   - If it exists, use its `id` as the `parent_id` for the new node.
3. The **Postgres Trigger** will automatically calculate the `path` and `grantha_id` upon insertion.

### Strategy 3: The "Admin Tree" Interface
Building a specialized React component (using `react-dnd` or `rc-tree`) that allows scholars to "Drag and Drop" nodes into the hierarchy. This is the best way to handle "Real Data" that requires human oversight.

---

## ⚖️ Integrity Check
Because of your **Constraints**, if you try to feed "bad data" (e.g., a child without a parent, or a duplicate sequence), the database will **REJECT** the entire batch. This is the "Dharma" that keeps your Vidya system pure.
