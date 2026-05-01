# 🔐 VidyaCore: Master Database Credentials

This document stores the connection details for both the **PostgreSQL Knowledge Graph** and the **Legacy MongoDB** layer.

---

## 🐘 1. PostgreSQL (Local)
*Access these via DBeaver, pgAdmin, or CLI.*

| Field | Primary Database | Shadow (Dev) Database |
| :--- | :--- | :--- |
| **Host** | `localhost` | `localhost` |
| **Port** | `5432` | `5432` |
| **Database** | `vidyacore` | `vidyacore_shadow` |
| **User** | `ppublications` | `ppublications` |
| **Password** | (None) | (None) |
| **Schema** | `vidya` | `vidya` |

**CLI Command:**
```bash
psql -d vidyacore -U ppublications
```

---

## 🍃 2. MongoDB (Cloud)
*Access these via MongoDB Compass or Atlas.*

**Connection URI:**
```text
mongodb+srv://vedicskills_db_user:veda108@vedicskills-donations.vclpxuq.mongodb.net/VedicSkills-donations?retryWrites=true&w=majority
```

| Field | Value |
| :--- | :--- |
| **Database Name** | `VedicSkills-donations` |
| **User** | `vedicskills_db_user` |
| **Role** | Read/Write Access |

---

## ⚙️ 3. Environment Configuration
The server is configured to use both databases simultaneously via the `.env` file in the `/server` directory:

```env
PORT=5001
MONGO_URI=mongodb+srv://vedicskills_db_user:veda108@vedicskills-donations.vclpxuq.mongodb.net/VedicSkills-donations?retryWrites=true&w=majority
DATABASE_URL=postgres://ppublications@localhost:5432/vidyacore
JWT_SECRET=5c6b6f65b30536c6fb3846e04d943c73e9e1963f0e6788af63ad93d119a20c61
```

---

**Keep these credentials safe. They are the keys to your VidyaCore foundation.** 🌿🏛️💎
