export function getDailyRevenueTrends({ transactions = [] }) {
  const revenueMap = {};

  transactions.forEach((tx) => {
    const timestamp = new Date(tx.timestamp);
    const date = timestamp.toISOString().split("T")[0];

    // Determine payment status from either `status` or `is_success`
    const status = tx.status?.toLowerCase?.() || (tx.is_success ? "paid" : "failed");

    const isPaid =
      ["paid", "success", "successful", "completed", "true", "yes"].includes(status.toString().toLowerCase());

    if (isPaid) {
      const amount = parseFloat(tx.amount) || 0;
      revenueMap[date] = (revenueMap[date] || 0) + amount;
    }
  });

  // Sort by date ascending and format for chart
  const chartData = [["Date", "Revenue"]];
  Object.entries(revenueMap)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .forEach(([date, revenue]) => {
      chartData.push([date, revenue]);
    });

  return chartData;
}
