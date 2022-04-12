import React, { Component } from "react";
import { fetchTags } from "./utils/getUtils.js";

class Create extends Component {
  state = {
    tags: null,
    isLoading: null,
    language1: null,
  };

  render() {
    return (
      <div>
        <h1>Create new sentences</h1>

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
            this.state.tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
      </div>
    );
  }
}

export default Create;
