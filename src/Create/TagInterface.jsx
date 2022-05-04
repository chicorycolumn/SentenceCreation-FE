import React, { useEffect, useState, useContext } from "react";
import { fetchTags, fetchWordsByTag } from "../utils/getUtils.js";
import styles from "../css/TagInterface.module.css";
import gstyles from "../css/Global.module.css";
import LanguageContext from "../context/LanguageContext.js";
import LemmasTable from "./LemmasTable.jsx";
const diUtils = require("../utils/displayUtils.js");

const TagInterface = (props) => {
  const [tags, setTags] = useState([]);
  const [fetchedLObjs, setFetchedLObjs] = useState({});
  const [wordtypeInFocus, setWordtypeInFocus] = useState("npe");
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
      setTags(fetchedTags.sort((x, y) => x.localeCompare(y)));
    });
  }, [lang1]);

  return (
    <div className={styles.mainBox}>
      <div className={styles.leftDiv}>
        {[props.traitValueInputString, props.traitValueInputString2].map(
          (traitValueInputString, index) => {
            const headings = ["Select And-Tags", "Select Or-Tags"];
            const isSecondary = index === 1;
            return (
              <>
                <div className={styles.div1}>
                  <h1>{headings[index]}</h1>

                  <button
                    className={gstyles.tickButton}
                    onClick={() => {
                      props.checkAndSetTraitValue(isSecondary);
                    }}
                  >
                    &#10003;
                  </button>

                  <select
                    className={styles.tagSelector}
                    name="tag"
                    onClick={(e) => {
                      e.preventDefault();
                      props.pushpopTraitValueInputString(
                        e.target.value,
                        true,
                        isSecondary
                      );
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
                      props.revertTraitValueInputString(isSecondary);
                      props.exitTraitBox(false);
                    }}
                  >
                    &times;
                  </button>
                </div>
                <div className={styles.etiquetteHolder}>
                  {diUtils.asArray(traitValueInputString).map((tag) => (
                    <div
                      onClick={() => {
                        props.pushpopTraitValueInputString(
                          tag,
                          false,
                          isSecondary
                        );
                      }}
                      className={`${styles.etiquette} ${styles.etiquetteClickable}`}
                      key={tag}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </>
            );
          }
        )}
      </div>

      <div className={styles.rightDiv}>
        <div className={styles.div3}>
          <div className={styles.wordtypeButtonsHolder}>
            {Object.keys(fetchedLObjs).map((wordtype) => {
              let count = fetchedLObjs[wordtype].length;
              return (
                <button
                  disabled={!count}
                  key={wordtype}
                  className={`${gstyles[wordtype]} ${styles.wordtypeButton}`}
                  onClick={() => {
                    setWordtypeInFocus(wordtype);
                  }}
                >
                  {wordtype}
                </button>
              );
            })}
          </div>
          <div className={styles.tableHolder}>
            <LemmasTable
              setWordtypeInFocus={setWordtypeInFocus}
              wordtypeInFocus={wordtypeInFocus}
              fetchedLObjs={fetchedLObjs}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagInterface;
