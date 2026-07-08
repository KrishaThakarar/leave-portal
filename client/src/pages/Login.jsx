// pages/Login.jsx — the login form.
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { saveSession } = useAuth();
  const navigate = useNavigate();

  // Local state for the two input fields and any error message.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault(); // stop the browser from reloading the page
    setError("");
    setSubmitting(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      saveSession(res.data); // stores token + user
      navigate("/dashboard");
    } catch (err) {
      // Show the backend's message if there is one.
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card form-card">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? "Logging in…" : "Login"}
        </button>
      </form>

      <p className="muted">
        No account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}
