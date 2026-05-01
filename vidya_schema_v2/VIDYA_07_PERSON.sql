-- =====================================================
-- 👤 VIDYA SCHEMA — MASTER PERSON (Consolidated)
-- =====================================================
-- Purpose:
-- Represents all contributors to shastra: Rishis, Acharyas, Editors.
--
-- Features:
-- 1. Identity: Primary and alternate names (GIN indexed).
-- 2. Chronology: start_year and end_year for timeline support.
-- 3. Context: Historical vs Mythic flag.
-- 4. Lineage: Base Sampradaya association.
-- =====================================================

SET search_path TO vidya;

-- =====================================================
-- 🌿 1. ENUMS & TYPES
-- =====================================================

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'person_type') THEN
        CREATE TYPE person_type AS ENUM (
            'RISHI', 'ACHARYA', 'KAVI', 'COMMENTATOR', 'TRANSLATOR', 'EDITOR', 'SCRIBE'
        );
    END IF;
END $$;

-- =====================================================
-- 🏛️ 2. MAIN TABLE: VEDIC PERSON
-- =====================================================

CREATE TABLE IF NOT EXISTS vedic_person (
    -- 🆔 Identity
    id BIGSERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT gen_random_uuid(),

    -- 🏷️ Core Identity
    name TEXT NOT NULL,
    title TEXT,
    alternate_names TEXT[],
    person_type person_type,

    -- 🌳 Context & Lineage
    sampradaya_id BIGINT, -- FK added in VIDYA_08_SAMPRADAYA.sql
    is_historical BOOLEAN DEFAULT TRUE,
    
    -- ⏳ Chronology
    start_year INT,
    end_year INT,
    period TEXT, -- Legacy free-text field

    -- 📝 Content
    biography TEXT,

    -- 🧾 Metadata & Auditing
    metadata JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- ⚡ 3. INDEXES
-- =====================================================

CREATE UNIQUE INDEX IF NOT EXISTS uq_person_uuid ON vedic_person(uuid);

-- Name Normalization & Fast Search
CREATE INDEX IF NOT EXISTS idx_person_name_lower ON vedic_person(LOWER(name));
CREATE INDEX IF NOT EXISTS idx_person_alt_names_search ON vedic_person USING GIN (alternate_names);

-- Fulltext Search (Biography)
CREATE INDEX IF NOT EXISTS idx_person_bio_fulltext ON vedic_person USING GIN (to_tsvector('simple', biography));

-- 🔗 API & Graph Lookups
CREATE INDEX IF NOT EXISTS idx_person_uuid_search ON vedic_person(uuid);

-- =====================================================
-- ⚙️ 4. TRIGGERS
-- =====================================================

-- Trigger: Auditing
DROP TRIGGER IF EXISTS trg_person_updated_at ON vedic_person;
CREATE TRIGGER trg_person_updated_at
BEFORE UPDATE ON vedic_person
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =====================================================
-- 📜 5. DOCUMENTATION
-- =====================================================

COMMENT ON TABLE vedic_person IS 'Rishis, Acharyas, authors, and editors. Authority layer.';
COMMENT ON COLUMN vedic_person.is_historical IS 'Distinguishes between historical vs mythic figures.';
COMMENT ON COLUMN vedic_person.alternate_names IS 'Indexed for fuzzy identity matching across traditions.';

-- =====================================================
-- END OF PERSON
-- =====================================================
