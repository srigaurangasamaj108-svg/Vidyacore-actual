-- =====================================================
-- 🤖 VIDYA SCHEMA — MASTER INTELLIGENCE (Consolidated)
-- =====================================================
-- Purpose:
-- Stores vector representations of text for semantic search and AI discovery.
--
-- Features:
-- 1. Optimized IVFFlat: Uses Cosine Similarity with list clustering for high-speed retrieval.
-- 2. Chunking: Supports segmented Vyakhya for hyper-precise RAG citations.
-- 3. Versioning: Model-aware storage allows multiple AI model embeddings to coexist.
-- 4. Validation: Ensures embedding integrity and normalization support.
-- =====================================================

SET search_path TO vidya;

-- =====================================================
-- 🏛️ 1. MULA EMBEDDING
-- =====================================================

CREATE TABLE IF NOT EXISTS mula_embedding (
    id BIGSERIAL PRIMARY KEY,
    mula_id BIGINT NOT NULL REFERENCES mula(id) ON DELETE CASCADE,
    
    -- 🤖 Vector Data
    embedding VECTOR(1536) NOT NULL, -- Standard for text-embedding-3-small
    embedding_norm REAL, -- Pre-computed length for speed
    
    -- 🏷️ Versioning
    model_version TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),

    -- ⚖️ Constraints
    CONSTRAINT chk_mula_embedding_not_null CHECK (embedding IS NOT NULL)
);

-- =====================================================
-- 🏛️ 2. VYAKHYA EMBEDDING
-- =====================================================

CREATE TABLE IF NOT EXISTS vyakhya_embedding (
    id BIGSERIAL PRIMARY KEY,
    vyakhya_id BIGINT NOT NULL REFERENCES vyakhya(id) ON DELETE CASCADE,

    -- 🤖 Vector Data & Chunking
    embedding VECTOR(1536) NOT NULL,
    embedding_norm REAL,
    chunk_index INT DEFAULT 0,
    chunk_text TEXT,

    -- 🏷️ Versioning
    model_version TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),

    -- ⚖️ Constraints
    CONSTRAINT chk_vyakhya_embedding_not_null CHECK (embedding IS NOT NULL)
);

-- =====================================================
-- ⚡ 3. INDEXES (Optimized for IVFFlat Search)
-- =====================================================

-- Mula Semantic Search
CREATE INDEX IF NOT EXISTS idx_mula_embedding_ivf
ON mula_embedding USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Vyakhya Semantic Search
CREATE INDEX IF NOT EXISTS idx_vyakhya_embedding_ivf
ON vyakhya_embedding USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Version Filtering
CREATE INDEX IF NOT EXISTS idx_mula_model ON mula_embedding(model_version);
CREATE INDEX IF NOT EXISTS idx_vyakhya_model ON vyakhya_embedding(model_version);

-- ⚖️ Uniqueness (One embedding per model version)
CREATE UNIQUE INDEX IF NOT EXISTS uq_mula_embedding_model ON mula_embedding(mula_id, model_version);
CREATE UNIQUE INDEX IF NOT EXISTS uq_vyakhya_chunk ON vyakhya_embedding(vyakhya_id, model_version, chunk_index);

-- =====================================================
-- 📜 4. DOCUMENTATION
-- =====================================================

COMMENT ON TABLE mula_embedding IS 'Vector engine for canonical text search.';
COMMENT ON TABLE vyakhya_embedding IS 'Vector engine for interpretation. Supports granular RAG chunking.';
COMMENT ON COLUMN vyakhya_embedding.chunk_index IS 'Specific segment index for long commentaries.';
COMMENT ON COLUMN vyakhya_embedding.embedding_norm IS 'Pre-calculated normalization factor for faster similarity math.';

-- =====================================================
-- END OF INTELLIGENCE
-- =====================================================
