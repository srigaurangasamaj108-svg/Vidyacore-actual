# VidyaCore: Fresh Chat Initialization Guide 🔑🚀

If you ever start a new chat session, use this guide to instantly provide the AI with the full context of the VidyaCore project.

---

## 📂 1. The "Context Bundle" (Upload these files first)
Provide these four documents to the AI immediately. They contain the "Soul" and "Skeleton" of the project:

1.  **`VIDYA_CORE_FOUNDATION.md`**: The Vision and Core Principles (Mula Purity, etc.).
2.  **`VIDYA_CORE_ARCHITECTURE.md`**: The Technical Stack (Drizzle, tRPC, Postgres).
3.  **`VIDYA_SCHEMA_BREAKDOWN.md`**: The 11-Layer Data Model.
4.  **`VIDYA_PROJECT_BLUEPRINT.md`**: The Folder Structure and Roadmap.
5.  **`CURRENT_STATE_AND_AUTH_MIGRATION.md`**: Current Auth state and Migration Plan.

**Also provide**: Your **13 Migration Scripts** so the AI knows the exact database schema.

---

## 💬 2. The "Master Bootstrap Prompt"
Copy and paste this text as your first message in the new chat:

> "I am working on **VidyaCore**, a high-fidelity Vedic Knowledge Operating System. We have already established the vision, the 11-layer architecture, and the technical stack (PostgreSQL, Drizzle ORM, tRPC, and Next.js). 
>
> I am providing you with the core documentation and the 13 migration scripts that define our schema. 
>
> **Current Status**: We have renamed the project from 'TrackMyFunds' to 'VidyaCore'. We have a working JWT auth system that needs to be migrated from MongoDB to PostgreSQL. 
>
> **Objective**: Please study the attached documents and wait for my instructions to proceed with the next phase of implementation."

---

## 🏛️ 3. Why this is necessary
- **Consistency**: It ensures the AI doesn't suggest a different ORM or a different layering strategy.
- **Speed**: You don't have to re-explain the `Kalpataru` tree or the `Mula` purity rules.
- **Accuracy**: The AI will have the exact table definitions from your migration scripts, preventing coding errors.

**With this guide, you can restart the project at any time, with any AI, and never lose a single drop of progress.** 🌿🏛️✨
