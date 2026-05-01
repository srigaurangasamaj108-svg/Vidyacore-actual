import { pgTable, type AnyPgColumn, pgSchema, index, uniqueIndex, foreignKey, unique, check, bigserial, uuid, bigint, text, boolean, jsonb, timestamp, integer, doublePrecision, real, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const vidya = pgSchema("vidya");
export const authorshipRoleInVidya = vidya.enum("authorship_role", ['DRASHTA', 'KARTA', 'COMPILER', 'COMMENTATOR', 'TRANSLATOR', 'EDITOR'])
export const contentFlagTypeInVidya = vidya.enum("content_flag_type", ['DISPUTED', 'LOW_CONFIDENCE', 'AI_GENERATED', 'REQUIRES_REVIEW'])
export const editionTypeInVidya = vidya.enum("edition_type", ['MANUSCRIPT', 'CRITICAL_EDITION', 'PRINTED', 'DIGITAL', 'ORAL_TRADITION'])
export const granthaUnitEnumInVidya = vidya.enum("grantha_unit_enum", ['shastra', 'parva', 'upaparva', 'kanda', 'skandha', 'sarga', 'adhyaya', 'adhikarana', 'mandala', 'sukta', 'rc', 'kanda_veda', 'prapathaka', 'anuvaka', 'arcika', 'gana', 'valli', 'brahmana_section', 'khanda', 'pada', 'sutra', 'ahnika', 'patala', 'sthana', 'prakarana', 'ullasa', 'pariccheda', 'prasna', 'sloka', 'mantra', 'sutra_unit', 'section'])
export const kalpataruNodeTypeInVidya = vidya.enum("kalpataru_node_type", ['MULA', 'SKANDHA', 'SHAKHA', 'PRASHAKHA', 'PALLAVA'])
export const mulaRelationTypeInVidya = vidya.enum("mula_relation_type", ['CITES', 'QUOTES', 'PARALLEL', 'EXPANDS', 'SUMMARIZES', 'REFUTES', 'SUPPORTS'])
export const mulaScriptInVidya = vidya.enum("mula_script", ['DEVANAGARI', 'BENGALI', 'PALI', 'TAMIL', 'TELUGU', 'KANNADA', 'GURMUKHI', 'IAST', 'BRAHMI', 'GRANTHA', 'SHARADA'])
export const mulaTypeInVidya = vidya.enum("mula_type", ['SHLOKA', 'MANTRA', 'SUTRA', 'INVOCATION', 'TITLE', 'COLOPHON', 'DOHA', 'ABHANGA', 'PADYA', 'GADYA', 'OTHER'])
export const personRelationTypeInVidya = vidya.enum("person_relation_type", ['DISCIPLE_OF', 'TEACHER_OF', 'INFLUENCED_BY', 'CONTEMPORARY'])
export const personTypeInVidya = vidya.enum("person_type", ['RISHI', 'ACHARYA', 'KAVI', 'COMMENTATOR', 'TRANSLATOR', 'EDITOR', 'SCRIBE'])
export const relationTypeInVidya = vidya.enum("relation_type", ['CITES', 'QUOTES', 'PARALLEL', 'EXPANDS', 'SUMMARIZES', 'REFUTES', 'SUPPORTS'])
export const shastraPramanaEnumInVidya = vidya.enum("shastra_pramana_enum", ['SHRUTI', 'SMRITI', 'ITIHASA_PURANA', 'VEDANGA', 'UPANGA', 'UPAVEDA', 'AGAMA'])
export const taxonomyClassInVidya = vidya.enum("taxonomy_class", ['CONCEPT', 'PRACTICE', 'ENTITY', 'RELATION', 'QUALITY'])
export const taxonomyDomainEnumInVidya = vidya.enum("taxonomy_domain_enum", ['ONTOLOGY', 'SADHANA', 'RITUAL', 'ETHICS', 'SOCIETY', 'SCIENCE'])
export const userRoleInVidya = vidya.enum("user_role", ['ADMIN', 'SCHOLAR', 'SEEKER', 'GUEST'])
export const vyakhyaPartInVidya = vidya.enum("vyakhya_part", ['AVATARIKA', 'VYAKHYANA', 'UPASAMHARA', 'TIPPNI'])
export const vyakhyaTypeInVidya = vidya.enum("vyakhya_type", ['mula', 'bhashya', 'tika', 'tippani', 'tippani_extended', 'shabdartha', 'anvaya', 'padaccheda', 'vigraha', 'bhavartha', 'tatparya', 'arthavistara', 'vivarana', 'vyakhyana', 'anuvada', 'bhasantara', 'bhavanuvada', 'sutra_summary', 'key_points', 'shirshaka', 'upashirshaka', 'pushpika'])


export const sampradayaInVidya = vidya.table("sampradaya", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	uuid: uuid().defaultRandom().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	parentId: bigint("parent_id", { mode: "number" }),
	// TODO: failed to parse database type 'ltree'
	path: text("path"),
	name: text().notNull(),
	philosophyName: text("philosophy_name"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	mulaAcharyaId: bigint("mula_acharya_id", { mode: "number" }),
	isActive: boolean("is_active").default(true),
	startCentury: text("start_century"),
	endCentury: text("end_century"),
	metadata: jsonb().default({}),
}, (table) => [
	index("idx_sampradaya_name_search").using("btree", table.name.asc().nullsLast().op("text_ops")),
	index("idx_sampradaya_path").using("gist", table.path.asc().nullsLast().op("gist_ltree_ops")),
	uniqueIndex("uq_sampradaya_uuid").using("btree", table.uuid.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "sampradaya_parent_id_fkey"
		}),
	foreignKey({
			columns: [table.mulaAcharyaId],
			foreignColumns: [vedicPersonInVidya.id],
			name: "sampradaya_mula_acharya_id_fkey"
		}),
	foreignKey({
			columns: [table.mulaAcharyaId],
			foreignColumns: [vedicPersonInVidya.id],
			name: "fk_sampradaya_acharya"
		}),
	unique("uq_sampradaya_name").on(table.name),
	check("chk_sampradaya_no_self", sql`(id IS NULL) OR (parent_id IS NULL) OR (id <> parent_id)`),
]);

