const { relations  } = require("drizzle-orm/relations");
const { sampradayaInVidya, vedicPersonInVidya, kalpataruInVidya, mulaInVidya, mulaRelationInVidya, editionInVidya, vyakhyaInVidya, languageInVidya, shastricTaxonomyInVidya, taxonomyAliasInVidya, mulaEmbeddingInVidya, personRelationInVidya, vyakhyaEmbeddingInVidya, searchQueryLogInVidya, kalpataruContentInVidya, kalpataruPersonRoleInVidya, sourceCitationInVidya, citationLinkInVidya, vyakhyaMulaMapInVidya, vyakhyaTaxonomyMapInVidya, mulaTaxonomyMapInVidya  } = require("./schema");

const sampradayaInVidyaRelations = relations(sampradayaInVidya, ({one, many}) => ({
	sampradayaInVidya: one(sampradayaInVidya, {
		fields: [sampradayaInVidya.parentId],
		references: [sampradayaInVidya.id],
		relationName: "sampradayaInVidya_parentId_sampradayaInVidya_id"
	}),
	sampradayaInVidyas: many(sampradayaInVidya, {
		relationName: "sampradayaInVidya_parentId_sampradayaInVidya_id"
	}),
	vedicPersonInVidya_mulaAcharyaId: one(vedicPersonInVidya, {
		fields: [sampradayaInVidya.mulaAcharyaId],
		references: [vedicPersonInVidya.id],
		relationName: "sampradayaInVidya_mulaAcharyaId_vedicPersonInVidya_id"
	}),
	vedicPersonInVidya_mulaAcharyaId: one(vedicPersonInVidya, {
		fields: [sampradayaInVidya.mulaAcharyaId],
		references: [vedicPersonInVidya.id],
		relationName: "sampradayaInVidya_mulaAcharyaId_vedicPersonInVidya_id"
	}),
	vyakhyaInVidyas: many(vyakhyaInVidya),
	vedicPersonInVidyas: many(vedicPersonInVidya, {
		relationName: "vedicPersonInVidya_sampradayaId_sampradayaInVidya_id"
	}),
	kalpataruPersonRoleInVidyas: many(kalpataruPersonRoleInVidya),
}));

const vedicPersonInVidyaRelations = relations(vedicPersonInVidya, ({one, many}) => ({
	sampradayaInVidyas_mulaAcharyaId: many(sampradayaInVidya, {
		relationName: "sampradayaInVidya_mulaAcharyaId_vedicPersonInVidya_id"
	}),
	sampradayaInVidyas_mulaAcharyaId: many(sampradayaInVidya, {
		relationName: "sampradayaInVidya_mulaAcharyaId_vedicPersonInVidya_id"
	}),
	vyakhyaInVidyas: many(vyakhyaInVidya),
	sampradayaInVidya: one(sampradayaInVidya, {
		fields: [vedicPersonInVidya.sampradayaId],
		references: [sampradayaInVidya.id],
		relationName: "vedicPersonInVidya_sampradayaId_sampradayaInVidya_id"
	}),
	personRelationInVidyas_fromPersonId: many(personRelationInVidya, {
		relationName: "personRelationInVidya_fromPersonId_vedicPersonInVidya_id"
	}),
	personRelationInVidyas_toPersonId: many(personRelationInVidya, {
		relationName: "personRelationInVidya_toPersonId_vedicPersonInVidya_id"
	}),
	kalpataruContentInVidyas_authorId: many(kalpataruContentInVidya, {
		relationName: "kalpataruContentInVidya_authorId_vedicPersonInVidya_id"
	}),
	kalpataruContentInVidyas_authorId: many(kalpataruContentInVidya, {
		relationName: "kalpataruContentInVidya_authorId_vedicPersonInVidya_id"
	}),
	kalpataruPersonRoleInVidyas: many(kalpataruPersonRoleInVidya),
}));

