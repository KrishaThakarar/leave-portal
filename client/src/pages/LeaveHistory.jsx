// pages/LeaveHistory.jsx — shows the logged-in employee's own leave requests.
import { useEffect, useState } from "react";
import api from "../api/api.js";
import StatusBadge from "../components/StatusBadge.jsx";
import LeaveTypeBadge from "../components/LeaveTypeBadge.jsx";

// Turns a date string into something readable like "6 Jul 2026".
function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function LeaveHistory() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load the data once when the page opens.
  useEffect(() => {
    api
      .get("/leaves/my")
      .then((res) => setLeaves(res.data))
      .catch((err) => setError(err.response?.data?.message || "Could not load history."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h2>My Leave History</h2>

      {leaves.length === 0 ? (
        <p className="muted">You have not applied for any leave yet.</p>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave._id}>
                  <td><LeaveTypeBadge type={leave.type} /></td>
                  <td>{formatDate(leave.startDate)}</td>
                  <td>{formatDate(leave.endDate)}</td>
                  <td>{leave.days}</td>
                  <td>{leave.reason || "—"}</td>
                  <td><StatusBadge status={leave.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
