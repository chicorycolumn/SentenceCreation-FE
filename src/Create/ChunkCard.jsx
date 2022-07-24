import React, { useState, useEffect, useContext } from "react";
import LanguageContext from "../context/LanguageContext.js";
import TraitBox from "./TraitBox.jsx";
import ToggleShowButton from "./ToggleShowButton.jsx";
import Tooltip from "../Cogs/Tooltip.jsx";
import styles from "../css/ChunkCard.module.css";
import gstyles from "../css/Global.module.css";
import diUtils from "../utils/displayUtils.js";
import idUtils from "../utils/identityUtils.js";
const putUtils = require("../utils/putUtils.js");
const getUtils = require("../utils/getUtils.js");
const uUtils = require("../utils/universalUtils.js");

const ChunkCard = (props) => {
  const [lObjs, setLObjs] = useState([]);
  const [noLObjsFetched, setNoLObjsFetched] = useState();
  const [backedUpStructureChunk, setBackedUpStructureChunk] = useState();
  const [chosenId, setChosenId] = useState();
  const [structureChunk, setStructureChunk] = useState(props.structureChunk);
  const [showTraitKeysGroupOne, setShowTraitKeysGroupOne] = useState(true);
  const [showTraitKeysGroupTwo, setShowTraitKeysGroupTwo] = useState();

  const [traitKeysGroup1, setTraitKeysGroup1] = useState([]);
  const [traitKeysGroup2, setTraitKeysGroup2] = useState([]);
  const [wordtype, setWordtype] = useState();
  const [chunkId, setChunkId] = useState();

  const [shouldRetryFetch, setShouldRetryFetch] = useState(0);

  const lang1 = useContext(LanguageContext);
  const setStructureChunkAndFormula = (newStCh) => {
    setStructureChunk(newStCh);
    props.setFormula((prevFormula) => {
      return prevFormula.map((formulaItem, index) => {
        if (index === props.index) {
          formulaItem.structureChunk = newStCh;
        }
        return formulaItem;
      });
    });
  };

  useEffect(() => {
    let fetchedLObjs = lObjs;

    if (structureChunk) {
      console.log(`Already done "${props.word}" actually.`);
      return;
    }

    if (props.word[0] === "*") {
      let stCh = idUtils.createFixedChunkFormulaItem(
        props.word,
        props.index,
        props.formula
      );

      setStructureChunkAndFormula(stCh);
      setBackedUpStructureChunk(uUtils.copyWithoutReference(stCh));
      props.editLemma(props.word.slice(1), stCh.chunkId.traitValue, stCh);
      return;
    }

    if (fetchedLObjs && fetchedLObjs.length) {
      let stCh = fetchedLObjs[0];
      if (fetchedLObjs.length > 1) {
        if (!chosenId) {
          let idFromPrompt = prompt(
            `\n"${props.formula
              .map((formulaItem, i) =>
                i === props.chunkCardIndex
                  ? formulaItem.word.toUpperCase()
                  : i === 0
                  ? uUtils.capitaliseFirst(formulaItem.word)
                  : formulaItem.word
              )
              .join(" ")}."\n\nWhich ${props.word.toUpperCase()} of these ${
              fetchedLObjs.length
            } matches are you after?\n\n(Hint: Look at the wordtype)`,
            fetchedLObjs.map((lObj) => lObj.id).join("|")
          );
          setChosenId(idFromPrompt);
        }
        let matchingStChs = fetchedLObjs.filter((lObj) => lObj.id === chosenId);
        if (matchingStChs.length === 1) {
          stCh = matchingStChs[0];
        } else {
          return;
        }
      }
      let idSplit = stCh.id.split("-");
      stCh.chunkId.traitValue = `${idSplit[1]}-${
        props.chunkCardIndex
      }${idSplit[2].split("").reverse().join("")}-${stCh.lemma}`;

      setStructureChunkAndFormula(stCh);
      setBackedUpStructureChunk(uUtils.copyWithoutReference(stCh));
    }
  }, [
    lObjs,
    props.chunkCardIndex,
    props.word,
    structureChunk,
    props.formula,
    chosenId,
  ]);

  useEffect(() => {
    console.log(1410, props.word);
    if (lang1 && (!structureChunk || !idUtils.isFixedChunk(structureChunk))) {
      console.log(14100, props.word);

      getUtils
        .fetchLObjsByLemma(lang1, props.word)
        .then(
          (fetchedLObjs) => {
            console.log(
              `Received ${fetchedLObjs.length} lObjs for "${props.word}".`
            );
            setLObjs(fetchedLObjs);
            setNoLObjsFetched(!fetchedLObjs.length);
          },
          (error) => {
            console.log("ERROR 0307:", error);
          }
        )
        .catch((e) => {
          console.log(1709, e);
        });
    }
  }, [lang1, props.word, shouldRetryFetch]);

  useEffect(() => {
    if (structureChunk) {
      let { orderedTraitKeysGroup1, orderedTraitKeysGroup2, wordtypeFromStCh } =
        diUtils.orderTraitKeys(structureChunk);
      setTraitKeysGroup1(orderedTraitKeysGroup1);
      setTraitKeysGroup2(orderedTraitKeysGroup2);
      setWordtype(wordtypeFromStCh);
      setChunkId(structureChunk.chunkId.traitValue);
    }
  }, [structureChunk]);

  let isFixedChunkOrNoChunk =
    !structureChunk || idUtils.isFixedChunk(structureChunk);

  return (
    <div
      className={`${styles.card} ${noLObjsFetched && styles.shortCard} ${
        wordtype && gstyles[wordtype]
      } ${
        props.highlightedCard &&
        props.highlightedCard !== chunkId &&
        gstyles.translucent
      }`}
      id={props.chunkCardKey}
    >
      <div className={styles.cardButtonsHolder}>
        {noLObjsFetched ? (
          <>
            <button
              alt="Letter F in circle icon"
              className={`${gstyles.cardButton1} ${gstyles.tooltipHolderDelayed}`}
              onClick={(e) => {
                e.target.blur();
                if (
                  window.confirm(
                    `Do you want to make "${props.word}" a fixed chunk? You'd better be sure this is an actual word and not one you mistyped.`
                  )
                ) {
                  props.editLemma("*" + props.word);
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
                    chunkId || props.word
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
                putUtils.fetchSentence(lang1, [structureChunk]).then(
                  (fetchedDataObj) => {
                    if (fetchedDataObj.messages) {
                      alert(
                        Object.keys(fetchedDataObj.messages).map((key) => {
                          let val = fetchedDataObj.messages[key];
                          return `${key}:       ${val}`;
                        })
                      );
                      props.setHighlightedCard();
                      return;
                    }

                    let fetchedData = fetchedDataObj.data;

                    props.setPopup({
                      title: `${fetchedData.length} lemma${
                        fetchedData.length > 1 ? "s" : ""
                      } for "${chunkId}" with traits you specified`,
                      headers: ["lemma", "id"],
                      rows: fetchedData.map((obj) => [
                        obj.selectedWord,
                        obj.lObjID,
                      ]),
                    });
                  },
                  (error) => {
                    console.log("ERROR 0302:", error);
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
                      `Reset all traits on this chunk (${chunkId})?`
                    )
                  ) {
                    setStructureChunkAndFormula(null);
                  }
                  props.setHighlightedCard();
                }, 0);
              }}
            >
              &#8647;
              <Tooltip text="Reset" />
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
                window.confirm(`Delete this chunk "${chunkId || props.word}"?`)
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
      <h1
        onClick={() => {
          //devlogging
          console.log("");
          console.log("structureChunk:", structureChunk);
          console.log("");
          console.log("structureChunk keys:");
          if (structureChunk) {
            Object.keys(structureChunk).forEach((traitKey) => {
              let traitObject = structureChunk[traitKey];
              if (!uUtils.isEmpty(traitObject.traitValue)) {
                console.log(traitKey, traitObject.traitValue);
              }
            });
          }
        }}
        className={styles.lemma}
      >
        {props.word}
      </h1>
      <p className={`${styles.wordtype} ${gstyles.tooltipHolderDelayed}`}>
        {structureChunk && structureChunk.id}
        <Tooltip text="lemma ID (of an example lemma)" />
      </p>
      {structureChunk && (
        <div className={styles.traitBoxesHolder}>
          <ToggleShowButton
            id={`ToggleShowButton-${props.batch}-Group1-${props.chunkCardIndex}`}
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

              return (
                !diUtils.traitsToNotDisplayInOwnBox.includes(traitKey) &&
                (traitKey === "chunkId" ||
                  !idUtils.isFixedChunk(structureChunk)) && (
                  <TraitBox
                    chunkId={chunkId}
                    chunkCardKey={props.chunkCardKey}
                    key={`${props.chunkCardKey}-${traitKey}`}
                    traitKey={traitKey}
                    traitKey2={traitKey2}
                    traitObject={traitObject}
                    traitObject2={traitObject2}
                    lObjId={structureChunk.id}
                    word={props.word}
                    setStructureChunkAndFormula={setStructureChunkAndFormula}
                    structureChunk={structureChunk}
                    wordtype={wordtype}
                    setElementsToDrawLinesBetween={
                      props.setElementsToDrawLinesBetween
                    }
                    flowerSearchingForStemBrace={
                      props.flowerSearchingForStemBrace
                    }
                    stemFoundForFlowerBrace={props.stemFoundForFlowerBrace}
                    backedUpStructureChunk={backedUpStructureChunk}
                    setHighlightedCard={props.setHighlightedCard}
                  />
                )
              );
            })}
          {!idUtils.isFixedChunk(structureChunk) && (
            <ToggleShowButton
              id={`ToggleShowButton-${props.batch}-Group2-${props.chunkCardIndex}`}
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
                !diUtils.traitsToNotDisplayInOwnBox.includes(traitKey) &&
                !idUtils.isFixedChunk(structureChunk) && (
                  <TraitBox
                    key={traitKey}
                    traitKey={traitKey}
                    chunkCardKey={props.chunkCardKey}
                    traitObject={structureChunk[traitKey]}
                    word={props.word}
                    setStructureChunkAndFormula={setStructureChunkAndFormula}
                    structureChunk={structureChunk}
                    setHighlightedCard={props.setHighlightedCard}
                  />
                )
            )}
        </div>
      )}
    </div>
  );
};

export default ChunkCard;
