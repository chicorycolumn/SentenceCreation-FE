exports.backendifyOrders = (frontendifiedOrders) => {
  let backendifiedOrders = { primary: [] };

  if (!frontendifiedOrders || !frontendifiedOrders.length) {
    return backendifiedOrders;
  }

  backendifiedOrders.primary = frontendifiedOrders
    .filter((obj) => obj.isPrimary)
    .map((obj) => obj.order);

  backendifiedOrders.additional = frontendifiedOrders
    .filter((obj) => !obj.isPrimary)
    .map((obj) => obj.order);

  return backendifiedOrders;
};
