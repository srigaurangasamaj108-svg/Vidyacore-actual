# VidyaCore: Migration Scripts Log 📜🏛️

This log tracks the 13 foundational migration scripts as they are reviewed and integrated into the project.

---

## ✅ Script 01: Schema Foundation Hardening (Addendum V2)
- **Status**: Received & Analyzed.
- **Key Features**:
    - **UUID Portability**: Installed `uuid-ossp`.
    - **Global ENUMs**: Standardized `authorship_role`, `relation_type`, and `edition_type`.
    - **Auditing**: Implemented `set_updated_at()` global trigger function.
    - **Documentation**: Hardened search paths and added architectural comments to the schema.
- **Action Required**: Ensure these ENUMs are used consistently in the next 12 tables.

---

## ✅ Script 02: Kalpataru Hardening (Addendum V2)
- **Status**: Received & Analyzed.
- **Key Features**:
    - **Performance**: Added `depth` (generated column) for fast level-based queries.
    - **Logic**: Automated `is_leaf` tracking via recursive trigger.
    - **Integrity**: Unique index on `ltree path` to prevent structural collisions.
    - **API Ready**: Indexed `uuid` and `system_code` for ultra-fast lookups.
    - **Constraints**: Enforced Grantha-root consistency.

---
 
 ## ✅ Script 03: Mula Hardening (Addendum V2)
- **Status**: Received & Analyzed.
- **Key Features**:
    - **Philology**: Added `is_canonical` and `is_variant` flags for handling Patha-bheda.
    - **Performance**: Integrated GIN index for ultra-fast Fulltext Search on Sanskrit text.
    - **Analytics**: Added `word_count` as a generated stored column.
    - **Integrity**: Enforced uniqueness for canonical readings and UUIDs.
    - **Reliability**: Added `is_fragment` support for damaged manuscript data.

---

## ✅ Script 04: Vyakhya Hardening (Addendum V2)
- **Status**: Received & Analyzed.
- **Key Features**:
    - **Intelligence**: Added `confidence_score` and `source` to mappings (Acharya vs AI).
    - **Granularity**: Added `anchor_text` for word-level commentary links.
    - **AI Readiness**: Added `is_chunked` flag for RAG/LLM optimization.
    - **Scholarly**: Integrated `edition_id` support for commentaries.
    - **Integrity**: Enforced strict ordering for commentary parts (Intro, Body, Conclusion).

---
 
 ## ✅ Script 05: Taxonomy Hardening (Addendum V2)
- **Status**: Received & Analyzed.
- **Key Features**:
    - **Ontology**: Added `taxonomy_class` (Entity, Practice, Quality) for deep Knowledge Graph logic.
    - **Categorization**: Standardized `taxonomy_domain` (Sadhana, Ritual, Science, etc.).
    - **Integrity**: Enforced "Primary Tag" rule (One main topic per verse).
    - **Search**: Integrated case-insensitive alias uniqueness and fulltext search on definitions.
    - **Structural**: Added `depth` and `is_leaf` tracking for the conceptual tree.

---
 
 ## ✅ Script 06: Relation Hardening (Addendum V2)
- **Status**: Received & Analyzed.
- **Key Features**:
    - **Graph Optimization**: Implemented symmetry detection using `LEAST/GREATEST` unique indexing.
    - **Topological**: Added `weight` for ranking relationship importance in graph traversals.
    - **Scholarly**: Integrated `edition_id` for source and target verses.
    - **Performance**: Composite index for fast relationship-type filtering.
    - **Integrity**: Standardized UUIDs and auditing for every connection.

---

## ✅ Script 07: Person Hardening (Addendum V2)
- **Status**: Received & Analyzed.
- **Key Features**:
    - **Identity**: Implemented GIN index on `alternate_names` for fuzzy, case-insensitive identity matching.
    - **Chronology**: Added `start_year` and `end_year` for historical timeline support.
    - **Context**: Added `is_historical` flag to distinguish between mythic and historical figures.
    - **Categorization**: Standardized `person_type` (Rishi, Acharya, Scribe, etc.).
    - **Integrity**: Standardized UUIDs, Auditing, and case-insensitive name indexing.
