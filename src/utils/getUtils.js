import axios from "axios";
const baseUrl = "http://localhost:9090/api";
// const token = localStorage.getItem("currentUserToken");

export const fetchTags = (lang1) => {
  return axios
    .get(
      `${baseUrl}/educator/tags/${lang1}`
      // ,{headers: { Authorization: `BEARER ${token}` }}
    )
    .then((res) => {
      return res.data;
    })
    .then((data) => {
      return data["tags"];
    });
};
