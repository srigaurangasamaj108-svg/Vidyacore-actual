-- =====================================================
-- 🌿 VIDYA SCHEMA — MASTER FOUNDATION (Consolidated)
-- =====================================================
-- This file initializes the global infrastructure of VidyaCore.
-- It includes extensions, global enums, and auditing functions.
--
-- Architecture Layers:
-- 1. Structure (Kalpataru)
-- 2. Canon (Mula)
-- 3. Interpretation (Vyakhya)
-- 4. Conceptual Layer (Taxonomy)
-- 5. Relationship Layer
-- 6. Authority Layer
-- 7. Intelligence Layer
-- =====================================================

SET search_path TO vidya;

-- =====================================================
-- 🛠️ 1. EXTENSIONS
-- =====================================================

-- Tree structure support
CREATE EXTENSION IF NOT EXISTS ltree;

-- UUID support (Primary & Fallback)
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Vector embeddings (AI/ML layer)
CREATE EXTENSION IF NOT EXISTS vector;

-- =====================================================
-- 🧬 2. GLOBAL ENUM TYPES (Shared Infrastructure)
-- =====================================================

-- Authorship roles (Shastric precision)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'authorship_role') THEN
        CREATE TYPE authorship_role AS ENUM (
            'DRASHTA',
            'KARTA',
            'COMPILER',
            'COMMENTATOR',
            'TRANSLATOR',
            'EDITOR'
        );
    END IF;
END $$;

-- Relation types (Shastrartha graph)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'relation_type') THEN
        CREATE TYPE relation_type AS ENUM (
            'CITES',
            'QUOTES',
            'PARALLEL',
            'EXPANDS',
            'SUMMARIZES',
            'REFUTES',
            'SUPPORTS'
        );
    END IF;
END $$;

-- Edition types (Manuscript classification)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'edition_type') THEN
        CREATE TYPE edition_type AS ENUM (
            'MANUSCRIPT',
            'CRITICAL_EDITION',
            'PRINTED',
            'DIGITAL',
            'ORAL_TRADITION'
        );
    END IF;
END $$;

-- Auditing function moved to VIDYA_00_AUTH.sql


-- =====================================================
-- 📜 4. SCHEMA DOCUMENTATION
-- =====================================================

COMMENT ON SCHEMA vidya IS
'Unified Vedic knowledge schema with 7-layer architecture:
Structure, Canon, Interpretation, Taxonomy, Relations, Authority, Intelligence';

DO $$ BEGIN
    EXECUTE 'COMMENT ON DATABASE ' || current_database() || ' IS ''VidyaCore Production Database. Always explicitly reference vidya schema.''';
END $$;

-- =====================================================
-- END OF FOUNDATION
-- =====================================================
