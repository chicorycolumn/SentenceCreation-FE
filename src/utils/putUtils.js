import axios from "axios";
import { backendifyStructureChunk } from "./getUtils.js";
const uUtils = require("../utils/universalUtils.js");
const baseUrl = "http://localhost:9090/api";
// const token = localStorage.getItem("currentUserToken");

export const fetchFormula = (sentenceFormulaId, answerLanguage) => {
  console.log("START fetchFormula", { sentenceFormulaId, answerLanguage });

  return axios
    .get(
      `${baseUrl}/educator/formulas?id=${sentenceFormulaId}&lang=${answerLanguage}`
      // ,{headers: { Authorization: `BEARER ${token}` }}
    )
    .then((res) => {
      console.log("fetchFormula got:", res.data); //devlogging
      console.log("/fetchFormula");
      console.log("");
      console.log("");

      return res.data;
    })
    .catch((e) => console.log("ERROR 9820", e));
};

export const fetchSentence = (lang1, rawChunks, orders) => {
  const requestingSingleWordOnly = !orders;

  let processedChunks = rawChunks.map((stCh) => backendifyStructureChunk(stCh));

  if (!processedChunks.length) {
    return;
  }

  let sentenceFormula = {
    sentenceStructure: processedChunks,
    orders: {},
  };

  if (orders) {
    sentenceFormula.orders.primary = orders
      .filter((orderObj) => orderObj.isPrimary)
      .map((orderObj) => orderObj.order);

    sentenceFormula.orders.additional = orders
      .filter((orderObj) => !orderObj.isPrimary)
      .map((orderObj) => orderObj.order);
  }

  console.log(""); //devlogging
  console.log("");
  console.log("**fetchSentence**");
  console.log({ lang1, sentenceFormula, requestingSingleWordOnly });

  return axios
    .put(
      `${baseUrl}/educator/sandbox?lang=${lang1}`,
      {
        questionLanguage: lang1,
        sentenceFormula,
        requestingSingleWordOnly,
      }
      // ,{headers: { Authorization: `BEARER ${token}` }}
    )
    .then((res) => {
      console.log("fetchSentence got:", res.data); //devlogging
      console.log("/fetchSentence");
      console.log("");
      console.log("");

      return res.data;
    })
    .catch((e) => console.log("ERROR 7461", e));
};
