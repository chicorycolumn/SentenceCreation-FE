import axios from "axios";
import { backendifyStructureChunk } from "./getUtils.js";
const uUtils = require("../utils/universalUtils.js");
const baseUrl = "http://localhost:9090/api";
// const token = localStorage.getItem("currentUserToken");

export const fetchSentence = (lang1, rawChunks, orders) => {
  let processedChunks = rawChunks.map((stCh) => backendifyStructureChunk(stCh));

  if (!processedChunks.length) {
    return;
  }

  let sentenceFormula = {
    sentenceStructure: processedChunks,
  };

  if (orders) {
    sentenceFormula.primaryOrders = orders
      .filter((obj) => obj.isPrimary)
      .map((obj) => obj.order);

    sentenceFormula.additionalOrders = orders
      .filter((obj) => !obj.isPrimary)
      .map((obj) => obj.order);
  }

  console.log(""); //devlogging
  console.log("");
  console.log("**fetchSentence**");
  console.log(lang1, sentenceFormula);

  return axios
    .put(
      `${baseUrl}/educator/sandbox?lang=${lang1}`,
      {
        questionLanguage: lang1,
        sentenceFormula,
      }
      // ,{headers: { Authorization: `BEARER ${token}` }}
    )
    .then((res) => {
      return res.data;
    })
    .then((data) => {
      let responseObj = { messages: data.messages };

      console.log("fetchSentence got:", data); //devlogging
      console.log("/fetchSentence");
      console.log("");
      console.log("");

      if (processedChunks.length === 1) {
        responseObj.data = data.wordsAndIDs;
      } else {
        responseObj.data = uUtils.flatten(data.wordsAndIDs);
      }

      return responseObj;
    })
    .catch((e) => console.log(e));
};
