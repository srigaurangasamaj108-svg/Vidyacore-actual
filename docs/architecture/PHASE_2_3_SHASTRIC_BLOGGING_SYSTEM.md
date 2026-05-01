# 🏛️ VidyaCore: Phase 2.3 — Shastric Blogging & Reader System

This document details the implementation of the **Shastric Reader**, the 3-panel frontend architecture, and the MDX-based blogging engine.

---

## 🎨 1. The Frontend Architecture (Trimūrti Layout)
The UI is organized into three modular panels, ensuring clarity and scholarly depth:

### 🌳 A. Tree Navigator (`src/components/Wiki/TreeNavigator/`)
- **Role**: Recursive hierarchy traversal.
- **Logic**: Maps the `kalpataru` PostgreSQL structure to a clickable sidebar.

### 📖 B. Article Surface (`src/pages/Wiki/WikiArticlePage.tsx`)
- **Role**: High-fidelity content rendering.
- **Standards**: Every article begins with a **Mantra Opening** (Devanagari + IAST) following the `MDX_ARTICLE_NORMS.md`.

### 🧠 C. Insight Panel (`src/components/Wiki/InsightPanel/`)
- **Role**: Scholarly metadata and external bridging.
- **Features**: Sampradaya attribution, Taxonomy tags, and verified [Vedabase.io](https://vedabase.io) links.

---

## ⚡ 2. The Success Tunnel (tRPC & React Query)
- **Client Utility**: `src/utils/trpc.ts` provides the type-safe hook generator.
- **Provider**: `src/components/trpc/TRPCProvider.tsx` manages the connection to the backend and handles authentication headers.

---

## 📂 3. Content Repository
- **Location**: `client/src/content/`
- **Format**: MDX (Markdown + React).
- **Prime Node**: `sri-krishna.mdx` serves as the gold-standard template for all future articles.

---

## 🚀 4. Milestone: `v1.4.0-shastric-reader-active`
- **Achievement**: A fully functional, 3-panel Knowledge Graph reader.
- **State**: Verified through Prime Ingestion (Sri Krishna ID#1).
- **Next Step**: Mass ingestion of the 4 Vedas and their respective Skandhas.

---

**VidyaCore is now a production-ready educational platform.** 🌿🏛️💎🚀🚣‍♂️