---
 
 ## ✅ Script 08: Sampradaya Hardening (Addendum V2)
- **Status**: Received & Analyzed.
- **Key Features**:
    - **Hierarchy**: Integrated `LTREE` for mapping lineage branches and sub-branches (Parampara).
    - **Logic**: Automated path enforcement via trigger to prevent structural errors.
    - **Chronology**: Added temporal fields (`start_century`, `end_century`) for historical tracking.
    - **Integrity**: Enforced unique names, unique UUIDs, and prohibited self-parenting loops.
    - **Discovery**: Indexed paths using GIST for ultra-fast "Ancestry" queries.

---

## ✅ Script 09: Person Role Hardening (Addendum V2)
- **Status**: Received & Analyzed.
- **Key Features**:
    - **Dharma Logic**: Enforced `DRASHTA` (Seer) rule via constraint to prevent assigning lineages to universal mantra-seers.
    - **Attribution**: Added `is_primary` and `seq` for ranking and ordering multiple contributors.
    - **Context**: Integrated `edition_id` to handle role changes across different textual versions.
    - **Integrity**: Unique index on `kalpataru_id + person_id + role` to prevent redundant attributions.
    - **Performance**: Specialized indexes for filtering by role and lineage.
---
 
 ## ✅ Script 10: Edition Hardening (Addendum V2)
- **Status**: Received & Analyzed.
- **Key Features**:
    - **Lineage**: Added `base_edition_id` to track reprints and derivatives (Edition Genealogy).
    - **Categorization**: Implemented `edition_type` (Manuscript, Critical, Digital, Oral).
    - **Localization**: Standardized `language_code` and `script` for authentic rendering.
    - **Integrity**: Enforced unique name/reference pairs and standardized UUIDs.
    - **Performance**: Specialized indexes for filtering by type, language, and base source.

---

## ✅ Script 11: Embedding Hardening (Addendum V2)
- **Status**: Received & Analyzed.
- **Key Features**:
    - **Speed**: Implemented `IVFFlat` indexing with Cosine Similarity for high-speed semantic search.
    - **Granularity**: Added `chunk_index` for long commentaries, enabling RAG to target specific paragraphs.
    - **Future-Proof**: Integrated `model_version` support for seamless AI model upgrades.
    - **Performance**: Added `embedding_norm` for faster vector mathematical operations.
    - **Scalability**: Configured indexing lists for efficient bulk data handling.
---
 
 ## ✅ Script 12: Language Hardening (Addendum V2)
- **Status**: Received & Analyzed.
- **Key Features**:
    - **Cultural UX**: Added `endonym` support for native-script language display.
    - **Standards**: Enforced ISO 2-letter lowercase code validation (`sa`, `en`, `bn`).
    - **Logic**: Added `script_default` mapping to automate frontend font/script rendering.
    - **Categorization**: Integrated `is_classical` flag for scholarly filtering.
    - **Integrity**: Enforced foreign key constraints across Vyakhya and Edition tables.

---

## ✅ Script 13: Quality & Trust Layer (Fresh Additions)
- **Status**: Received & Analyzed.
- **Key Features**:
    - **Integrity**: Implemented `content_flag` to mark AI-generated or disputed content.
    - **Lineage**: Created `person_relation` for mapping Guru-Shishya (student-teacher) graphs.
    - **Intelligence**: Added `search_query_log` with vector support for query ranking and AI improvement.
    - **Scholarly**: Integrated `source_citation` and `citation_link` for external scholarly verification.
    - **Trust**: Enabled confidence scores and primary-tag enforcement across all knowledge layers.

---

## 🏁 Final Status: 13/13 Scripts Received
**All foundational migration scripts have been reviewed and documented. The project is ready for Drizzle Schema generation and Auth Migration.**
