import React, { useEffect, useState } from "react";
import LemmasTable from "./LemmasTable.jsx";
import Tooltip from "../Cogs/Tooltip.jsx";
import styles from "../css/TagInterface.module.css";
import gstyles from "../css/Global.module.css";
import diUtils from "../utils/displayUtils.js";
import uUtils from "../utils/universalUtils.js";
import $ from "jquery";
import idUtils from "../utils/identityUtils.js";
const getUtils = require("../utils/getUtils.js");

const TagInterface = (props) => {
  const [clickCounter, setClickCounter] = useState(0);
  const [tickDisabled, setTickDisabled] = useState();
  const [tags, setTags] = useState([]);
  const [fetchedWordsByWordtype, setFetchedWordsByWordtype] = useState({});
  const [focusedWordtype, setFocusedWordtype] = useState(props.wordtype);

  const exit = () => {
    $(document).off("keyup");
    props.revertTraitValueInputString(true);
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

  useEffect(() => {
    getUtils
      .fetchWordsByTag(
        props.lang,
        diUtils.asArray(props.traitValueInputString),
        diUtils.asArray(props.traitValueInputString2)
      )
      .then((fetchedWords) => {
        setFetchedWordsByWordtype(fetchedWords);

        setTickDisabled(
          !fetchedWords[props.wordtype] ||
            !fetchedWords[props.wordtype].some(
              (lObj) => lObj.id === props.lObjId
            )
        );
      });
  }, [
    props.traitValueInputString,
    props.traitValueInputString2,
    props.lang,
    props.lObjId,
    props.wordtype,
  ]);

  useEffect(() => {
    getUtils.fetchTags(props.lang).then((fetchedTags) => {
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
      <div id={"TagInterface-mainBox"} className={styles.mainBox}>
        <div className={styles.leftDiv}>
          <div className={styles.buttonHolder}>
            <button
              id="TagInterface-tickbutton"
              alt="Tick icon / Check icon"
              className={`${gstyles.tickButton} 
              ${tickDisabled && gstyles.disabled}
              ${gstyles.tooltipHolderDelayed}
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
              className={`${gstyles.sideButton} ${gstyles.redButton} ${gstyles.tooltipHolderDelayed}`}
              onClick={exit}
            >
              &times;
              <Tooltip text={"Exit without saving"} />
            </button>

            <button
              alt="Undo icon"
              className={`${gstyles.sideButton} ${gstyles.blueButton} ${gstyles.tooltipHolderDelayed}`}
              onClick={() => {
                props.revertTraitValueInputString();
                props.revertTraitValueInputString(true);
              }}
            >
              &#8634;
              <Tooltip text={"Undo changes"} />
            </button>

            <button
              alt="Reset icon"
              className={`${gstyles.sideButton} ${gstyles.blueButton} ${gstyles.tooltipHolderDelayed}`}
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
              <Tooltip text={"Revert to this word's original tags"} />
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
              {Object.keys(fetchedWordsByWordtype).map((wordtype) => {
                let count = fetchedWordsByWordtype[wordtype].length;
                return (
                  <button
                    disabled={!count}
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
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TagInterface;
