const uUtils = require("./universalUtils.js");
const idUtils = require("./identityUtils.js");

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

exports.createFixedChunk = (guideword, index, formula) => {
  if (guideword[0] === "*") {
    guideword = guideword.slice(1);
  }

  let existingNumbers = formula
    .filter((formulaItem) => formulaItem.structureChunk)
    .map(
      (formulaItem) =>
        formulaItem.structureChunk.chunkId.traitValue.split("-")[1]
    );

  let newNumber = index.toString() + Math.random().toString().slice(2, 6);

  while (existingNumbers.includes(newNumber)) {
    newNumber = index.toString() + Math.random().toString().slice(2, 6);
  }

  let chunkId = `fix-${newNumber}-${guideword}`;

  return {
    chunkId: { traitValue: chunkId },
    chunkValue: { traitValue: guideword },
    guideword: { traitValue: guideword }, // Will be transferred to formulaItem by bodge.
  };
};

exports.wordtypesWhichMustHavePopulatedTags = ["npe", "nco", "ver", "adj"];

exports.isTagTrait = (traitKey) => {
  return ["andTags", "orTags"].includes(traitKey);
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
  const lang1 = split[0];
  const lang2 = split[1];
  const beEnv = split[2];
  return { lang1, lang2, beEnv };
};

exports.formulaIdNotUnique = (fetchedFormulaIds, sentenceFormulaId) => {
  return fetchedFormulaIds.rows.map((x) => x[0]).includes(sentenceFormulaId);
};

exports.getNewSentenceFormulaId = (
  existingIdsData,
  lang1,
  existingSentenceFormulaId
) => {
  const existingIds = existingIdsData.rows.map((x) => x[0]);
  let n = 1;

  if (existingSentenceFormulaId) {
    let letters = "_abcdefghijklmnopqrstuvwxyz";
    if (/[a-z]/.test(existingSentenceFormulaId.slice(-1))) {
      existingSentenceFormulaId = existingSentenceFormulaId.slice(
        0,
        existingSentenceFormulaId.length - 1
      );
    }

    while (n < 1000) {
      let putativeId = `${existingSentenceFormulaId}${letters[n]}`;
      if (!existingIds.includes(putativeId)) {
        return putativeId;
      } else {
        n += 1;
      }
    }
  } else {
    while (n < 1000) {
      let num = `000${n}`.slice(-3);
      let putativeId = `${lang1}-${num}`;
      if (!existingIds.includes(putativeId)) {
        return putativeId;
      } else {
        n += 1;
      }
    }
  }
};

exports.checkFormulaIdUniqueAndModify = (
  lang1,
  fetchedFormulaIds,
  formulaToSend,
  chosenFormulaID
) => {
  if (
    fetchedFormulaIds &&
    idUtils.formulaIdNotUnique(
      fetchedFormulaIds,
      formulaToSend.sentenceFormulaId
    ) &&
    window.confirm(
      "Overwrite existing formula (CANCEL) or create sibling formula (OK)? Otherwise if you want this formula to have a new and unrelated ID, click Snowflake for extra options."
    )
  ) {
    let uniqueId = idUtils.getNewSentenceFormulaId(
      fetchedFormulaIds,
      lang1,
      chosenFormulaID
    );
    formulaToSend.sentenceFormulaId = uniqueId;
  }
};
