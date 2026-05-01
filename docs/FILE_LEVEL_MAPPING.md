# File-Level Mapping: TrackMyFunds 📂

This document provides a detailed breakdown of every file in the project, its responsibility, and its relationships with other files.

---

## 🛠️ SERVER (BACKEND)

### Entry & Config
- **`/server/server.js`**
  - **Responsibility**: Boots up the Express server, connects to MongoDB, and defines top-level routes.
  - **Linkage**: Imports `routes/authRoutes.js`, `routes/transactionRoutes.js`, and `routes/goalRoutes.js`.

- **`/server/.env`**
  - **Responsibility**: Stores sensitive variables like `MONGO_URI` and `JWT_SECRET`.
  - **Linkage**: Loaded by `server.js` using `dotenv`.

### Routing (The Gatekeepers)
- **`/server/routes/authRoutes.js`**
  - **Responsibility**: Defines endpoints for login, register, and getting user profile.
  - **Linkage**: Calls functions in `controllers/authController.js`. Uses `middleware/authMiddleware.js` for the `/me` route.

- **`/server/routes/transactionRoutes.js`**
  - **Responsibility**: Defines endpoints for adding and fetching transactions.
  - **Linkage**: Calls `controllers/transactionController.js`. Uses `middleware/authMiddleware.js` to ensure only the owner can see their transactions.

### Logic (The Brains)
- **`/server/controllers/authController.js`**
  - **Responsibility**: Handles user registration (hashing passwords) and login (generating JWT tokens).
  - **Linkage**: Uses `models/User.js` to save/find users.

- **`/server/controllers/transactionController.js`**
  - **Responsibility**: Logic for saving new income/expense entries and retrieving them for the user.
  - **Linkage**: Uses `models/Transaction.js`.

### Security & Data
- **`/server/middleware/authMiddleware.js`**
  - **Responsibility**: A function that checks the JWT token in the request headers. If valid, it attaches the `user.id` to the request (`req.user`).
  - **Linkage**: Used by almost all routes in `routes/`.

- **`/server/models/User.js`**, **`Transaction.js`**, **`Goal.js`**
  - **Responsibility**: Mongoose schemas that define the structure of documents in MongoDB.
  - **Linkage**: Imported by Controllers to perform database operations.

---

## 🎨 CLIENT (FRONTEND)

### Entry & Routing
- **`/client/src/main.jsx`**
  - **Responsibility**: Renders the app into the HTML `id="root"`.
  - **Linkage**: Wraps everything in `BrowserRouter` and `AuthProvider`.

- **`/client/src/App.jsx`**
  - **Responsibility**: Defines all pages (Routes) and protects some using `PrivateRoute`.
  - **Linkage**: Imports all components from `pages/` and `components/`.

### State & Services
- **`/client/src/context/AuthContext.jsx`**
  - **Responsibility**: Manages the global `user` state (is the user logged in or not?).
  - **Linkage**: Calls `services/api.js` for login/register.

- **`/client/src/services/api.js`**
  - **Responsibility**: Configures Axios with the `baseURL`. Automatically adds the `Authorization` header to every request.
  - **Linkage**: Imported by `AuthContext.jsx` and various page components to make API calls.

### Pages & Components
- **`/client/src/pages/Dashboard.jsx`**
  - **Responsibility**: Fetches all transactions and displays summaries/charts.
  - **Linkage**: Uses `AuthContext` to get the current user and `api.js` to fetch data.

- **`/client/src/components/PrivateRoute.jsx`**
  - **Responsibility**: A wrapper component. If the user is not logged in, it redirects them to `/login`.
  - **Linkage**: Used in `App.jsx` to protect sensitive pages.

- **`/client/src/pages/UploadCSV.jsx`**
  - **Responsibility**: Allows users to upload a bank file. It parses the CSV and sends the data to the backend.
  - **Linkage**: Uses `papaparse` for parsing and `api.js` for saving.

---

## 🔗 The "Request Chain" Example:
1. **User action** in `UploadCSV.jsx`.
2. **Call** to `api.post('/transactions/upload', data)` in `services/api.js`.
3. **Request** hits `server/server.js` ➡️ `routes/transactionRoutes.js`.
4. **Middleware** `authMiddleware.js` verifies the user.
5. **Controller** `transactionController.js` saves the data using `models/Transaction.js`.
6. **Response** sent back to `UploadCSV.jsx`.
7. **UI Updates** to show "Success!".
