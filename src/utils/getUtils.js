import axios from "axios";
import idUtils from "./identityUtils.js";
const uUtils = require("../utils/universalUtils.js");
const baseUrl = "http://localhost:9090/api";
// const token = localStorage.getItem("currentUserToken");

export const frontendOnlyTraits = ["booleanTraits", "isGhostChunk"];

export const backendOnlyTraits = ["allohomInfo", "hiddenTraits"];

export const backendifyStructureChunk = (stCh) => {
  let processedStCh = {};

  if (stCh.booleanTraits) {
    stCh.booleanTraits.traitValue.forEach((booleanTrait) => {
      processedStCh[booleanTrait] = {
        expectedTypeOnStCh: "boolean",
        traitValue: true,
      };
    });
  }

  Object.keys(stCh).forEach((traitKey) => {
    if (frontendOnlyTraits.includes(traitKey)) {
      return;
    }

    let { traitValue } = stCh[traitKey];

    if (traitValue && (traitValue === true || traitValue.length)) {
      processedStCh[traitKey] = traitValue;
    }
  });

  Object.keys(idUtils.renamedTraitKeys).forEach((backendKey) => {
    let frontendKey = idUtils.renamedTraitKeys[backendKey];
    if (Object.keys(processedStCh).includes(frontendKey)) {
      processedStCh[backendKey] = processedStCh[frontendKey];
      delete processedStCh[frontendKey];
    }
  });

  return processedStCh;
};

export const frontendifyStructureChunk = (stCh) => {
  Object.keys(idUtils.renamedTraitKeys).forEach((backendKey) => {
    let frontendKey = idUtils.renamedTraitKeys[backendKey];
    if (Object.keys(stCh).includes(backendKey)) {
      stCh[frontendKey] = stCh[backendKey];
      delete stCh[backendKey];
    }
  });

  let booleanTraits = {
    expectedTypeOnStCh: "array",
    possibleTraitValues: [],
    traitValue: [],
  };

  Object.keys(stCh).forEach((traitKey) => {
    if (
      typeof stCh[traitKey] === "object" &&
      stCh[traitKey].expectedTypeOnStCh === "boolean"
    ) {
      booleanTraits.possibleTraitValues.push(traitKey);
      delete stCh[traitKey];
    }
  });

  stCh.booleanTraits = booleanTraits;

  backendOnlyTraits.forEach((traitKey) => {
    delete stCh[traitKey];
  });

  return stCh;
};

export const fetchLObjsByLemma = (lang1, lemma) => {
  console.log(""); //devlogging
  console.log("");
  console.log("**fetchLObjsByLemma**");
  console.log({ lang1, lemma });

  return axios
    .get(
      `${baseUrl}/educator/info?infoType=lObjs&lang=${lang1}&lemma=${lemma}`
      // ,{headers: { Authorization: `BEARER ${token}` }}
    )
    .then((res) => {
      let result = res.data["info"];
      console.log("fetchLObjsByLemma got:", result); //devlogging
      console.log("/fetchLObjsByLemma");
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
