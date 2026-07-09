// context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api.js";

const AuthContext = createContext(null);


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  
  const [loading, setLoading] = useState(true);

  
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

  
  function saveSession({ token, user }) {
    localStorage.setItem("token", token);
    setUser(user);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  
  async function refreshUser() {
    const res = await api.get("/auth/me");
    setUser(res.data.user);
    return res.data.user;
  }

  const value = { user, setUser, saveSession, logout, loading, refreshUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export function useAuth() {
  return useContext(AuthContext);
}
