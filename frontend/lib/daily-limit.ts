export const DAILY_LIMIT = 5;

// The server and the counter must use the same day boundary (UTC midnight).
export function startOfToday() {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  return start.toISOString();
}
