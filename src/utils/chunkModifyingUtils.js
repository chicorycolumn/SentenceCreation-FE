const getUtils = require("./getUtils.js");

exports.addSpecificId = (stCh, traitsAffectedBySpecificId, lang, guideword) => {
  if (!stCh.lObjId) {
    let success = exports.addLObjIdToChunk(stCh, lang, guideword);
    if (!success) {
      return;
    }
  }

  stCh.specificIds.traitValue = [stCh.lObjId];
  console.log("Blanking", traitsAffectedBySpecificId);
  traitsAffectedBySpecificId.forEach((traitKey) => {
    stCh[traitKey].traitValue = [];
  });
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

exports.addLObjIdToChunk = (newStCh, lang1, guideword) => {
  getUtils
    .fetchEnChsByLemma(lang1, guideword)
    .then(
      (fetchedEnChs) => {
        console.log(`"${guideword}" got ${fetchedEnChs.length} fetchedEnChs.`);
        let lObjIds = fetchedEnChs.map((enCh) => enCh.lObjId).filter((x) => x);
        if (!lObjIds.length) {
          alert(`Failed to find any lemma objects for "${guideword}".`);
          return false;
        } else {
          newStCh.lObjId = lObjIds[0];
          return true;
        }
      },
      (e) => {
        console.log("ERROR 0371:", e);
      }
    )
    .catch((e) => {
      console.log("ERROR 9072", e);
    });
};
