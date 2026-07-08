// context/AuthContext.jsx
// "Context" lets us share the logged-in user with every component without
// passing props down manually. Any component can call useAuth() to read it.
import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api.js";

const AuthContext = createContext(null);

// Wrap the whole app in <AuthProvider> (done in main.jsx).
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // "loading" is true while we check localStorage / verify the token on startup.
  const [loading, setLoading] = useState(true);

  // On first load, if we have a saved token, ask the backend who we are.
  // This keeps the user logged in after a page refresh.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => {
        // Token was invalid/expired — clear it.
        localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, []);

  // Save the token + user after a successful login or register.
  function saveSession({ token, user }) {
    localStorage.setItem("token", token);
    setUser(user);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  // Re-fetches the current user from the backend (e.g. to pick up an updated
  // leave balance after a request gets approved). Pages that display balances
  // should call this on mount instead of trusting the possibly-stale value
  // that was set at login time.
  async function refreshUser() {
    const res = await api.get("/auth/me");
    setUser(res.data.user);
    return res.data.user;
  }

  const value = { user, setUser, saveSession, logout, loading, refreshUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// A tiny helper hook so components can write:  const { user } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
