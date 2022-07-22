const uUtils = require("./universalUtils.js");

exports.isFixedChunk = (stCh) => {
  return stCh.chunkId.traitValue.split("-")[0] === "fix";
};

exports.createFixedChunkFormulaItem = (word, index, formula) => {
  let existingNumbers = formula
    .filter((formulaItem) => formulaItem.structureChunk)
    .map(
      (formulaItem) =>
        formulaItem.structureChunk.chunkId.traitValue.split("-")[1]
    );

  let newNumber = index.toString() + Math.random().toString().slice(2, 5);

  while (existingNumbers.includes(newNumber)) {
    newNumber = index.toString() + Math.random().toString().slice(2, 5);
  }

  let chunkId = `fix-${newNumber}-${word.slice(1)}`;

  return { chunkId: { traitValue: chunkId } };
};

exports.wordtypesWhichMustHavePopulatedTags = ["npe", "nco", "ver", "adj"];

exports.isTagTrait = (traitKey) => {
  return ["andTags", "orTags"].includes(traitKey);
};

exports.isChunkId = (traitKey) => {
  return ["chunkId"].includes(traitKey);
};

exports.isAgreeOrConnected = (traitKey) => {
  return ["agreeWith", "connectedTo"].includes(traitKey);
};
