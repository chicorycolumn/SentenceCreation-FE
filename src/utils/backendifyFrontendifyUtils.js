exports.frontendOnlyTraits = ["booleanTraits", "isGhostChunk"];

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

exports.backendifyFormula = (formula) => {
  // Backendify-1: Orders (if not already done)
  if (Array.isArray(formula.orders)) {
    formula.orders = exports.backendifyOrders(formula.orders);
  }

  formula.sentenceStructure = formula.sentenceStructure.map((enCh) => {
    let stCh = {};

    // Backendify-2b: Unpack booleans
    if (enCh.booleanTraits) {
      enCh.booleanTraits.traitValue.forEach((booleanTrait) => {
        stCh[booleanTrait] = true;
      });
    }

    // Backendify-2a: enCh to stCh
    Object.keys(enCh).forEach((traitKey) => {
      if (exports.frontendOnlyTraits.includes(traitKey)) {
        return;
      }

      let { traitValue } = enCh[traitKey];
      if (traitValue && (traitValue === true || traitValue.length)) {
        stCh[traitKey] = traitValue;
      }
    });

    // Backendify-2c: isGhostChunk already removed by 2a, and is not coded in BE in any way.
    // Just in FE where chunks not appearing in any orderObj are labelled ghost.

    return stCh;
  });
};
