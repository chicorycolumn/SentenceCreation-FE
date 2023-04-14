const idUtils = require("./identityUtils");
const uUtils = require("./universalUtils");

exports.promptGuideword = () => {
  return prompt("Enter new guideword.");
};

exports.isTaglessChunk = (stCh) => {
  return (
    idUtils.wordtypesWhichMustHavePopulatedTags.includes(
      idUtils.getWordtypeEnCh(stCh)
    ) &&
    uUtils.isEmpty(stCh.specificIds.traitValue) &&
    uUtils.isEmpty(stCh.andTags.traitValue) &&
    uUtils.isEmpty(stCh.orTags.traitValue)
  );
};

exports.getTaglessChunks = (formula) => {
  return formula
    .map((el) => el.structureChunk)
    .filter((stCh) => exports.isTaglessChunk(stCh));
};

exports.checkForStChsWithNoLObjs = (formula) => {
  let sentenceStructure = formula.map((el) => el.structureChunk);

  let indexesOfStChsWithNoLobjs = sentenceStructure
    .map((el, index) => {
      return { el, index };
    })
    .filter((obj) => !obj.el)
    .map((obj) => obj.index);

  if (indexesOfStChsWithNoLobjs.length) {
    alert(
      `I cannot do this, chunk(s) number ${indexesOfStChsWithNoLobjs
        .map((i) => i + 1)
        .join(", ")} are null.`
    );
    return true;
  }
};

exports.validateFormulaToSend = (formula) => {
  if (exports.checkForStChsWithNoLObjs(formula)) {
    return true;
  }

  let taglessChunks = exports.getTaglessChunks(formula);
  if (taglessChunks.length) {
    alert(
      `Cannot query whole sentence because no tags are specified on chunk "${taglessChunks
        .map((badCh) => badCh.chunkId.traitValue)
        .join('","')}".`
    );
    return true;
  }

  if (
    formula.some((fItem) => {
      let stCh = fItem.structureChunk;
      return (
        idUtils.getWordtypeEnCh(stCh) === "npe" &&
        idUtils.agreementTraits.some((agreementTrait) => {
          if (stCh[agreementTrait] && stCh[agreementTrait].traitValue) {
            let stemChunkId = stCh[agreementTrait].traitValue;
            let x = formula.find(
              (fItem) => fItem.structureChunk.chunkId.traitValue === stemChunkId
            );
            if (x) {
              let foundStCh = x.structureChunk;
              if (idUtils.getWordtypeEnCh(foundStCh) === "pro") {
                return true;
              }
            }
          }
        })
      );
    })
  ) {
    if (
      !window.confirm(
        "Please click CANCEL.\n\nThere a nounPerson chunk which agrees with a pronoun chunk.\n\nI advise you flip that the other way around."
      )
    ) {
      return true;
    }
  }
};
