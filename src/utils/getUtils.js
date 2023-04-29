import axios from "axios";
import idUtils from "./identityUtils.js";
import bfUtils from "./backendifyFrontendifyUtils.js";
const uUtils = require("../utils/universalUtils.js");
const baseUrl = "http://localhost:9090/api";
// const token = localStorage.getItem("currentUserToken");

export const fetchEnChsByLemma = (lang, lemma) => {
  console.log(""); //devlogging
  console.log("");
  console.log("**fetchEnChsByLemm'a**");
  console.log({ lang, lemma });

  return axios
    .get(
      `${baseUrl}/educator/chunks?&lang=${lang}&lemma=${lemma}`
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
      console.log("ERROR 2171", lang, `"${lemma}"`, e);
    });
};

export const fetchTags = (lang) => {
  return axios
    .get(
      `${baseUrl}/educator/tags?lang=${lang}`
      // ,{headers: { Authorization: `BEARER ${token}` }}
    )
    .then((res) => {
      return res.data;
    })
    .then((data) => {
      return data["tags"];
    });
};

export const fetchWordsByTag = (lang, andTags, orTags) => {
  const langString = `lang=${lang}`;
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
