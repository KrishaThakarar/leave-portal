// components/StatusBadge.jsx
// A small colored label showing a request's status (pending/approved/rejected).
export default function StatusBadge({ status }) {
  // Pick a CSS class based on the status so each gets its own color.
  const className = `badge badge-${status}`;
  return <span className={className}>{status}</span>;
}
