-- =====================================================
-- 🚩 VIDYA SCHEMA — MASTER QUALITY & TRUST (Consolidated)
-- =====================================================
-- Purpose:
-- Ensures integrity, trust, and scholarly verification across the graph.
--
-- Features:
-- 1. Content Flags: Marks AI-generated, disputed, or low-confidence data.
-- 2. Guru-Shishya Graph: Maps traditional lineages and influences between people.
-- 3. Search Intelligence: Logs semantic queries to improve retrieval over time.
-- 4. Scholarly Citations: Links all data to verifiable external sources.
-- =====================================================

SET search_path TO vidya;

-- =====================================================
-- 🌿 1. ENUMS & TYPES
-- =====================================================

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_flag_type') THEN
        CREATE TYPE content_flag_type AS ENUM (
            'DISPUTED', 'LOW_CONFIDENCE', 'AI_GENERATED', 'REQUIRES_REVIEW'
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'person_relation_type') THEN
        CREATE TYPE person_relation_type AS ENUM (
            'DISCIPLE_OF', 'TEACHER_OF', 'INFLUENCED_BY', 'CONTEMPORARY'
        );
    END IF;
END $$;

-- =====================================================
-- 🏛️ 2. CONTENT FLAGS (Quality Control)
-- =====================================================

CREATE TABLE IF NOT EXISTS content_flag (
    id BIGSERIAL PRIMARY KEY,
    
    -- 📍 Entity Link
    entity_type TEXT NOT NULL, -- 'MULA', 'VYAKHYA', 'RELATION', 'TAXONOMY'
    entity_id BIGINT NOT NULL,

    -- 🏷️ Classification
    flag_type content_flag_type NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 🏛️ 3. PERSON RELATIONS (Guru-Shishya Graph)
-- =====================================================

CREATE TABLE IF NOT EXISTS person_relation (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT gen_random_uuid(),

    -- 🔗 Relation Ends (Directional: from -> to)
    from_person_id BIGINT NOT NULL REFERENCES vedic_person(id) ON DELETE CASCADE,
    to_person_id BIGINT NOT NULL REFERENCES vedic_person(id) ON DELETE CASCADE,

    -- 🧬 Semantic Type
    relation_type person_relation_type NOT NULL,
    confidence_score INT DEFAULT 100 CHECK (confidence_score BETWEEN 1 AND 100),
    
    -- ⏳ Chronology & Meta
    start_year INT,
    end_year INT,
    metadata JSONB DEFAULT '{}'::jsonb,

    CONSTRAINT chk_person_no_self CHECK (from_person_id <> to_person_id)
);

-- =====================================================
-- 🏛️ 4. SEARCH QUERY LOG (AI Improvement)
-- =====================================================

CREATE TABLE IF NOT EXISTS search_query_log (
    id BIGSERIAL PRIMARY KEY,
    query TEXT NOT NULL,
    embedding VECTOR(1536), -- Semantic vector of query
    
    -- 📍 Interaction tracking
    clicked_mula_id BIGINT REFERENCES mula(id),
    clicked_vyakhya_id BIGINT REFERENCES vyakhya(id),

    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 🏛️ 5. SOURCE CITATION (Scholarly Verification)
-- =====================================================

CREATE TABLE IF NOT EXISTS source_citation (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT gen_random_uuid(),

    -- 📚 Publication Info
    title TEXT NOT NULL,
    author TEXT,
    publication TEXT,
    year INT,
    url TEXT,

    metadata JSONB DEFAULT '{}'::jsonb
);

-- Link Citations to Entities
CREATE TABLE IF NOT EXISTS citation_link (
    citation_id BIGINT REFERENCES source_citation(id) ON DELETE CASCADE,
    
    entity_type TEXT NOT NULL, -- 'MULA', 'VYAKHYA', 'RELATION', 'TAXONOMY'
    entity_id BIGINT NOT NULL,
    
    note TEXT,
    PRIMARY KEY (citation_id, entity_type, entity_id)
);

-- =====================================================
-- ⚡ 6. INDEXES
-- =====================================================

CREATE UNIQUE INDEX IF NOT EXISTS uq_person_rel_uuid ON person_relation(uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uq_source_citation_uuid ON source_citation(uuid);

-- Lookups
CREATE INDEX IF NOT EXISTS idx_flag_entity ON content_flag(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_person_rel_from ON person_relation(from_person_id);
CREATE INDEX IF NOT EXISTS idx_person_rel_to ON person_relation(to_person_id);
CREATE INDEX IF NOT EXISTS idx_person_rel_type ON person_relation(relation_type);
CREATE INDEX IF NOT EXISTS idx_citation_entity ON citation_link(entity_type, entity_id);

-- Search Intelligence
CREATE INDEX IF NOT EXISTS idx_search_query ON search_query_log USING GIN (to_tsvector('simple', query));

-- =====================================================
-- 📜 7. DOCUMENTATION
-- =====================================================

COMMENT ON TABLE content_flag IS 'Flags content for review, dispute, or AI-origin awareness.';
COMMENT ON TABLE person_relation IS 'The Guru-Shishya (student-teacher) and influence graph.';
COMMENT ON TABLE search_query_log IS 'User query interactions for improving semantic search precision.';
COMMENT ON TABLE source_citation IS 'Scholarly references backing specific claims or mappings.';

-- =====================================================
-- END OF QUALITY & TRUST
-- =====================================================
