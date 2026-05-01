-- =====================================================
-- 🌳 VIDYA SCHEMA — MASTER KALPATARU (Consolidated)
-- =====================================================
-- Purpose:
-- Defines the hierarchical structure of all Vedic literature.
-- This table is the "Geography" of knowledge—no textual content.
--
-- Design Pattern:
-- MULA → SKANDHA → SHAKHA → PRASHAKHA → PALLAVA
-- =====================================================

SET search_path TO vidya;

-- =====================================================
-- 🌿 1. ENUMS & TYPES
-- =====================================================

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'kalpataru_node_type') THEN
        CREATE TYPE kalpataru_node_type AS ENUM (
            'MULA',        -- Root (Absolute origin)
            'SKANDHA',     -- Trunk (Shruti, Smriti)
            'SHAKHA',      -- Branch (Rig Veda, Mahabharata)
            'PRASHAKHA',   -- Sub-branch (Mandala, Parva, Upanishad)
            'PALLAVA'      -- Terminal unit (Adhyaya, Sukta, Gita)
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'shastra_pramana_enum') THEN
        CREATE TYPE shastra_pramana_enum AS ENUM (
            'SHRUTI',
            'SMRITI',
            'ITIHASA_PURANA',
            'VEDANGA',
            'UPANGA',
            'UPAVEDA',
            'AGAMA'
        );
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'grantha_unit_enum') THEN
        CREATE TYPE grantha_unit_enum AS ENUM (
            'shastra',
            'parva', 'upaparva', 'kanda', 'skandha', 'sarga', 'adhyaya', 'adhikarana',
            'mandala', 'sukta', 'rc', 'kanda_veda', 'prapathaka', 'anuvaka', 'arcika', 'gana',
            'valli', 'brahmana_section', 'khanda',
            'pada', 'sutra', 'ahnika',
            'patala',
            'sthana', 'prakarana', 'ullasa', 'pariccheda', 'prasna',
            'sloka', 'mantra', 'sutra_unit',
            'section'
        );
    END IF;
END $$;

-- =====================================================
-- 🏛️ 2. MAIN TABLE: KALPATARU
-- =====================================================

CREATE TABLE IF NOT EXISTS kalpataru (
    -- 🆔 Identity
    id BIGSERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT gen_random_uuid(),

    -- 🌳 Hierarchy
    parent_id BIGINT REFERENCES kalpataru(id) ON DELETE CASCADE,
    path LTREE NOT NULL,
    depth INT GENERATED ALWAYS AS (nlevel(path)) STORED,
    is_leaf BOOLEAN DEFAULT TRUE,

    -- 🏷️ Semantic Info
    name TEXT NOT NULL,
    name_devanagari TEXT, -- Sri Krishna in original script
    slug TEXT NOT NULL, -- sri-krishna for clean URLs
    description TEXT,
    node_type kalpataru_node_type NOT NULL,
    seq INT NOT NULL,

    shastra_pramana shastra_pramana_enum,

    -- 📘 Grantha Context
    is_grantha BOOLEAN DEFAULT FALSE,
    grantha_id BIGINT REFERENCES kalpataru(id),
    grantha_unit grantha_unit_enum,
    system_code TEXT,

    -- 🧾 Metadata & Auditing
    metadata JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP DEFAULT NOW(),

    -- ⚖️ Constraints
    CONSTRAINT uq_kalpataru_slug UNIQUE (slug),
    CONSTRAINT chk_root_rule CHECK (

        (node_type = 'MULA' AND parent_id IS NULL) OR
        (node_type <> 'MULA' AND parent_id IS NOT NULL)
    ),
    CONSTRAINT chk_grantha_valid CHECK (
        is_grantha = FALSE OR node_type IN ('SHAKHA','PRASHAKHA','PALLAVA')
    ),
    CONSTRAINT chk_grantha_null CHECK (
        grantha_id IS NULL OR grantha_unit IS NOT NULL
    ),
    CONSTRAINT chk_grantha_root_consistency CHECK (
        NOT is_grantha OR grantha_id = id
    ),
    CONSTRAINT chk_no_self_parent CHECK (
        id IS NULL OR parent_id IS NULL OR id <> parent_id
    )
);

-- =====================================================
-- ⚡ 3. INDEXES
-- =====================================================

CREATE UNIQUE INDEX IF NOT EXISTS uq_kalpataru_uuid ON kalpataru(uuid);
CREATE UNIQUE INDEX IF NOT EXISTS uq_kalpataru_path ON kalpataru(path);
CREATE UNIQUE INDEX IF NOT EXISTS uq_kalpataru_system_code ON kalpataru(system_code);
CREATE UNIQUE INDEX IF NOT EXISTS uq_kalpataru_seq ON kalpataru(parent_id, seq);

