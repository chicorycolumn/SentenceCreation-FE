import axios from "axios";
const baseUrl = "http://localhost:9090/api";
// const token = localStorage.getItem("currentUserToken");

export const fetchTags = (lang1) => {
  return axios
    .get(
      `${baseUrl}/educator/tags?language1=${lang1}`
      // ,{headers: { Authorization: `BEARER ${token}` }}
    )
    .then((res) => {
      return res.data;
    })
    .then((data) => {
      return data["tags"];
    });
};

export const fetchWordsByTag = (lang1, tag) => {
  return axios
    .get(
      `${baseUrl}/educator/words?language1=${lang1}&tags=${tag}`
      // ,{headers: { Authorization: `BEARER ${token}` }}
    )
    .then((res) => {
      return res.data;
    })
    .then((data) => {
      return data["words"];
    });
};
