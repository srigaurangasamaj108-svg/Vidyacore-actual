# 🛡️ VidyaCore: SQL Trigger Hardening

This document records the architectural fixes applied to the PostgreSQL Master Schema to ensure robust hierarchical data management.

---

## 🛠️ 1. The Issue: Schema Isolation
During the initial ingestion of the **Prime Node** (Sri Krishna), the database triggers failed with:
`ERROR: type "kalpataru" does not exist`

This occurred because PL/pgSQL functions run in a localized environment and may not automatically inherit the `search_path` set by the session.

---

## 🏗️ 2. The Solution: Hardened Triggers
The following architectural patterns were applied to all tree-logic triggers (`Kalpataru`, `Taxonomy`, `Sampradaya`):

### A. Explicit Schema Typing
Changed local variable declarations from:
`DECLARE parent_record kalpataru;`
To:
`DECLARE parent_record vidya.kalpataru;`

### B. Internal Search Path
Added an explicit search path inside the function body:
`SET search_path TO vidya, public;`

**Benefit**: This ensures that the `ltree` extension and internal table references are resolved correctly regardless of the connection parameters.

---

## 🆔 3. Sequence Management
Failed transactions in PostgreSQL still consume sequence numbers. This is why the first successful insertion might result in `ID 2` if a previous attempt failed.

**Policy**: For major production milestones, sequences should be reset only during a full "Wipe and Ingest" phase to maintain identity consistency.

---

**These fixes ensure that the VidyaCore tree can grow infinitely without structural failure.** 🌿🏛️💎🚀🚣‍♂️
