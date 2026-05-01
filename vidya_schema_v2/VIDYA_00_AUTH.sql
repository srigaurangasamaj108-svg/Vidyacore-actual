-- =====================================================
-- 🔐 VIDYA SCHEMA — MASTER AUTHENTICATION (Consolidated)
-- =====================================================
-- Purpose:
-- The secure gateway for VidyaCore. Manages users, roles, and access.
-- Designed to replace the existing MongoDB/JWT auth system.
--
-- Features:
-- 1. Identity: Secure password hashing and unique UUIDs.
-- 2. RBAC: Role-Based Access Control (Admin, Scholar, Seeker).
-- 3. Audit: Automated creation and update tracking.
-- =====================================================

CREATE SCHEMA IF NOT EXISTS vidya;
SET search_path TO vidya;

-- =====================================================
-- ⚙️ SHARED FUNCTIONS (Auditing)
-- =====================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 🌿 1. ENUMS & TYPES
-- =====================================================

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM (
            'ADMIN',    -- Full system access
            'SCHOLAR',  -- Can create/edit Vyakhya & Taxonomy
            'SEEKER',   -- Standard read-access with bookmarking
            'GUEST'     -- Read-only limited access
        );
    END IF;
END $$;

-- =====================================================
-- 🏛️ 2. MAIN TABLE: USERS
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
    -- 🆔 Identity
    id BIGSERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT gen_random_uuid(),

    -- 🔑 Credentials
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    
    -- 🛡️ Authorization
    role user_role NOT NULL DEFAULT 'SEEKER',
    is_active BOOLEAN DEFAULT TRUE,

    -- 🧾 Metadata & Profile
    metadata JSONB DEFAULT '{
        "full_name": "",
        "bio": "",
        "preferences": {
            "default_language": "sa",
            "default_script": "DEVANAGARI"
        }
    }'::jsonb,

    -- ⏳ Auditing
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    -- ⚖️ Constraints
    CONSTRAINT uq_user_username UNIQUE (username),
    CONSTRAINT uq_user_email UNIQUE (email),
    CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
);

-- =====================================================
-- ⚡ 3. INDEXES
-- =====================================================

CREATE UNIQUE INDEX IF NOT EXISTS uq_user_uuid ON users(uuid);
CREATE INDEX IF NOT EXISTS idx_user_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_user_active ON users(is_active);

-- =====================================================
-- ⚙️ 4. TRIGGERS
-- =====================================================

-- Trigger: Auditing
DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =====================================================
-- 📜 5. DOCUMENTATION
-- =====================================================

COMMENT ON TABLE users IS 'User accounts and authentication data for VidyaCore.';
COMMENT ON COLUMN users.password_hash IS 'Securely hashed password (bcrypt/argon2). Never store plain text.';
COMMENT ON COLUMN users.role IS 'User permission level within the system.';
COMMENT ON COLUMN users.uuid IS 'External ID used for JWT and API interactions.';

-- =====================================================
-- END OF AUTHENTICATION
-- =====================================================