export const usersInVidya = vidya.table("users", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	uuid: uuid().defaultRandom().notNull(),
	username: text().notNull(),
	email: text().notNull(),
	passwordHash: text("password_hash").notNull(),
	role: userRoleInVidya().default('SEEKER').notNull(),
	isActive: boolean("is_active").default(true),
	metadata: jsonb().default({"bio":"","full_name":"","preferences":{"default_script":"DEVANAGARI","default_language":"sa"}}),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_user_active").using("btree", table.isActive.asc().nullsLast().op("bool_ops")),
	index("idx_user_role").using("btree", table.role.asc().nullsLast().op("enum_ops")),
	uniqueIndex("uq_user_uuid").using("btree", table.uuid.asc().nullsLast().op("uuid_ops")),
	unique("uq_user_username").on(table.username),
	unique("uq_user_email").on(table.email),
	check("chk_email_format", sql`email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'::text`),
]);

export const kalpataruInVidya = vidya.table("kalpataru", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	uuid: uuid().defaultRandom().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	parentId: bigint("parent_id", { mode: "number" }),
	// TODO: failed to parse database type 'ltree'
	path: text("path").notNull(),
	depth: integer().generatedAlwaysAs(sql`vidya.nlevel(path)`),
	isLeaf: boolean("is_leaf").default(true),
	name: text().notNull(),
	description: text(),
	nodeType: kalpataruNodeTypeInVidya("node_type").notNull(),
	seq: integer().notNull(),
	shastraPramana: shastraPramanaEnumInVidya("shastra_pramana"),
	isGrantha: boolean("is_grantha").default(false),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	granthaId: bigint("grantha_id", { mode: "number" }),
	granthaUnit: granthaUnitEnumInVidya("grantha_unit"),
	systemCode: text("system_code"),
	metadata: jsonb().default({}),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_kalpataru_grantha").using("btree", table.granthaId.asc().nullsLast().op("int8_ops")),
	index("idx_kalpataru_path_gist").using("gist", table.path.asc().nullsLast().op("gist_ltree_ops")),
	index("idx_kalpataru_uuid_search").using("btree", table.uuid.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("uq_kalpataru_path").using("btree", table.path.asc().nullsLast().op("ltree_ops")),
	uniqueIndex("uq_kalpataru_seq").using("btree", table.parentId.asc().nullsLast().op("int4_ops"), table.seq.asc().nullsLast().op("int8_ops")),
	uniqueIndex("uq_kalpataru_system_code").using("btree", table.systemCode.asc().nullsLast().op("text_ops")),
	uniqueIndex("uq_kalpataru_uuid").using("btree", table.uuid.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "kalpataru_parent_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.granthaId],
			foreignColumns: [table.id],
			name: "kalpataru_grantha_id_fkey"
		}),
	check("chk_root_rule", sql`((node_type = 'MULA'::vidya.kalpataru_node_type) AND (parent_id IS NULL)) OR ((node_type <> 'MULA'::vidya.kalpataru_node_type) AND (parent_id IS NOT NULL))`),
	check("chk_grantha_valid", sql`(is_grantha = false) OR (node_type = ANY (ARRAY['SHAKHA'::vidya.kalpataru_node_type, 'PRASHAKHA'::vidya.kalpataru_node_type, 'PALLAVA'::vidya.kalpataru_node_type]))`),
	check("chk_grantha_null", sql`(grantha_id IS NULL) OR (grantha_unit IS NOT NULL)`),
	check("chk_grantha_root_consistency", sql`(NOT is_grantha) OR (grantha_id = id)`),
	check("chk_no_self_parent", sql`(id IS NULL) OR (parent_id IS NULL) OR (id <> parent_id)`),
]);

