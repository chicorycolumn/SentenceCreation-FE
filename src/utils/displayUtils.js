const uUtils = require("./universalUtils.js");

exports.orderTraitKeys = (stCh) => {
  let orderedTraitKeys = ["andTags", "orTags", "agreeWith", "connectedTo"];
  let lexicalTraitKeys = [];
  let booleanTraitKeys = [];
  Object.keys(stCh).forEach((traitKey) => {
    const traitValue = stCh[traitKey];
    if (traitValue.isLexical && !orderedTraitKeys.includes(traitKey)) {
      lexicalTraitKeys.push(traitKey);
    } else if (
      traitValue.expectedTypeOnStCh === "boolean" &&
      !orderedTraitKeys.includes(traitKey)
    ) {
      booleanTraitKeys.push(traitKey);
    }
  });
  lexicalTraitKeys = lexicalTraitKeys.sort((x, y) => y.localeCompare(x));
  booleanTraitKeys = booleanTraitKeys.sort((x, y) => x.localeCompare(y));

  orderedTraitKeys = [...orderedTraitKeys, ...lexicalTraitKeys];

  const length = orderedTraitKeys.length;

  orderedTraitKeys = [...orderedTraitKeys, ...booleanTraitKeys];

  orderedTraitKeys = [
    ...orderedTraitKeys,
    ...Object.keys(stCh)
      .filter((traitKey) => !orderedTraitKeys.includes(traitKey))
      .sort((x, y) => x.localeCompare(y)),
  ];
  if (orderedTraitKeys.length !== Object.keys(stCh).length) {
    throw `gluj: orderedTraitKeys.length ${
      orderedTraitKeys.length
    } !== Object.keys(stCh).length ${Object.keys(stCh).length}`;
  }

  orderedTraitKeys = orderedTraitKeys.filter(
    (traitKey) => !["wordtype"].includes(traitKey)
  );

  return {
    orderedTraitKeysGroup1: orderedTraitKeys.slice(0, length),
    orderedTraitKeysGroup2: orderedTraitKeys.slice(length),
    wordtypeFromStCh: stCh.wordtype,
  };
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
