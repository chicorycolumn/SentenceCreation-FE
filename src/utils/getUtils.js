import axios from "axios";
const uUtils = require("../utils/universalUtils.js");
const baseUrl = "http://localhost:9090/api";
// const token = localStorage.getItem("currentUserToken");

export const fetchLObjsByLemma = (lang1, lemma) => {
  console.log("Will request lObjs for", lang1, lemma);
  return axios
    .get(
      `${baseUrl}/educator/info?infoType=lObjs&lang=${lang1}&lemma=${lemma}`
      // ,{headers: { Authorization: `BEARER ${token}` }}
    )
    .then((res) => {
      return res.data;
    })
    .then((data) => {
      return data["info"];
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