export const mulaRelationInVidya = vidya.table("mula_relation", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	uuid: uuid().defaultRandom().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	fromMulaId: bigint("from_mula_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	toMulaId: bigint("to_mula_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	fromEditionId: bigint("from_edition_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	toEditionId: bigint("to_edition_id", { mode: "number" }),
	relationType: mulaRelationTypeInVidya("relation_type").notNull(),
	confidenceScore: integer("confidence_score").default(100),
	isSymmetrical: boolean("is_symmetrical").generatedAlwaysAs(sql`(relation_type = ANY (ARRAY['PARALLEL'::vidya.mula_relation_type, 'SUPPORTS'::vidya.mula_relation_type]))`),
	weight: doublePrecision().default(1),
	justification: text(),
	source: text(),
	metadata: jsonb().default({}),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_relation_confidence").using("btree", table.confidenceScore.asc().nullsLast().op("int4_ops")),
	index("idx_relation_from_type").using("btree", table.fromMulaId.asc().nullsLast().op("int8_ops"), table.relationType.asc().nullsLast().op("enum_ops")),
	index("idx_relation_symmetry").using("btree", table.isSymmetrical.asc().nullsLast().op("bool_ops")),
	index("idx_relation_to").using("btree", table.toMulaId.asc().nullsLast().op("int8_ops")),
	uniqueIndex("uq_mula_relation_unique").using("btree", sql`from_mula_id`, sql`to_mula_id`, sql`relation_type`, sql`COALESCE(from_edition_id, (0)::bigint)`, sql`COALESCE(to_edition_id, (0)::bigint)`),
	uniqueIndex("uq_mula_relation_uuid").using("btree", table.uuid.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("uq_relation_symmetric").using("btree", sql`LEAST(from_mula_id, to_mula_id)`, sql`GREATEST(from_mula_id, to_mula_id)`, sql`relation_type`).where(sql`(relation_type = ANY (ARRAY['PARALLEL'::vidya.mula_relation_type, 'SUPPORTS'::vidya.mula_relation_type]))`),
	foreignKey({
			columns: [table.fromMulaId],
			foreignColumns: [mulaInVidya.id],
			name: "fk_mr_from"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.toMulaId],
			foreignColumns: [mulaInVidya.id],
			name: "fk_mr_to"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.fromEditionId],
			foreignColumns: [editionInVidya.id],
			name: "fk_mr_from_ed"
		}),
	foreignKey({
			columns: [table.toEditionId],
			foreignColumns: [editionInVidya.id],
			name: "fk_mr_to_ed"
		}),
	check("mula_relation_confidence_score_check", sql`(confidence_score >= 1) AND (confidence_score <= 100)`),
	check("chk_no_self_relation", sql`from_mula_id <> to_mula_id`),
]);

