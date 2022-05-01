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

export const fetchWordsByTag = (lang1, tags) => {
  console.log(tags.length, tags);
  return axios
    .get(
      `${baseUrl}/educator/words?lang=${lang1}&tags=${tags.join("+")}`
      // ,{headers: { Authorization: `BEARER ${token}` }}
    )
    .then((res) => {
      return res.data;
    })
    .then((data) => {
      return data["words"];
    });
};
