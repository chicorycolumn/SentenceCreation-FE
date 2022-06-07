const uUtils = require("./universalUtils.js");

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
