-- =====================================================
-- 🌐 VIDYA SCHEMA — MASTER LANGUAGE (Consolidated)
-- =====================================================
-- Purpose:
-- Controlled linguistic infrastructure supporting Vyakhya and metadata.
--
-- Features:
-- 1. Cultural Identity: Uses Endonyms (Native names) for UI representation.
-- 2. Rules: Automated script mapping and classical language classification.
-- 3. Integrity: Strict ISO 2-letter code formatting.
-- =====================================================

SET search_path TO vidya;

-- =====================================================
-- 🏛️ 1. MAIN TABLE: LANGUAGE
-- =====================================================

CREATE TABLE IF NOT EXISTS language (
    -- 🆔 Identity (ISO 639-1)
    code TEXT PRIMARY KEY,
    
    -- 🏷️ Naming
    name TEXT NOT NULL,
    endonym TEXT, -- Native name e.g. 'संस्कृतम्'
    
    -- 🧬 Rules & Metadata
    script_default mula_script, -- Defined in Mula layer
    is_classical BOOLEAN DEFAULT FALSE,

    -- ⚖️ Constraints
    CONSTRAINT chk_language_code_format CHECK (code ~ '^[a-z]{2}$'),
    CONSTRAINT uq_language_name UNIQUE (name)
);

-- =====================================================
-- 🌱 2. SEED DATA (Foundational Support)
-- =====================================================

INSERT INTO language (code, name, endonym, script_default, is_classical) 
VALUES
('sa', 'Sanskrit', 'संस्कृतम्', 'DEVANAGARI', TRUE),
('en', 'English', 'English', 'IAST', FALSE),
('bn', 'Bengali', 'বাংলা', 'BENGALI', FALSE),
('hi', 'Hindi', 'हिन्दी', 'DEVANAGARI', FALSE)
ON CONFLICT (code) DO UPDATE SET
  endonym = EXCLUDED.endonym,
  script_default = EXCLUDED.script_default,
  is_classical = EXCLUDED.is_classical;

-- =====================================================
-- 📜 3. DOCUMENTATION
-- =====================================================

COMMENT ON TABLE language IS 'Controlled linguistic system for the knowledge graph.';
COMMENT ON COLUMN language.endonym IS 'Language name in its native script. Essential for global UI switches.';
COMMENT ON COLUMN language.is_classical IS 'True for ancient/root languages of the Vedic library.';
COMMENT ON COLUMN language.code IS 'Must be lowercase 2-letter ISO code (sa, hi, en, etc.).';

-- =====================================================
-- END OF LANGUAGE
-- =====================================================
