# 🏛️ Implementation Plan: TypeScript & tRPC Transition

This plan details the "Phase 2" upgrade of VidyaCore to a full TypeScript + tRPC architecture, ensuring the highest level of type-safety for the Shastra Knowledge Graph.

---

## 🎯 1. Objectives
- **TypeScript**: Migrate the `/server` from JS to TS for robust development.
- **tRPC**: Establish a type-safe communication tunnel between Frontend and Backend.
- **Drizzle Restoration**: Re-use the high-fidelity `.ts` schemas for 100% database parity.
- **Folder Integrity**: Maintain the clean, modular structure (`controllers`, `routes`, `pages`, etc.).

---

## 🏗️ 2. Architectural Changes

### 📂 Folder Structure Preservation:
We will keep the current clean structure but add the tRPC layer:
```text
server/
├── db/              # Drizzle Schemas (.ts)
├── trpc/            # tRPC Routers and Context (NEW)
├── controllers/     # Legacy Logic (migrating to .ts)
├── routes/          # Legacy Express Routes (migrating to .ts)
├── middleware/      # Auth and Logger (migrating to .ts)
└── server.ts        # Entry point (Renamed from server.js)
```

---

## 🛠️ 3. Step-by-Step Execution

### Step 1: Core Dependencies
Install the engine for the new architecture:
- `typescript`, `ts-node`, `nodemon`
- `@trpc/server`, `@trpc/client`, `@trpc/react-query`
- `zod` (for schema validation)
- `@types/express`, `@types/node`, `@types/cors`

### Step 2: TypeScript Config
Create a `tsconfig.json` optimized for Node.js and Drizzle.

### Step 3: The tRPC "Success Tunnel"
1.  **`server/trpc/context.ts`**: Extract the JWT from the request and identify the user.
2.  **`server/trpc/trpc.ts`**: Initialize the tRPC instance with Auth middleware.
3.  **`server/trpc/routers/_app.ts`**: The root router connecting all sub-routers (Auth, Kalpataru, Mula).

### Step 4: Express Mounting
Mount the tRPC middleware at `/trpc` in `server.ts` alongside existing Express routes.

---

## 🧪 4. Verification & Success Point
1.  **Test 1**: Verify the server starts and connects to both Postgres and Mongo.
2.  **Test 2**: Verify existing `/api/auth/login` (Express) still works.
3.  **Test 3**: Create a `hello` tRPC procedure and call it from the frontend.

**Once verified, we will lock this as Success Point `v1.1.0-trpc-initialized`.** 🌿🏛️💎🚀🚣‍♂️
