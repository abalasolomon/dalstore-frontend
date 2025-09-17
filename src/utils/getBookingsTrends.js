import { parseISO, format, isSameWeek, isSameMonth } from "date-fns";

/**
 * Get booking trends grouped by day, with optional filtering by week or month.
 *
 * @param {Object[]} bookings - List of bookings.
 * @param {"all"|"week"|"month"} filter - Time filter.
 * @param {Date} [referenceDate] - Reference date for week/month comparison (default: today).
 * @returns {Array} - Array of [date, bookingCount], sorted by date.
 */
export const getBookingsTrends = (bookings = [], filter = "all", referenceDate = new Date()) => {
  const dailyCounts = {};

  bookings.forEach((booking) => {
    const createdAt = booking.created_at;
    if (!createdAt) return;

    const date = parseISO(createdAt);
    const dayKey = format(date, "dd MMM yyyy");

    const include = 
      filter === "all" ||
      (filter === "week" && isSameWeek(date, referenceDate, { weekStartsOn: 1 })) ||
      (filter === "month" && isSameMonth(date, referenceDate));

    if (include) {
      dailyCounts[dayKey] = (dailyCounts[dayKey] || 0) + 1;
    }
  });

  const sortedDates = Object.keys(dailyCounts).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const result = [["Date", "Bookings"]];
  sortedDates.forEach((day) => {
    result.push([day, dailyCounts[day]]);
  });

  return result;
};
