// pages/EmployeeDashboard.jsx

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function EmployeeDashboard() {
  const { user, refreshUser } = useAuth();

  
  
  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The three leave types with friendly labels.
  const types = [
    { key: "casual", label: "Casual Leave" },
    { key: "sick", label: "Sick Leave" },
    { key: "earned", label: "Earned Leave" },
  ];

  return (
    <div>
      <h2>Welcome, {user.name} 👋</h2>
      <p className="muted">Here is your remaining leave balance for the year.</p>

      {/* Balance cards, one per leave type */}
      <div className="balance-grid">
        {types.map((t) => (
          <div key={t.key} className={`card balance-card balance-${t.key}`}>
            <div className="balance-number">{user.leaveBalance?.[t.key] ?? 0}</div>
            <div className="balance-label">{t.label}</div>
            <div className="muted">days left</div>
          </div>
        ))}
      </div>

      <div className="quick-links">
        <Link className="btn" to="/apply">
          + Apply for Leave
        </Link>
        <Link className="btn btn-secondary" to="/history">
          View My History
        </Link>
      </div>
    </div>
  );
}