const kalpataruInVidyaRelations = relations(kalpataruInVidya, ({one, many}) => ({
	kalpataruInVidya_parentId: one(kalpataruInVidya, {
		fields: [kalpataruInVidya.parentId],
		references: [kalpataruInVidya.id],
		relationName: "kalpataruInVidya_parentId_kalpataruInVidya_id"
	}),
	kalpataruInVidyas_parentId: many(kalpataruInVidya, {
		relationName: "kalpataruInVidya_parentId_kalpataruInVidya_id"
	}),
	kalpataruInVidya_granthaId: one(kalpataruInVidya, {
		fields: [kalpataruInVidya.granthaId],
		references: [kalpataruInVidya.id],
		relationName: "kalpataruInVidya_granthaId_kalpataruInVidya_id"
	}),
	kalpataruInVidyas_granthaId: many(kalpataruInVidya, {
		relationName: "kalpataruInVidya_granthaId_kalpataruInVidya_id"
	}),
	mulaInVidyas_kalpataruId: many(mulaInVidya, {
		relationName: "mulaInVidya_kalpataruId_kalpataruInVidya_id"
	}),
	mulaInVidyas_kalpataruId: many(mulaInVidya, {
		relationName: "mulaInVidya_kalpataruId_kalpataruInVidya_id"
	}),
	kalpataruContentInVidyas: many(kalpataruContentInVidya),
	kalpataruPersonRoleInVidyas: many(kalpataruPersonRoleInVidya),
}));

const mulaRelationInVidyaRelations = relations(mulaRelationInVidya, ({one}) => ({
	mulaInVidya_fromMulaId: one(mulaInVidya, {
		fields: [mulaRelationInVidya.fromMulaId],
		references: [mulaInVidya.id],
		relationName: "mulaRelationInVidya_fromMulaId_mulaInVidya_id"
	}),
	mulaInVidya_toMulaId: one(mulaInVidya, {
		fields: [mulaRelationInVidya.toMulaId],
		references: [mulaInVidya.id],
		relationName: "mulaRelationInVidya_toMulaId_mulaInVidya_id"
	}),
	editionInVidya_fromEditionId: one(editionInVidya, {
		fields: [mulaRelationInVidya.fromEditionId],
		references: [editionInVidya.id],
		relationName: "mulaRelationInVidya_fromEditionId_editionInVidya_id"
	}),
	editionInVidya_toEditionId: one(editionInVidya, {
		fields: [mulaRelationInVidya.toEditionId],
		references: [editionInVidya.id],
		relationName: "mulaRelationInVidya_toEditionId_editionInVidya_id"
	}),
}));

const mulaInVidyaRelations = relations(mulaInVidya, ({one, many}) => ({
	mulaRelationInVidyas_fromMulaId: many(mulaRelationInVidya, {
		relationName: "mulaRelationInVidya_fromMulaId_mulaInVidya_id"
	}),
	mulaRelationInVidyas_toMulaId: many(mulaRelationInVidya, {
		relationName: "mulaRelationInVidya_toMulaId_mulaInVidya_id"
	}),
	kalpataruInVidya_kalpataruId: one(kalpataruInVidya, {
		fields: [mulaInVidya.kalpataruId],
		references: [kalpataruInVidya.id],
		relationName: "mulaInVidya_kalpataruId_kalpataruInVidya_id"
	}),
	kalpataruInVidya_kalpataruId: one(kalpataruInVidya, {
		fields: [mulaInVidya.kalpataruId],
		references: [kalpataruInVidya.id],
		relationName: "mulaInVidya_kalpataruId_kalpataruInVidya_id"
	}),
	editionInVidya: one(editionInVidya, {
		fields: [mulaInVidya.editionId],
		references: [editionInVidya.id]
	}),
	mulaEmbeddingInVidyas: many(mulaEmbeddingInVidya),
	searchQueryLogInVidyas: many(searchQueryLogInVidya),
	vyakhyaMulaMapInVidyas: many(vyakhyaMulaMapInVidya),
	mulaTaxonomyMapInVidyas: many(mulaTaxonomyMapInVidya),
}));

const editionInVidyaRelations = relations(editionInVidya, ({one, many}) => ({
	mulaRelationInVidyas_fromEditionId: many(mulaRelationInVidya, {
		relationName: "mulaRelationInVidya_fromEditionId_editionInVidya_id"
	}),
	mulaRelationInVidyas_toEditionId: many(mulaRelationInVidya, {
		relationName: "mulaRelationInVidya_toEditionId_editionInVidya_id"
	}),
	mulaInVidyas: many(mulaInVidya),
	vyakhyaInVidyas: many(vyakhyaInVidya),
	languageInVidya: one(languageInVidya, {
		fields: [editionInVidya.languageCode],
		references: [languageInVidya.code]
	}),
	editionInVidya: one(editionInVidya, {
		fields: [editionInVidya.baseEditionId],
		references: [editionInVidya.id],
		relationName: "editionInVidya_baseEditionId_editionInVidya_id"
	}),
	editionInVidyas: many(editionInVidya, {
		relationName: "editionInVidya_baseEditionId_editionInVidya_id"
	}),
	kalpataruPersonRoleInVidyas: many(kalpataruPersonRoleInVidya),
	mulaTaxonomyMapInVidyas: many(mulaTaxonomyMapInVidya),
}));

