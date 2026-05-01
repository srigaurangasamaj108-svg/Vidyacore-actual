-- =====================================================
-- 🛡️ VIDYA SCHEMA — MASTER INTEGRITY (The Final Wiring)
-- =====================================================
-- Purpose:
-- This file establishes all cross-table relationships (Foreign Keys)
-- once all the core tables (01-14) have been created.
--
-- This ensures that the numerical sequence 01-14 works perfectly.
-- =====================================================

SET search_path TO vidya;

-- =====================================================
-- 🔗 1. MULA CONNECTIONS
-- =====================================================

ALTER TABLE mula ADD CONSTRAINT fk_mula_kalpataru FOREIGN KEY (kalpataru_id) REFERENCES kalpataru(id) ON DELETE CASCADE;
ALTER TABLE mula ADD CONSTRAINT fk_mula_edition FOREIGN KEY (edition_id) REFERENCES edition(id);

-- =====================================================
-- 🔗 2. VYAKHYA CONNECTIONS
-- =====================================================

ALTER TABLE vyakhya ADD CONSTRAINT fk_vyakhya_author FOREIGN KEY (author_id) REFERENCES vedic_person(id);
ALTER TABLE vyakhya ADD CONSTRAINT fk_vyakhya_sampradaya FOREIGN KEY (sampradaya_id) REFERENCES sampradaya(id);
ALTER TABLE vyakhya ADD CONSTRAINT fk_vyakhya_edition FOREIGN KEY (edition_id) REFERENCES edition(id);
ALTER TABLE vyakhya ADD CONSTRAINT fk_vyakhya_language FOREIGN KEY (language_code) REFERENCES language(code);

-- =====================================================
-- 🔗 3. TAXONOMY CONNECTIONS
-- =====================================================

ALTER TABLE mula_taxonomy_map ADD CONSTRAINT fk_mtm_mula FOREIGN KEY (mula_id) REFERENCES mula(id) ON DELETE CASCADE;
ALTER TABLE mula_taxonomy_map ADD CONSTRAINT fk_mtm_taxonomy FOREIGN KEY (taxonomy_id) REFERENCES shastric_taxonomy(id) ON DELETE CASCADE;
ALTER TABLE mula_taxonomy_map ADD CONSTRAINT fk_mtm_edition FOREIGN KEY (edition_id) REFERENCES edition(id);

ALTER TABLE vyakhya_taxonomy_map ADD CONSTRAINT fk_vtm_vyakhya FOREIGN KEY (vyakhya_id) REFERENCES vyakhya(id) ON DELETE CASCADE;
ALTER TABLE vyakhya_taxonomy_map ADD CONSTRAINT fk_vtm_taxonomy FOREIGN KEY (taxonomy_id) REFERENCES shastric_taxonomy(id) ON DELETE CASCADE;

-- =====================================================
-- 🔗 4. RELATION CONNECTIONS
-- =====================================================

ALTER TABLE mula_relation ADD CONSTRAINT fk_mr_from FOREIGN KEY (from_mula_id) REFERENCES mula(id) ON DELETE CASCADE;
ALTER TABLE mula_relation ADD CONSTRAINT fk_mr_to FOREIGN KEY (to_mula_id) REFERENCES mula(id) ON DELETE CASCADE;
ALTER TABLE mula_relation ADD CONSTRAINT fk_mr_from_ed FOREIGN KEY (from_edition_id) REFERENCES edition(id);
ALTER TABLE mula_relation ADD CONSTRAINT fk_mr_to_ed FOREIGN KEY (to_edition_id) REFERENCES edition(id);

-- =====================================================
-- 🔗 5. AUTHORITY CONNECTIONS (Person & Sampradaya)
-- =====================================================

ALTER TABLE vedic_person ADD CONSTRAINT fk_person_sampradaya FOREIGN KEY (sampradaya_id) REFERENCES sampradaya(id);
ALTER TABLE sampradaya ADD CONSTRAINT fk_sampradaya_acharya FOREIGN KEY (mula_acharya_id) REFERENCES vedic_person(id);

-- =====================================================
-- 🔗 6. ATTRIBUTION CONNECTIONS
-- =====================================================

ALTER TABLE kalpataru_person_role ADD CONSTRAINT fk_kpr_kalpataru FOREIGN KEY (kalpataru_id) REFERENCES kalpataru(id) ON DELETE CASCADE;
ALTER TABLE kalpataru_person_role ADD CONSTRAINT fk_kpr_person FOREIGN KEY (person_id) REFERENCES vedic_person(id) ON DELETE CASCADE;
ALTER TABLE kalpataru_person_role ADD CONSTRAINT fk_kpr_edition FOREIGN KEY (edition_id) REFERENCES edition(id);
ALTER TABLE kalpataru_person_role ADD CONSTRAINT fk_kpr_sampradaya FOREIGN KEY (sampradaya_id) REFERENCES sampradaya(id);

-- =====================================================
-- 🔗 7. EDITION CONNECTIONS
-- =====================================================

ALTER TABLE edition ADD CONSTRAINT fk_edition_language FOREIGN KEY (language_code) REFERENCES language(code);
ALTER TABLE edition ADD CONSTRAINT fk_edition_base FOREIGN KEY (base_edition_id) REFERENCES edition(id);

-- =====================================================
-- 🔗 8. QUALITY & BLOGGING CONNECTIONS
-- =====================================================

ALTER TABLE kalpataru_content ADD CONSTRAINT fk_kc_author FOREIGN KEY (author_id) REFERENCES vedic_person(id);

-- =====================================================
-- END OF INTEGRITY
-- =====================================================
