const uUtils = require("./universalUtils.js");
const idUtils = require("./identityUtils.js");

exports.isStative = (lObj) => {
  return lObj.id && lObj.id.split("-").slice(-1)[0].includes("ß");
};

exports.traitKeyRegulators = [
  {
    name: "formulaImportantTraitKeys",
    tooltipText: "Upgrade importance of trait",
    buttonText: "+",
    altText: "Plus icon",
  },
  {
    name: "educatorBlocksAnnotationsForTheseTraitKeys",
    tooltipText: "Block annotations for trait",
    buttonText: "ɐ",
    altText: "Inverted lowercase letter A icon",
  },
  {
    name: "merelyPreferredChoicesForQuestionSentence",
    tooltipText: "Downgrade importance of trait",
    buttonText: "-",
    altText: "Minus icon",
  },
  {
    name: null,
    tooltipText: "Get info about these buttons",
    buttonText: "?",
    altText: "Question mark icon",
  },
  // {
  //   name: "counterfactuallyImportantTraitKeys", //Not used in BE.
  //   tooltipText: "Make counterfactually important trait key",
  //   buttonText: "C",
  // },
  // {
  //   name: "hiddenTraits", //Only set internally in BE, for tantum nouns.
  //   tooltipText: "Make hidden trait key",
  //   buttonText: "H",
  // },
];

exports.isFixedChunk = (stCh) => {
  return stCh.chunkId.traitValue.split("-")[0] === "fix";
};

exports.createFixedChunk = (guideword, index, femula) => {
  if (guideword[0] === "*") {
    guideword = guideword.slice(1);
  }

  let existingNumbers = femula
    .filter((femulaItem) => femulaItem.structureChunk)
    .map(
      (femulaItem) => femulaItem.structureChunk.chunkId.traitValue.split("-")[1]
    );

  let newNumber = index.toString() + Math.random().toString().slice(2, 6);

  while (existingNumbers.includes(newNumber)) {
    newNumber = index.toString() + Math.random().toString().slice(2, 6);
  }

  let chunkId = `fix-${newNumber}-${guideword}`;

  return {
    chunkId: { traitValue: chunkId },
    chunkValue: { traitValue: guideword },
    guideword: { traitValue: guideword }, // Will be transferred to femulaItem by bodge.
  };
};

exports.wordtypesWhichMustHavePopulatedTags = ["npe", "nco", "ver", "adj"];

exports.wordtypes = ["adj", "nco", "npe", "ver", "art", "pre", "pro"];

exports.isTagTrait = (traitKey) => {
  return ["andTags", "orTags"].includes(traitKey);
};

exports.isSpecificIdsInterface = (traitKey) => {
  return ["specificIds"].includes(traitKey);
};

exports.isChunkId = (traitKey) => {
  return traitKey === "chunkId";
};

exports.agreementTraits = [
  "agreeWith",
  "agreeWith2",
  // "connectedTo",
];

exports.getWordtypeEnCh = (enCh) => {
  return enCh.chunkId.traitValue.split("-")[0];
};

exports.getLangsAndEnv = (str) => {
  let split = str.split("-");
  const langQ = split[0];
  const langA = split[1];
  const beEnv = split[2];
  return { langQ, langA, beEnv };
};

exports.formulaIdNotUnique = (fetchedFormulaIds, formulaId) => {
  return fetchedFormulaIds.rows.map((x) => x[0]).includes(formulaId);
};

exports.getNewFormulaId = (existingIdsData, lang, existingFormulaId) => {
  const existingIds = existingIdsData.rows.map((x) => x[0]);
  let n = 1;

  if (existingFormulaId) {
    let split = existingFormulaId.split("-");
    existingFormulaId = [split[0], split[1]].join("-");

    while (n <= 99) {
      let z = "00" + String(n);
      let num = z.slice(-2);

      let putativeId = `${existingFormulaId}-${num}`;
      if (!existingIds.includes(putativeId)) {
        return putativeId;
      }

      n++;
    }
  } else {
    while (n <= 99999) {
      let z = "00000" + String(n);
      let num = z.slice(-5);
      let putativeId = `${lang}-${num}`;
      if (!existingIds.includes(putativeId)) {
        return putativeId;
      }

      n++;
    }
  }
};

exports.getUniqueFormulaIdIfPrompted = (
  lang,
  fetchedFormulaIds,
  chosenFormulaId
) => {
  if (
    fetchedFormulaIds &&
    idUtils.formulaIdNotUnique(fetchedFormulaIds, chosenFormulaId) &&
    !window.confirm(
      "Overwrite existing formula (OK) or create sibling formula (CANCEL)? Otherwise if you want this formula to have a new and unrelated ID, click Snowflake for extra options."
    )
  ) {
    let uniqueId = idUtils.getNewFormulaId(
      fetchedFormulaIds,
      lang,
      chosenFormulaId
    );
    return uniqueId;
  }
};

exports.checkChunkIdsMatchLangAndWordtype = (chunkId1, chunkId2) => {
  let split1 = chunkId1.split("-");
  let split2 = chunkId2.split("-");
  return split1[0] === split2[0];
};

exports.invertBatch = (s) => {
  let ref = {
    Question: "Answer",
    Answer: "Question",
  };
  return ref[s];
};

exports.getFemulaItemForChunkId = (femula, chunkId) => {
  return femula.find(
    (fItem) => fItem.structureChunk.chunkId.traitValue === chunkId
  );
};