const vyakhyaInVidyaRelations = relations(vyakhyaInVidya, ({one, many}) => ({
	vedicPersonInVidya: one(vedicPersonInVidya, {
		fields: [vyakhyaInVidya.authorId],
		references: [vedicPersonInVidya.id]
	}),
	sampradayaInVidya: one(sampradayaInVidya, {
		fields: [vyakhyaInVidya.sampradayaId],
		references: [sampradayaInVidya.id]
	}),
	editionInVidya: one(editionInVidya, {
		fields: [vyakhyaInVidya.editionId],
		references: [editionInVidya.id]
	}),
	languageInVidya: one(languageInVidya, {
		fields: [vyakhyaInVidya.languageCode],
		references: [languageInVidya.code]
	}),
	vyakhyaEmbeddingInVidyas: many(vyakhyaEmbeddingInVidya),
	searchQueryLogInVidyas: many(searchQueryLogInVidya),
	vyakhyaMulaMapInVidyas: many(vyakhyaMulaMapInVidya),
	vyakhyaTaxonomyMapInVidyas: many(vyakhyaTaxonomyMapInVidya),
}));

const languageInVidyaRelations = relations(languageInVidya, ({many}) => ({
	vyakhyaInVidyas: many(vyakhyaInVidya),
	editionInVidyas: many(editionInVidya),
}));

const shastricTaxonomyInVidyaRelations = relations(shastricTaxonomyInVidya, ({one, many}) => ({
	shastricTaxonomyInVidya: one(shastricTaxonomyInVidya, {
		fields: [shastricTaxonomyInVidya.parentId],
		references: [shastricTaxonomyInVidya.id],
		relationName: "shastricTaxonomyInVidya_parentId_shastricTaxonomyInVidya_id"
	}),
	shastricTaxonomyInVidyas: many(shastricTaxonomyInVidya, {
		relationName: "shastricTaxonomyInVidya_parentId_shastricTaxonomyInVidya_id"
	}),
	taxonomyAliasInVidyas: many(taxonomyAliasInVidya),
	vyakhyaTaxonomyMapInVidyas: many(vyakhyaTaxonomyMapInVidya),
	mulaTaxonomyMapInVidyas: many(mulaTaxonomyMapInVidya),
}));

const taxonomyAliasInVidyaRelations = relations(taxonomyAliasInVidya, ({one}) => ({
	shastricTaxonomyInVidya: one(shastricTaxonomyInVidya, {
		fields: [taxonomyAliasInVidya.taxonomyId],
		references: [shastricTaxonomyInVidya.id]
	}),
}));

const mulaEmbeddingInVidyaRelations = relations(mulaEmbeddingInVidya, ({one}) => ({
	mulaInVidya: one(mulaInVidya, {
		fields: [mulaEmbeddingInVidya.mulaId],
		references: [mulaInVidya.id]
	}),
}));

const personRelationInVidyaRelations = relations(personRelationInVidya, ({one}) => ({
	vedicPersonInVidya_fromPersonId: one(vedicPersonInVidya, {
		fields: [personRelationInVidya.fromPersonId],
		references: [vedicPersonInVidya.id],
		relationName: "personRelationInVidya_fromPersonId_vedicPersonInVidya_id"
	}),
	vedicPersonInVidya_toPersonId: one(vedicPersonInVidya, {
		fields: [personRelationInVidya.toPersonId],
		references: [vedicPersonInVidya.id],
		relationName: "personRelationInVidya_toPersonId_vedicPersonInVidya_id"
	}),
}));

const vyakhyaEmbeddingInVidyaRelations = relations(vyakhyaEmbeddingInVidya, ({one}) => ({
	vyakhyaInVidya: one(vyakhyaInVidya, {
		fields: [vyakhyaEmbeddingInVidya.vyakhyaId],
		references: [vyakhyaInVidya.id]
	}),
}));

const searchQueryLogInVidyaRelations = relations(searchQueryLogInVidya, ({one}) => ({
	mulaInVidya: one(mulaInVidya, {
		fields: [searchQueryLogInVidya.clickedMulaId],
		references: [mulaInVidya.id]
	}),
	vyakhyaInVidya: one(vyakhyaInVidya, {
		fields: [searchQueryLogInVidya.clickedVyakhyaId],
		references: [vyakhyaInVidya.id]
	}),
}));