export const mulaInVidya = vidya.table("mula", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	uuid: uuid().defaultRandom().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	kalpataruId: bigint("kalpataru_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	editionId: bigint("edition_id", { mode: "number" }),
	seq: integer().notNull(),
	mulaRef: text("mula_ref"),
	isCanonical: boolean("is_canonical").default(true),
	isVariant: boolean("is_variant").default(false),
	isFragment: boolean("is_fragment").default(false),
	mulaType: mulaTypeInVidya("mula_type").notNull(),
	mulaScript: mulaScriptInVidya("mula_script").default('DEVANAGARI').notNull(),
	textMula: text("text_mula").notNull(),
	wordCount: integer("word_count").generatedAlwaysAs(sql`array_length(regexp_split_to_array(text_mula, '\s+'::text), 1)`),
	metadata: jsonb().default({}),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_mula_fulltext").using("gin", sql`to_tsvector('simple'::regconfig, text_mula)`),
	index("idx_mula_kalpataru_seq").using("btree", table.kalpataruId.asc().nullsLast().op("int4_ops"), table.seq.asc().nullsLast().op("int4_ops")),
	index("idx_mula_ref").using("btree", table.kalpataruId.asc().nullsLast().op("text_ops"), table.mulaRef.asc().nullsLast().op("int8_ops")).where(sql`(mula_ref IS NOT NULL)`),
	index("idx_mula_type").using("btree", table.mulaType.asc().nullsLast().op("enum_ops")),
	index("idx_mula_uuid_search").using("btree", table.uuid.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("uq_mula_canonical").using("btree", table.kalpataruId.asc().nullsLast().op("int4_ops"), table.seq.asc().nullsLast().op("int8_ops")).where(sql`(is_canonical = true)`),
	uniqueIndex("uq_mula_null_edition").using("btree", table.kalpataruId.asc().nullsLast().op("int4_ops"), table.seq.asc().nullsLast().op("int8_ops")).where(sql`(edition_id IS NULL)`),
	uniqueIndex("uq_mula_seq").using("btree", table.kalpataruId.asc().nullsLast().op("int4_ops"), table.seq.asc().nullsLast().op("int8_ops"), table.editionId.asc().nullsLast().op("int4_ops")),
	uniqueIndex("uq_mula_uuid").using("btree", table.uuid.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.kalpataruId],
			foreignColumns: [kalpataruInVidya.id],
			name: "mula_kalpataru_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.kalpataruId],
			foreignColumns: [kalpataruInVidya.id],
			name: "fk_mula_kalpataru"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.editionId],
			foreignColumns: [editionInVidya.id],
			name: "fk_mula_edition"
		}),
	check("chk_mula_text_not_empty", sql`length(TRIM(BOTH FROM text_mula)) > 0`),
	check("chk_mula_size_guard", sql`length(text_mula) <= 10000`),
]);

export const vyakhyaInVidya = vidya.table("vyakhya", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	uuid: uuid().defaultRandom().notNull(),
	vyakhyaType: vyakhyaTypeInVidya("vyakhya_type").notNull(),
	partType: vyakhyaPartInVidya("part_type").default('VYAKHYANA'),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	authorId: bigint("author_id", { mode: "number" }),
	sourceName: text("source_name"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	sampradayaId: bigint("sampradaya_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	editionId: bigint("edition_id", { mode: "number" }),
	languageCode: text("language_code").notNull(),
	script: text(),
	textVyakhya: text("text_vyakhya").notNull(),
	seq: integer().default(1),
	isChunked: boolean("is_chunked").default(false),
	metadata: jsonb().default({}),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_vyakhya_author").using("btree", table.authorId.asc().nullsLast().op("int8_ops")),
	index("idx_vyakhya_fulltext").using("gin", sql`to_tsvector('simple'::regconfig, text_vyakhya)`),
	index("idx_vyakhya_language").using("btree", table.languageCode.asc().nullsLast().op("text_ops")),
	index("idx_vyakhya_type").using("btree", table.vyakhyaType.asc().nullsLast().op("enum_ops")),
	index("idx_vyakhya_uuid_search").using("btree", table.uuid.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("uq_vyakhya_order").using("btree", sql`author_id`, sql`part_type`, sql`seq`, sql`COALESCE(edition_id, (0)::bigint)`),
	uniqueIndex("uq_vyakhya_uuid").using("btree", table.uuid.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.authorId],
			foreignColumns: [vedicPersonInVidya.id],
			name: "fk_vyakhya_author"
		}),
	foreignKey({
			columns: [table.sampradayaId],
			foreignColumns: [sampradayaInVidya.id],
			name: "fk_vyakhya_sampradaya"
		}),
	foreignKey({
			columns: [table.editionId],
			foreignColumns: [editionInVidya.id],
			name: "fk_vyakhya_edition"
		}),
	foreignKey({
			columns: [table.languageCode],
			foreignColumns: [languageInVidya.code],
			name: "fk_vyakhya_language"
		}),
	check("chk_vyakhya_text", sql`length(TRIM(BOTH FROM text_vyakhya)) > 0`),
]);

