// components/StatusBadge.jsx
// A small colored label showing a requests status (pending/approved/rejected).
export default function StatusBadge({ status }) {
  
  const className = `badge badge-${status}`;
  return <span className={className}>{status}</span>;
}
