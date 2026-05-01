# Backend Architecture: TrackMyFunds ⚙️

The backend is built with **Node.js** and **Express**. It follows a "Controller-Route-Model" pattern.

## Root: `server/`

### 1. `server.js`
- **Role**: The main entry point of your application.
- **Responsibility**: 
    - Loads environment variables (`dotenv`).
    - Configures middleware (CORS, JSON parsing).
    - Connects to **MongoDB** using Mongoose.
    - Mounts all major route groups (e.g., `/api/auth`, `/api/transactions`).
    - Starts the server on a specific port.

---

## Folders & Files

### 2. `models/` (The "Data" Layer)
This folder defines what your data looks like in the database.
- **`User.js`**: Defines the user schema (name, email, password).
- **`Transaction.js`**: Defines income and expense entries (amount, category, type, date).
- **`Goal.js`**: Defines savings goals and their targets.

### 3. `routes/` (The "Gatekeeper" Layer)
These files define the URL paths and which HTTP methods (GET, POST, DELETE) are allowed.
- **`authRoutes.js`**: Handles `/api/auth/register`, `/login`, and `/me`.
- **`transactionRoutes.js`**: Handles creating and fetching expenses.
- **`goalRoutes.js`**: Handles savings goals.
- **Linkage**: These files call functions in the **Controllers**.

### 4. `controllers/` (The "Logic" Layer)
This is where the actual "brain" of your app lives.
- **`authController.js`**: Contains the logic for hashing passwords, creating JWT tokens, and verifying user credentials.
- **`transactionController.js`**: Contains logic for adding transactions and calculating totals.
- **Responsibility**: It receives data from the Route, talks to the Model, and sends a JSON response back to the client.

### 5. `middleware/` (The "Filter" Layer)
These are helper functions that run *before* the controller.
- **`authMiddleware.js`**: This is the most important one. It checks the "Authorization" header for a valid JWT token. If the token is missing or invalid, it blocks the request. This ensures only logged-in users can see their data.

---

## Request Flow Example:
1. `server.js` ➡️ `routes/authRoutes.js` ➡️ `middleware/authMiddleware.js` (if protected) ➡️ `controllers/authController.js` ➡️ `models/User.js`.