CREATE INDEX IF NOT EXISTS idx_kalpataru_path_gist ON kalpataru USING GIST(path);
CREATE INDEX IF NOT EXISTS idx_kalpataru_grantha ON kalpataru(grantha_id);
CREATE INDEX IF NOT EXISTS idx_kalpataru_uuid_search ON kalpataru(uuid);

-- =====================================================
-- ⚙️ 4. TRIGGERS & FUNCTIONS
-- =====================================================

-- Function: Enforce Structural Integrity & Path Construction
CREATE OR REPLACE FUNCTION kalpataru_enforce_rules()
RETURNS TRIGGER AS $$
DECLARE
  parent_record vidya.kalpataru;
BEGIN
  -- Ensure search path includes vidya for ltree and internal calls
  SET search_path TO vidya, public;

  IF NEW.parent_id IS NOT NULL THEN
    SELECT * INTO parent_record FROM kalpataru WHERE id = NEW.parent_id;
    IF parent_record IS NULL THEN
      RAISE EXCEPTION 'Parent node % does not exist', NEW.parent_id;
    END IF;

    -- Node Type Hierarchy Validation
    IF NEW.node_type = 'SKANDHA' AND parent_record.node_type <> 'MULA' THEN
      RAISE EXCEPTION 'SKANDHA must have MULA as parent';
    END IF;
    IF NEW.node_type = 'SHAKHA' AND parent_record.node_type <> 'SKANDHA' THEN
      RAISE EXCEPTION 'SHAKHA must have SKANDHA as parent';
    END IF;
    IF NEW.node_type = 'PRASHAKHA' AND parent_record.node_type NOT IN ('SHAKHA','PRASHAKHA') THEN
      RAISE EXCEPTION 'PRASHAKHA must have SHAKHA or PRASHAKHA as parent';
    END IF;
    IF NEW.node_type = 'PALLAVA' AND parent_record.node_type NOT IN ('PRASHAKHA','PALLAVA') THEN
      RAISE EXCEPTION 'PALLAVA must have PRASHAKHA or PALLAVA as parent';
    END IF;

    -- Grantha Inheritance
    IF parent_record.grantha_id IS NOT NULL AND NEW.is_grantha = FALSE THEN
      NEW.grantha_id := parent_record.grantha_id;
    END IF;

    -- Path Construction
    NEW.path := parent_record.path || text2ltree(NEW.id::text);
  ELSE
    -- Root node Path
    NEW.path := text2ltree(NEW.id::text);
  END IF;

  -- New Grantha Self-Anchor
  IF NEW.is_grantha THEN
    NEW.grantha_id := NEW.id;
  END IF;

  -- Grantha Unit Validation
  IF NEW.grantha_id IS NOT NULL AND NEW.grantha_unit IS NULL THEN
    RAISE EXCEPTION 'grantha_unit must be defined inside grantha';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Structural Rules
DROP TRIGGER IF EXISTS trg_kalpataru_rules ON kalpataru;
CREATE TRIGGER trg_kalpataru_rules
BEFORE INSERT OR UPDATE ON kalpataru
FOR EACH ROW EXECUTE FUNCTION kalpataru_enforce_rules();

-- Function: Leaf Detection tracking
CREATE OR REPLACE FUNCTION kalpataru_update_leaf()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.parent_id IS NOT NULL THEN
        UPDATE kalpataru SET is_leaf = FALSE WHERE id = NEW.parent_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Leaf Status
DROP TRIGGER IF EXISTS trg_kalpataru_leaf ON kalpataru;
CREATE TRIGGER trg_kalpataru_leaf
AFTER INSERT ON kalpataru
FOR EACH ROW EXECUTE FUNCTION kalpataru_update_leaf();

-- Trigger: Auditing
DROP TRIGGER IF EXISTS trg_kalpataru_updated_at ON kalpataru;
CREATE TRIGGER trg_kalpataru_updated_at
BEFORE UPDATE ON kalpataru
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =====================================================
-- 📜 5. DOCUMENTATION
-- =====================================================

COMMENT ON TABLE kalpataru IS 'Structural tree of shastra. Hierarchy only. No textual content.';
COMMENT ON COLUMN kalpataru.depth IS 'Computed depth of node in tree.';
COMMENT ON COLUMN kalpataru.is_leaf IS 'True if node has no children. Used for UI optimization.';
COMMENT ON COLUMN kalpataru.system_code IS 'Human-friendly unique citation code (e.g. RV.1.1).';

-- =====================================================
-- END OF KALPATARU
-- =====================================================
