-- =====================================================
-- 📖 VIDYA SCHEMA — MASTER BLOGGING & WIKI (Consolidated)
-- =====================================================
-- Purpose:
-- Transforms the Kalpataru tree into an interactive educational platform.
-- Every node (Veda, Purana, etc.) can have a long-form scholarly article.
--
-- Features:
-- 1. Wiki-Style: One-to-one link with Kalpataru nodes for contextual reading.
-- 2. Rich Content: Supports Markdown/HTML articles with featured images.
-- 3. SEO-Ready: Includes metadata for reading time and SEO optimization.
-- 4. Searchable: Full-text GIN indexing on article bodies.
-- =====================================================

SET search_path TO vidya;

-- =====================================================
-- 🏛️ 1. MAIN TABLE: KALPATARU_CONTENT
-- =====================================================

CREATE TABLE IF NOT EXISTS kalpataru_content (
    -- 🆔 Identity
    id BIGSERIAL PRIMARY KEY,
    uuid UUID NOT NULL DEFAULT gen_random_uuid(),

    -- 🌳 Structural Link (One article per node)
    kalpataru_id BIGINT NOT NULL UNIQUE REFERENCES kalpataru(id) ON DELETE CASCADE,

    -- 🏷️ Editorial Content
    title TEXT NOT NULL,
    content_body TEXT NOT NULL, -- Detailed explanation (Markdown/HTML)
    featured_image TEXT, -- Hero image URL
    
    -- 👤 Attribution
    author_id BIGINT REFERENCES vedic_person(id), -- Modern scholar or author
    
    -- 📊 Metadata & SEO
    metadata JSONB DEFAULT '{
        "reading_time_mins": 0,
        "difficulty": "BEGINNER",
        "seo_keywords": []
    }'::jsonb,

    -- ⏳ Auditing
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- ⚡ 2. INDEXES
-- =====================================================

CREATE UNIQUE INDEX IF NOT EXISTS uq_kalpataru_content_uuid ON kalpataru_content(uuid);

-- Fast lookup by node
CREATE INDEX IF NOT EXISTS idx_kalpataru_content_node ON kalpataru_content(kalpataru_id);

-- Search Index (Articles)
CREATE INDEX IF NOT EXISTS idx_kalpataru_content_fulltext 
ON kalpataru_content USING GIN (to_tsvector('simple', title || ' ' || content_body));

-- =====================================================
-- ⚙️ 3. TRIGGERS
-- =====================================================

-- Trigger: Auditing
DROP TRIGGER IF EXISTS trg_kalpataru_content_updated_at ON kalpataru_content;
CREATE TRIGGER trg_kalpataru_content_updated_at
BEFORE UPDATE ON kalpataru_content
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =====================================================
-- 📜 4. DOCUMENTATION
-- =====================================================

COMMENT ON TABLE kalpataru_content IS 'The educational/blogging layer of VidyaCore. Elaborate articles for tree nodes.';
COMMENT ON COLUMN kalpataru_content.content_body IS 'Scholarly explanation of the shastra node. Supports Markdown.';
COMMENT ON COLUMN kalpataru_content.featured_image IS 'Representational image for the shastra (used in UI cards).';
COMMENT ON COLUMN kalpataru_content.metadata IS 'Contains reading_time, difficulty, and SEO tags.';

-- =====================================================
-- END OF BLOGGING
-- =====================================================
