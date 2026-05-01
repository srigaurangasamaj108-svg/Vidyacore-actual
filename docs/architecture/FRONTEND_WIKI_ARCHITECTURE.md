# 🏛️ VidyaCore: Frontend Wiki Architecture

This document details the modular organization of the "Shastric Reader" interface, ensuring a clean, high-performance, and meditative user experience.

---

## 🎨 1. The "Trimūrti" Layout
The UI is divided into three distinct functional zones:

### 🌳 A. The Navigation Tree (Left)
- **Role**: Recursive hierarchy explorer.
- **Logic**: Fetches the `ltree` structure from PostgreSQL.
- **Interaction**: Selecting a node updates the URL slug and fetches the corresponding article.

### 📖 B. The Knowledge Surface (Center)
- **Role**: High-fidelity MDX rendering.
- **Logic**: Combines database metadata (Title, Author) with MDX body content.
- **Aesthetic**: Uses "Shloka Blocks" for Sanskrit text and the "Peacock/Flute" motif for headers.

### 🧠 C. The Insight Panel (Right)
- **Role**: Scholarly context and related links.
- **Logic**: Shows connected taxonomy tags, sampradaya attribution, and external Vedabase links.

---

## 📂 2. Folder Structure
```text
client/src/
├── components/Wiki/
│   ├── TreeNavigator/       # Recursive tree logic
│   ├── ArticleSurface/      # MDX & Typography
│   └── InsightPanel/        # Metadata & Related Links
├── pages/Wiki/
│   ├── WikiLayout.tsx       # 3-Panel Grid
│   └── [slug].tsx           # Dynamic Route handler
├── content/                 # MDX Source Files
└── hooks/
    └── useShastra.ts        # tRPC integration for Knowledge Graph
```

---

## ⚡ 3. The tRPC Integration
We will use the **`v1.1.0` Success Tunnel** to fetch data:
```typescript
// Example usage in UI
const { data: tree } = api.knowledge.getTree.useQuery();
const { data: article } = api.knowledge.getArticleBySlug.useQuery({ slug: "sri-krishna" });
```

---

**This architecture ensures that as the VidyaCore tree grows to thousands of nodes, the UI remains fast, organized, and elegant.** 🌿🏛️💎🚀🚣‍♂️
