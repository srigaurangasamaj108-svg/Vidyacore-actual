# Project Setup & Troubleshooting Journey: TrackMyFunds 🛠️

This document records the full process of setting up the TrackMyFunds project, the challenges we faced, and how we solved them. Use this as a reference if you ever need to set up the project again on a new machine.

---

## Step 1: Initial Analysis
We started by identifying the project structure:
- **Frontend**: React + Vite (Port 5173).
- **Backend**: Node.js + Express (Port 5000 initially).
- **Database**: MongoDB Atlas.

---

## Step 2: Database Setup & Challenges
### Challenge: Authentication Failed
**Problem**: After setting up MongoDB Atlas, the server reported `bad auth : authentication failed`.
**Resolution**: 
- We verified the **Database Access** user in Atlas.
- We reset the password to a simpler one (`veda108`) to avoid special character encoding issues.
- We corrected the **Database Name** casing (changing it to `VedicSkills-donations` with a capital **S**).

### Challenge: IP Whitelisting
**Problem**: The database was blocking connections from the local machine.
**Resolution**: We added `0.0.0.0/0` to the MongoDB Atlas **Network Access** list to allow connections from anywhere during development.

---

## Step 3: Server Configuration
We created the `.env` file in the `/server` directory with the following variables:
- `PORT`: Initially 5000, later changed to 5001.
- `MONGO_URI`: The full connection string including username, password, and database name.
- `JWT_SECRET`: A secure 32-byte hex string generated via Node.js crypto.

---

## Step 4: The Mac Port 5000 Conflict
### Challenge: ERR_EMPTY_RESPONSE / CORS Blocked
**Problem**: Even though the server was running, the frontend couldn't talk to it. The browser reported CORS errors and "Empty Response".
**Cause**: On macOS (Monterey and later), the **AirPlay Receiver** service uses Port 5000 by default, "stealing" traffic meant for the backend.
**Resolution**: 
- We moved the Backend to **Port 5001**.
- We updated the Frontend `api.js` to point to `http://localhost:5001/api`.
- This immediately resolved the connection issues.

---

## Step 5: Registration & Login Debugging
### Challenge: "User already exists" or "Registration failed"
**Problem**: User registration was failing or giving confusing messages.
**Resolution**: 
- We added detailed logging to `authController.js` to see the exact error.
- We fixed the CORS configuration in `server.js` to explicitly allow `http://localhost:5173` with `credentials: true`.
- Once the connection was clean, we found that the user already existed in the database from previous attempts.

---

## Step 6: Success & Deployment Ready
Finally, the app was fully functional:
1.  **Backend**: Running on `http://localhost:5001`.
2.  **Frontend**: Running on `http://localhost:5173`.
3.  **Database**: Data successfully saving and loading from MongoDB Atlas.

### Final Improvements:
- Added a `FRONTEND_URL` environment variable to `server.js` to allow easy switching between local development and production.
- Created a `DEPLOYMENT.md` guide for taking the project live on Render and Vercel.

---

## Summary of Commands to Start Locally:
**Backend**:
```bash
cd server
npm install
npx nodemon server.js
```

**Frontend**:
```bash
cd client
npm install
npm run dev
```

**Enjoy your fully functional Personal Finance Dashboard!** 🚀💰