const kalpataruContentInVidyaRelations = relations(kalpataruContentInVidya, ({one}) => ({
	kalpataruInVidya: one(kalpataruInVidya, {
		fields: [kalpataruContentInVidya.kalpataruId],
		references: [kalpataruInVidya.id]
	}),
	vedicPersonInVidya_authorId: one(vedicPersonInVidya, {
		fields: [kalpataruContentInVidya.authorId],
		references: [vedicPersonInVidya.id],
		relationName: "kalpataruContentInVidya_authorId_vedicPersonInVidya_id"
	}),
	vedicPersonInVidya_authorId: one(vedicPersonInVidya, {
		fields: [kalpataruContentInVidya.authorId],
		references: [vedicPersonInVidya.id],
		relationName: "kalpataruContentInVidya_authorId_vedicPersonInVidya_id"
	}),
}));

const kalpataruPersonRoleInVidyaRelations = relations(kalpataruPersonRoleInVidya, ({one}) => ({
	kalpataruInVidya: one(kalpataruInVidya, {
		fields: [kalpataruPersonRoleInVidya.kalpataruId],
		references: [kalpataruInVidya.id]
	}),
	vedicPersonInVidya: one(vedicPersonInVidya, {
		fields: [kalpataruPersonRoleInVidya.personId],
		references: [vedicPersonInVidya.id]
	}),
	editionInVidya: one(editionInVidya, {
		fields: [kalpataruPersonRoleInVidya.editionId],
		references: [editionInVidya.id]
	}),
	sampradayaInVidya: one(sampradayaInVidya, {
		fields: [kalpataruPersonRoleInVidya.sampradayaId],
		references: [sampradayaInVidya.id]
	}),
}));

const citationLinkInVidyaRelations = relations(citationLinkInVidya, ({one}) => ({
	sourceCitationInVidya: one(sourceCitationInVidya, {
		fields: [citationLinkInVidya.citationId],
		references: [sourceCitationInVidya.id]
	}),
}));

const sourceCitationInVidyaRelations = relations(sourceCitationInVidya, ({many}) => ({
	citationLinkInVidyas: many(citationLinkInVidya),
}));

const vyakhyaMulaMapInVidyaRelations = relations(vyakhyaMulaMapInVidya, ({one}) => ({
	vyakhyaInVidya: one(vyakhyaInVidya, {
		fields: [vyakhyaMulaMapInVidya.vyakhyaId],
		references: [vyakhyaInVidya.id]
	}),
	mulaInVidya: one(mulaInVidya, {
		fields: [vyakhyaMulaMapInVidya.mulaId],
		references: [mulaInVidya.id]
	}),
}));

const vyakhyaTaxonomyMapInVidyaRelations = relations(vyakhyaTaxonomyMapInVidya, ({one}) => ({
	vyakhyaInVidya: one(vyakhyaInVidya, {
		fields: [vyakhyaTaxonomyMapInVidya.vyakhyaId],
		references: [vyakhyaInVidya.id]
	}),
	shastricTaxonomyInVidya: one(shastricTaxonomyInVidya, {
		fields: [vyakhyaTaxonomyMapInVidya.taxonomyId],
		references: [shastricTaxonomyInVidya.id]
	}),
}));

const mulaTaxonomyMapInVidyaRelations = relations(mulaTaxonomyMapInVidya, ({one}) => ({
	mulaInVidya: one(mulaInVidya, {
		fields: [mulaTaxonomyMapInVidya.mulaId],
		references: [mulaInVidya.id]
	}),
	shastricTaxonomyInVidya: one(shastricTaxonomyInVidya, {
		fields: [mulaTaxonomyMapInVidya.taxonomyId],
		references: [shastricTaxonomyInVidya.id]
	}),
	editionInVidya: one(editionInVidya, {
		fields: [mulaTaxonomyMapInVidya.editionId],
		references: [editionInVidya.id]
	}),
}));
module.exports = { sampradayaInVidyaRelations, vedicPersonInVidyaRelations, kalpataruInVidyaRelations, mulaRelationInVidyaRelations, mulaInVidyaRelations, editionInVidyaRelations, vyakhyaInVidyaRelations, languageInVidyaRelations, shastricTaxonomyInVidyaRelations, taxonomyAliasInVidyaRelations, mulaEmbeddingInVidyaRelations, personRelationInVidyaRelations, vyakhyaEmbeddingInVidyaRelations, searchQueryLogInVidyaRelations, kalpataruContentInVidyaRelations, kalpataruPersonRoleInVidyaRelations, citationLinkInVidyaRelations, sourceCitationInVidyaRelations, vyakhyaMulaMapInVidyaRelations, vyakhyaTaxonomyMapInVidyaRelations, mulaTaxonomyMapInVidyaRelations };
