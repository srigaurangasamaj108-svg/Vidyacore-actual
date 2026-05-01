-- =====================================================
-- 📚 VIDYA SCHEMA — MASTER EDITION (Consolidated)
-- =====================================================
-- Purpose:
-- Represents different versions of a text: Manuscripts, Critical Editions, Reprints.
--
-- Features:
-- 1. Genealogy: base_edition_id tracks derivation from a parent source.
-- 2. Classification: Type-safe edition categories (Oral, Manuscript, Digital).
-- 3. Localization: Linked to language and default script for authentic rendering.
-- =====================================================

SET search_path TO vidya;

-- =====================================================
-- 🏛️ 1. MAIN TABLE: EDITION
-- =====================================================

CREATE TABLE IF NOT EXISTS edition (
    -- 🆔 Identity
    id BIGSERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT gen_random_uuid(),

    -- 🏷️ Basic Info
    name TEXT NOT NULL,
    publisher TEXT,
    reference TEXT, -- ISBN, manuscript ID, archive ref
    year INT,

    -- 🧬 Classification & Lineage
    edition_type edition_type,
    base_edition_id BIGINT, -- Self-reference for reprints/lineage
    
    -- 🌐 Language & Rendering
    language_code TEXT DEFAULT 'sa',
    script mula_script DEFAULT 'DEVANAGARI',

    -- 🧾 Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- =====================================================
-- ⚡ 2. INDEXES
-- =====================================================

CREATE UNIQUE INDEX IF NOT EXISTS uq_edition_uuid ON edition(uuid);

-- Duplicate Protection (Same name + reference)
CREATE UNIQUE INDEX IF NOT EXISTS uq_edition_name_reference ON edition(name, COALESCE(reference, ''));

-- Scholarly Lookups
CREATE INDEX IF NOT EXISTS idx_edition_name ON edition(name);
CREATE INDEX IF NOT EXISTS idx_edition_type ON edition(edition_type);
CREATE INDEX IF NOT EXISTS idx_edition_base ON edition(base_edition_id);
CREATE INDEX IF NOT EXISTS idx_edition_language ON edition(language_code);

-- =====================================================
-- 📜 3. DOCUMENTATION
-- =====================================================

COMMENT ON TABLE edition IS 'Textual versions (manuscripts/prints) of shastra. Enables comparison and preservation of variants.';
COMMENT ON COLUMN edition.base_edition_id IS 'Parent edition if this is a derivative/reprint. Tracks book genealogy.';
COMMENT ON COLUMN edition.edition_type IS 'MANUSCRIPT, CRITICAL_EDITION, PRINTED, DIGITAL, or ORAL_TRADITION.';
COMMENT ON COLUMN edition.language_code IS 'Primary language of the source text.';

-- =====================================================
-- END OF EDITION
-- =====================================================
