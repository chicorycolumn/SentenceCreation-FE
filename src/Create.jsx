import React, { Component } from "react";
import { fetchTags, fetchWordsByTag } from "./utils/getUtils.js";

class Create extends Component {
  state = {
    tags: null,
    isLoading: null,
    language1: null,
    err: null,
  };

  render() {
    return (
      <div>
        <h1>Create new sentences</h1>
        {this.state.isLoading ? <p>Loading...</p> : <p>Welcome</p>}
        <form
          onChange={(e) => {
            this.setState({ language1: e.target.value });
          }}
        >
          <input type="radio" id="english" name="language1" value="ENG" />
          <label htmlFor="english">English</label>
          <input type="radio" id="polish" name="language1" value="POL" />
          <label htmlFor="polish">Polish</label>
        </form>

        <button
          onClick={() => {
            let language1 = this.state.language1;

            if (language1) {
              this.setState({ isLoading: true });
              fetchTags(language1)
                .then((tags) => {
                  this.setState({ tags, isLoading: false });
                })
                .catch((err) => this.setState({ err }));
            } else {
              console.log("Please select a language.");
            }
          }}
        >
          Poll tags
        </button>

        <ul>
          {this.state.tags &&
            this.state.tags.map((tag) => (
              <li
                style={{ color: "purple" }}
                onClick={() => {
                  this.setState({ isLoading: true });
                  fetchWordsByTag(this.state.language1, tag)
                    .then((words) => {
                      this.setState({ words, isLoading: false });
                    })
                    .catch((err) => this.setState({ err }));
                }}
                key={tag}
              >
                {tag}
              </li>
            ))}
          {this.state.words &&
            Object.keys(this.state.words).map((wordSetKey) => (
              <div key={wordSetKey}>
                <h2>{wordSetKey}</h2>
                {this.state.words[wordSetKey].map((wordObj) => (
                  <div key={wordObj.id}>
                    <span style={{ color: "darkblue" }}>{wordObj.lemma}</span>
                    <span style={{ color: "crimson" }}>{wordObj.id}</span>
                  </div>
                ))}
              </div>
            ))}
        </ul>
      </div>
    );
  }
}

export default Create;
