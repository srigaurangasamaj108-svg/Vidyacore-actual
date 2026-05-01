-- =====================================================
-- 🎭 VIDYA SCHEMA — MASTER ATTRIBUTION (Consolidated)
-- =====================================================
-- Purpose:
-- Links persons to Kalpataru nodes with specific authorship roles.
--
-- Features:
-- 1. Role Precision: Distinguishes between Author, Seer, and Commentator.
-- 2. Shastric Integrity: Ensures Seers (Drashtas) are not owned by Sampradayas.
-- 3. Edition Context: Links authorship to specific textual versions.
-- 4. Sequencing: Preserves correct order of contributors.
-- =====================================================

SET search_path TO vidya;

-- =====================================================
-- 🏛️ 1. MAIN TABLE: KALPATARU_PERSON_ROLE
-- =====================================================

CREATE TABLE IF NOT EXISTS kalpataru_person_role (
    -- 🆔 Identity
    id BIGSERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT gen_random_uuid(),

    -- 🔗 Core Links
    kalpataru_id BIGINT NOT NULL,
    person_id BIGINT NOT NULL,
    edition_id BIGINT,

    -- 🏷️ Role & Context
    role authorship_role NOT NULL,
    sampradaya_id BIGINT,
    
    -- 🔢 Ordering & Priority
    seq INT DEFAULT 1,
    is_primary BOOLEAN DEFAULT FALSE,

    -- 🧾 Metadata
    metadata JSONB DEFAULT '{}'::jsonb,

    -- ⚖️ Constraints
    -- Shastric Rule: Drashtas (Seers) of Mantras do not belong to a human Sampradaya.
    CONSTRAINT chk_drashta_no_sampradaya CHECK (
        NOT (role = 'DRASHTA' AND sampradaya_id IS NOT NULL)
    )
);

-- =====================================================
-- ⚡ 2. INDEXES
-- =====================================================

CREATE UNIQUE INDEX IF NOT EXISTS uq_kpr_uuid ON kalpataru_person_role(uuid);

-- Duplicate Protection (Same person, same role, same text/edition)
CREATE UNIQUE INDEX IF NOT EXISTS uq_kpr_unique ON kalpataru_person_role(
    kalpataru_id, person_id, role, COALESCE(edition_id, 0)
);

-- Ordering Index (Sequence preservation)
CREATE UNIQUE INDEX IF NOT EXISTS uq_kpr_order ON kalpataru_person_role(kalpataru_id, role, seq);

-- Lookups
CREATE INDEX IF NOT EXISTS idx_kpr_role ON kalpataru_person_role(role);
CREATE INDEX IF NOT EXISTS idx_kpr_sampradaya ON kalpataru_person_role(sampradaya_id);
CREATE INDEX IF NOT EXISTS idx_kpr_edition ON kalpataru_person_role(edition_id);
CREATE INDEX IF NOT EXISTS idx_kpr_kalpataru ON kalpataru_person_role(kalpataru_id);
CREATE INDEX IF NOT EXISTS idx_kpr_person ON kalpataru_person_role(person_id);

-- =====================================================
-- 📜 3. DOCUMENTATION
-- =====================================================

COMMENT ON TABLE kalpataru_person_role IS 'Precise attribution graph between people and texts.';
COMMENT ON COLUMN kalpataru_person_role.role IS 'Author, Seer, Commentator, etc.';
COMMENT ON COLUMN kalpataru_person_role.is_primary IS 'Marks lead contributor when multiple persons share a role.';
COMMENT ON COLUMN kalpataru_person_role.edition_id IS 'Specific edition this role applies to (e.g. Editor of 1920 reprint).';

-- =====================================================
-- END OF ATTRIBUTION
-- =====================================================
