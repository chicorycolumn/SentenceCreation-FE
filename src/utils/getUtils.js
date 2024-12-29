import axios from "axios";
import idUtils from "./identityUtils.js";
import bfUtils from "./backendifyFrontendifyUtils.js";
import diUtils from "./displayUtils.js";
const uUtils = require("../utils/universalUtils.js");
const baseUrl = "http://localhost:9090/api";
// const token = localStorage.getItem("currentUserToken");

export const fetchPalette = (
  beEnv,
  langQ,
  langA,
  fTopics,
  formulaDifficulty,
  iterations = 2
) => {
  let baseString = `${baseUrl}/palette?`;
  let envString = `envir=${beEnv}`;
  let langString = `&questionLanguage=${langQ}&answerLanguage=${langA}`;
  let topicsString = fTopics.length ? `&topics=${fTopics.join(",")}` : "";
  let difficultyString = `&difficulty=${formulaDifficulty}`;
  let iterationsString = `&iterations=${iterations}`;

  return axios
    .get(
      baseString +
        envString +
        langString +
        topicsString +
        difficultyString +
        iterationsString
      // ,{headers: { Authorization: `BEARER ${token}` }}
    )
    .then((res) => {
      let responseObjArr = res.data;
      console.log(">>>", responseObjArr.length);
      responseObjArr.forEach((responseObj) => console.log(responseObj));
      return responseObjArr;
    });
};

export const fetchEnChsByLemma = (lang, lemma, beEnv) => {
  console.log(""); //devlogging
  console.log("");
  console.log("**fetchEnChsByLemm'a**");
  console.log({ lang, lemma });

  return axios
    .get(
      `${baseUrl}/educator/chunks?&lang=${lang}&lemma=${lemma}&envir=${beEnv}`
      // ,{headers: { Authorization: `BEARER ${token}` }}
    )
    .then((res) => {
      let result = res.data["info"];
      console.log("fetchEnChsByLemm'a got:", result); //devlogging
      console.log("/fetchEnChsByLemm'a");
      console.log("");
      console.log("");

      diUtils.stopSpinner();
      return result;
    })
    .catch((e) => {
      diUtils.stopSpinner();
      console.log("ERROR 2171", lang, `"${lemma}"`, e);
    });
};

export const fetchTopics = (beEnv, currentLang) => {
  return axios
    .get(
      `${baseUrl}/educator/topics?envir=${beEnv}&lang=${currentLang}`
      // ,{headers: { Authorization: `BEARER ${token}` }}
    )
    .then((res) => {
      return res.data;
    })
    .then((data) => {
      return data["topics"];
    });
};

export const fetchAvailableNexusId = (beEnv, callback, args) => {
  return axios
    .get(
      `${baseUrl}/educator/nexusid?envir=${beEnv}`
      // ,{headers: { Authorization: `BEARER ${token}` }}
    )
    .then((res) => {
      return res.data;
    })
    .then((data) => {
      let nexusId = data["info"];

      if (callback) {
        callback(nexusId, ...args);
      }

      return nexusId;
    });
};

export const fetchTags = (lang, beEnv) => {
  return axios
    .get(
      `${baseUrl}/educator/tags?lang=${lang}&envir=${beEnv}`
      // ,{headers: { Authorization: `BEARER ${token}` }}
    )
    .then((res) => {
      return res.data["tags"];
    });
};

export const fetchWordsByTag = (
  beEnv,
  lang,
  andTags,
  orTags,
  wordtype,
  shouldFetchFrequency
) => {
  console.log("fetchWordsByTag", { lang, andTags, orTags, wordtype });

  const langString = `lang=${lang}`;
  const envirString = `&envir=${beEnv}`;
  const wordtypeString = `&wordtype=${wordtype}`;
  const extraString = shouldFetchFrequency ? `&include_frequency=true` : "";
  const andTagsString = !uUtils.isEmpty(andTags)
    ? `&andTags=${andTags.join(",")}`
    : "";
  const orTagsString = !uUtils.isEmpty(orTags)
    ? `&orTags=${orTags.join(",")}`
    : "";

  return axios
    .get(
      `${baseUrl}/educator/words?${langString}${envirString}${extraString}${andTagsString}${orTagsString}${wordtypeString}`
      // ,{headers: { Authorization: `BEARER ${token}` }}
    )
    .then((res) => {
      return res.data["words"];
    });
};
