import axios from "axios";
import { backendifyFormula } from "./getUtils.js";
const uUtils = require("../utils/universalUtils.js");
const baseUrl = "http://localhost:9090/api";
// const token = localStorage.getItem("currentUserToken");

export const fetchFormulaIds = (lang1, lang2, env) => {
  return axios
    .get(
      `${baseUrl}/educator/formulaids?lang1=${lang1}&lang2=${lang2}&env=${env}`
      // ,{headers: { Authorization: `BEARER ${token}` }}
    )
    .then((res) => {
      console.log("fetchFormulaIds got:", res.data); //devlogging
      console.log("/fetchFormulaIds");

      return res.data;
    })
    .catch((e) => console.log("ERROR 7070", e));
};

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

export const fetchSentence = (lang1, sentenceFormula) => {
  backendifyFormula(sentenceFormula);

  if (!sentenceFormula.sentenceStructure.length) {
    return;
  }

  let requestingSingleWordOnly =
    (!sentenceFormula.primaryOrders || !sentenceFormula.primaryOrders.length) &&
    (!sentenceFormula.additionalOrders ||
      !sentenceFormula.additionalOrders.length);

  let body = {
    questionLanguage: lang1,
    sentenceFormula,
    requestingSingleWordOnly,
  };

  console.log(""); //devlogging
  console.log("");
  console.log("**fetchSentence**");
  console.log(body);

  return axios
    .put(
      `${baseUrl}/educator/sentences?lang=${lang1}`,
      body
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
