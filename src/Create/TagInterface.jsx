import React, { Component, useEffect, useState, useContext } from "react";
import { fetchTags, fetchWordsByTag } from "../utils/getUtils.js";
import styles from "../css/TagInterface.module.css";
import traitBoxStyles from "../css/TraitBox.module.css";
import gstyles from "../css/Global.module.css";
import LanguageContext from "../context/LanguageContext.js";
const diUtils = require("../utils/displayUtils.js");

const TagInterface = (props) => {
  const [tags, setTags] = useState([]);
  const [fetchedLObjs, setFetchedLObjs] = useState({});
  const lang1 = useContext(LanguageContext);

  useEffect(() => {
    fetchWordsByTag(lang1, diUtils.asArray(props.traitValueInputString)).then(
      (fetchedWords) => {
        console.log("");
        console.log("Setting fetched WORDS", fetchedWords);
        console.log("");
        setFetchedLObjs(fetchedWords);
      }
    );
  }, [props.traitValueInputString, lang1]);

  useEffect(() => {
    fetchTags(lang1).then((fetchedTags) => {
      console.log("");
      console.log("Setting fetched TAGS");
      console.log("");
      setTags(fetchedTags);
    });
  }, [lang1]);

  return (
    <div className={styles.mainBox}>
      <h1>Select tags</h1>

      <button
        className={gstyles.tickButton}
        onClick={props.checkAndSetTraitValue}
      >
        &#10003;
      </button>

      <select
        className={styles.tagSelector}
        name="tag"
        onClick={(e) => {
          e.preventDefault();
          props.pushpopTraitValueInputString(e.target.value);
        }}
      >
        {tags.map((tag) => (
          <option value={tag} key={tag}>
            {tag}
          </option>
        ))}
      </select>
      <button
        className={gstyles.exitButton}
        onClick={() => {
          props.revertTraitValueInputString();
          props.exitTraitBox(false);
        }}
      >
        &times;
      </button>

      <div className={styles.etiquetteHolder}>
        {diUtils.asArray(props.traitValueInputString).map((tag) => (
          <div
            onClick={() => {
              props.pushpopTraitValueInputString(tag, false);
            }}
            className={`${styles.etiquette} ${styles.etiquetteClickable}`}
            key={tag}
          >
            {tag}
          </div>
        ))}
      </div>

      <div className={styles.etiquetteHolder}>
        {Object.keys(fetchedLObjs).map((wordtype) => {
          let words = fetchedLObjs[wordtype];
          return words.map((word) => {
            const { lemma, id } = word;
            return (
              <div
                className={`${styles.etiquette} ${gstyles.tooltipHolder} ${gstyles[wordtype]}`}
                key={lemma}
              >
                {lemma}
                <span className={gstyles.tooltip}>{id}</span>
              </div>
            );
          });
        })}
      </div>
    </div>
  );
};

export default TagInterface;
