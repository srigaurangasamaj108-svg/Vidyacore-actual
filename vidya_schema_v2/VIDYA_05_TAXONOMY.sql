-- =====================================================
-- 🧠 VIDYA SCHEMA — MASTER TAXONOMY (Consolidated)
-- =====================================================
-- Purpose:
-- Defines the controlled conceptual vocabulary of shastra.
-- This is a curated ontology of knowledge, not a free tagging system.
--
-- Domains: Ontology, Sadhana, Ritual, Ethics, Society, Science.
-- Classes: Concept, Practice, Entity, Relation, Quality.
-- =====================================================

SET search_path TO vidya;

-- =====================================================
-- 🌿 1. ENUMS & TYPES
-- =====================================================

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'taxonomy_domain_enum') THEN
        CREATE TYPE taxonomy_domain_enum AS ENUM (
            'ONTOLOGY', 'SADHANA', 'RITUAL', 'ETHICS', 'SOCIETY', 'SCIENCE'
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'taxonomy_class') THEN
        CREATE TYPE taxonomy_class AS ENUM (
            'CONCEPT', 'PRACTICE', 'ENTITY', 'RELATION', 'QUALITY'
        );
    END IF;
END $$;

-- =====================================================
-- 🏛️ 2. MAIN TABLE: SHASTRIC TAXONOMY
-- =====================================================

CREATE TABLE IF NOT EXISTS shastric_taxonomy (
    -- 🆔 Identity
    id BIGSERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,

    -- 🌳 Hierarchy
    parent_id BIGINT REFERENCES shastric_taxonomy(id) ON DELETE CASCADE,
    path LTREE NOT NULL,
    depth INT GENERATED ALWAYS AS (nlevel(path)) STORED,
    is_leaf BOOLEAN DEFAULT TRUE,

    -- 🏷️ Naming & Content
    name_sanskrit TEXT NOT NULL,
    name_english TEXT,
    definition TEXT,

    -- 🧬 Classification
    taxonomy_domain taxonomy_domain_enum NOT NULL,
    taxonomy_class taxonomy_class NOT NULL DEFAULT 'CONCEPT',

    -- 🧾 Metadata
    metadata JSONB DEFAULT '{}'::jsonb,

    -- ⚖️ Constraints
    CONSTRAINT uq_taxonomy_slug_unique UNIQUE (slug)
);

-- =====================================================
-- 🏷️ 3. ALIAS TABLE (Synonyms & Search Terms)
-- =====================================================

CREATE TABLE IF NOT EXISTS taxonomy_alias (
    id BIGSERIAL PRIMARY KEY,
    taxonomy_id BIGINT REFERENCES shastric_taxonomy(id) ON DELETE CASCADE,
    alias TEXT NOT NULL
);

-- =====================================================
-- 🔗 4. MAPPING TABLES (Mula & Vyakhya)
-- =====================================================

-- Map Mula to Taxonomy
CREATE TABLE IF NOT EXISTS mula_taxonomy_map (
    mula_id BIGINT NOT NULL,
    taxonomy_id BIGINT NOT NULL,
    edition_id BIGINT,
    
    confidence_score INT DEFAULT 100 CHECK (confidence_score BETWEEN 1 AND 100),
    is_primary BOOLEAN DEFAULT FALSE,
    justification TEXT,
    source TEXT,

    PRIMARY KEY (mula_id, taxonomy_id) -- Simplified PK
);

-- Separate Unique Index to handle nullable edition_id
CREATE UNIQUE INDEX IF NOT EXISTS uq_mula_taxonomy_composite 
ON mula_taxonomy_map(mula_id, taxonomy_id, COALESCE(edition_id, 0));

-- Map Vyakhya to Taxonomy
CREATE TABLE IF NOT EXISTS vyakhya_taxonomy_map (
    vyakhya_id BIGINT NOT NULL,
    taxonomy_id BIGINT NOT NULL,
    
    confidence_score INT DEFAULT 100 CHECK (confidence_score BETWEEN 1 AND 100),
    is_primary BOOLEAN DEFAULT FALSE,
    justification TEXT,
    source TEXT,

    PRIMARY KEY (vyakhya_id, taxonomy_id)
);

