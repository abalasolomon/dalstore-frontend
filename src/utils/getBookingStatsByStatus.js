export default function getBookingStatsByStatus(bookings) {
  const stats = {
    Confirmed: { count: 0, total: 0 },
    Cancelled: { count: 0, total: 0 },
    Pending: { count: 0, total: 0 },
  };

  bookings.forEach((booking) => {
    const { status, selected_price } = booking;
    const price = parseFloat(selected_price);

    if (stats[status]) {
      stats[status].count += 1;
      stats[status].total += price;
    }
  });

  // Optionally round totals to 2 decimals
  Object.keys(stats).forEach((key) => {
    stats[key].total = Number(stats[key].total.toFixed(2));
  });

  return stats;
}
