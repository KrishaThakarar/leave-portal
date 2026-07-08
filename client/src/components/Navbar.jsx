// components/Navbar.jsx
// The top navigation bar. It shows different links depending on whether the
// user is logged in and whether they are an admin.
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🏝️ Leave Portal
      </Link>

      <div className="navbar-links">
        {/* Links shown only when logged in */}
        {user && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/apply">Apply</Link>
            <Link to="/history">History</Link>
            {/* Admin-only link */}
            {user.role === "admin" && <Link to="/admin">Admin</Link>}
          </>
        )}

        {/* Links for logged-out visitors */}
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {user && (
          <>
            <span className="navbar-user">
              {user.name} ({user.role})
            </span>
            <button className="btn btn-small" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
