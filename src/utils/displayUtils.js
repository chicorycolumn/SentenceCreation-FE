const uUtils = require("./universalUtils.js");
const idUtils = require("./identityUtils.js");

exports.orderTraitKeys = (stCh) => {
  let orderedTraitKeys = [
    "chunkId",
    "andTags",
    "orTags",
    ...idUtils.agreementTraits.filter((agreementTrait) => stCh[agreementTrait]),
  ];
  let lexicalTraitKeys = [];
  // let booleanTraitKeys = [];

  Object.keys(stCh).forEach((traitKey) => {
    const traitValue = stCh[traitKey];
    if (traitValue.isLexical && !orderedTraitKeys.includes(traitKey)) {
      lexicalTraitKeys.push(traitKey);
    }
    // else if (
    //   traitValue.expectedTypeOnStCh === "boolean" &&
    //   !orderedTraitKeys.includes(traitKey)
    // ) {
    //   booleanTraitKeys.push(traitKey);
    // }
  });

  lexicalTraitKeys = lexicalTraitKeys.sort((x, y) => y.localeCompare(x));

  if (lexicalTraitKeys.includes("tense")) {
    // Aesthetically I prefer "tense" traitBox shown at the bottom of group1.
    lexicalTraitKeys = lexicalTraitKeys.filter((x) => x !== "tense");
    lexicalTraitKeys.push("tense");
  }

  orderedTraitKeys.push(...lexicalTraitKeys);

  const length = orderedTraitKeys.length;

  if (stCh.booleanTraits) {
    orderedTraitKeys.push("booleanTraits");
  }

  // orderedTraitKeys = [...orderedTraitKeys, ...booleanTraitKeys];

  orderedTraitKeys.push(
    ...Object.keys(stCh)
      .filter((traitKey) => !orderedTraitKeys.includes(traitKey))
      .sort((x, y) => x.localeCompare(y))
  );

  let countOfLeftoverTraitKeys =
    orderedTraitKeys.length - Object.keys(stCh).length;

  let wordtype = idUtils.getWordtypeEnCh(stCh);

  if (
    !idUtils.isFixedChunk(stCh) &&
    countOfLeftoverTraitKeys &&
    !(countOfLeftoverTraitKeys === 3 && wordtype !== "pro")
  ) {
    throw `gluj: ${wordtype} orderedTraitKeys.length ${
      orderedTraitKeys.length
    } !== Object.keys(stCh).length ${Object.keys(stCh).length}`;
  }

  orderedTraitKeys = orderedTraitKeys.filter(
    (traitKey) =>
      ![
        ...idUtils.traitKeyRegulators.map((tkr) => tkr.name).filter((el) => el),
      ].includes(traitKey) && traitKey[0] !== "_"
  );

  return {
    orderedTraitKeysGroup1: orderedTraitKeys.slice(0, length),
    orderedTraitKeysGroup2: orderedTraitKeys.slice(length),
  };
};

exports.asString = (values) => {
  if (uUtils.isEmpty(values, true)) {
    return "";
  }
  return String(values).replace(/,/g, ", ");
};

exports.asArray = (str, strict = false) => {
  if (!str) {
    return strict ? null : [];
  }
  let split = Array.isArray(str) ? str : str.split(",");
  let res = split.map((element) => element.trim()).filter((element) => element);
  return strict && !res.length ? null : res;
};

exports.doTraitKeysHoldSomeValues = (traitKeysGroup, structureChunk) => {
  return traitKeysGroup.some(
    (traitKey) =>
      structureChunk[traitKey] &&
      !uUtils.isEmpty(structureChunk[traitKey].traitValue)
  );
};

exports.addChunkId = (stCh, chunkCardIndex, guideword, femula, label) => {
  let existingChunkIds = [];
  if (femula) {
    existingChunkIds = femula
      .map((femulaItem) => femulaItem.structureChunk)
      .filter((x) => x)
      .map((structureChunk) => structureChunk.chunkId)
      .filter((x) => x)
      .map((chunkIdObj) => chunkIdObj.traitValue);
  }

  let idSplit = stCh.lObjId.split("-");
  let chunkIdBase = `${idSplit[1]}-${chunkCardIndex}`;

  const createChunkId = (
    idSplit,
    chunkIdBase,
    guideword,
    appendRandomDigits
  ) => {
    let randomDigit = Math.random().toString()[2];
    let randomDigits = appendRandomDigits
      ? Math.random().toString().slice(2, 6)
      : "";

    if (guideword.includes("*")) {
      return `${chunkIdBase}000${randomDigit}-${guideword}${randomDigits}`;
    } else {
      let idNumber = /^\d.+$/.test(idSplit[2])
        ? idSplit[2]
        : uUtils.getRandomNumberString(3);

      return `${chunkIdBase}${idNumber
        .split("")
        .reverse()
        .join("")}${randomDigit}-${guideword}${randomDigits}`;
    }
  };

  let chunkId;

  for (let i = 1; i <= 20; i++) {
    chunkId = createChunkId(idSplit, chunkIdBase, guideword);
    if (!existingChunkIds.includes(chunkId)) {
      break;
    }
    if (i === 20) {
      while (existingChunkIds.includes(chunkId)) {
        chunkId = createChunkId(idSplit, chunkIdBase, guideword, true);
      }
    }
  }

  stCh.chunkId.traitValue = chunkId;
  console.log(label, "Added chunkId", stCh.chunkId.traitValue);
};

exports.traitsNotToDisplayInOwnBox = ["orTags", "id", "guideword", "lObjId"];
