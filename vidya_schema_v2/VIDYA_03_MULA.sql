-- =====================================================
-- 🍎 VIDYA SCHEMA — MASTER MŪLA (Consolidated)
-- =====================================================
-- Purpose:
-- Stores original, author-originated śāstric text.
-- Contains ONLY canonical text. No translation or commentary.
--
-- Design Rules:
-- 1. Purity: Only original units (Shloka, Mantra, Sutra).
-- 2. Atomicity: Each row is a single citation unit.
-- 3. Variants: Supports multiple readings via is_canonical/is_variant.
-- =====================================================

SET search_path TO vidya;

-- =====================================================
-- 🌿 1. ENUMS & TYPES
-- =====================================================

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mula_type') THEN
        CREATE TYPE mula_type AS ENUM (
            'SHLOKA', 'MANTRA', 'SUTRA', 'INVOCATION', 'TITLE', 'COLOPHON',
            'DOHA', 'ABHANGA', 'PADYA', 'GADYA', 'OTHER'
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mula_script') THEN
        CREATE TYPE mula_script AS ENUM (
            'DEVANAGARI', 'BENGALI', 'PALI', 'TAMIL', 'TELUGU', 'KANNADA',
            'GURMUKHI', 'IAST', 'BRAHMI', 'GRANTHA', 'SHARADA'
        );
    END IF;
END $$;

-- =====================================================
-- 🏛️ 2. MAIN TABLE: MULA
-- =====================================================

CREATE TABLE IF NOT EXISTS mula (
    -- 🆔 Identity
    id BIGSERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT gen_random_uuid(),

    -- 🌳 Structural Link
    kalpataru_id BIGINT NOT NULL REFERENCES kalpataru(id) ON DELETE CASCADE,
    edition_id BIGINT, -- FK added in VIDYA_10_EDITION.sql

    -- 🔢 Ordering & Citation
    seq INT NOT NULL,
    mula_ref TEXT, -- e.g., '2.47'
    
    -- ⚖️ Canonical Control
    is_canonical BOOLEAN DEFAULT TRUE,
    is_variant BOOLEAN DEFAULT FALSE,
    is_fragment BOOLEAN DEFAULT FALSE,

    -- 📝 Content
    mula_type mula_type NOT NULL,
    mula_script mula_script NOT NULL DEFAULT 'DEVANAGARI',
    text_mula TEXT NOT NULL,
    
    -- 📊 Analytics (Computed)
    word_count INT GENERATED ALWAYS AS (array_length(regexp_split_to_array(text_mula, '\s+'), 1)) STORED,

    -- 🧾 Metadata & Auditing
    metadata JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP DEFAULT NOW(),

    -- ⚖️ Constraints
    CONSTRAINT chk_mula_text_not_empty CHECK (LENGTH(TRIM(text_mula)) > 0),
    CONSTRAINT chk_mula_size_guard CHECK (LENGTH(text_mula) <= 10000)
);

-- =====================================================
-- ⚡ 3. INDEXES
-- =====================================================

CREATE UNIQUE INDEX IF NOT EXISTS uq_mula_uuid ON mula(uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uq_mula_seq ON mula(kalpataru_id, seq, edition_id);

-- Ensure only one canonical reading per group
CREATE UNIQUE INDEX IF NOT EXISTS uq_mula_canonical ON mula(kalpataru_id, seq) 
WHERE is_canonical = TRUE;

-- Handle NULL edition uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS uq_mula_null_edition ON mula(kalpataru_id, seq) 
WHERE edition_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_mula_kalpataru_seq ON mula(kalpataru_id, seq);
CREATE INDEX IF NOT EXISTS idx_mula_type ON mula(mula_type);
CREATE INDEX IF NOT EXISTS idx_mula_ref ON mula(kalpataru_id, mula_ref) WHERE mula_ref IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_mula_uuid_search ON mula(uuid);

-- Fulltext Search
CREATE INDEX IF NOT EXISTS idx_mula_fulltext ON mula USING GIN (to_tsvector('simple', text_mula));

-- =====================================================
-- ⚙️ 4. TRIGGERS & FUNCTIONS
-- =====================================================

-- Function: Mula Integrity Rules
CREATE OR REPLACE FUNCTION mula_enforce_rules()
RETURNS TRIGGER AS $$
DECLARE
  kt_record RECORD;
BEGIN
  SELECT * INTO kt_record FROM kalpataru WHERE id = NEW.kalpataru_id;

  -- Must attach to terminal node
  IF kt_record.node_type <> 'PALLAVA' THEN
    RAISE EXCEPTION 'Mula must attach to terminal Kalpataru node (PALLAVA)';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Structural Rules
DROP TRIGGER IF EXISTS trg_mula_rules ON mula;
CREATE TRIGGER trg_mula_rules
BEFORE INSERT OR UPDATE ON mula
FOR EACH ROW EXECUTE FUNCTION mula_enforce_rules();

-- Trigger: Auditing
DROP TRIGGER IF EXISTS trg_mula_updated_at ON mula;
CREATE TRIGGER trg_mula_updated_at
BEFORE UPDATE ON mula
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =====================================================
-- 📜 5. DOCUMENTATION
-- =====================================================

COMMENT ON TABLE mula IS 'Canonical shastra text. Original authored units only.';
COMMENT ON COLUMN mula.is_canonical IS 'Marks default canonical reading when multiple editions exist.';
COMMENT ON COLUMN mula.is_variant IS 'Marks textual variation or alternate reading.';
COMMENT ON COLUMN mula.is_fragment IS 'Indicates incomplete or damaged textual unit.';
COMMENT ON COLUMN mula.word_count IS 'Computed word count for AI/analytics.';

-- =====================================================
-- END OF MULA
-- =====================================================