export const vedicPersonInVidya = vidya.table("vedic_person", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	uuid: uuid().defaultRandom().notNull(),
	name: text().notNull(),
	title: text(),
	alternateNames: text("alternate_names").array(),
	personType: personTypeInVidya("person_type"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	sampradayaId: bigint("sampradaya_id", { mode: "number" }),
	isHistorical: boolean("is_historical").default(true),
	startYear: integer("start_year"),
	endYear: integer("end_year"),
	period: text(),
	biography: text(),
	metadata: jsonb().default({}),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_person_alt_names_search").using("gin", table.alternateNames.asc().nullsLast().op("array_ops")),
	index("idx_person_bio_fulltext").using("gin", sql`to_tsvector('simple'::regconfig, biography)`),
	index("idx_person_name_lower").using("btree", sql`lower(name)`),
	index("idx_person_uuid_search").using("btree", table.uuid.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("uq_person_uuid").using("btree", table.uuid.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.sampradayaId],
			foreignColumns: [sampradayaInVidya.id],
			name: "fk_person_sampradaya"
		}),
]);

export const shastricTaxonomyInVidya = vidya.table("shastric_taxonomy", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	uuid: uuid().defaultRandom().notNull(),
	slug: text().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	parentId: bigint("parent_id", { mode: "number" }),
	// TODO: failed to parse database type 'ltree'
	path: text("path").notNull(),
	depth: integer().generatedAlwaysAs(sql`vidya.nlevel(path)`),
	isLeaf: boolean("is_leaf").default(true),
	nameSanskrit: text("name_sanskrit").notNull(),
	nameEnglish: text("name_english"),
	definition: text(),
	taxonomyDomain: taxonomyDomainEnumInVidya("taxonomy_domain").notNull(),
	taxonomyClass: taxonomyClassInVidya("taxonomy_class").default('CONCEPT').notNull(),
	metadata: jsonb().default({}),
}, (table) => [
	index("idx_taxonomy_definition").using("gin", sql`to_tsvector('simple'::regconfig, definition)`),
	index("idx_taxonomy_domain").using("btree", table.taxonomyDomain.asc().nullsLast().op("enum_ops")),
	index("idx_taxonomy_path_gist").using("gist", table.path.asc().nullsLast().op("gist_ltree_ops")),
	index("idx_taxonomy_uuid_search").using("btree", table.uuid.asc().nullsLast().op("uuid_ops")),
	uniqueIndex("uq_taxonomy_path").using("btree", table.path.asc().nullsLast().op("ltree_ops")),
	uniqueIndex("uq_taxonomy_uuid").using("btree", table.uuid.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "shastric_taxonomy_parent_id_fkey"
		}).onDelete("cascade"),
	unique("uq_taxonomy_slug_unique").on(table.slug),
]);

export const taxonomyAliasInVidya = vidya.table("taxonomy_alias", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	taxonomyId: bigint("taxonomy_id", { mode: "number" }),
	alias: text().notNull(),
}, (table) => [
	uniqueIndex("uq_taxonomy_alias_norm").using("btree", sql`lower(alias)`),
	foreignKey({
			columns: [table.taxonomyId],
			foreignColumns: [shastricTaxonomyInVidya.id],
			name: "taxonomy_alias_taxonomy_id_fkey"
		}).onDelete("cascade"),
]);

export const mulaEmbeddingInVidya = vidya.table("mula_embedding", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	mulaId: bigint("mula_id", { mode: "number" }).notNull(),
	// TODO: failed to parse database type 'vidya.vector(1536)'
	embedding: text("embedding").notNull(),
	embeddingNorm: real("embedding_norm"),
	modelVersion: text("model_version").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_mula_embedding_ivf").using("ivfflat", table.embedding.asc().nullsLast().op("vector_cosine_ops")).with({lists: "100"}),
	index("idx_mula_model").using("btree", table.modelVersion.asc().nullsLast().op("text_ops")),
	uniqueIndex("uq_mula_embedding_model").using("btree", table.mulaId.asc().nullsLast().op("int8_ops"), table.modelVersion.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.mulaId],
			foreignColumns: [mulaInVidya.id],
			name: "mula_embedding_mula_id_fkey"
		}).onDelete("cascade"),
	check("chk_mula_embedding_not_null", sql`embedding IS NOT NULL`),
]);

