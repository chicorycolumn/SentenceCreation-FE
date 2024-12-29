import React, { useState, useContext, useEffect } from "react";
import LanguageContext from "../context/LanguageContext.js";
import idUtils from "../utils/identityUtils.js";
import gstyles from "../css/Global.module.css";
import styles from "../css/DifficultyAndTopicsSelector.module.css";
import rfStyles from "../css/RadioForm.module.css";
import Tooltip from "../Cogs/Tooltip.jsx";
const uUtils = require("../utils/universalUtils.js");

const DifficultyAndTopicsSelector = (props) => {
  return (
    <div className={rfStyles.form}>
      <h4 className={rfStyles.titleSmall}>Formula topics</h4>
      <div className={styles.horizontalHolderMini}>
        <textarea
          className={styles.topics}
          readOnly
          value={props.fTopics.join(", ")}
        ></textarea>
        <select
          className={styles.topicsSelector}
          name="topics"
          onClick={(e) => {
            e.preventDefault();
            props.setFTopics((prev) => {
              let selectedTopic = e.target.value;
              if (prev.includes(selectedTopic)) {
                return prev.filter((x) => x !== selectedTopic);
              }
              return [...prev, selectedTopic];
            });
          }}
        >
          {props.allTopics.map((topicOption, tpoIndex) => (
            <option value={topicOption} key={`${tpoIndex}-${topicOption}`}>
              {topicOption}
            </option>
          ))}
        </select>
        <button
          alt="Cross icon"
          className={`${styles.topicsButton} ${gstyles.redButton}`}
          onClick={() => {
            if (window.confirm("Wipe all formula topics?")) {
              props.setFTopics([]);
            }
          }}
        >
          &times;
        </button>
      </div>

      <div className={styles.horizontalHolderMini}>
        <h4 className={`${rfStyles.titleSmall} ${styles.difficultyHeader}`}>
          Formula difficulty
        </h4>
        <select
          className={styles.difficultySelector}
          name="difficulty"
          onClick={(e) => {
            e.preventDefault();
            props.setFormulaDifficulty(e.target.value);
          }}
          placeholder={props.formulaDifficulty}
        >
          {[1, 2, 3, 4, 5].map((difficultyOption, dioIndex) => (
            <option
              value={difficultyOption}
              key={`${dioIndex}-${difficultyOption}`}
            >
              {difficultyOption}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DifficultyAndTopicsSelector;
