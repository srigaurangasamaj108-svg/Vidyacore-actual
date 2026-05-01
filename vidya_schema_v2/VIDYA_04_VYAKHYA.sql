-- =====================================================
-- 🍲 VIDYA SCHEMA — MASTER VYĀKHYĀ (Consolidated)
-- =====================================================
-- Purpose:
-- Stores all forms of interpretation, translation, and commentary.
-- Associated with Mula.
--
-- Components:
-- 1. Vyakhya (The interpretive content)
-- 2. Mapping (Link between Vyakhya and Mula)
--
-- Design Rule:
-- Multiple interpretations from different traditions coexist without conflict.
-- =====================================================

SET search_path TO vidya;

-- =====================================================
-- 🌿 1. ENUMS & TYPES
-- =====================================================

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vyakhya_type') THEN
        CREATE TYPE vyakhya_type AS ENUM (
            'mula', -- Rare use
            'bhashya', 'tika', 'tippani', 'tippani_extended',
            'shabdartha', 'anvaya', 'padaccheda', 'vigraha',
            'bhavartha', 'tatparya', 'arthavistara',
            'vivarana', 'vyakhyana',
            'anuvada', 'bhasantara', 'bhavanuvada',
            'sutra_summary', 'key_points',
            'shirshaka', 'upashirshaka', 'pushpika'
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vyakhya_part') THEN
        CREATE TYPE vyakhya_part AS ENUM (
            'AVATARIKA',   -- Introductory framing
            'VYAKHYANA',   -- Main explanation
            'UPASAMHARA',  -- Conclusion
            'TIPPNI'       -- Notes / remarks
        );
    END IF;
END $$;

-- =====================================================
-- 🏛️ 2. MAIN TABLE: VYAKHYA
-- =====================================================

CREATE TABLE IF NOT EXISTS vyakhya (
    -- 🆔 Identity
    id BIGSERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT gen_random_uuid(),

    -- 🏷️ Classification
    vyakhya_type vyakhya_type NOT NULL,
    part_type vyakhya_part DEFAULT 'VYAKHYANA',

    -- 👤 Authorship & Context
    author_id BIGINT,
    source_name TEXT, -- Fallback for anonymous/inst source
    sampradaya_id BIGINT,
    edition_id BIGINT,

    -- 🌐 Language & Rendering
    language_code TEXT NOT NULL,
    script TEXT,

    -- 📝 Content
    text_vyakhya TEXT NOT NULL,
    seq INT DEFAULT 1,
    is_chunked BOOLEAN DEFAULT FALSE, -- RAG/AI readiness

    -- 🧾 Metadata & Auditing
    metadata JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP DEFAULT NOW(),

    -- ⚖️ Constraints
    CONSTRAINT chk_vyakhya_text CHECK (LENGTH(TRIM(text_vyakhya)) > 0)
);

-- =====================================================
-- 🔗 3. MAPPING TABLE: VYAKHYA_MULA_MAP
-- =====================================================

CREATE TABLE IF NOT EXISTS vyakhya_mula_map (
    vyakhya_id BIGINT REFERENCES vyakhya(id) ON DELETE CASCADE,
    mula_id BIGINT REFERENCES mula(id) ON DELETE CASCADE,

    -- 📍 Mapping Precision
    anchor_text TEXT, -- targeted segment of Mula
    confidence_score INT DEFAULT 100 CHECK (confidence_score BETWEEN 0 AND 100),
    source TEXT DEFAULT 'acharya', -- acharya, scholar, ai

    PRIMARY KEY (vyakhya_id, mula_id)
);

-- =====================================================
-- ⚡ 4. INDEXES
-- =====================================================

CREATE UNIQUE INDEX IF NOT EXISTS uq_vyakhya_uuid ON vyakhya(uuid);

-- Unique order per context
CREATE UNIQUE INDEX IF NOT EXISTS uq_vyakhya_order 
ON vyakhya(author_id, part_type, seq, COALESCE(edition_id, 0));

CREATE INDEX IF NOT EXISTS idx_vyakhya_type ON vyakhya(vyakhya_type);
CREATE INDEX IF NOT EXISTS idx_vyakhya_author ON vyakhya(author_id);
CREATE INDEX IF NOT EXISTS idx_vyakhya_language ON vyakhya(language_code);
CREATE INDEX IF NOT EXISTS idx_vyakhya_uuid_search ON vyakhya(uuid);

-- Fulltext Search
CREATE INDEX IF NOT EXISTS idx_vyakhya_fulltext ON vyakhya USING GIN (to_tsvector('simple', text_vyakhya));

-- Mapping Indexes
CREATE INDEX IF NOT EXISTS idx_vyakhya_map_mula ON vyakhya_mula_map(mula_id);
CREATE INDEX IF NOT EXISTS idx_vyakhya_map_confidence ON vyakhya_mula_map(confidence_score);

-- =====================================================
-- ⚙️ 5. TRIGGERS
-- =====================================================

-- Trigger: Auditing
DROP TRIGGER IF EXISTS trg_vyakhya_updated_at ON vyakhya;
CREATE TRIGGER trg_vyakhya_updated_at
BEFORE UPDATE ON vyakhya
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =====================================================
-- 📜 6. DOCUMENTATION
-- =====================================================

COMMENT ON TABLE vyakhya IS 'Interpretation layer of shastra. Includes translation, commentary, explanation.';
COMMENT ON COLUMN vyakhya.is_chunked IS 'True if content is processed for RAG/AI context windows.';
COMMENT ON COLUMN vyakhya_mula_map.anchor_text IS 'Exact substring or segment of Mula targeted by this explanation.';
COMMENT ON COLUMN vyakhya_mula_map.confidence_score IS '0–100 confidence of the semantic mapping.';

-- =====================================================
-- END OF VYAKHYA
-- =====================================================
