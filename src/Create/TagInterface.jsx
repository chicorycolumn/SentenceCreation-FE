import React, { useEffect, useState, useContext } from "react";
import LemmasTable from "./LemmasTable.jsx";
import Tooltip from "../Cogs/Tooltip.jsx";
import LanguageContext from "../context/LanguageContext.js";
import styles from "../css/TagInterface.module.css";
import gstyles from "../css/Global.module.css";
import diUtils from "../utils/displayUtils.js";
import uUtils from "../utils/universalUtils.js";
import $ from "jquery";
import idUtils from "../utils/identityUtils.js";
const getUtils = require("../utils/getUtils.js");

const TagInterface = (props) => {
  const [clickCounter, setClickCounter] = useState(0);
  const [meaninglessCounter, setMeaninglessCounter] = useState(0);
  const [tickDisabled, setTickDisabled] = useState();
  const [tags, setTags] = useState([]);
  const [fetchedWordsByWordtype, setFetchedWordsByWordtype] = useState([]);
  const [focusedWordtype, setFocusedWordtype] = useState(props.wordtype);

  const { beEnv } = idUtils.getLangsAndEnv(useContext(LanguageContext));

  const exit = () => {
    $(document).off("keyup");
    if (!props.noSecondaryGroup) {
      props.revertTraitValueInputString(!props.isSpecificIdsInterface);
    }
    props.exitTraitBox(false);
  };
  const saveAndExit = () => {
    if (tickDisabled) {
      setClickCounter((prev) => prev + 1);
    } else {
      $(document).off("keyup");
      props.checkAndSetTraitValue(true);
    }
  };
  const useClickedId = (id) => {
    props.pushpopTraitValueInputString(id, true);
  };

  useEffect(() => {
    uUtils.addListener($, document, "keyup", (e) => {
      console.log("via TagInterface document listened keyup:", e.key);
      if (["Enter"].includes(e.key)) {
        $("#TagInterface-tickbutton").addClass(gstyles.tickButtonActive);
        setTimeout(saveAndExit, 150);
      } else if (["Escape"].includes(e.key)) {
        $("#TagInterface-crossbutton").addClass(gstyles.redButtonActive);
        setTimeout(exit, 150);
      }
    });
  }, []);

  const fetchWordsByTags = (shouldFetchFrequency = false) => {
    let andTagsArr = diUtils.asArray(props.traitValueInputString);
    let orTagsArr = props.isSpecificIdsInterface
      ? []
      : diUtils.asArray(props.traitValueInputString2);

    if (!andTagsArr.length && !orTagsArr.length) {
      if (props.isSpecificIdsInterface) {
        setFetchedWordsByWordtype([]);
      }

      return;
    }

    getUtils
      .fetchWordsByTag(
        beEnv,
        props.lang,
        andTagsArr,
        orTagsArr,
        focusedWordtype,
        shouldFetchFrequency
      )
      .then((fetchedWords) => {
        if (fetchedWords) {
          setFetchedWordsByWordtype(
            fetchedWords.sort((x, y) => x.id.localeCompare(y.id))
          );

          if (!props.isSpecificIdsInterface) {
            setTickDisabled(
              !fetchedWords.some((lObj) => lObj.id === props.lObjId)
            );
          }
        }
      });
  };

  useEffect(() => {
    fetchWordsByTags();
  }, [
    props.traitValueInputString,
    props.traitValueInputString2,
    props.lang,
    props.lObjId,
    focusedWordtype,
    meaninglessCounter,
  ]);

  useEffect(() => {
    getUtils.fetchTags(props.lang, beEnv).then((fetchedTags) => {
      setTags(fetchedTags.sort((x, y) => x.localeCompare(y)));
    });
  }, [props.lang]);

  useEffect(() => {
    if (clickCounter > 5) {
      setTickDisabled(false);
    }
  }, [clickCounter]);

  return (
    <>
      <div className={gstyles.obscurus} onClick={exit}></div>
      <div
        id={"TagInterface-mainBox"}
        className={`${
          props.isSpecificIdsInterface ? styles.mainBoxWide : styles.mainBox
        }`}
      >
        <div
          className={`${
            props.isSpecificIdsInterface ? styles.leftDivWide : styles.leftDiv
          }`}
        >
          <div className={styles.buttonHolder}>
            <button
              id="TagInterface-tickbutton"
              alt="Checkmark tick icon"
              className={`${gstyles.tickButton} 
              ${tickDisabled && gstyles.disabled}
              ${gstyles.tooltipHolderDelayed1s}
              `}
              onClick={(e) => {
                e.preventDefault();
                saveAndExit();
              }}
            >
              &#10003;
              <Tooltip text={"Exit and save"} />
            </button>

            <button
              id="TagInterface-crossbutton"
              alt="Cross icon"
              className={`${gstyles.sideButton} ${gstyles.redButton} ${gstyles.tooltipHolderDelayed1s}`}
              onClick={exit}
            >
              &times;
              <Tooltip text={"Exit without saving"} />
            </button>

            <button
              alt="Undo icon"
              className={`${gstyles.sideButton} ${gstyles.blueButton} ${gstyles.tooltipHolderDelayed1s}`}
              onClick={() => {
                props.revertTraitValueInputString();
                if (!props.noSecondaryGroup) {
                  props.revertTraitValueInputString(true);
                }
              }}
            >
              &#8634;
              <Tooltip text={"Undo changes"} />
            </button>

            {!props.isSpecificIdsInterface && (
              <button
                alt="Reset icon"
                className={`${gstyles.sideButton} ${gstyles.blueButton} ${gstyles.tooltipHolderDelayed1s}`}
                onClick={() => {
                  props.pushpopTraitValueInputString(
                    props.backedUpTags,
                    true,
                    false,
                    true
                  );
                  if (!props.isSpecificIdsInterface) {
                    props.pushpopTraitValueInputString(null, true, true, true);
                  }
                }}
              >
                &#8647;
                <Tooltip text={"Revert to this word's original tags"} />
              </button>
            )}

            <button
              alt="Plus icon"
              className={`${gstyles.sideButton} ${gstyles.purpleButton} ${gstyles.tooltipHolderDelayed1s}`}
              onClick={() => {
                fetchWordsByTags(true);
              }}
            >
              &#43;
              <Tooltip text={"Get frequency for these words"} />
            </button>
          </div>

          {[props.traitValueInputString, props.traitValueInputString2].map(
            (traitValueInputString, index) => {
              const heading = ["Select And-Tags", "Select Or-Tags"][index];
              const isSecondary = index === 1;

              if (props.isSpecificIdsInterface && isSecondary) {
                return (
                  <div key={"Specific IDs"} className={styles.heading}>
                    <div className={`${styles.div1Short}`}>
                      <h1>{"Specific IDs"}</h1>
                    </div>
                    <div className={`${styles.etiquetteHolderLong}`}>
                      {diUtils.asArray(traitValueInputString).map((tag) => (
                        <div
                          onClick={() => {
                            props.pushpopTraitValueInputString(
                              tag,
                              false,
                              false
                            );
                          }}
                          className={`${styles.etiquetteSmall} ${styles.etiquetteClickable}`}
                          key={tag}
                        >
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <div key={heading} className={styles.heading}>
                  <div className={styles.div1}>
                    <h1>{heading}</h1>

                    <select
                      className={styles.tagSelector}
                      name="tag"
                      onClick={(e) => {
                        e.preventDefault();
                        if (props.isSpecificIdsInterface) {
                          props.traitValueInputString.push(e.target.value);
                          setMeaninglessCounter((prev) => prev + 1);
                          return;
                        }

                        props.pushpopTraitValueInputString(
                          e.target.value,
                          true,
                          isSecondary
                        );
                      }}
                    >
                      {/* <option value="" disabled selected>...</option> */}
                      {tags
                        .filter(
                          (tag) =>
                            !diUtils
                              .asArray(traitValueInputString)
                              .includes(tag)
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
                          if (props.isSpecificIdsInterface) {
                            if (props.traitValueInputString.includes(tag)) {
                              let indexToSplice =
                                props.traitValueInputString.indexOf(tag);
                              props.traitValueInputString.splice(
                                indexToSplice,
                                1
                              );
                            } else {
                              props.traitValueInputString.push(tag);
                            }
                            setMeaninglessCounter((prev) => prev + 1);
                            return;
                          }

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

        <div
          className={`${
            props.isSpecificIdsInterface
              ? styles.rightDivNarrow
              : styles.rightDiv
          }`}
        >
          <div className={styles.div3}>
            <div className={styles.wordtypeButtonsHolder}>
              {idUtils.wordtypes.map((wordtype) => {
                return (
                  <button
                    key={wordtype}
                    className={`${gstyles[wordtype]} ${styles.wordtypeButton} ${
                      focusedWordtype === wordtype &&
                      styles.wordtypeButtonSelected
                    }`}
                    onClick={() => {
                      setFocusedWordtype(wordtype);
                    }}
                  >
                    {wordtype}
                  </button>
                );
              })}
            </div>
            <div className={styles.tableHolder}>
              <LemmasTable
                setFocusedWordtype={setFocusedWordtype}
                focusedWordtype={focusedWordtype}
                fetchedWordsByWordtype={fetchedWordsByWordtype}
                setFetchedWordsByWordtype={setFetchedWordsByWordtype}
                useClickedId={
                  props.isSpecificIdsInterface ? useClickedId : null
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TagInterface;
