/**
 * Formats a date string from "MM-YYYY" format to a localized string (e.g., "Jan 2024").
 *
 * @param {string} dateStr - The date string in "MM-YYYY" format.
 * @returns {string} The formatted date string (e.g., "Jan 2024"), the original string if invalid, or an empty string if null.
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const match = dateStr.match(/^(\d{2})-(\d{4})$/);
  if (!match) return dateStr;
  const [, month, year] = match;
  const monthInt = parseInt(month, 10);
  const date = new Date(year, monthInt - 1);
  return date.toLocaleString("en-GB", { month: "short", year: "numeric" });
};

/**
 * Formats an ISO date string to a localized string (e.g., "Jan 29, 2026").
 *
 * @param {string} isoDateStr - The ISO date string.
 * @returns {string} The formatted date string (e.g., "Jan 29, 2026") or an empty string if null.
 */
export const formatISODate = (isoDateStr) => {
  if (!isoDateStr) return "";
  const date = new Date(isoDateStr);
  return date.toLocaleString("en-GB", { month: "short", day: "numeric", year: "numeric" });
};
