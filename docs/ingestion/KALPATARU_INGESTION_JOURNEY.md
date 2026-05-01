# 🌿 VidyaCore: The Kalpataru Ingestion Journey

## 🏛️ Project State: v1.5.0 "Success Tunnel Manifested"

This document records the forensic history of the VidyaCore Knowledge Graph implementation, the challenges faced, and the immutable principles established to ensure long-term structural integrity.

---

## 🔱 Key Challenges & Forensic Observations

### 1. The "BigInt Silence" (Serialization Crash)
*   **The Challenge**: The server was fetching nodes correctly but the frontend stayed in a permanent "Loading" state (gray pulsing boxes).
*   **The Cause**: PostgreSQL `BIGINT` columns are returned as `BigInt` objects in Node.js. Standard `JSON.stringify` (and tRPC by extension) cannot serialize BigInts, causing the server to crash *silently* after logging but before sending the response.
*   **The Solution**: Explicitly mapping the database result to convert all `id`, `parentId`, and `granthaId` fields into standard JavaScript `Number` types before returning them to the tRPC caller.

### 2. The "Casing Conflict" (Database vs. Frontend)
*   **The Challenge**: The tree navigation was empty even though the data existed in the database.
*   **The Cause**: PostgreSQL uses `snake_case` (e.g., `parent_id`), but the Drizzle ORM was configured (via schema definitions) to use `camelCase` (e.g., `parentId`). The frontend was looking for `node.parent_id`, which was `undefined`.
*   **The Solution**: Synchronizing all frontend components (`TreeView`, `InsightSidebar`) to use the `camelCase` properties defined in the Drizzle schema.

### 3. The "Relative Path Paradox"
*   **The Challenge**: Moving components deeper into the directory tree (e.g., `src/components/Wiki/TreeNavigator/`) broke the imports to the tRPC utility.
*   **The Cause**: Nested components were using `../../utils/trpc`, which pointed to a non-existent folder. 
*   **The Solution**: Correcting the backtrack depth (`../../../utils/trpc`) and ensuring all imports are relative to the final production folder structure.

### 4. The "Port Dissonance"
*   **The Challenge**: The "Success Tunnel" was disconnected even though the server was running.
*   **The Cause**: The `.env` file specified `PORT=5001`, but the `TRPCProvider.tsx` was sometimes hardcoded or defaulting to `5000`.
*   **The Solution**: Centralizing port configuration and ensuring the `TRPCProvider` strictly matches the server's listening port.

---

## 🛡️ Rigid Principles (What NOT to change)

To prevent future "fidgeting" from breaking the system, the following principles must be observed:

1.  **Immutability of the Tree Logic**: The `TreeView` logic uses a `Map` for O(n) tree construction. Avoid changing this to nested loops; the map ensures the tree remains fast as the graph grows to thousands of nodes.
2.  **Explicit Serialization**: Every new tRPC procedure fetching data from the `kalpataru` table MUST include a `.map()` to convert BigInts to Numbers. Failure to do so will cause the "White Screen of Death."
3.  **CamelCase Superiority**: Always use `camelCase` in the frontend for database fields. The Drizzle schema is the "Source of Truth" for property names, NOT the raw SQL column names.
4.  **Slug-Based Manifestation**: The Wiki relies on the `slug` parameter matching the `.mdx` filename exactly. Do not rename `.mdx` files without updating the `slug` column in the database.

---

## ✅ Practical Solutions (Summary)

*   **UI stuck in loading?** Check server terminal for BigInt serialization errors.
*   **Tree is empty?** Check if `parentId` (camelCase) is being used in the mapping.
*   **Import errors?** Verify the backtrack level (`../`) in the component.

**Status**: The Kalpataru is now rooted and growing. 🐘🏗️🌱
