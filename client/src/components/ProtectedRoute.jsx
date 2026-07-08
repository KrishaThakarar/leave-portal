// components/ProtectedRoute.jsx
// A wrapper that only shows its children if the user is logged in.
// If not logged in, it redirects to the login page.
// If adminOnly is true, it also requires the user to be an admin.
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  // While we are still checking the saved token, show a simple message.
  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading…</p>;
  }

  // Not logged in → go to login page.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not an admin, on an admin-only page → send to dashboard.
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
