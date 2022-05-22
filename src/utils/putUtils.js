import axios from "axios";
const uUtils = require("../utils/universalUtils.js");
const baseUrl = "http://localhost:9090/api";
// const token = localStorage.getItem("currentUserToken");

export const fetchWordByExplicitChunk = (lang1, chunk) => {
  console.log("Will request", lang1, chunk);
  return axios
    .put(
      `${baseUrl}/educator/sandbox?lang=${lang1}`,
      {
        questionLanguage: lang1,
        sentenceFormula: { sentenceStructure: [chunk] },
      }
      // ,{headers: { Authorization: `BEARER ${token}` }}
    )
    .then((res) => {
      return res.data;
    })
    .then((data) => {
      return data.wordsAndIDs;
    });
};
