# Vidya: Project Blueprint & Implementation Plan 🌿🏛️

This blueprint outlines the transition from the current "TrackMyFunds" setup to the full "Vidya" knowledge system using PostgreSQL and Drizzle ORM.

---

## 📂 1. Expanded Folder Structure

### 🛠️ Backend (Node.js/Express)
```
server/
├── db/                   # NEW: Drizzle database layer
│   ├── schema.js         # Table definitions (Kalpataru, Mula, etc.)
│   └── index.js          # Drizzle client initialization
├── controllers/
│   ├── authController.js # UPDATED: Logic for Postgres Auth
│   ├── vidyaController.js # NEW: Logic for Tree/Verse navigation
│   └── searchController.js # NEW: Logic for Vector/Semantic search
├── routes/
│   ├── authRoutes.js     # Links to new auth logic
│   └── vidyaRoutes.js    # NEW: Endpoints for the library
├── middleware/
│   └── authMiddleware.js # SAME: JWT verification logic
└── server.js             # UPDATED: Boots with Drizzle client
```

### 🎨 Frontend (React/Vite)
```
client/src/
├── components/
│   ├── vidya/            # NEW: Specialized library components
│   │   ├── KalpataruTree.jsx  # Hierarchical navigation
│   │   ├── VerseViewer.jsx    # Display Mula + Vyakhya
│   │   ├── TaxonomyMap.jsx    # Visual conceptual web
│   │   └── SampradayaToggle.jsx # Switch between traditions
├── pages/
│   ├── Library.jsx       # The main Explorer screen
│   ├── Profile.jsx       # User's bookmarks and history
│   └── Login.jsx         # Same: Unified auth page
└── services/
    └── api.js            # SAME: Talk to the new backend endpoints
```

---

## 🔐 2. The Postgres Auth Transition
To replace MongoDB, we will update the `authController.js` logic:
- **Registration**: 
    - `db.insert(users).values({ email, password: hashedPassword })`
- **Login**:
    - `db.select().from(users).where(eq(users.email, email))`
- **Benefit**: You get the same JWT security, but with the performance and reliability of Postgres.

---

## 🏛️ 3. Proposed "Semantic" Tables (5 New Tables)
To complete your vision, I propose adding these to your schema:
1.  **`manuscript_source`**: Links `edition` to physical/digital archives (e.g., scan URLs, library IDs).
2.  **`parampara_flow`**: Maps the flow of knowledge between `vedic_person` and `sampradaya`.
3.  **`semantic_concept`**: A deeper layer for `taxonomy` that stores specific Sanskrit-to-English philosophical mapping.
4.  **`audio_recitation`**: Links a `mula_id` to an audio file/timestamp for the oral tradition.
6.  **`kalpataru_content`**: The "Educational Layer." Stores 1-page elaborate explanations for every node in the tree.

---

## 🖼️ 4. Front-End Design Visualization
**The "Vidya Explorer" Interface**:
- **Sidebar (Left)**: A dynamic tree view of the `kalpataru`. Nodes expand as you click.
- **Header**: Search bar with "Semantic Search" (Powered by `pgvector`).
- **Main View (Center)**: 
    - **Read Mode**: Displays the 1-page article from `kalpataru_content`.
    - **Verse Mode**: Displays the current `mula` verse in large, clear Devanagari.
- **Details Panel (Right)**:
    - **Tab 1: Vyakhya**: Selectable commentaries by tradition.
    - **Tab 2: Taxonomy**: Clickable concepts related to this verse.
    - **Tab 3: Relations**: Links to "Supporting" or "Expanding" verses in other texts.

---

## 🏁 5. Implementation Strategy
1.  **Step 1**: Initialize **Drizzle** and test the **Auth Layer** migration (Mongo ➡️ Postgres).
2.  **Step 2**: Create the core Vidya tables using your **13 Migration Scripts**.
3.  **Step 3**: Implement the **"Dharma Engine"** (Triggers) for `ltree` and `grantha_id` propagation.
4.  **Step 4**: Build the **Tree Navigator** and **Article Viewer** (Blogging system).
5.  **Step 5**: Implement the **Intelligence Layer** (Semantic Search) for AI discovery.

**This plan ensures that every part of your vision has a clear home in the code.**
