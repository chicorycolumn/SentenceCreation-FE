const getUtils = require("./getUtils.js");
const { getWordtypeEnCh } = require("./identityUtils.js");
const putUtils = require("./putUtils.js");

exports.addSpecificId = (
  stCh,
  traitsAffectedBySpecificId,
  lang,
  guideword,
  demoword,
  editLemmaCallback,
  editFormulaCallback
) => {
  if (getWordtypeEnCh(stCh) === "fix") {
    return;
  }

  if (!stCh.lObjId) {
    exports.addLObjIdToChunk(
      stCh,
      lang,
      guideword,
      demoword,
      editLemmaCallback
    );
  }

  if (!stCh.lObjId) {
    return;
  }

  stCh.specificIds.traitValue = [stCh.lObjId];

  traitsAffectedBySpecificId.forEach((traitKey) => {
    console.log("Blanking", traitKey);
    stCh[traitKey].traitValue = [];
  });

  if (editFormulaCallback) {
    editFormulaCallback(stCh);
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

exports.addLObjIdToChunk = (
  newStCh,
  lang1,
  guideword,
  demoword,
  editLemmaCallback
) => {
  if (getWordtypeEnCh(newStCh) === "fix") {
    return;
  }

  if (guideword && !/^\d+$/.test(guideword)) {
    getUtils
      .fetchEnChsByLemma(lang1, demoword)
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
          console.log("ERROR 0371:", e);
        }
      )
      .catch((e) => {
        console.log("ERROR 9072", e);
      });
  } else {
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
        console.log("addLObjIdToChunk clause 2 Success.");
        newStCh.lObjId = lObjId;

        if (editLemmaCallback) {
          setTimeout(() => {
            console.log("Try editLemmaCallback with", selectedWord);
            editLemmaCallback(selectedWord);
          }, 2000);
        }
      },
      (e) => {
        console.log("ERROR 0302:", e);
      }
    );
  }
};
