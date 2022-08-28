const uUtils = require("./universalUtils.js");
const idUtils = require("./identityUtils.js");

exports.createFormulaItemId = () => {
  return Math.random().toString().slice(2, 12);
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

exports.createFixedChunk = (word, index, formula) => {
  word = word.slice(1);

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

  let chunkId = `fix-${newNumber}-${word}`;

  return {
    chunkId: { traitValue: chunkId },
    chunkValue: { traitValue: word },
    wordtype: "fix",
    lemma: word,
  };
};

exports.wordtypesWhichMustHavePopulatedTags = ["npe", "nco", "ver", "adj"];

exports.isTagTrait = (traitKey) => {
  return ["andTags", "orTags"].includes(traitKey);
};

exports.isChunkId = (traitKey) => {
  return ["chunkId"].includes(traitKey);
};

exports.agreementTraits = [
  "agreeWith",
  "agreeWith2",
  // "connectedTo",
];

exports.renamedTraitKeys = {
  // postHocAgreeWithPrimary: "agreeWith",
  // postHocAgreeWithSecondary: "agreeWith2",
};

exports.getBadChunks = (formula) => {
  return formula
    .map((el) => el.structureChunk)
    .filter((stCh) => idUtils.isBadChunk(stCh));
};

exports.isBadChunk = (stCh) => {
  return (
    idUtils.wordtypesWhichMustHavePopulatedTags.includes(stCh.wordtype) &&
    uUtils.isEmpty(stCh.specificIds.traitValue) &&
    uUtils.isEmpty(stCh.andTags.traitValue) &&
    uUtils.isEmpty(stCh.orTags.traitValue)
  );
};
