import axios from "axios";
import idUtils from "./identityUtils.js";
const uUtils = require("../utils/universalUtils.js");
const baseUrl = "http://localhost:9090/api";
// const token = localStorage.getItem("currentUserToken");

export const frontendOnlyTraits = ["booleanTraits", "isGhostChunk"];

export const backendifyFormula = (formula) => {
  // Backendify-1: Orders
  if (formula.orders) {
    formula.primaryOrders = formula.orders
      .filter((obj) => obj.isPrimary)
      .map((obj) => obj.order);

    formula.additionalOrders = formula.orders
      .filter((obj) => !obj.isPrimary)
      .map((obj) => obj.order);

    delete formula.orders;
  }

  formula.sentenceStructure = formula.sentenceStructure.map((enCh) => {
    let stCh = {};

    // Backendify-2b: Unpack booleans
    if (enCh.booleanTraits) {
      enCh.booleanTraits.traitValue.forEach((booleanTrait) => {
        stCh[booleanTrait] = true;
      });
    }

    // Backendify-2a: enCh to stCh
    Object.keys(enCh).forEach((traitKey) => {
      if (frontendOnlyTraits.includes(traitKey)) {
        return;
      }

      let { traitValue } = enCh[traitKey];
      if (traitValue && (traitValue === true || traitValue.length)) {
        stCh[traitKey] = traitValue;
      }
    });

    // Backendify-2c: isGhostChunk already removed by 2a, and is not coded in BE in any way.
    // Just in FE where chunks not appearing in any orderObj are labelled ghost.

    return stCh;
  });
};

export const fetchEnChsByLemma = (lang1, lemma) => {
  console.log(""); //devlogging
  console.log("");
  console.log("**fetchEnChsByLemm'a**");
  console.log({ lang1, lemma });

  return axios
    .get(
      `${baseUrl}/educator/chunks?&lang=${lang1}&lemma=${lemma}`
      // ,{headers: { Authorization: `BEARER ${token}` }}
    )
    .then((res) => {
      let result = res.data["info"];
      console.log("fetchEnChsByLemm'a got:", result); //devlogging
      console.log("/fetchEnChsByLemm'a");
      console.log("");
      console.log("");

      return result;
    })
    .catch((e) => {
      console.log("ERROR 2171", lang1, `"${lemma}"`, e);
    });
};

export const fetchTags = (lang1) => {
  return axios
    .get(
      `${baseUrl}/educator/tags?lang=${lang1}`
      // ,{headers: { Authorization: `BEARER ${token}` }}
    )
    .then((res) => {
      return res.data;
    })
    .then((data) => {
      return data["tags"];
    });
};

export const fetchWordsByTag = (lang1, andTags, orTags) => {
  const langString = `lang=${lang1}`;
  const andTagsString = !uUtils.isEmpty(andTags)
    ? `&andTags=${andTags.join("+")}`
    : "";
  const orTagsString = !uUtils.isEmpty(orTags)
    ? `&orTags=${orTags.join("+")}`
    : "";
  const requestString = `${baseUrl}/educator/words?${langString}${andTagsString}${orTagsString}`;

  return axios
    .get(
      requestString
      // ,{headers: { Authorization: `BEARER ${token}` }}
    )
    .then((res) => {
      return res.data;
    })
    .then((data) => {
      return data["words"];
    });
};
