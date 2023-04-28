import React, { useState, useEffect, useContext } from "react";
import LanguageContext from "../context/LanguageContext.js";
import TraitBox from "./TraitBox.jsx";
import ToggleShowButton from "./ToggleShowButton.jsx";
import Tooltip from "../Cogs/Tooltip.jsx";
import Prompt from "../Cogs/Prompt.jsx";
import styles from "../css/ChunkCard.module.css";
import gstyles from "../css/Global.module.css";
import diUtils from "../utils/displayUtils.js";
import idUtils, {
  getWordtypeEnCh,
  isFixedChunk,
} from "../utils/identityUtils.js";
const putUtils = require("../utils/putUtils.js");
const getUtils = require("../utils/getUtils.js");
const uUtils = require("../utils/universalUtils.js");
const consol = require("../utils/loggingUtils.js");
const scUtils = require("../utils/structureChunkUtils.js");
const uiUtils = require("../utils/userInputUtils.js");

const ChunkCard = (props) => {
  const [fetchedEnChsByLemma, setFetchedEnChsByLemma] = useState([]);
  const [noEnChsFetched, setNoEnChsFetched] = useState();
  const [chosenId, setChosenId] = useState();
  const [showTraitKeysGroupOne, setShowTraitKeysGroupOne] = useState(true);
  const [showTraitKeysGroupTwo, setShowTraitKeysGroupTwo] = useState();

  const [traitKeysGroup1, setTraitKeysGroup1] = useState([]);
  const [traitKeysGroup2, setTraitKeysGroup2] = useState([]);
  const [chunkId, setChunkId] = useState();

  const [shouldRetryFetch, setShouldRetryFetch] = useState(0);
  const [promptData, setPromptData] = useState();
  const [chunkCardInfo, setChunkCardInfo] = useState([]);

  const { lang1, lang2, beEnv } = idUtils.getLangsAndEnv(
    useContext(LanguageContext)
  );

  const refreshTraitBoxInputs = (traitKeysGroup) => {
    if (![1, 2].includes(traitKeysGroup)) {
      return;
    }

    let setShowTraitKeys =
      traitKeysGroup === 1
        ? setShowTraitKeysGroupOne
        : setShowTraitKeysGroupTwo;

    setTimeout(() => {
      setShowTraitKeys(false);
      setTimeout(() => {
        setShowTraitKeys(true);
      }, 50);
    }, 50);
  };

  const modifyStructureChunkOnThisFemulaItem = (
    label,
    newStCh,
    shouldBackUp
  ) => {
    console.log(
      `START modifyStructureChunkOnThisFemulaItem from "${label}" with args:`,
      { newStCh, shouldBackUp }
    );

    if (shouldBackUp) {
      if (!newStCh) {
        throw "Woah there";
      }
      props.backUpStCh(newStCh);
    }

    props.setStructureChunkOnFemula(newStCh);
  };

  const formatAndSetStructureChunk = (stCh, femula, guideword, label) => {
    console.log(`START formatAndSetStructureChunk from "${label}" with args:`, {
      stCh,
      femula,
      guideword,
    });

    guideword = scUtils.improveGuideword(guideword, stCh);

    if (!stCh.chunkId.traitValue) {
      diUtils.addChunkId(stCh, props.chunkCardIndex, guideword, femula, label);
    }
    modifyStructureChunkOnThisFemulaItem(
      "formatAndSetStructureChunk",
      stCh,
      true
    );
  };

  const regulateTraitKey = (tKey, regulationGroup) => {
    let regulatedTraitKeys =
      props.structureChunk[regulationGroup].traitValue.slice();
    if (regulatedTraitKeys.includes(tKey)) {
      regulatedTraitKeys = regulatedTraitKeys.filter((tk) => tk !== tKey);
    } else if (!regulatedTraitKeys.includes(tKey)) {
      regulatedTraitKeys.push(tKey);
    }

    props.structureChunk[regulationGroup].traitValue = regulatedTraitKeys;

    modifyStructureChunkOnThisFemulaItem(
      "regulateTraitKey",
      props.structureChunk
    );
  };

  useEffect(() => {
    if (chosenId) {
      console.log("Begin useEffect CC1");
      setPromptData();
      let matches = fetchedEnChsByLemma.filter(
        (enCh) => enCh.lObjId === chosenId
      );
      if (matches.length === 1) {
        formatAndSetStructureChunk(
          matches[0],
          props.femula,
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
    console.log("Begin useEffect CC2");
    if (props.structureChunk) {
      if (!isFixedChunk(props.structureChunk) && !props.structureChunk.lObjId) {
        console.log(
          "NOTE 750 Didn't expect to ever reach this clause. " +
            props.structureChunk.chunkId.traitValue
        );
      }

      console.log(
        `Already did "${consol.log1(props)}", halting useEffect CC2.`
      );
      return;
    }

    if (props.guideword[0] === "*") {
      let stCh = idUtils.createFixedChunk(
        props.guideword,
        props.chunkCardIndex,
        props.femula
      );

      modifyStructureChunkOnThisFemulaItem(
        "createFixedChunk useEffect CC2",
        stCh,
        true
      );
      return;
    }

    if (fetchedEnChsByLemma.length === 1) {
      let chosenEnCh = fetchedEnChsByLemma[0];
      formatAndSetStructureChunk(
        chosenEnCh,
        props.femula,
        props.guideword,
        "fetchedEnChsByLemma.length===1 useEffect CC2"
      );
      setFetchedEnChsByLemma([]);
      return;
    }

    if (fetchedEnChsByLemma.length > 1 && !chosenId) {
      let title = `"${consol.log1(props)}"`;
      let message = `Which of these ${fetchedEnChsByLemma.length} are you after?`;

      let options = fetchedEnChsByLemma.map((enCh) => {
        let extraInfo = enCh.andTags.traitValue.slice();
        if (enCh._info.allohomInfo) {
          extraInfo.unshift(
            enCh._info.allohomInfo.text + " " + enCh._info.allohomInfo.emoji
          );
        }

        return {
          text: enCh.lObjId,
          color: gstyles[enCh.lObjId.split("-")[1]],
          extraInfo,
          callback: () => {
            setChosenId(enCh.lObjId);
          },
        };
      });

      setPromptData({ message, options, title });
      return;
    }
  }, [
    fetchedEnChsByLemma,
    props.guideword,
    props.structureChunk,
    props.femula,
    chosenId,
  ]);

  useEffect(() => {
    if (lang1 && !props.structureChunk) {
      getUtils
        .fetchEnChsByLemma(lang1, props.guideword)
        .then(
          (fetchedEnChs) => {
            console.log(
              `"${consol.log1(props)}" got ${fetchedEnChs.length} fetchedEnChs.`
            );
            setFetchedEnChsByLemma(fetchedEnChs);
            setNoEnChsFetched(!fetchedEnChs.length);
          },
          (e) => {
            console.log("ERROR 0570:", e);
          }
        )
        .catch((e) => {
          console.log("ERROR 9171", e);
        });
    }
  }, [lang1, props.guideword, shouldRetryFetch]);

  useEffect(() => {
    // Each of these logic blocks is unrelated.

    if (props.structureChunk) {
      // A. Set trait key groups.
      let { orderedTraitKeysGroup1, orderedTraitKeysGroup2 } =
        diUtils.orderTraitKeys(props.structureChunk);
      setTraitKeysGroup1(orderedTraitKeysGroup1);
      setTraitKeysGroup2(orderedTraitKeysGroup2);
      setChunkId(props.structureChunk.chunkId.traitValue);

      // B. Set chunk card info.
      scUtils.getChunkCardInfo(structureChunk, setChunkCardInfo);
    } else if (props.backedUpStructureChunk) {
      // C. Restore stCh from backup.
      modifyStructureChunkOnThisFemulaItem(
        "useEffect CC4",
        uUtils.copyWithoutReference(props.backedUpStructureChunk)
      );
    }
  }, [props.structureChunk]);

  useEffect(() => {
    if (traitKeysGroup2.length) {
      setTimeout(() => {
        if (
          diUtils.doTraitKeysHoldSomeValues(
            traitKeysGroup2,
            props.structureChunk
          )
        ) {
          setShowTraitKeysGroupTwo(true);
        }
      }, 500);
    }
  }, [traitKeysGroup2]);

  let { structureChunk } = props;

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
      ${structureChunk && gstyles[idUtils.getWordtypeEnCh(structureChunk)]} 
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
                    `Do you want to make "${consol.log1(
                      props
                    )}" a fixed chunk? You'd better be sure this is an actual word and not one you mistyped.`
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
                  `Will retry find lobjs for "${
                    chunkId || consol.log1(props)
                  }".`
                );
                setShouldRetryFetch((prev) => prev + 1);
              }}
            >
              &#10515;
              <Tooltip text="Retry find lobjs" />
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

                let formula = {
                  sentenceStructure: [structureChunk],
                  orders: {},
                };

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
                      title: `${payload.length} Lemma${
                        payload.length > 1 ? "s" : ""
                      } for "${chunkId}" with traits you specified`,
                      headers: ["Lemma", "ID"],
                      rows: payload.map((obj) => [
                        obj.selectedWord,
                        obj.lObjId,
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
                    modifyStructureChunkOnThisFemulaItem("Reset button", null);
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
                modifyStructureChunkOnThisFemulaItem(
                  "Ghost button",
                  structureChunk
                );
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

            let newGuideword = uiUtils.promptGuideword();
            if (newGuideword) {
              props.editLemma(newGuideword, chunkId);
            }

            props.setHighlightedCard();
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
                  `Delete this chunk "${chunkId || consol.log1(props)}"?`
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
        <div
          className={`${styles.chunkCardInfo} ${
            !chunkCardInfo.length && gstyles.invisible
          }`}
        >
          {chunkCardInfo.map((chunkCardInfoObj) => (
            <p
              className={`${styles.chunkCardInfoObj} ${
                chunkCardInfoObj.inactive && gstyles.strikethrough
              }`}
            >
              {chunkCardInfoObj.title}
            </p>
          ))}
        </div>
        <h1
          onClick={() => {
            consol.logChunkCard(props, structureChunk); //devlogging

            console.log("chunkCardInfo");
            chunkCardInfo.forEach((x) => console.log(x));
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

              modifyStructureChunkOnThisFemulaItem("Person button", stCh);
              refreshTraitBoxInputs(2);
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
        <p className={`${styles.lObjId} ${gstyles.tooltipHolderDelayed}`}>
          {structureChunk && structureChunk.lObjId}
          <Tooltip text="lobj ID (of an example lobj)" />
        </p>
        {structureChunk && !idUtils.isFixedChunk(structureChunk) && (
          <button
            alt="Target bullseye icon"
            className={`${gstyles.cardButton1} ${gstyles.tooltipHolderDelayed} ${styles.smallButton}`}
            onClick={(e) => {
              e.preventDefault();

              let newStCh = uUtils.copyWithoutReference(structureChunk);
              let isSecondClick;

              let traitsAffectedBySpecificId = ["andTags", "orTags"];

              if (
                newStCh.specificIds.traitValue &&
                newStCh.specificIds.traitValue.length
              ) {
                if (
                  newStCh.specificIds.traitValue.some((tv) => tv[0] === "^")
                ) {
                  //Third click - remove specificIds.
                  if (getWordtypeEnCh(newStCh) !== "pro") {
                    scUtils.removeSpecificId(
                      newStCh,
                      traitsAffectedBySpecificId,
                      props.backedUpStructureChunk
                    );
                  } else {
                    //Unless it's pronombre in which case not allowed to have no specificIds.
                    scUtils.addSpecificId(newStCh, traitsAffectedBySpecificId);
                  }
                } else {
                  //Second click - Upgrade specificIds with ^caret.
                  isSecondClick = true;
                  scUtils.upgradeSpecificId(newStCh, structureChunk);
                }
              } else {
                //First click - Add specificIds.
                scUtils.addSpecificId(newStCh, traitsAffectedBySpecificId);
              }

              modifyStructureChunkOnThisFemulaItem(
                "SpecificID button",
                newStCh
              );

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
                    ? `${
                        getWordtypeEnCh(structureChunk) === "pro"
                          ? "Downgrade"
                          : "Remove"
                      }`
                    : "Upgrade"
                  : "Set"
              } as specific lobj for this chunk`}
              number={5}
            />
          </button>
        )}
      </div>
      {structureChunk && (
        <div className={styles.traitBoxesHolder}>
          <ToggleShowButton
            id={`ToggleShowButton-${props.batch}-Group1-${props.femulaItemId}`}
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
                    modifyStructureChunkOnThisFemulaItem={
                      modifyStructureChunkOnThisFemulaItem
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
                    meaninglessCounterTraitBox={
                      props.meaninglessCounterTraitBox
                    }
                    setMeaninglessCounterTraitBox={
                      props.setMeaninglessCounterTraitBox
                    }
                    disabled={idUtils.isTagTrait(traitKey) && hasSpecificId}
                    refreshTraitBoxInputs={refreshTraitBoxInputs}
                  />
                )
              );
            })}
          {!idUtils.isFixedChunk(structureChunk) && (
            <ToggleShowButton
              id={`ToggleShowButton-${props.batch}-Group2-${props.femulaItemId}`}
              setShowTraitKeysGroup={setShowTraitKeysGroupTwo}
              showTraitKeysGroup={showTraitKeysGroupTwo}
              traitKeysHoldSomeValues={diUtils.doTraitKeysHoldSomeValues(
                traitKeysGroup2,
                structureChunk
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
                    modifyStructureChunkOnThisFemulaItem={
                      modifyStructureChunkOnThisFemulaItem
                    }
                    structureChunk={structureChunk}
                    backedUpStructureChunk={props.backedUpStructureChunk}
                    setHighlightedCard={props.setHighlightedCard}
                    setPopup={props.setPopup}
                    refreshTraitBoxInputs={refreshTraitBoxInputs}
                  />
                )
            )}
        </div>
      )}
    </div>
  );
};

export default ChunkCard;
