-- =====================================================
-- 🌿 VIDYA SCHEMA — MASTER SAMPRADAYA (Consolidated)
-- =====================================================
-- Purpose:
-- Represents traditional lineages (Parampara) of knowledge transmission.
--
-- Features:
-- 1. Hierarchy: Uses LTREE to map lineage branches (e.g. Gaudiya branch of Madhva).
-- 2. Lineage Integrity: Path automation and self-parenting checks.
-- 3. Temporal Context: Tracking active vs extinct lineages via centuries.
-- =====================================================

SET search_path TO vidya;

-- =====================================================
-- 🏛️ 1. MAIN TABLE: SAMPRADAYA
-- =====================================================

CREATE TABLE IF NOT EXISTS sampradaya (
    -- 🆔 Identity
    id BIGSERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT gen_random_uuid(),

    -- 🌳 Hierarchy
    parent_id BIGINT REFERENCES sampradaya(id),
    path LTREE,

    -- 🏷️ Core Identity
    name TEXT NOT NULL,
    philosophy_name TEXT, -- e.g. Advaita, Dvaita
    mula_acharya_id BIGINT REFERENCES vedic_person(id),

    -- ⏳ Status & Temporal
    is_active BOOLEAN DEFAULT TRUE,
    start_century TEXT,
    end_century TEXT,

    -- 🧾 Metadata
    metadata JSONB DEFAULT '{}'::jsonb,

    -- ⚖️ Constraints
    CONSTRAINT uq_sampradaya_name UNIQUE (name),
    CONSTRAINT chk_sampradaya_no_self CHECK (id IS NULL OR parent_id IS NULL OR id <> parent_id)
);

-- =====================================================
-- ⚡ 2. INDEXES
-- =====================================================

CREATE UNIQUE INDEX IF NOT EXISTS uq_sampradaya_uuid ON sampradaya(uuid);

-- Hierarchy Traversal (GIST)
CREATE INDEX IF NOT EXISTS idx_sampradaya_path ON sampradaya USING GIST(path);
CREATE INDEX IF NOT EXISTS idx_sampradaya_name_search ON sampradaya(name);

-- =====================================================
-- ⚙️ 3. TRIGGERS & FUNCTIONS
-- =====================================================

-- Function: Hierarchy Path Enforcement
CREATE OR REPLACE FUNCTION sampradaya_enforce_path()
RETURNS TRIGGER AS $$
DECLARE parent_record sampradaya;
BEGIN
  IF NEW.parent_id IS NOT NULL THEN
    SELECT * INTO parent_record FROM sampradaya WHERE id = NEW.parent_id;
    IF parent_record IS NULL THEN
      RAISE EXCEPTION 'Parent sampradaya % not found', NEW.parent_id;
    END IF;
    NEW.path := parent_record.path || NEW.id::text;
  ELSE
    NEW.path := NEW.id::text::ltree;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Hierarchy Path
DROP TRIGGER IF EXISTS trg_sampradaya_path ON sampradaya;
CREATE TRIGGER trg_sampradaya_path
BEFORE INSERT OR UPDATE ON sampradaya
FOR EACH ROW EXECUTE FUNCTION sampradaya_enforce_path();

-- =====================================================
-- 📜 4. DOCUMENTATION
-- =====================================================

COMMENT ON TABLE sampradaya IS 'Traditional lineages of knowledge transmission (Parampara).';
COMMENT ON COLUMN sampradaya.path IS 'LTREE path for mapping sub-branches of lineages.';
COMMENT ON COLUMN sampradaya.is_active IS 'Whether this lineage is currently active.';

-- =====================================================
-- END OF SAMPRADAYA
-- =====================================================
