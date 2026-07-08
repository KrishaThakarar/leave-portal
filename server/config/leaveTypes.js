// config/leaveTypes.js
// A single place that defines the leave types and their default yearly quotas.
// Both the User model and the leave controller import from here so the values
// never get out of sync.

export const LEAVE_TYPES = ["casual", "sick", "earned"];

// Default balance (in days) a brand-new user starts with, per type.
export const DEFAULT_LEAVE_BALANCE = {
  casual: 12,
  sick: 10,
  earned: 15,
};