export const personRelationInVidya = vidya.table("person_relation", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	uuid: uuid().defaultRandom().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	fromPersonId: bigint("from_person_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	toPersonId: bigint("to_person_id", { mode: "number" }).notNull(),
	relationType: personRelationTypeInVidya("relation_type").notNull(),
	confidenceScore: integer("confidence_score").default(100),
	startYear: integer("start_year"),
	endYear: integer("end_year"),
	metadata: jsonb().default({}),
}, (table) => [
	index("idx_person_rel_from").using("btree", table.fromPersonId.asc().nullsLast().op("int8_ops")),
	index("idx_person_rel_to").using("btree", table.toPersonId.asc().nullsLast().op("int8_ops")),
	index("idx_person_rel_type").using("btree", table.relationType.asc().nullsLast().op("enum_ops")),
	uniqueIndex("uq_person_rel_uuid").using("btree", table.uuid.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.fromPersonId],
			foreignColumns: [vedicPersonInVidya.id],
			name: "person_relation_from_person_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.toPersonId],
			foreignColumns: [vedicPersonInVidya.id],
			name: "person_relation_to_person_id_fkey"
		}).onDelete("cascade"),
	check("person_relation_confidence_score_check", sql`(confidence_score >= 1) AND (confidence_score <= 100)`),
	check("chk_person_no_self", sql`from_person_id <> to_person_id`),
]);

export const vyakhyaEmbeddingInVidya = vidya.table("vyakhya_embedding", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	vyakhyaId: bigint("vyakhya_id", { mode: "number" }).notNull(),
	// TODO: failed to parse database type 'vidya.vector(1536)'
	embedding: text("embedding").notNull(),
	embeddingNorm: real("embedding_norm"),
	chunkIndex: integer("chunk_index").default(0),
	chunkText: text("chunk_text"),
	modelVersion: text("model_version").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_vyakhya_embedding_ivf").using("ivfflat", table.embedding.asc().nullsLast().op("vector_cosine_ops")).with({lists: "100"}),
	index("idx_vyakhya_model").using("btree", table.modelVersion.asc().nullsLast().op("text_ops")),
	uniqueIndex("uq_vyakhya_chunk").using("btree", table.vyakhyaId.asc().nullsLast().op("text_ops"), table.modelVersion.asc().nullsLast().op("int8_ops"), table.chunkIndex.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.vyakhyaId],
			foreignColumns: [vyakhyaInVidya.id],
			name: "vyakhya_embedding_vyakhya_id_fkey"
		}).onDelete("cascade"),
	check("chk_vyakhya_embedding_not_null", sql`embedding IS NOT NULL`),
]);

export const contentFlagInVidya = vidya.table("content_flag", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	entityType: text("entity_type").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	entityId: bigint("entity_id", { mode: "number" }).notNull(),
	flagType: contentFlagTypeInVidya("flag_type").notNull(),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_flag_entity").using("btree", table.entityType.asc().nullsLast().op("int8_ops"), table.entityId.asc().nullsLast().op("int8_ops")),
]);

export const searchQueryLogInVidya = vidya.table("search_query_log", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	query: text().notNull(),
	// TODO: failed to parse database type 'vidya.vector(1536)'
	embedding: text("embedding"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	clickedMulaId: bigint("clicked_mula_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	clickedVyakhyaId: bigint("clicked_vyakhya_id", { mode: "number" }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_search_query").using("gin", sql`to_tsvector('simple'::regconfig, query)`),
	foreignKey({
			columns: [table.clickedMulaId],
			foreignColumns: [mulaInVidya.id],
			name: "search_query_log_clicked_mula_id_fkey"
		}),
	foreignKey({
			columns: [table.clickedVyakhyaId],
			foreignColumns: [vyakhyaInVidya.id],
			name: "search_query_log_clicked_vyakhya_id_fkey"
		}),
]);

export const languageInVidya = vidya.table("language", {
	code: text().primaryKey().notNull(),
	name: text().notNull(),
	endonym: text(),
	scriptDefault: mulaScriptInVidya("script_default"),
	isClassical: boolean("is_classical").default(false),
}, (table) => [
	unique("uq_language_name").on(table.name),
	check("chk_language_code_format", sql`code ~ '^[a-z]{2}$'::text`),
]);

export const sourceCitationInVidya = vidya.table("source_citation", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	uuid: uuid().defaultRandom().notNull(),
	title: text().notNull(),
	author: text(),
	publication: text(),
	year: integer(),
	url: text(),
	metadata: jsonb().default({}),
}, (table) => [
	uniqueIndex("uq_source_citation_uuid").using("btree", table.uuid.asc().nullsLast().op("uuid_ops")),
]);

