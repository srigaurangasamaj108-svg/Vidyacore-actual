# 🛡️ VidyaCore: Success Point Policy

This document establishes the official policy for versioning and state-preservation in the VidyaCore project. Following this policy ensures we can always return to a perfectly functional state.

---

## 💎 1. The Golden Rule
**"Never tag a broken state."**
A **Success Point (Git Tag)** is only created when the following conditions are met:
- [ ] **Schema Sync**: The database exactly matches the Drizzle definitions.
- [ ] **Build Success**: The server starts without errors (`npm run dev`).
- [ ] **Logic Verified**: The specific feature being worked on has been manually or automatically tested.
- [ ] **Documentation Sync**: Any architectural changes are documented in the `/docs` folder.

---

## 📝 2. Descriptive Manifestos
Every tag must have a clear, descriptive message using the following format:
`git tag -a vX.Y.Z -m "[Module Name]: Detailed description of what is now functional"`

**Example:**
`git tag -a v1.1.0 -m "Auth Migration: Users now login via Postgres; Roles (Admin/Scholar) are enforced in middleware."`

---

## 📂 3. Success Point Registry
The following milestones represent the "Ancestry" of the project:

- **v1.0.0 (Foundation)**: Master 15-file Schema + Drizzle Engine + Doc Organization.
- *(Next Milestone Pending: Auth Migration)*

---

## 🚀 4. The Sync Policy
To prevent data loss, every Success Point must be pushed to the cloud immediately:
```bash
git push origin [tag_name]
```

---

**By following this policy, we ensure that VidyaCore remains an immutable and reliable repository of Shastra.** 🌿🏛️💎🚀🚣‍♂️
