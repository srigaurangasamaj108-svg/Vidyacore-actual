# VidyaCore: 11-Layer Schema Breakdown 🧬🏛️

VidyaCore uses a strictly layered architecture to separate structural navigation, canonical text, and interpretive expansion.

---

## 🌳 Layer 1: Structure (Kalpataru)
- **Table**: `kalpataru`
- **Role**: The "Skeleton." Defines the hierarchy (Veda ➡️ Shakha ➡️ etc.).
- **Key Logic**: Uses `ltree` for fast hierarchical pathing. No textual content here.

---

## 🍎 Layer 2: Canon (Mula)
- **Table**: `mula`
- **Role**: The "Truth." Atomic canonical units (Verses/Mantras).
- **Key Logic**: Linked to a leaf node in the Kalpataru tree.

---

## 🍲 Layer 3: Interpretation (Vyakhya)
- **Table**: `vyakhya`
- **Role**: The "Understanding." Translations and commentaries.
- **Key Logic**: Many-to-One relationship with Mula. Pluralistic by design.

---

## 🔗 Layer 4: Relationships (Sambandha)
- **Table**: `mula_relation`
- **Role**: The "Connective Tissue." Links verses across different texts (e.g., Gita quoting Upanishad).

---

## 👤 Layer 5: Authority (Purusha)
- **Table**: `vedic_person`
- **Role**: The "Identity." Authors, Seers (Rishis), and Acharyas.

---

## 🌿 Layer 6: Lineage (Sampradaya)
- **Table**: `sampradaya`
- **Role**: The "Parampara." Traditional schools of thought.

---

## 🎭 Layer 7: Roles (Person ↔ Text)
- **Table**: `kalpataru_person_role`
- **Role**: The "Context." Defines how a person relates to a specific text (Author, Seer, etc.).

---

## 📚 Layer 8: Edition (Textual Lineage)
- **Table**: `edition`
- **Role**: The "Source." Manuscripts and printed versions.

---

## 🤖 Layer 9: Intelligence (Bodha)
- **Tables**: `mula_embedding`, `vyakhya_embedding`
- **Role**: The "AI Bridge." Vector embeddings for semantic search.

---

## 🌐 Layer 10: Support (Language)
- **Table**: `language`
- **Role**: The "Stabilizer." Controlled list of language codes.

---

## 🧠 Layer 11: Taxonomy (Conceptual)
- **Table**: `shastric_taxonomy`
- **Role**: The "Knowledge Web." Hierarchical ontology of concepts (Atman, Dharma, etc.).
