import axios from "axios";
const baseUrl = "http://localhost:9090/api";
// const token = localStorage.getItem("currentUserToken");

export const fetchLObjsByLemma = (lang1, lemma) => {
  console.log("Will request", lang1, lemma);
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
  let langString = `lang=${lang1}`;
  let andTagsString = andTags ? `&andTags=${andTags.join("+")}` : "";
  let orTagsString = orTags ? `&orTags=${orTags.join("+")}` : "";

  return axios
    .get(
      `${baseUrl}/educator/words?${langString}${andTagsString}${orTagsString}`
      // ,{headers: { Authorization: `BEARER ${token}` }}
    )
    .then((res) => {
      return res.data;
    })
    .then((data) => {
      return data["words"];
    });
};
