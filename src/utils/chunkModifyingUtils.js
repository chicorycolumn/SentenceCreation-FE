const getUtils = require("./getUtils.js");
const { getWordtypeEnCh } = require("./identityUtils.js");
const putUtils = require("./putUtils.js");
const cmUtils = require("./chunkModifyingUtils.js");

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
    cmUtils.addLObjIdToChunk(
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
  console.log("START addLObjIdToChunk");

  if (demoword && !/^\d+$/.test(demoword)) {
    console.log("CLAUSE1 addLObjIdToChunk");
    getUtils
      .fetchEnChsByLemma(lang1, demoword)
      .then(
        (fetchedEnChs) => {
          console.log(`"${demoword}" got ${fetchedEnChs.length} fetchedEnChs.`);
          let lObjIds = fetchedEnChs
            .map((enCh) => enCh.lObjId)
            .filter((x) => x);
          if (lObjIds.length) {
            console.log("addLObjIdToChunk clause 1 Success.");
            newStCh.lObjId = lObjIds[0];
          } else {
            console.log(
              `addLObjIdToChunk clause 1 Failed to find any lobjs for "${demoword}".`
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
    console.log("CLAUSE2 addLObjIdToChunk");
    let formula = { sentenceStructure: [newStCh] };
    putUtils.fetchSentence(lang1, formula).then(
      (data) => {
        let { payload, messages } = data;

        if (messages && !payload.length) {
          console.log(
            `addLObjIdToChunk clause 2 Failed to find any lobjs for "${demoword}".`
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
            console.log("EDIT LEMMA CALLBACK with:", selectedWord);
            editLemmaCallback(
              { demoword: selectedWord, guideword },
              newStCh.chunkId.traitValue,
              newStCh
            );
          }, 750);
        }
      },
      (e) => {
        console.log("ERROR 0302:", e);
      }
    );
  }
};
