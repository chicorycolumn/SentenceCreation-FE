import React, { useState, useEffect, useContext } from "react";
import LanguageContext from "../context/LanguageContext.js";
import TraitBox from "./TraitBox.jsx";
import ToggleShowButton from "./ToggleShowButton.jsx";
import Tooltip from "../Cogs/Tooltip.jsx";
import Prompt from "../Cogs/Prompt.jsx";
import styles from "../css/ChunkCard.module.css";
import gstyles from "../css/Global.module.css";
import diUtils from "../utils/displayUtils.js";
import idUtils from "../utils/identityUtils.js";
const putUtils = require("../utils/putUtils.js");
const getUtils = require("../utils/getUtils.js");
const uUtils = require("../utils/universalUtils.js");
const consol = require("../utils/loggingUtils.js");

const ChunkCard = (props) => {
  const [fetchedEnChsByLemma, setFetchedEnChsByLemma] = useState([]);
  const [noEnChsFetched, setNoEnChsFetched] = useState();
  const [chosenId, setChosenId] = useState();
  const [structureChunk, setStructureChunk] = useState(props.structureChunk);
  const [showTraitKeysGroupOne, setShowTraitKeysGroupOne] = useState(true);
  const [showTraitKeysGroupTwo, setShowTraitKeysGroupTwo] = useState();

  const [traitKeysGroup1, setTraitKeysGroup1] = useState([]);
  const [traitKeysGroup2, setTraitKeysGroup2] = useState([]);
  const [chunkId, setChunkId] = useState();

  const [shouldRetryFetch, setShouldRetryFetch] = useState(0);
  const [promptData, setPromptData] = useState();

  const [meaninglessCounterTraitBox, setMeaninglessCounterTraitBox] =
    useState(0);

  const lang1 = useContext(LanguageContext);

  const modifyStructureChunkOnThisFormulaItem = (newStCh, shouldBackUp) => {
    if (shouldBackUp) {
      if (!newStCh) {
        throw "Woah there";
      }
      props.backUpStCh(newStCh);
    }

    console.log("modifyStructureChunkOnThisFormulaItem", newStCh);
    console.log("props.formulaItemId", props.formulaItemId);

    setStructureChunk(newStCh); // This should be unnec, right?
    props.setStructureChunkOnFormula(newStCh);
  };

  const formatAndSetStructureChunk = (stCh, formula, guideword, label) => {
    console.log("formatAndSetStructureChunk", label, guideword);

    if (!guideword) {
      guideword = "blank";
    }

    if (!stCh.chunkId.traitValue) {
      diUtils.addChunkId(stCh, props.chunkCardIndex, guideword, formula);
    }
    modifyStructureChunkOnThisFormulaItem(stCh, true);
  };

  const regulateTraitKey = (tKey, regulationGroup) => {
    let regulatedTraitKeys = structureChunk[regulationGroup].traitValue.slice();
    if (regulatedTraitKeys.includes(tKey)) {
      regulatedTraitKeys = regulatedTraitKeys.filter((tk) => tk !== tKey);
    } else if (!regulatedTraitKeys.includes(tKey)) {
      regulatedTraitKeys.push(tKey);
    }

    structureChunk[regulationGroup].traitValue = regulatedTraitKeys;

    modifyStructureChunkOnThisFormulaItem(structureChunk);
  };

  useEffect(() => {
    if (chosenId) {
      setPromptData();
      let matches = fetchedEnChsByLemma.filter((lObj) => lObj.id === chosenId);
      if (matches.length === 1) {
        formatAndSetStructureChunk(
          matches[0],
          props.formula,
          props.guideword,
          "chosenId useEffect"
        );
        setFetchedEnChsByLemma([]);
        setChosenId();
      } else {
        alert(
          `There are ${matches.length} matches for "${chosenId}". I expected 1 so unsure how to proceed.`
        );
      }
    }
  }, [chosenId]);

  useEffect(() => {
    if (structureChunk) {
      console.log(`Already did "${props.guideword}".`);
      return;
    }

    if (props.guideword[0] === "*") {
      let stCh = idUtils.createFixedChunk(
        props.guideword,
        props.chunkCardIndex,
        props.formula
      );

      modifyStructureChunkOnThisFormulaItem(stCh, true);
      props.editLemma(props.guideword.slice(1), stCh.chunkId.traitValue, stCh);
      return;
    }

    if (fetchedEnChsByLemma.length === 1) {
      let chosenEnCh = fetchedEnChsByLemma[0];
      formatAndSetStructureChunk(
        chosenEnCh,
        props.formula,
        props.guideword,
        "fetchedEnChsByLemma.length===1 useEffect"
      );
      setFetchedEnChsByLemma([]);
      return;
    }

    if (fetchedEnChsByLemma.length > 1 && !chosenId) {
      let title = `"${props.guideword}"`;
      let message = `Which of these ${fetchedEnChsByLemma.length} are you after?`;

      let options = fetchedEnChsByLemma.map((lObj) => {
        let extraInfo = lObj.andTags.traitValue.slice();
        if (lObj._info.allohomInfo) {
          extraInfo.unshift(
            lObj._info.allohomInfo.text + " " + lObj._info.allohomInfo.emoji
          );
        }

        return {
          text: lObj.id,
          color: gstyles[lObj.id.split("-")[1]],
          extraInfo,
          callback: () => {
            setChosenId(lObj.id);
          },
        };
      });

      setPromptData({ message, options, title });
      return;
    }
  }, [
    fetchedEnChsByLemma,
    props.guideword,
    structureChunk,
    props.formula,
    chosenId,
  ]);

  useEffect(() => {
    if (lang1 && !structureChunk) {
      getUtils
        .fetchEnChsByLemma(lang1, props.guideword)
        .then(
          (fetchedEnChs) => {
            console.log(
              `"${props.guideword}" got ${fetchedEnChs.length} fetchedEnChs.`
            );
            setFetchedEnChsByLemma(fetchedEnChs);
            setNoEnChsFetched(!fetchedEnChs.length);
          },
          (e) => {
            console.log("ERROR 0370:", e);
          }
        )
        .catch((e) => {
          console.log("ERROR 9071", e);
        });
    }
  }, [lang1, props.guideword, shouldRetryFetch]);

  useEffect(() => {
    if (structureChunk) {
      let { orderedTraitKeysGroup1, orderedTraitKeysGroup2 } =
        diUtils.orderTraitKeys(structureChunk);
      setTraitKeysGroup1(orderedTraitKeysGroup1);
      setTraitKeysGroup2(orderedTraitKeysGroup2);
      setChunkId(structureChunk.chunkId.traitValue);
    } else if (props.backedUpStructureChunk) {
      // Restore stCh from backup. (unrelated to above clause)
      modifyStructureChunkOnThisFormulaItem(
        uUtils.copyWithoutReference(props.backedUpStructureChunk)
      );
    }
  }, [structureChunk]);

  useEffect(() => {
    if (props.formulaWasLoaded) {
      formatAndSetStructureChunk(
        structureChunk,
        props.formula,
        props.guideword,
        "formulaWasLoaded useEffect"
      );
      setTimeout(() => {
        props.setFormulaWasLoaded(0);
      }, 500);
    }
  }, [props.formulaWasLoaded]);

  let isFixedChunkOrNoChunk =
    !structureChunk || idUtils.isFixedChunk(structureChunk);

  let hasSpecificId =
    structureChunk &&
    structureChunk.specificIds &&
    structureChunk.specificIds.traitValue &&
    structureChunk.specificIds.traitValue.length;

  return (
    <div
      className={`${styles.card} 
      ${noEnChsFetched && styles.shortCard}
      ${noEnChsFetched && styles.needsAttention}
      ${
        structureChunk &&
        gstyles[idUtils.getWordtypeShorthandStCh(structureChunk)]
      } 
      ${
        props.highlightedCard &&
        props.highlightedCard !== chunkId &&
        gstyles.translucent
      }`}
      id={props.chunkCardKey}
    >
      {promptData && <Prompt data={promptData} />}
      <div className={styles.cardButtonsHolder}>
        {noEnChsFetched ? (
          <>
            <button
              alt="Letter F in circle icon"
              className={`${gstyles.cardButton1} ${gstyles.tooltipHolderDelayed}`}
              onClick={(e) => {
                e.target.blur();
                if (
                  window.confirm(
                    `Do you want to make "${props.guideword}" a fixed chunk? You'd better be sure this is an actual word and not one you mistyped.`
                  )
                ) {
                  props.editLemma("*" + props.guideword);
                }
              }}
            >
              &#9403;
              <Tooltip text="Make this a fixed chunk" />
            </button>
            <button
              alt="Download icon"
              className={`${gstyles.cardButton1} ${gstyles.tooltipHolderDelayed}`}
              onClick={(e) => {
                e.target.blur();
                alert(
                  `Will retry find lemma objects for "${
                    chunkId || props.guideword
                  }".`
                );
                setShouldRetryFetch((prev) => prev + 1);
              }}
            >
              &#10515;
              <Tooltip text="Retry find lemma objects" />
            </button>
          </>
        ) : (
          <>
            <button
              alt="Star icon"
              disabled={isFixedChunkOrNoChunk}
              className={`${gstyles.cardButton1} ${
                gstyles.tooltipHolderDelayed
              } ${isFixedChunkOrNoChunk && gstyles.disabled}`}
              onClick={(e) => {
                e.target.blur();
                props.setHighlightedCard(chunkId);

                let formula = { sentenceStructure: [structureChunk] };

                putUtils.fetchSentence(lang1, formula).then(
                  (data) => {
                    let { payload, messages } = data;

                    if (messages) {
                      alert(
                        Object.keys(messages).map((key) => {
                          let val = messages[key];
                          return `${key}:       ${val}`;
                        })
                      );
                      props.setHighlightedCard();
                      return;
                    }

                    props.setPopup({
                      title: `${payload.length} lemma${
                        payload.length > 1 ? "s" : ""
                      } for "${chunkId}" with traits you specified`,
                      headers: ["lemma", "id"],
                      rows: payload.map((obj) => [
                        obj.selectedWord,
                        obj.lObjID,
                      ]),
                    });
                  },
                  (e) => {
                    console.log("ERROR 0302:", e);
                  }
                );
              }}
            >
              &#9733;
              <Tooltip text="Query word" />
            </button>
            <button
              alt="Reset icon"
              disabled={isFixedChunkOrNoChunk}
              className={`${gstyles.cardButton1} ${
                gstyles.tooltipHolderDelayed
              } ${isFixedChunkOrNoChunk && gstyles.disabled}`}
              onClick={(e) => {
                e.target.blur();
                props.setHighlightedCard(chunkId);
                setTimeout(() => {
                  if (
                    window.confirm(
                      `Reset all traits (excluding andTags/orTags) on this chunk (${chunkId})?`
                    )
                  ) {
                    modifyStructureChunkOnThisFormulaItem(null);
                  }
                  props.setHighlightedCard();
                }, 0);
              }}
            >
              &#8647;
              <Tooltip text="Reset" />
            </button>
            <button
              alt="Dotted circle icon"
              disabled={isFixedChunkOrNoChunk}
              className={`${gstyles.cardButton1} ${
                gstyles.tooltipHolderDelayed
              } ${isFixedChunkOrNoChunk && gstyles.disabled} ${
                structureChunk &&
                structureChunk.isGhostChunk &&
                gstyles.cardButton1Active
              }`}
              onClick={(e) => {
                e.target.blur();
                structureChunk.isGhostChunk = !structureChunk.isGhostChunk;
                modifyStructureChunkOnThisFormulaItem(structureChunk);
              }}
            >
              &#9676;
              <Tooltip text="Make this a ghost chunk" />
            </button>
            <button
              alt="Squares icon"
              className={`${gstyles.cardButton1} ${gstyles.tooltipHolderDelayed}`}
              onClick={(e) => {
                e.target.blur();
                props.setHighlightedCard(chunkId);
                setTimeout(() => {
                  alert(
                    "Let's connect chunk cards from Question sentence to their counterparts in Answer sentence."
                  );
                  props.setHighlightedCard();
                }, 0);
              }}
            >
              &#10697;
              <Tooltip text="Connect to Answer sentence" />
            </button>
          </>
        )}

        <button
          alt="Pencil icon"
          className={`${gstyles.cardButton1} ${gstyles.tooltipHolderDelayed}`}
          onClick={(e) => {
            e.target.blur();
            props.setHighlightedCard(chunkId);
            setTimeout(() => {
              let newLemma = prompt("Enter new lemma.");
              if (newLemma) {
                props.editLemma(newLemma, chunkId);
              }
              props.setHighlightedCard();
            }, 0);
          }}
        >
          &#9998;
          <Tooltip text="Change word" />
        </button>
        <button
          alt="Cross icon"
          className={`${gstyles.cardButton1} ${gstyles.tooltipHolderDelayed}`}
          onClick={(e) => {
            e.target.blur();
            props.setHighlightedCard(chunkId);
            setTimeout(() => {
              if (
                window.confirm(
                  `Delete this chunk "${chunkId || props.guideword}"?`
                )
              ) {
                props.editLemma(null, chunkId);
              }
              props.setHighlightedCard();
            }, 0);
          }}
        >
          &times;
          <Tooltip text="Delete" />
        </button>
      </div>
      <div className={styles.lemmaHolder}>
        <h1
          onClick={() => {
            consol.logChunkCard(props, structureChunk); //devlogging
          }}
          className={`
          ${styles.lemma} 
          ${
            structureChunk &&
            structureChunk.isGhostChunk &&
            styles.lemmaGhostChunk
          }
          ${hasSpecificId && gstyles.bold}          
          `}
        >
          {props.guideword}
        </h1>
      </div>

      <div className={`${styles.bottomHolder}`}>
        {structureChunk && (
          <button
            alt="Person face icon"
            className={`${gstyles.cardButton1} ${
              gstyles.tooltipHolderDelayed
            } ${styles.smallButton} ${
              (!structureChunk ||
                !structureChunk.booleanTraits ||
                !structureChunk.booleanTraits.possibleTraitValues.includes(
                  "isPerson"
                )) &&
              gstyles.invisible
            }`}
            onClick={(e) => {
              e.preventDefault();

              let stCh = uUtils.copyWithoutReference(structureChunk);

              if (stCh.booleanTraits.traitValue.includes("isPerson")) {
                stCh.booleanTraits.traitValue =
                  stCh.booleanTraits.traitValue.filter(
                    (booleanTrait) => booleanTrait !== "isPerson"
                  );
              } else {
                stCh.booleanTraits.traitValue.push("isPerson");
              }

              modifyStructureChunkOnThisFormulaItem(stCh);
              setShowTraitKeysGroupTwo(
                !structureChunk.booleanTraits.traitValue.includes("isPerson")
              );
            }}
          >
            {structureChunk.booleanTraits &&
            structureChunk.booleanTraits.traitValue.includes("isPerson") ? (
              <span>&#9865;</span>
            ) : (
              <span>&#9863;</span>
            )}
            <Tooltip
              text="Set this as a person (ie disallow neuter gender)"
              number={5}
            />
          </button>
        )}
        <p className={`${styles.lObjID} ${gstyles.tooltipHolderDelayed}`}>
          {structureChunk && structureChunk.lObjId}
          <Tooltip text="lemma ID (of an example lemma)" />
        </p>
        {structureChunk && !idUtils.isFixedChunk(structureChunk) && (
          <button
            alt="Target bullseye icon"
            className={`${gstyles.cardButton1} ${gstyles.tooltipHolderDelayed} ${styles.smallButton}`}
            onClick={(e) => {
              e.preventDefault();

              let stCh = uUtils.copyWithoutReference(structureChunk);
              let isSecondClick;

              let traitsAffectedBySpecificId = ["andTags", "orTags"];

              if (
                stCh.specificIds.traitValue &&
                stCh.specificIds.traitValue.length
              ) {
                if (stCh.specificIds.traitValue.some((tv) => tv[0] === "^")) {
                  //Third click - remove specificIds.
                  stCh.specificIds.traitValue = [];
                  console.log("Resetting", traitsAffectedBySpecificId);
                  traitsAffectedBySpecificId.forEach((traitKey) => {
                    stCh[traitKey].traitValue =
                      props.backedUpStructureChunk[traitKey].traitValue.slice();
                  });
                } else {
                  //Second click - Upgrade specificIds with ^caret.
                  isSecondClick = true;
                  stCh.specificIds.traitValue =
                    structureChunk.specificIds.traitValue.map((tv) => `^${tv}`);
                }
              } else {
                //First click - Add specificIds.
                stCh.specificIds.traitValue = [stCh.lObjId];
                console.log("Blanking", traitsAffectedBySpecificId);
                traitsAffectedBySpecificId.forEach((traitKey) => {
                  stCh[traitKey].traitValue = [];
                });
              }

              modifyStructureChunkOnThisFormulaItem(stCh);

              if (isSecondClick) {
                setShowTraitKeysGroupTwo(false);
                setTimeout(() => {
                  setShowTraitKeysGroupTwo(true);
                }, 25);
              } else {
                setShowTraitKeysGroupTwo(!hasSpecificId);
              }
            }}
          >
            {hasSpecificId ? (
              structureChunk.specificIds.traitValue.some(
                (tv) => tv[0] === "^"
              ) ? (
                <span>&#11044;</span>
              ) : (
                <span>&#10687;</span>
              )
            ) : (
              <span>&#9678;</span>
            )}
            <Tooltip
              text={`${
                hasSpecificId
                  ? structureChunk.specificIds.traitValue.some(
                      (tv) => tv[0] === "^"
                    )
                    ? "Remove"
                    : "Upgrade"
                  : "Set"
              } as specific lemma for this chunk`}
              number={5}
            />
          </button>
        )}
      </div>
      {structureChunk && (
        <div className={styles.traitBoxesHolder}>
          <ToggleShowButton
            id={`ToggleShowButton-${props.batch}-Group1-${props.formulaItemId}`}
            setShowTraitKeysGroup={setShowTraitKeysGroupOne}
            showTraitKeysGroup={showTraitKeysGroupOne}
            traitKeysHoldSomeValues={traitKeysGroup1.some(
              (traitKey) =>
                structureChunk[traitKey] &&
                !uUtils.isEmpty(structureChunk[traitKey].traitValue)
            )}
          />
          {showTraitKeysGroupOne &&
            traitKeysGroup1.map((traitKey) => {
              let traitObject = structureChunk[traitKey];
              let traitKey2 = null;

              if (traitKey === "andTags") {
                traitKey2 = "orTags";
              }

              let traitObject2 = traitKey2 ? structureChunk[traitKey2] : null;

              const getTraitRegulatorValues = () => {
                let obj = {};

                idUtils.traitKeyRegulators.forEach((traitRegulator) => {
                  if (!traitRegulator.name) {
                    return;
                  }

                  obj[traitRegulator.name] = structureChunk[traitRegulator.name]
                    ? structureChunk[traitRegulator.name].traitValue
                    : [];
                });

                return obj;
              };

              let traitRegulatorValues = getTraitRegulatorValues();

              return (
                !diUtils.traitsNotToDisplayInOwnBox.includes(traitKey) &&
                (traitKey === "chunkId" ||
                  !idUtils.isFixedChunk(structureChunk)) && (
                  <TraitBox
                    traitKeysGroup={1}
                    chunkId={chunkId}
                    chunkCardKey={props.chunkCardKey}
                    key={`${props.chunkCardKey}-${traitKey}`}
                    traitKey={traitKey}
                    traitKey2={traitKey2}
                    traitObject={traitObject}
                    traitObject2={traitObject2}
                    lObjId={structureChunk.lObjId}
                    guideword={props.guideword}
                    modifyStructureChunkOnThisFormulaItem={
                      modifyStructureChunkOnThisFormulaItem
                    }
                    regulateTraitKey={regulateTraitKey}
                    traitRegulatorValues={traitRegulatorValues}
                    structureChunk={structureChunk}
                    backedUpStructureChunk={props.backedUpStructureChunk}
                    setElementsToDrawLinesBetween={
                      props.setElementsToDrawLinesBetween
                    }
                    flowerSearchingForStemBrace={
                      props.flowerSearchingForStemBrace
                    }
                    stemFoundForFlowerBrace={props.stemFoundForFlowerBrace}
                    setHighlightedCard={props.setHighlightedCard}
                    setPopup={props.setPopup}
                    meaninglessCounterTraitBox={meaninglessCounterTraitBox}
                    setMeaninglessCounterTraitBox={
                      setMeaninglessCounterTraitBox
                    }
                    disabled={idUtils.isTagTrait(traitKey) && hasSpecificId}
                  />
                )
              );
            })}
          {!idUtils.isFixedChunk(structureChunk) && (
            <ToggleShowButton
              id={`ToggleShowButton-${props.batch}-Group2-${props.formulaItemId}`}
              setShowTraitKeysGroup={setShowTraitKeysGroupTwo}
              showTraitKeysGroup={showTraitKeysGroupTwo}
              traitKeysHoldSomeValues={traitKeysGroup2.some(
                (traitKey) =>
                  structureChunk[traitKey] &&
                  !uUtils.isEmpty(structureChunk[traitKey].traitValue)
              )}
            />
          )}
          {showTraitKeysGroupTwo &&
            traitKeysGroup2.map(
              (traitKey) =>
                !diUtils.traitsNotToDisplayInOwnBox.includes(traitKey) &&
                !idUtils.isFixedChunk(structureChunk) && (
                  <TraitBox
                    traitKeysGroup={2}
                    key={traitKey}
                    traitKey={traitKey}
                    chunkCardKey={props.chunkCardKey}
                    traitObject={structureChunk[traitKey]}
                    guideword={props.guideword}
                    modifyStructureChunkOnThisFormulaItem={
                      modifyStructureChunkOnThisFormulaItem
                    }
                    structureChunk={structureChunk}
                    backedUpStructureChunk={props.backedUpStructureChunk}
                    setHighlightedCard={props.setHighlightedCard}
                    setPopup={props.setPopup}
                  />
                )
            )}
        </div>
      )}
    </div>
  );
};

export default ChunkCard;
