const uUtils = require("./universalUtils.js");

exports.createFixedChunkFormulaItem = (word, index, formula) => {
  let existingNumbers = formula.map(
    (formulaItem) => formulaItem.structureChunk.chunkId.split("-")[1]
  );

  let newNumber = index.toString() + Math.random().toString().slice(2, 5);

  while (existingNumbers.includes(newNumber)) {
    newNumber = index.toString() + Math.random().toString().slice(2, 5);
  }

  let chunkId = `fix-${newNumber}-${word}`;

  return { word, structureChunk: { chunkId } };
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