export const kalpataruContentInVidya = vidya.table("kalpataru_content", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	uuid: uuid().defaultRandom().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	kalpataruId: bigint("kalpataru_id", { mode: "number" }).notNull(),
	title: text().notNull(),
	contentBody: text("content_body").notNull(),
	featuredImage: text("featured_image"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	authorId: bigint("author_id", { mode: "number" }),
	metadata: jsonb().default({"difficulty":"BEGINNER","seo_keywords":[],"reading_time_mins":0}),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_kalpataru_content_fulltext").using("gin", sql`to_tsvector('simple'::regconfig, ((title || ' '::text) || conte`),
	index("idx_kalpataru_content_node").using("btree", table.kalpataruId.asc().nullsLast().op("int8_ops")),
	uniqueIndex("uq_kalpataru_content_uuid").using("btree", table.uuid.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.kalpataruId],
			foreignColumns: [kalpataruInVidya.id],
			name: "kalpataru_content_kalpataru_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.authorId],
			foreignColumns: [vedicPersonInVidya.id],
			name: "kalpataru_content_author_id_fkey"
		}),
	foreignKey({
			columns: [table.authorId],
			foreignColumns: [vedicPersonInVidya.id],
			name: "fk_kc_author"
		}),
	unique("kalpataru_content_kalpataru_id_key").on(table.kalpataruId),
]);

export const editionInVidya = vidya.table("edition", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	uuid: uuid().defaultRandom().notNull(),
	name: text().notNull(),
	publisher: text(),
	reference: text(),
	year: integer(),
	editionType: editionTypeInVidya("edition_type"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	baseEditionId: bigint("base_edition_id", { mode: "number" }),
	languageCode: text("language_code").default('sa'),
	script: mulaScriptInVidya().default('DEVANAGARI'),
	metadata: jsonb().default({}),
}, (table) => [
	index("idx_edition_base").using("btree", table.baseEditionId.asc().nullsLast().op("int8_ops")),
	index("idx_edition_language").using("btree", table.languageCode.asc().nullsLast().op("text_ops")),
	index("idx_edition_name").using("btree", table.name.asc().nullsLast().op("text_ops")),
	index("idx_edition_type").using("btree", table.editionType.asc().nullsLast().op("enum_ops")),
	uniqueIndex("uq_edition_name_reference").using("btree", sql`name`, sql`COALESCE(reference, ''::text)`),
	uniqueIndex("uq_edition_uuid").using("btree", table.uuid.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.languageCode],
			foreignColumns: [languageInVidya.code],
			name: "fk_edition_language"
		}),
	foreignKey({
			columns: [table.baseEditionId],
			foreignColumns: [table.id],
			name: "fk_edition_base"
		}),
]);

export const kalpataruPersonRoleInVidya = vidya.table("kalpataru_person_role", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	uuid: uuid().defaultRandom().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	kalpataruId: bigint("kalpataru_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	personId: bigint("person_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	editionId: bigint("edition_id", { mode: "number" }),
	role: authorshipRoleInVidya().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	sampradayaId: bigint("sampradaya_id", { mode: "number" }),
	seq: integer().default(1),
	isPrimary: boolean("is_primary").default(false),
	metadata: jsonb().default({}),
}, (table) => [
	index("idx_kpr_edition").using("btree", table.editionId.asc().nullsLast().op("int8_ops")),
	index("idx_kpr_kalpataru").using("btree", table.kalpataruId.asc().nullsLast().op("int8_ops")),
	index("idx_kpr_person").using("btree", table.personId.asc().nullsLast().op("int8_ops")),
	index("idx_kpr_role").using("btree", table.role.asc().nullsLast().op("enum_ops")),
	index("idx_kpr_sampradaya").using("btree", table.sampradayaId.asc().nullsLast().op("int8_ops")),
	uniqueIndex("uq_kpr_order").using("btree", table.kalpataruId.asc().nullsLast().op("enum_ops"), table.role.asc().nullsLast().op("enum_ops"), table.seq.asc().nullsLast().op("enum_ops")),
	uniqueIndex("uq_kpr_unique").using("btree", sql`kalpataru_id`, sql`person_id`, sql`role`, sql`COALESCE(edition_id, (0)::bigint)`),
	uniqueIndex("uq_kpr_uuid").using("btree", table.uuid.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.kalpataruId],
			foreignColumns: [kalpataruInVidya.id],
			name: "fk_kpr_kalpataru"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.personId],
			foreignColumns: [vedicPersonInVidya.id],
			name: "fk_kpr_person"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.editionId],
			foreignColumns: [editionInVidya.id],
			name: "fk_kpr_edition"
		}),
	foreignKey({
			columns: [table.sampradayaId],
			foreignColumns: [sampradayaInVidya.id],
			name: "fk_kpr_sampradaya"
		}),
	check("chk_drashta_no_sampradaya", sql`NOT ((role = 'DRASHTA'::vidya.authorship_role) AND (sampradaya_id IS NOT NULL))`),
]);

