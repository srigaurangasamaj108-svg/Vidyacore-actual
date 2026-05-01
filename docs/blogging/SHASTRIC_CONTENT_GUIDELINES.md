# 🖋️ VidyaCore: Shastric Content & Blogging Guidelines

## 🏛️ Vision
The VidyaCore Blog is not a collection of opinions; it is a **Manifestation of Shastric Truth**. Every article must bridge the gap between immutable revelation (Nigama) and practical application (Agama).

---

## 🛠️ Mature MDX Norms

### 1. The Shloka Block
Every article must start with or center around a foundational Shloka. Use the `ShlokaBlock` component for maximum aesthetic impact.

```mdx
<ShlokaBlock>
  सर्वस्य चाहं हृदि सन्निविष्टो मत्तः स्मृतिर्ज्ञानमपोहनं च ।
  वेदैश्च सर्वैर्हमेव वेद्यो वेदान्तकृद्वेदविदेव चाहम् ॥
</ShlokaBlock>
```

### 2. Aesthetic Motifs
Use high-resolution imagery (Aesthetic Motifs) at the start of articles to set the meditative tone. Standard paths: `/assets/images/sri-krishna-aesthetic.webp`.

### 3. Frontmatter Requirements
Every MDX file must include the following frontmatter for system synchronization:
- `title`: Professional scholarly title.
- `slug`: Must match the filename exactly.
- `node_id`: The corresponding ID in the `kalpataru` table.
- `description`: A brief summary for the Insight Panel.

---

## 🔱 The Blogging Workflow

1.  **Node Ingestion**: Create a entry in the `vidya.kalpataru` table.
2.  **MDX Creation**: Author the content in `client/src/content/[slug].mdx`.
3.  **Cross-Linking**: Link to other nodes using the standard `/wiki/[slug]` path.
4.  **Verification**: Ensure the "Insight Sidebar" correctly pulls the metadata from the database via the `slug`.

---

## 🛡️ Forbidden Practices
- **No Hardcoded Metadata**: Do not put system metadata (like `node_type`) inside the MDX text; the system pulls this live from the database.
- **No Raw HTML**: Use Tailwind-styled Markdown for consistency.
- **No Relative Links**: Always use absolute paths starting with `/wiki/` to ensure the routing engine can track the seeker's journey.

**Status**: The content pipeline is now standardized. 🖋️📜🏛️
