import axios from "axios";
import { backendifyFormula } from "./backendifyFrontendifyUtils.js";
import bfUtils from "./backendifyFrontendifyUtils.js";
const uiUtils = require("./userInputUtils.js");
const diUtils = require("./displayUtils.js");
const putUtils = require("./putUtils.js");
const uUtils = require("../utils/universalUtils.js");
const baseUrl = "http://localhost:9090/api";
// const token = localStorage.getItem("currentUserToken");

export const fetchFormulaIds = (langQ, langA, beEnv) => {
  diUtils.startSpinner("green");

  return axios
    .get(
      `${baseUrl}/educator/formulaids?lang1=${langQ}&lang2=${langA}&envir=${beEnv}`
      // ,{headers: { Authorization: `BEARER ${token}` }}
    )
    .then((res) => {
      console.log("fetchFormulaIds got:", res.data); //devlogging
      console.log("/fetchFormulaIds");

      diUtils.stopSpinner();
      return res.data;
    })
    .catch((e) => {
      console.log("ERROR 7070", e);
      diUtils.stopSpinner();
    });
};

export const fetchFemula = (formulaId, answerLanguage, beEnv) => {
  diUtils.startSpinner("fuchsia");

  console.log("START fetchFemula", { formulaId, answerLanguage });

  return axios
    .get(
      `${baseUrl}/educator/formulas?id=${formulaId}&lang=${answerLanguage}&envir=${beEnv}`
      // ,{headers: { Authorization: `BEARER ${token}` }}
    )
    .then((res) => {
      console.log("END fetchFemula GOT:", res.data); //devlogging
      console.log("");
      console.log("");

      diUtils.stopSpinner();
      return res.data;
    })
    .catch((e) => {
      console.log("ERROR 9820", e);
      diUtils.stopSpinner();
    });
};

export const _fetchSentence = (
  beEnv,
  lang,
  formula,
  label,
  callback,
  setListPopupData
) => {
  fetchSentence(lang, formula, beEnv).then(
    (data) => {
      let { payload, messages } = data;

      diUtils.stopSpinner();

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
        callback(payload.length, formula);
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
      diUtils.stopSpinner();
    }
  );
};

export const _fetchDualSentence = (
  beEnv,
  label,
  langQ,
  langA,
  questionFormula,
  answerFormula,
  setListPopupData,
  callback,
  repeatCallback
) => {
  fetchDualSentence(beEnv, langQ, langA, questionFormula, answerFormula).then(
    (data) => {
      let { payload, messages } = data;

      diUtils.stopSpinner();

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
      diUtils.stopSpinner();
    }
  );
};

const _removeAnyUnusedChunksFromFormula = (formula) => {
  let usedChunkIds = [];
  Object.keys(formula.orders).forEach((orderCategory) => {
    formula.orders[orderCategory].forEach((orderArr) => {
      orderArr.forEach((chunkId) => {
        if (!usedChunkIds.includes(chunkId)) {
          usedChunkIds.push(chunkId);
        }
      });
    });
  });
  formula.sentenceStructure = formula.sentenceStructure.filter((chunk) =>
    usedChunkIds.includes(chunk.chunkId)
  );
};

export const prepareFormula = (lang, formula) => {
  backendifyFormula(formula);

  if (!formula.sentenceStructure.length) {
    return;
  }

  let requestingSingleWordOnly =
    !formula.orders ||
    !Object.keys(formula.orders).length ||
    ((!formula.orders.primary || !formula.orders.primary.length) &&
      (!formula.orders.additional || !formula.orders.additional.length));

  _removeAnyUnusedChunksFromFormula(formula);

  let body = {
    questionLanguage: lang,
    sentenceFormula: formula,
    requestingSingleWordOnly,
  };

  return body;
};

export const fetchSentence = (lang, formula, beEnv) => {
  diUtils.startSpinner("lightskyblue");

  const body = putUtils.prepareFormula(lang, formula);

  console.log("");
  console.log("");
  console.log("**fetchSentence**");
  console.log(body);

  return axios
    .put(
      `${baseUrl}/educator/sentences?lang=${lang}&envir=${beEnv}`,
      body
      // ,{headers: { Authorization: `BEARER ${token}` }}
    )
    .then((res) => {
      console.log("fetchSentence got:", res.data);
      console.log("/fetchSentence");
      console.log("");
      console.log("");

      diUtils.stopSpinner();
      return res.data;
    })
    .catch((e) => {
      console.log("ERROR 7461", e);
      diUtils.stopSpinner();
    });
};

export const fetchDualSentence = (
  beEnv,
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

  diUtils.startSpinner("blue");

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
      `${baseUrl}/educator/sentences?lang=${questionLanguage}&lang2=${answerLanguage}&envir=${beEnv}`,
      body
      // ,{headers: { Authorization: `BEARER ${token}` }}
    )
    .then((res) => {
      console.log("fetchDualSentence got:", res.data);
      console.log("/fetchDualSentence");
      console.log("");
      console.log("");

      diUtils.stopSpinner();
      return res.data;
    })
    .catch((e) => {
      console.log("ERROR 7181", e);
      diUtils.stopSpinner();
    });
};
