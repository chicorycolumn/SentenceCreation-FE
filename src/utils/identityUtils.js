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

exports.createFixedChunk = (guideword, demoword, index, formula) => {
  if (guideword[0] === "*") {
    guideword = guideword.slice(1);
  }
  if (demoword[0] === "*") {
    demoword = demoword.slice(1);
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
    chunkValue: { traitValue: demoword },
    demoword: { traitValue: demoword }, // Will be transferred to formulaItem by bodge.
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

exports.getBadChunks = (formula) => {
  return formula
    .map((el) => el.structureChunk)
    .filter((stCh) => idUtils.isBadChunk(stCh));
};

exports.isBadChunk = (stCh) => {
  return (
    idUtils.wordtypesWhichMustHavePopulatedTags.includes(
      idUtils.getWordtypeEnCh(stCh)
    ) &&
    uUtils.isEmpty(stCh.specificIds.traitValue) &&
    uUtils.isEmpty(stCh.andTags.traitValue) &&
    uUtils.isEmpty(stCh.orTags.traitValue)
  );
};

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
