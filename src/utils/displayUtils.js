const uUtils = require("./universalUtils.js");

exports.orderTraitKeys = (stCh) => {
  let order = ["andTags", "orTags", "agreeWith", "connectedTo"];
  let lexicalTraitKeys = [];
  let booleanTraitKeys = [];
  Object.keys(stCh).forEach((traitKey) => {
    const traitValue = stCh[traitKey];
    if (traitValue.isLexical && !order.includes(traitKey)) {
      lexicalTraitKeys.push(traitKey);
    } else if (
      traitValue.expectedTypeOnStCh === "boolean" &&
      !order.includes(traitKey)
    ) {
      booleanTraitKeys.push(traitKey);
    }
  });
  lexicalTraitKeys = lexicalTraitKeys.sort((x, y) => y.localeCompare(x));
  booleanTraitKeys = booleanTraitKeys.sort((x, y) => x.localeCompare(y));

  order = [...order, ...lexicalTraitKeys, ...booleanTraitKeys];
  order = [
    ...order,
    ...Object.keys(stCh).filter((traitKey) => !order.includes(traitKey)),
  ];
  if (order.length !== Object.keys(stCh).length) {
    throw `gluj: order.length ${order.length} !== Object.keys(stCh).length ${
      Object.keys(stCh).length
    }`;
  }
  return order;
};

exports.asString = (values) => {
  if (!uUtils.isEmpty(values, true)) {
    return String(values).replace(/,/g, ", ");
  }
};

exports.asArray = (str, strict = false) => {
  if (!str) {
    return strict ? null : [];
  }
  let split = Array.isArray(str) ? str : str.split(",");
  let res = split.map((element) => element.trim()).filter((element) => element);
  return strict && !res.length ? null : res;
};

exports.isTagTrait = (traitKey) => {
  return ["andTags", "orTags"].includes(traitKey);
};
