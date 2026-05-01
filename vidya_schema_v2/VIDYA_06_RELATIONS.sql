-- =====================================================
-- 🔗 VIDYA SCHEMA — MASTER RELATIONS (Consolidated)
-- =====================================================
-- Purpose:
-- Defines explicit relationships between canonical units (Mula).
--
-- Enables:
-- ✔ Cross-text navigation
-- ✔ Philosophical tracing (Shastrartha)
-- ✔ Graph modeling (Neo4j-ready edges)
-- =====================================================

SET search_path TO vidya;

-- =====================================================
-- 🌿 1. ENUMS & TYPES
-- =====================================================

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'mula_relation_type') THEN
        CREATE TYPE mula_relation_type AS ENUM (
            'CITES',        -- Direct citation
            'QUOTES',       -- Exact textual quoting
            'PARALLEL',     -- Similar idea or structure
            'EXPANDS',      -- Builds upon concept
            'SUMMARIZES',   -- Condensed form
            'REFUTES',      -- Contradicts or debates
            'SUPPORTS'      -- Reinforces same idea
        );
    END IF;
END $$;

-- =====================================================
-- 🏛️ 2. MAIN TABLE: MULA_RELATION
-- =====================================================

CREATE TABLE IF NOT EXISTS mula_relation (
    -- 🆔 Identity
    id BIGSERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT gen_random_uuid(),

    -- 🔗 Relation Ends (Nodes)
    from_mula_id BIGINT NOT NULL,
    to_mula_id BIGINT NOT NULL,

    -- 📚 Scholarly Context
    from_edition_id BIGINT,
    to_edition_id BIGINT,

    -- 🧬 Semantic Type & Weight
    relation_type mula_relation_type NOT NULL,
    confidence_score INT DEFAULT 100 CHECK (confidence_score BETWEEN 1 AND 100),
    is_symmetrical BOOLEAN GENERATED ALWAYS AS (relation_type IN ('PARALLEL','SUPPORTS')) STORED,
    weight FLOAT DEFAULT 1.0,

    -- Context & Meta
    justification TEXT,
    source TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP DEFAULT NOW(),

    -- ⚖️ Constraints
    CONSTRAINT chk_no_self_relation CHECK (from_mula_id <> to_mula_id)
);

-- =====================================================
-- ⚡ 3. INDEXES
-- =====================================================

CREATE UNIQUE INDEX IF NOT EXISTS uq_mula_relation_uuid ON mula_relation(uuid);

-- Deduplication Constraint (Strict)
CREATE UNIQUE INDEX IF NOT EXISTS uq_mula_relation_unique ON mula_relation(
    from_mula_id, to_mula_id, relation_type,
    COALESCE(from_edition_id, 0), COALESCE(to_edition_id, 0)
);

-- Prevent Reverse Duplicates for Symmetric Relations
CREATE UNIQUE INDEX IF NOT EXISTS uq_relation_symmetric ON mula_relation(
    LEAST(from_mula_id, to_mula_id),
    GREATEST(from_mula_id, to_mula_id),
    relation_type
) WHERE relation_type IN ('PARALLEL','SUPPORTS');

-- Graph Traversal & Lookups
CREATE INDEX IF NOT EXISTS idx_relation_from_type ON mula_relation(from_mula_id, relation_type);
CREATE INDEX IF NOT EXISTS idx_relation_to ON mula_relation(to_mula_id);
CREATE INDEX IF NOT EXISTS idx_relation_symmetry ON mula_relation(is_symmetrical);
CREATE INDEX IF NOT EXISTS idx_relation_confidence ON mula_relation(confidence_score);

-- =====================================================
-- ⚙️ 4. TRIGGERS
-- =====================================================

-- Trigger: Auditing
DROP TRIGGER IF EXISTS trg_relation_updated_at ON mula_relation;
CREATE TRIGGER trg_relation_updated_at
BEFORE UPDATE ON mula_relation
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =====================================================
-- 📜 5. DOCUMENTATION
-- =====================================================

COMMENT ON TABLE mula_relation IS 'Cross-text connections between canonical units. Graph-ready.';
COMMENT ON COLUMN mula_relation.is_symmetrical IS 'True for relations where A->B is identical to B->A.';
COMMENT ON COLUMN mula_relation.weight IS 'Importance of link for graph traversal algorithms.';

-- =====================================================
-- END OF RELATIONS
-- =====================================================
