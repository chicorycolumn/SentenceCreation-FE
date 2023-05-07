import axios from "axios";
import { backendifyFormula } from "./backendifyFrontendifyUtils.js";
import bfUtils from "./backendifyFrontendifyUtils.js";
const uiUtils = require("./userInputUtils.js");
const uUtils = require("../utils/universalUtils.js");
const baseUrl = "http://localhost:9090/api";
// const token = localStorage.getItem("currentUserToken");

export const fetchFormulaIds = (langQ, langA, env) => {
  return axios
    .get(
      `${baseUrl}/educator/formulaids?lang1=${langQ}&lang2=${langA}&env=${env}`
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
  lang,
  protoFormula,
  label,
  callback,
  setListPopupData
) => {
  fetchSentence(lang, protoFormula).then(
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
        callback(payload, protoFormula);
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

export const _fetchDualSentence = (
  label,
  langQ,
  langA,
  questionFormula,
  answerFormula,
  setListPopupData,
  callback,
  repeatCallback
) => {
  fetchDualSentence(langQ, langA, questionFormula, answerFormula).then(
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
        callback(payload, questionFormula, answerFormula);
      } else {
        let firstRow = [
          payload.questionSentenceArr,
          payload.answerSentenceArr[0],
        ];
        let rows = [firstRow];
        payload.answerSentenceArr.slice(1).forEach((answerSentence) => {
          rows.push(["", answerSentence]);
        });
        setListPopupData({
          title: `${payload.answerSentenceArr.length} Answer sentences for this Question sentence.`,
          headers: [`Question (${langQ})`, `Answers (${langA})`],
          rows,
          repeatCallback,
        });
      }
    },
    (e) => {
      console.log(`ERROR ${label}:`, e);
    }
  );
};

export const fetchSentence = (lang, formula) => {
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
    questionLanguage: lang,
    sentenceFormula: formula,
    requestingSingleWordOnly,
  };

  console.log("");
  console.log("");
  console.log("**fetchSentence**");
  console.log(body);

  return axios
    .put(
      `${baseUrl}/educator/sentences?lang=${lang}`,
      body
      // ,{headers: { Authorization: `BEARER ${token}` }}
    )
    .then((res) => {
      console.log("fetchSentence got:", res.data);
      console.log("/fetchSentence");
      console.log("");
      console.log("");

      return res.data;
    })
    .catch((e) => console.log("ERROR 7461", e));
};

export const fetchDualSentence = (
  questionLanguage,
  answerLanguage,
  questionFormula,
  answerFormula
) => {
  if (!questionFormula.sentenceStructure.length) {
    return;
  }
  if (!answerFormula.sentenceStructure.length) {
    return;
  }

  let requestingSingleWordOnly =
    !questionFormula.orders ||
    !Object.keys(questionFormula.orders).length ||
    ((!questionFormula.orders.primary ||
      !questionFormula.orders.primary.length) &&
      (!questionFormula.orders.additional ||
        !questionFormula.orders.additional.length));

  let body = {
    questionLanguage,
    answerLanguage,
    questionFormula,
    answerFormula,
    requestingSingleWordOnly,
  };

  console.log("");
  console.log("");
  console.log("**fetchDualSentence**");
  console.log(body);

  return axios
    .put(
      `${baseUrl}/educator/sentences?lang=${questionLanguage}&lang2=${answerLanguage}`,
      body
      // ,{headers: { Authorization: `BEARER ${token}` }}
    )
    .then((res) => {
      console.log("fetchDualSentence got:", res.data);
      console.log("/fetchDualSentence");
      console.log("");
      console.log("");

      return res.data;
    })
    .catch((e) => console.log("ERROR 7181", e));
};
