// components/LeaveTypeBadge.jsx
// A small colored label showing the leave type (casual/sick/earned).
export default function LeaveTypeBadge({ type }) {
  const labels = {
    casual: "Casual",
    sick: "Sick",
    earned: "Earned",
  };
  return <span className={`badge badge-type-${type}`}>{labels[type] || type}</span>;
}
