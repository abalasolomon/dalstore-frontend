import { parseISO, format } from "date-fns";

export const getMonthlyWithdrawalTrends = (transactions = [], paidStatuses = ["Paid", true]) => {
  const monthlyTotals = {};

  transactions.forEach((tx) => {
    const status = tx.status ?? tx.is_success;
    const isPaid = paidStatuses.includes(status);

    if (isPaid) {
      const date = parseISO(tx.timestamp);
      const monthYear = format(date, "MMM yyyy");
      const amount = parseFloat(tx.amount);

      monthlyTotals[monthYear] = (monthlyTotals[monthYear] || 0) + amount;
    }
  });

  const sortedKeys = Object.keys(monthlyTotals).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const result = [["Month", "Revenue"]];
  sortedKeys.forEach((monthYear) => {
    result.push([monthYear, monthlyTotals[monthYear]]);
  });

  return result;
};
