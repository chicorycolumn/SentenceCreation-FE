import React, { useEffect, useState, useContext } from "react";
import { fetchTags, fetchWordsByTag } from "../utils/getUtils.js";
import styles from "../css/TagInterface.module.css";
import gstyles from "../css/Global.module.css";
import LanguageContext from "../context/LanguageContext.js";
import LemmasTable from "./LemmasTable.jsx";
import diUtils from "../utils/displayUtils.js";

const TagInterface = (props) => {
  const [clickCounter, setClickCounter] = useState(0);
  const [tickDisabled, setTickDisabled] = useState();
  const [tags, setTags] = useState([]);
  const [fetchedLObjs, setFetchedLObjs] = useState({});
  const [wordtypeInFocus, setWordtypeInFocus] = useState(props.wordtype);
  const lang1 = useContext(LanguageContext);

  useEffect(() => {
    fetchWordsByTag(
      lang1,
      diUtils.asArray(props.traitValueInputString),
      diUtils.asArray(props.traitValueInputString2)
    ).then((fetchedWords) => {
      setFetchedLObjs(fetchedWords);

      setTickDisabled(
        !fetchedWords[props.wordtype] ||
          !fetchedWords[props.wordtype].some((lObj) => lObj.id === props.lObjId)
      );
    });
  }, [
    props.traitValueInputString,
    props.traitValueInputString2,
    lang1,
    props.lObjId,
    props.wordtype,
  ]);

  useEffect(() => {
    fetchTags(lang1).then((fetchedTags) => {
      setTags(fetchedTags.sort((x, y) => x.localeCompare(y)));
    });
  }, [lang1]);

  useEffect(() => {
    if (clickCounter > 5) {
      setTickDisabled(false);
    }
  }, [clickCounter]);

  return (
    <div className={styles.mainBox}>
      <div className={styles.leftDiv}>
        <div className={styles.buttonHolder}>
          <button
            alt="Tick icon / Check icon"
            className={`${gstyles.tickButton} ${
              tickDisabled && gstyles.disabled
            }`}
            onClick={(e) => {
              e.preventDefault();
              if (tickDisabled) {
                setClickCounter((prev) => prev + 1);
              } else {
                props.checkAndSetTraitValue(true);
              }
            }}
          >
            &#10003;
          </button>

          <button
            alt="Cross icon"
            className={`${gstyles.sideButton} ${gstyles.redButton}`}
            onClick={() => {
              props.revertTraitValueInputString(true);
              props.exitTraitBox(false);
            }}
          >
            &times;
          </button>

          <button
            alt="Undo icon"
            className={`${gstyles.sideButton} ${gstyles.blueButton}`}
            onClick={() => {
              props.revertTraitValueInputString();
              props.revertTraitValueInputString(true);
            }}
          >
            &#8634;
          </button>

          <button
            alt="Reset icon"
            className={`${gstyles.sideButton} ${gstyles.blueButton}`}
            onClick={() => {
              props.pushpopTraitValueInputString(
                props.backedUpTags,
                true,
                false,
                true
              );
              props.pushpopTraitValueInputString(null, true, true, true);
            }}
          >
            &#8647;
          </button>
        </div>

        {[props.traitValueInputString, props.traitValueInputString2].map(
          (traitValueInputString, index) => {
            const heading = ["Select And-Tags", "Select Or-Tags"][index];
            const isSecondary = index === 1;
            return (
              <div key={heading} className={styles.heading}>
                <div className={styles.div1}>
                  <h1>{heading}</h1>

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
                    {tags
                      .filter(
                        (tag) =>
                          !diUtils.asArray(traitValueInputString).includes(tag)
                      )
                      .map((tag) => (
                        <option value={tag} key={tag}>
                          {tag}
                        </option>
                      ))}
                  </select>
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
              </div>
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
                  className={`${gstyles[wordtype]} ${styles.wordtypeButton} ${
                    wordtypeInFocus === wordtype &&
                    styles.wordtypeButtonSelected
                  }`}
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