-- =====================================================
-- ⚡ 5. INDEXES
-- =====================================================

CREATE UNIQUE INDEX IF NOT EXISTS uq_taxonomy_uuid ON shastric_taxonomy(uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uq_taxonomy_path ON shastric_taxonomy(path);

-- Alias Normalization
CREATE UNIQUE INDEX IF NOT EXISTS uq_taxonomy_alias_norm ON taxonomy_alias (LOWER(alias));

-- Taxonomy Search & Hierarchy
CREATE INDEX IF NOT EXISTS idx_taxonomy_path_gist ON shastric_taxonomy USING GIST(path);
CREATE INDEX IF NOT EXISTS idx_taxonomy_domain ON shastric_taxonomy(taxonomy_domain);
CREATE INDEX IF NOT EXISTS idx_taxonomy_uuid_search ON shastric_taxonomy(uuid);
CREATE INDEX IF NOT EXISTS idx_taxonomy_definition ON shastric_taxonomy USING GIN (to_tsvector('simple', definition));

-- Primary Tag Enforcement
CREATE UNIQUE INDEX IF NOT EXISTS uq_mula_primary_taxonomy ON mula_taxonomy_map(mula_id) WHERE is_primary = TRUE;
CREATE UNIQUE INDEX IF NOT EXISTS uq_vyakhya_primary_taxonomy ON vyakhya_taxonomy_map(vyakhya_id) WHERE is_primary = TRUE;

-- Mapping Lookups
CREATE INDEX IF NOT EXISTS idx_mula_taxonomy ON mula_taxonomy_map(taxonomy_id);
CREATE INDEX IF NOT EXISTS idx_vyakhya_taxonomy ON vyakhya_taxonomy_map(taxonomy_id);

-- =====================================================
-- ⚙️ 6. TRIGGERS & FUNCTIONS
-- =====================================================

-- Function: Path Construction
CREATE OR REPLACE FUNCTION taxonomy_enforce_path()
RETURNS TRIGGER AS $$
DECLARE
  parent_record vidya.shastric_taxonomy;
BEGIN
  -- Ensure search path includes vidya for ltree and internal calls
  SET search_path TO vidya, public;

  IF NEW.parent_id IS NOT NULL THEN
    SELECT * INTO parent_record FROM shastric_taxonomy WHERE id = NEW.parent_id;
    NEW.path := parent_record.path || NEW.id::text;
  ELSE
    NEW.path := NEW.id::text::ltree;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Hierarchy Path
DROP TRIGGER IF EXISTS trg_taxonomy_path ON shastric_taxonomy;
CREATE TRIGGER trg_taxonomy_path
BEFORE INSERT OR UPDATE ON shastric_taxonomy
FOR EACH ROW EXECUTE FUNCTION taxonomy_enforce_path();

-- Function: Leaf Detection tracking
CREATE OR REPLACE FUNCTION taxonomy_update_leaf()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.parent_id IS NOT NULL THEN
        UPDATE shastric_taxonomy SET is_leaf = FALSE WHERE id = NEW.parent_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Leaf Status
DROP TRIGGER IF EXISTS trg_taxonomy_leaf ON shastric_taxonomy;
CREATE TRIGGER trg_taxonomy_leaf
AFTER INSERT ON shastric_taxonomy
FOR EACH ROW EXECUTE FUNCTION taxonomy_update_leaf();

-- =====================================================
-- 📜 7. DOCUMENTATION
-- =====================================================

COMMENT ON TABLE shastric_taxonomy IS 'Controlled conceptual ontology of shastra.';
COMMENT ON COLUMN shastric_taxonomy.slug IS 'Unique identifier for taxonomy term (system-safe).';
COMMENT ON COLUMN shastric_taxonomy.is_leaf IS 'True if concept has no sub-concepts.';
COMMENT ON TABLE mula_taxonomy_map IS 'Ensures strict primary-tagging for verses.';

-- =====================================================
-- END OF TAXONOMY
-- =====================================================
