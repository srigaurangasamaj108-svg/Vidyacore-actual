# VidyaCore: Drill-down Blogging & Educational System 🌿📖

This system transforms the `kalpataru` structural tree into an interactive educational platform where every node (Veda, Shakha, Purana) has its own elaborate "Article."

---

## 📂 1. Database Layer: `kalpataru_content`
To keep the tree navigation fast, we store long-form descriptions in a separate table.

### 🛠️ Table Design
| Column | Type | Role |
| :--- | :--- | :--- |
| **`id`** | BIGSERIAL | Internal ID. |
| **`kalpataru_id`** | BIGINT | UNIQUE link to the tree node. |
| **`title`** | TEXT | The headline for the article (e.g., "The Infinite Wisdom of Nigama"). |
| **`content_body`** | TEXT | The 1/2 to 1 page description (Markdown or HTML). |
| **`featured_image`** | TEXT | URL to an image representing that Shastra. |
| **`author_id`** | BIGINT | Link to `vedic_person` (Who wrote the summary?). |
| **`metadata`** | JSONB | Reading time, difficulty level, etc. |

### 🏛️ SQL Schema
```sql
CREATE TABLE kalpataru_content (
  id BIGSERIAL PRIMARY KEY,
  kalpataru_id BIGINT REFERENCES kalpataru(id) UNIQUE, -- One description per node
  title TEXT,          -- Catchy title for the blog post
  content_body TEXT,   -- Your 1-page elaborate description (Markdown/HTML)
  author_id BIGINT REFERENCES vedic_person(id), -- Who wrote this explanation?
  last_updated TIMESTAMP DEFAULT now()
);
```

---

## 🌐 2. Frontend Logic: The "Reader Flow"

### A. The "Wiki" Navigation
When a user selects a node in the tree:
1.  **API Call**: `api.vidya.getContent({ kalpataru_id: X })`.
2.  **Display**: React renders the `content_body`.
3.  **Hierarchy**: Below the article, React automatically lists the "Children" of that node as "Next Steps" or "Explore Further."

### B. Split-Panel Interface
- **Sidebar**: High-level tree (Nigama > Rig Veda > Mandala 1).
- **Center**: The Article (Detailed explanation with Sanskrit quotes).
- **Bottom**: "Recommended Reading" or "Connected Taxonomy Concepts."

---

## 🧠 3. Why this is powerful for VidyaCore
- **Contextual Learning**: Instead of just seeing a list of 108 Upanishads, the user reads *why* they are important before they dive into the verses.
- **SEO Optimization**: Each node's content creates a unique page for search engines to index, bringing more people to the platform.
- **Scholarly Commentary**: It allows you to add modern scholarly context to ancient structures without mixing them into the `mula` (Canon) layer.

---

## 🚀 4. Implementation Step
In our **Drizzle Schema**, we will simply add a "One-to-One" relationship:
- **`kalpataru`** hasOne **`kalpataru_content`**.

This ensures that when you fetch a node, you can optionally include its elaborate description only when the user is in "Read Mode."