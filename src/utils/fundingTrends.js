import { format, parseISO } from "date-fns";

export const getMonthlyFundingTrends = (fundings = []) => {
  const monthlyTotals = {};

  fundings.forEach((tx) => {
    if (tx.is_success) {
      const date = parseISO(tx.timestamp);
      const monthYear = format(date, "MMM yyyy");
      const amount = parseFloat(tx.amount);

      monthlyTotals[monthYear] = (monthlyTotals[monthYear] || 0) + amount;
    }
  });

  const sortedKeys = Object.keys(monthlyTotals).sort((a, b) => {
    const aDate = new Date(a);
    const bDate = new Date(b);
    return aDate - bDate;
  });

  const result = [["Month", "Revenue"]];
  sortedKeys.forEach((monthYear) => {
    result.push([monthYear, monthlyTotals[monthYear]]);
  });

  return result;
};
