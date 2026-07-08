// pages/ApplyLeave.jsx — form to submit a new leave request.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";

export default function ApplyLeave() {
  const navigate = useNavigate();

  const [type, setType] = useState("casual");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await api.post("/leaves", { type, startDate, endDate, reason });
      setSuccess("Leave request submitted! Redirecting to your history…");
      // Give the user a moment to read the message, then go to history.
      setTimeout(() => navigate("/history"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit leave request.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card form-card">
      <h2>Apply for Leave</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSubmit}>
        <label>Leave Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="casual">Casual Leave</option>
          <option value="sick">Sick Leave</option>
          <option value="earned">Earned Leave</option>
        </select>

        <label>Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />

        <label>End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />

        <label>Reason (optional)</label>
        <textarea
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Family function"
        />

        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit Request"}
        </button>
      </form>
    </div>
  );
}
