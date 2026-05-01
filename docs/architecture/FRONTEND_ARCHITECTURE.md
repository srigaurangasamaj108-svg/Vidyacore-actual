# Frontend Architecture: TrackMyFunds 🎨

The frontend is a **React** application built with **Vite**. It uses a "Component-Context-Service" architecture.

## Root: `client/`

### 1. `main.jsx`
- **Role**: The bridge between React and the HTML page.
- **Responsibility**: Renders the `<App />` component and wraps it in the `<BrowserRouter>` for routing and `<AuthProvider>` for state management.

### 2. `App.jsx`
- **Role**: The "Router" of your app.
- **Responsibility**: Defines all the URL paths on your website (e.g., `/dashboard`, `/login`, `/register`) and which Page component to show for each one.

---

## Folders & Files

### 3. `context/` (The "State" Layer)
- **`AuthContext.jsx`**: This is the most critical file. It holds the "Logged In" status for the whole app. It provides functions like `login()` and `logout()` that any component can use. It also saves the user's token in `localStorage`.

### 4. `services/` (The "API" Layer)
- **`api.js`**: This is your **API Helper**. Instead of writing `axios.post` in every file, you use this helper.
- **Responsibility**: It automatically attaches the JWT token to every request so the server knows who is calling it. It also defines the `baseURL` for the backend.

### 5. `pages/` (The "View" Layer)
These are full screens the user sees.
- **`Login.jsx` / `Register.jsx`**: Handles the auth forms.
- **`Dashboard.jsx`**: The main screen with charts and summaries.
- **`Profile.jsx`**: Displays user details.

### 6. `components/` (The "Widget" Layer)
Small, reusable pieces of UI.
- **`Navbar.jsx`**: The navigation bar.
- **`PrivateRoute.jsx`**: A special wrapper that checks if you are logged in. If not, it redirects you to the login page automatically.

### 7. `layouts/` (The "Structure" Layer)
- **`MainLayout.jsx`**: Defines the general look of the page (e.g., Sidebar on the left, Content on the right).

---

## Linkage Summary:
1. **User clicks a button** in a `page`.
2. The `page` calls a function in the `context`.
3. The `context` uses the `api.js` service to talk to the backend.
4. The backend responds, and the `context` updates the `page` with the new data.
