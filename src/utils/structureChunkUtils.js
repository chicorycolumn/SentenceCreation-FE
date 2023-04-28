const getUtils = require("./getUtils.js");
const {
  getWordtypeEnCh,
  isFixedChunk,
  isStative,
} = require("./identityUtils.js");
const putUtils = require("./putUtils.js");
const scUtils = require("./structureChunkUtils.js");
const { getRandomNumberString } = require("./universalUtils.js");

exports.getChunkCardInfo = (stCh, setChunkCardInfo) => {
  setChunkCardInfo((prev) => {
    let info = [];
    if (stCh.booleanTraits) {
      if (isStative({ id: stCh.lObjId })) {
        if (stCh.booleanTraits.traitValue.includes("stativeOverrideFalse")) {
          info.push({ title: "STATIVE", inactive: true });
        } else {
          info.push({ title: "STATIVE" });
        }
      } else if (
        stCh.booleanTraits.traitValue.includes("stativeOverrideTrue")
      ) {
        info.push({ title: "STATIVE" });
      }

      if (stCh.booleanTraits.traitValue.includes("negative")) {
        info.push({ title: "NEG" });
      }
    }

    return info;
  });
};

exports.improveGuideword = (guideword, structureChunk) => {
  if (!guideword || /^\d+$/.test(guideword)) {
    if (structureChunk && structureChunk.lObjId) {
      return structureChunk.lObjId.split("-").slice(-1);
    } else if (
      structureChunk.specificIds &&
      structureChunk.specificIds.traitValue
    ) {
      return structureChunk.specificIds.traitValue[0];
    } else if (isFixedChunk(structureChunk)) {
      return structureChunk.chunkValue.traitValue;
    }
    return "000" + getRandomNumberString(3);
  }
  return guideword;
};

exports.addSpecificId = (
  stCh,
  traitsAffectedBySpecificId,
  editFemulaCallback
) => {
  if (getWordtypeEnCh(stCh) === "fix") {
    return;
  }
  if (!stCh.lObjId) {
    return;
  }

  stCh.specificIds.traitValue = [stCh.lObjId];

  traitsAffectedBySpecificId.forEach((traitKey) => {
    console.log("Blanking", traitKey);
    stCh[traitKey].traitValue = [];
  });

  if (editFemulaCallback) {
    editFemulaCallback(stCh);
  }
};

exports.removeSpecificId = (
  stCh,
  traitsAffectedBySpecificId,
  backedUpStructureChunk
) => {
  stCh.specificIds.traitValue = [];
  console.log("Resetting", traitsAffectedBySpecificId);
  traitsAffectedBySpecificId.forEach((traitKey) => {
    stCh[traitKey].traitValue =
      backedUpStructureChunk[traitKey].traitValue.slice();
  });
};

exports.upgradeSpecificId = (stCh, originalStCh) => {
  stCh.specificIds.traitValue = originalStCh.specificIds.traitValue.map(
    (tv) => `^${tv}`
  );
};

exports.setNewTraitValue = (stCh, traitKey, newTraitValue) => {
  if (newTraitValue) {
    stCh[traitKey].traitValue = newTraitValue;
  } else {
    let expectedType = stCh[traitKey].expectedTypeOnStCh;

    if (expectedType === "array") {
      stCh[traitKey].traitValue = [];
    } else {
      delete stCh[traitKey].traitValue;
    }
  }
};

//Unused.
exports.addLObjIdToChunk = (newStCh, lang1, guideword, editLemmaCallback) => {
  if (getWordtypeEnCh(newStCh) === "fix") {
    return;
  }
  console.log("START addLObjIdToChunk", newStCh.chunkId.traitValue);

  if (guideword) {
    console.log("CLAUSE1 addLObjIdToChunk", guideword);
    getUtils
      .fetchEnChsByLemma(lang1, guideword)
      .then(
        (fetchedEnChs) => {
          console.log(
            `"${guideword}" got ${fetchedEnChs.length} fetchedEnChs.`
          );
          let lObjIds = fetchedEnChs
            .map((enCh) => enCh.lObjId)
            .filter((x) => x);
          if (lObjIds.length) {
            console.log("addLObjIdToChunk clause 1 Success.");
            newStCh.lObjId = lObjIds[0];
          } else {
            console.log(
              `addLObjIdToChunk clause 1 Failed to find any lobjs for "${guideword}".`
            );
          }
        },
        (e) => {
          console.log("ERROR 0431:", e);
        }
      )
      .catch((e) => {
        console.log("ERROR 0432", e);
      });
  } else {
    console.log("CLAUSE2 addLObjIdToChunk");
    let formula = { sentenceStructure: [newStCh] };
    putUtils.fetchSentence(lang1, formula).then(
      (data) => {
        let { payload, messages } = data;

        if (messages && !payload.length) {
          console.log(
            `addLObjIdToChunk clause 2 Failed to find any lobjs for "${guideword}".`
          );
          console.log(
            Object.keys(messages).map((key) => {
              let val = messages[key];
              return `${key}:       ${val}`;
            })
          );
        }

        let { selectedWord, lObjId } = payload[0];
        console.log("addLObjIdToChunk clause 2 Success.", lObjId);
        newStCh.lObjId = lObjId;

        if (editLemmaCallback) {
          setTimeout(() => {
            console.log("EDIT LEMMA CALLBACK with:", selectedWord);
            editLemmaCallback(
              {
                guideword,
              },
              newStCh.chunkId.traitValue,
              newStCh
            );
          }, 750);
        }
      },
      (e) => {
        console.log("ERROR 0433:", e);
      }
    );
  }
};