export const citationLinkInVidya = vidya.table("citation_link", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	citationId: bigint("citation_id", { mode: "number" }).notNull(),
	entityType: text("entity_type").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	entityId: bigint("entity_id", { mode: "number" }).notNull(),
	note: text(),
}, (table) => [
	index("idx_citation_entity").using("btree", table.entityType.asc().nullsLast().op("int8_ops"), table.entityId.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.citationId],
			foreignColumns: [sourceCitationInVidya.id],
			name: "citation_link_citation_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.citationId, table.entityType, table.entityId], name: "citation_link_pkey"}),
]);

export const vyakhyaMulaMapInVidya = vidya.table("vyakhya_mula_map", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	vyakhyaId: bigint("vyakhya_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	mulaId: bigint("mula_id", { mode: "number" }).notNull(),
	anchorText: text("anchor_text"),
	confidenceScore: integer("confidence_score").default(100),
	source: text().default('acharya'),
}, (table) => [
	index("idx_vyakhya_map_confidence").using("btree", table.confidenceScore.asc().nullsLast().op("int4_ops")),
	index("idx_vyakhya_map_mula").using("btree", table.mulaId.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.vyakhyaId],
			foreignColumns: [vyakhyaInVidya.id],
			name: "vyakhya_mula_map_vyakhya_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.mulaId],
			foreignColumns: [mulaInVidya.id],
			name: "vyakhya_mula_map_mula_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.vyakhyaId, table.mulaId], name: "vyakhya_mula_map_pkey"}),
	check("vyakhya_mula_map_confidence_score_check", sql`(confidence_score >= 0) AND (confidence_score <= 100)`),
]);

export const vyakhyaTaxonomyMapInVidya = vidya.table("vyakhya_taxonomy_map", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	vyakhyaId: bigint("vyakhya_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	taxonomyId: bigint("taxonomy_id", { mode: "number" }).notNull(),
	confidenceScore: integer("confidence_score").default(100),
	isPrimary: boolean("is_primary").default(false),
	justification: text(),
	source: text(),
}, (table) => [
	index("idx_vyakhya_taxonomy").using("btree", table.taxonomyId.asc().nullsLast().op("int8_ops")),
	uniqueIndex("uq_vyakhya_primary_taxonomy").using("btree", table.vyakhyaId.asc().nullsLast().op("int8_ops")).where(sql`(is_primary = true)`),
	foreignKey({
			columns: [table.vyakhyaId],
			foreignColumns: [vyakhyaInVidya.id],
			name: "fk_vtm_vyakhya"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.taxonomyId],
			foreignColumns: [shastricTaxonomyInVidya.id],
			name: "fk_vtm_taxonomy"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.vyakhyaId, table.taxonomyId], name: "vyakhya_taxonomy_map_pkey"}),
	check("vyakhya_taxonomy_map_confidence_score_check", sql`(confidence_score >= 1) AND (confidence_score <= 100)`),
]);

export const mulaTaxonomyMapInVidya = vidya.table("mula_taxonomy_map", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	mulaId: bigint("mula_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	taxonomyId: bigint("taxonomy_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	editionId: bigint("edition_id", { mode: "number" }),
	confidenceScore: integer("confidence_score").default(100),
	isPrimary: boolean("is_primary").default(false),
	justification: text(),
	source: text(),
}, (table) => [
	index("idx_mula_taxonomy").using("btree", table.taxonomyId.asc().nullsLast().op("int8_ops")),
	uniqueIndex("uq_mula_primary_taxonomy").using("btree", table.mulaId.asc().nullsLast().op("int8_ops")).where(sql`(is_primary = true)`),
	uniqueIndex("uq_mula_taxonomy_composite").using("btree", sql`mula_id`, sql`taxonomy_id`, sql`COALESCE(edition_id, (0)::bigint)`),
	foreignKey({
			columns: [table.mulaId],
			foreignColumns: [mulaInVidya.id],
			name: "fk_mtm_mula"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.taxonomyId],
			foreignColumns: [shastricTaxonomyInVidya.id],
			name: "fk_mtm_taxonomy"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.editionId],
			foreignColumns: [editionInVidya.id],
			name: "fk_mtm_edition"
		}),
	primaryKey({ columns: [table.mulaId, table.taxonomyId], name: "mula_taxonomy_map_pkey"}),
	check("mula_taxonomy_map_confidence_score_check", sql`(confidence_score >= 1) AND (confidence_score <= 100)`),
]);
