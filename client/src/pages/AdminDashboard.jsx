// pages/AdminDashboard.jsx
// Admins see every leave request and can Approve or Reject the pending ones.
import { useEffect, useState } from "react";
import api from "../api/api.js";
import StatusBadge from "../components/StatusBadge.jsx";
import LeaveTypeBadge from "../components/LeaveTypeBadge.jsx";

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminDashboard() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters: "" means "all".
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // Fetches the list from the backend using the current filters.
  function loadLeaves() {
    setLoading(true);
    const params = {};
    if (statusFilter) params.status = statusFilter;
    if (typeFilter) params.type = typeFilter;

    api
      .get("/leaves", { params })
      .then((res) => setLeaves(res.data))
      .catch((err) => setError(err.response?.data?.message || "Could not load requests."))
      .finally(() => setLoading(false));
  }

  // Reload whenever a filter changes.
  useEffect(() => {
    loadLeaves();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, typeFilter]);

  // Approve or reject a single request, then refresh the list.
  async function handleDecision(id, status) {
    setError("");
    try {
      await api.patch(`/leaves/${id}/status`, { status });
      loadLeaves();
    } catch (err) {
      setError(err.response?.data?.message || "Action failed.");
    }
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p className="muted">Review and act on employee leave requests.</p>

      {/* Filter controls */}
      <div className="filters">
        <label>
          Status:
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </label>

        <label>
          Type:
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">All</option>
            <option value="casual">Casual</option>
            <option value="sick">Sick</option>
            <option value="earned">Earned</option>
          </select>
        </label>
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>Loading…</p>
      ) : leaves.length === 0 ? (
        <p className="muted">No requests match these filters.</p>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((leave) => (
                <tr key={leave._id}>
                  <td>
                    {/* userId is "populated" by the backend into an object */}
                    {leave.userId?.name || "Unknown"}
                    <br />
                    <span className="muted small">{leave.userId?.email}</span>
                  </td>
                  <td><LeaveTypeBadge type={leave.type} /></td>
                  <td>{formatDate(leave.startDate)}</td>
                  <td>{formatDate(leave.endDate)}</td>
                  <td>{leave.days}</td>
                  <td>{leave.reason || "—"}</td>
                  <td><StatusBadge status={leave.status} /></td>
                  <td>
                    {leave.status === "pending" ? (
                      <div className="action-buttons">
                        <button
                          className="btn btn-small btn-approve"
                          onClick={() => handleDecision(leave._id, "approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-small btn-reject"
                          onClick={() => handleDecision(leave._id, "rejected")}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
