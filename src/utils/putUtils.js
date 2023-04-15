import axios from "axios";
import { backendifyFormula } from "./backendifyFrontendifyUtils.js";
import bfUtils from "./backendifyFrontendifyUtils.js";
const uiUtils = require("./userInputUtils.js");
const uUtils = require("../utils/universalUtils.js");
const baseUrl = "http://localhost:9090/api";
// const token = localStorage.getItem("currentUserToken");

export const getFormulaToSend = (props) => {
  if (uiUtils.validateFormulaToSend(props.formula)) {
    return;
  }

  return {
    sentenceFormulaId: props.chosenFormulaID,
    sentenceStructure: props.formula.map((el) => el.structureChunk),
    orders: bfUtils.backendifyOrders(props.chunkOrders), // Backendify-1: Orders
  };
};

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
      console.log("END fetchFormula GOT:", res.data); //devlogging
      console.log("");
      console.log("");

      return res.data;
    })
    .catch((e) => console.log("ERROR 9820", e));
};

export const _fetchSentence = (
  lang1,
  formulaToSend,
  label,
  callback,
  setListPopupData
) => {
  fetchSentence(lang1, formulaToSend).then(
    (data) => {
      let { payload, messages } = data;

      if (messages) {
        alert(
          Object.keys(messages).map((key) => {
            let val = messages[key];
            return `${key}:       ${val}`;
          })
        );
        return;
      }
      if (callback) {
        callback(payload, formulaToSend);
      } else {
        setListPopupData({
          title: `${payload.length} sentence${
            payload.length > 1 ? "s" : ""
          } from traits you specified`,
          headers: ["sentence"],
          rows: payload.map((el) => [el]),
        });
      }
    },
    (e) => {
      console.log(`ERROR ${label}:`, e);
    }
  );
};

export const fetchSentence = (lang1, sentenceFormula) => {
  backendifyFormula(sentenceFormula);

  if (!sentenceFormula.sentenceStructure.length) {
    return;
  }

  let requestingSingleWordOnly =
    !sentenceFormula.orders ||
    !Object.keys(sentenceFormula.orders).length ||
    ((!sentenceFormula.orders.primary ||
      !sentenceFormula.orders.primary.length) &&
      (!sentenceFormula.orders.additional ||
        !sentenceFormula.orders.additional.length));

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
