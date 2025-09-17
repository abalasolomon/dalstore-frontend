export const getStatusBadgeVariant = (status) => {
  const map = {
    confirmed: "success",
    pending: "warning",
    cancelled: "danger",
    paid: "success",
  };
  return map[status?.toLowerCase()] || "secondary";
};
