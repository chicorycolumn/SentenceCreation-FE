import axios from "axios";
import { backendifyFormula } from "./backendifyFrontendifyUtils.js";
import bfUtils from "./backendifyFrontendifyUtils.js";
const uiUtils = require("./userInputUtils.js");
const uUtils = require("../utils/universalUtils.js");
const baseUrl = "http://localhost:9090/api";
// const token = localStorage.getItem("currentUserToken");

export const getFormula = (props) => {
  if (uiUtils.validateFemulaToSend(props.femula)) {
    return;
  }

  return {
    sentenceFormulaId: props.chosenFormulaId,
    sentenceStructure: props.femula.map((el) => el.structureChunk),
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

export const fetchFemula = (formulaId, answerLanguage) => {
  console.log("START fetchFemula", { formulaId, answerLanguage });

  return axios
    .get(
      `${baseUrl}/educator/formulas?id=${formulaId}&lang=${answerLanguage}`
      // ,{headers: { Authorization: `BEARER ${token}` }}
    )
    .then((res) => {
      console.log("END fetchFemula GOT:", res.data); //devlogging
      console.log("");
      console.log("");

      return res.data;
    })
    .catch((e) => console.log("ERROR 9820", e));
};

export const _fetchSentence = (
  lang1,
  formula,
  label,
  callback,
  setListPopupData
) => {
  fetchSentence(lang1, formula).then(
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
        callback(payload, formula);
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

export const fetchSentence = (lang1, formula) => {
  backendifyFormula(formula);

  if (!formula.sentenceStructure.length) {
    return;
  }

  let requestingSingleWordOnly =
    !formula.orders ||
    !Object.keys(formula.orders).length ||
    ((!formula.orders.primary || !formula.orders.primary.length) &&
      (!formula.orders.additional || !formula.orders.additional.length));

  let body = {
    questionLanguage: lang1,
    sentenceFormula: formula,
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
