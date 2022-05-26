import axios from "axios";
const uUtils = require("../utils/universalUtils.js");
const idUtils = require("../utils/identityUtils.js");
const baseUrl = "http://localhost:9090/api";
// const token = localStorage.getItem("currentUserToken");

export const fetchWordByExplicitChunk = (lang1, rawChunks) => {
  let processedChunks = rawChunks.map((structureChunk) => {
    let processedStCh = {};
    Object.keys(structureChunk).forEach((traitKey) => {
      if (!idUtils.isAgreeOrConnected(traitKey)) {
        let { traitValue } = structureChunk[traitKey];
        if (traitValue && traitValue.length) {
          processedStCh[traitKey] = traitValue;
        }
      }
    });
    return processedStCh;
  });

  if (!processedChunks.length) {
    return;
  }

  console.log("Will request", lang1, processedChunks);
  return axios
    .put(
      `${baseUrl}/educator/sandbox?lang=${lang1}`,
      {
        questionLanguage: lang1,
        sentenceFormula: { sentenceStructure: processedChunks },
      }
      // ,{headers: { Authorization: `BEARER ${token}` }}
    )
    .then((res) => {
      return res.data;
    })
    .then((data) => {
      if (processedChunks.length === 1) {
        return data.wordsAndIDs;
      } else {
        return uUtils.flatten(data.wordsAndIDs);
      }
    });
};
