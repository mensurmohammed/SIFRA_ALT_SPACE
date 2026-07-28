/**
 * Utility to clean and format error messages into concise, user-friendly strings,
 * removing Turbopack stack traces, database pooler dumps, and unhandled internal dev errors.
 */
export function cleanErrorMessage(
  rawError: any,
  fallback = "An unexpected error occurred. Please try again."
): string {
  if (!rawError) return fallback;

  let msg = "";
  if (typeof rawError === "string") {
    msg = rawError;
  } else if (typeof rawError === "object") {
    msg = rawError.error || rawError.message || fallback;
  }

  if (typeof msg !== "string" || !msg.trim()) return fallback;

  // Detect Turbopack / Next.js dev server stack traces
  if (
    msg.includes("__TURBOPACK__") ||
    msg.includes("invocation in") ||
    msg.includes("async function") ||
    msg.includes(".next\\dev\\server") ||
    msg.includes(".next/dev/server")
  ) {
    if (
      msg.includes("Can't reach database server") ||
      msg.includes("database server at") ||
      msg.includes("prisma")
    ) {
      return "Unable to connect to database server. Please check database configuration or network connection.";
    }
    return "An internal server error occurred. Please try again later.";
  }

  // Database & Prisma error cleanups
  if (msg.includes("Can't reach database server") || msg.includes("P1001")) {
    return "Unable to connect to database server. Please try again later.";
  }
  if (msg.includes("Unique constraint failed") || msg.includes("P2002")) {
    return "A record with this information already exists.";
  }
  if (msg.includes("Foreign key constraint failed") || msg.includes("P2003")) {
    return "Operation failed due to a related record constraint.";
  }
  if (msg.includes("ETIMEDOUT") || msg.includes("ECONNREFUSED")) {
    return "Connection timeout. Please check your network connection.";
  }
  if (msg.includes("jwt expired") || msg.includes("invalid token")) {
    return "Your session has expired. Please log in again.";
  }

  // If message is multi-line, take the first line
  if (msg.includes("\n")) {
    msg = msg.split("\n")[0];
  }

  // Strip backticks or excessive quotes
  msg = msg.replace(/`+/g, "").trim();

  // Enforce maximum length for conciseness
  if (msg.length > 140) {
    msg = msg.substring(0, 137).trim() + "...";
  }

  return msg || fallback;
}
