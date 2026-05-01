# Deployment Guide: TrackMyFunds 🚀

Follow these steps to take your project from your local machine to a live online URL.

---

## Phase 1: Preparation (GitHub)

The easiest way to deploy is to have your code on GitHub.

1.  **Create a Repository**: Go to GitHub and create a new repository named `TrackMyFunds`.
2.  **Initialize Git**: In your project root, run:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
3.  **Push to GitHub**: Follow the instructions on GitHub to link your local folder and push:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/TrackMyFunds.git
    git branch -M main
    git push -u origin main
    ```

---

## Phase 2: Deploy the Backend (Server)

We will use **[Render.com](https://render.com/)** for the Node.js server.

1.  **Create Web Service**: In Render, click **New > Web Service**.
2.  **Connect GitHub**: Select your `TrackMyFunds` repository.
3.  **Settings**:
    - **Name**: `trackmyfunds-api`
    - **Root Directory**: `server`
    - **Environment**: `Node`
    - **Build Command**: `npm install`
    - **Start Command**: `node server.js`
4.  **Environment Variables**: Click **Advanced** and add:
    - `MONGO_URI`: (Your full MongoDB connection string)
    - `JWT_SECRET`: (Your secret key from .env)
    - `PORT`: `10000`
    - `FRONTEND_URL`: (Your final Vercel link, e.g., `https://your-app.vercel.app`)
5.  **Copy the Link**: Once deployed, Render will give you a URL like `https://trackmyfunds-api.onrender.com`. **Copy this.**

---

## Phase 3: Update Frontend API Link

Now you must tell your frontend to talk to the live backend instead of `localhost`.

1.  Open `client/src/services/api.js`.
2.  Update the `baseURL`:
    ```javascript
    const api = axios.create({
      baseURL: 'https://trackmyfunds-api.onrender.com/api', // Use your Render link
      withCredentials: true,
    });
    ```
3.  **Commit and Push**:
    ```bash
    git add .
    git commit -m "Update API URL for production"
    git push origin main
    ```

---

## Phase 4: Deploy the Frontend (Client)

We will use **[Vercel](https://vercel.com/)** for the React application.

1.  **Import Project**: In Vercel, click **Add New > Project**.
2.  **Connect GitHub**: Select your `TrackMyFunds` repository.
3.  **Project Settings**:
    - **Root Directory**: `client`
    - **Framework Preset**: `Vite`
    - **Build Command**: `npm run build`
    - **Output Directory**: `dist`
4.  **Deploy**: Click **Deploy**. Vercel will give you your final live link (e.g., `https://track-my-funds.vercel.app`).

---

## Phase 5: Final CORS Configuration

For security, your backend must explicitly allow your new Vercel link.

1.  Open `server/server.js`.
2.  Update the `cors` section to include your Vercel link:
    ```javascript
    app.use(cors({
      origin: "https://track-my-funds.vercel.app", // Your final Vercel link
      credentials: true,
    }));
    ```
3.  **Commit and Push**:
    ```bash
    git add .
    git commit -m "Update CORS for production"
    git push origin main
    ```

---

## Summary of URLs
| Component | Local URL | Example Production URL |
| :--- | :--- | :--- |
| **Frontend** | `http://localhost:5173` | `https://your-app.vercel.app` |
| **Backend** | `http://localhost:5001` | `https://your-api.onrender.com` |

**Congratulations! Your personal finance tracker is now live!** 🌍💰
