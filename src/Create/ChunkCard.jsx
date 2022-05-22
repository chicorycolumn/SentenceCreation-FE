import React, { useState, useEffect, useContext } from "react";
import styles from "../css/ChunkCard.module.css";
import gstyles from "../css/Global.module.css";
import { fetchLObjsByLemma } from "../utils/getUtils.js";
import { fetchWordByExplicitChunk } from "../utils/putUtils.js";
import LanguageContext from "../context/LanguageContext.js";
import TraitBox from "./TraitBox.jsx";
import ToggleShowButton from "./ToggleShowButton.jsx";
import { testStChs } from "../utils/testData.js";
import diUtils from "../utils/displayUtils.js";
import idUtils from "../utils/identityUtils.js";
const uUtils = require("../utils/universalUtils.js");
const traitsToNotDisplayInOwnBox = ["orTags", "id", "lemma"];

const ChunkCard = (props) => {
  const [lObjs, setLObjs] = useState([]);
  const [backedUpStructureChunk, setBackedUpStructureChunk] = useState();
  const [chosenId, setChosenId] = useState();
  const [structureChunk, setStructureChunk] = useState();
  const [showTraitKeysGroupOne, setShowTraitKeysGroupOne] = useState(true);
  const [showTraitKeysGroupTwo, setShowTraitKeysGroupTwo] = useState();
  const lang1 = useContext(LanguageContext);

  useEffect(() => {
    if (lObjs) {
      let fetchedLObjs = lObjs;

      if (structureChunk) {
        console.log("Already done this one actually.");
        return;
      }

      if (fetchedLObjs.length) {
        let stCh = fetchedLObjs[0];
        if (fetchedLObjs.length > 1) {
          if (!chosenId) {
            let idFromPrompt = prompt(
              `\n"${props.formulaSymbol
                .split(" ")
                .map((el, i) =>
                  i === props.chunkCardIndex
                    ? el.toUpperCase()
                    : i === 0
                    ? uUtils.capitaliseFirst(el)
                    : el
                )
                .join(" ")}."\n\nWhich ${props.word.toUpperCase()} of these ${
                fetchedLObjs.length
              } matches are you after?\n\n(Hint: Look at the wordtype)`,
              fetchedLObjs.map((lObj) => lObj.id).join("|")
            );
            setChosenId(idFromPrompt);
          }
          let matchingStChs = fetchedLObjs.filter(
            (lObj) => lObj.id === chosenId
          );
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

        setStructureChunk(stCh);
        setBackedUpStructureChunk(uUtils.copyWithoutReference(stCh));
      }
    }
  }, [
    lObjs,
    props.chunkCardIndex,
    props.word,
    structureChunk,
    props.formulaSymbol,
    chosenId,
  ]);

  useEffect(() => {
    if (lang1 && props.word) {
      fetchLObjsByLemma(lang1, props.word).then(
        (fetchedLObjs) => {
          setLObjs(fetchedLObjs);
        },
        (error) => {
          console.log("ERROR 0307:", error);
        }
      );
    }
  }, [lang1, props.word]);

  let traitKeysGroup1 = [];
  let traitKeysGroup2 = [];
  let wordtype;
  let chunkId;

  if (structureChunk) {
    let { orderedTraitKeysGroup1, orderedTraitKeysGroup2, wordtypeFromStCh } =
      diUtils.orderTraitKeys(structureChunk);
    traitKeysGroup1 = orderedTraitKeysGroup1;
    traitKeysGroup2 = orderedTraitKeysGroup2;
    wordtype = wordtypeFromStCh;
    chunkId = structureChunk.chunkId.traitValue;
  }

  return (
    <div
      className={`${styles.card} ${wordtype && gstyles[wordtype]}`}
      key={props.word}
    >
      <div className={styles.cardButtonsHolder}>
        <button
          alt="Reset icon"
          className={styles.cardButton}
          onClick={() => {
            if (window.confirm(`Reset this whole chunk (${chunkId})?`)) {
              setStructureChunk(null);
            }
          }}
        >
          &#8647;
        </button>
        <button
          alt="Star icon to query"
          className={styles.cardButton}
          onClick={() => {
            let realStCh = {};

            Object.keys(structureChunk).forEach((traitKey) => {
              if (!idUtils.isAgreeOrConnected(traitKey)) {
                let { traitValue } = structureChunk[traitKey];
                if (traitValue && traitValue.length) {
                  realStCh[traitKey] = traitValue;
                }
              }
            });

            fetchWordByExplicitChunk(lang1, realStCh).then(
              (fetchedData) => {
                console.log(fetchedData);
                alert(
                  `Fetched ${fetchedData.length} lemma${
                    fetchedData.length > 1 ? "s" : ""
                  } for chunk "${chunkId}" with the traits you've specified:\n\n` +
                    fetchedData
                      .map(
                        (obj) => `${obj.lObjID}            ${obj.selectedWord}`
                      )
                      .join("\n")
                );
              },
              (error) => {
                console.log("ERROR 0302:", error);
              }
            );
          }}
        >
          &#9733;
        </button>
        <button
          alt="Edit icon"
          className={styles.cardButton}
          onClick={() => {
            let newLemma = prompt("Enter new lemma.");
            if (newLemma) {
              props.editLemma(newLemma);
            }
          }}
        >
          &#9998;
        </button>
        <button
          alt="Cross icon"
          className={styles.cardButton}
          onClick={() => {
            if (window.confirm("Delete this chunk?")) {
              props.editLemma(null);
            }
          }}
        >
          &times;
        </button>
        <button alt="Join icon" className={styles.cardButton}>
          &#10697;
        </button>
      </div>
      <h1
        onClick={() => {
          //devlogging
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
      <p className={styles.wordtype}>{structureChunk && structureChunk.id}</p>
      {structureChunk && (
        <div className={styles.traitBoxesHolder}>
          <ToggleShowButton
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
                !traitsToNotDisplayInOwnBox.includes(traitKey) && (
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
                    setStructureChunk={setStructureChunk}
                    wordtype={wordtype}
                    setElementsToDrawLinesBetween={
                      props.setElementsToDrawLinesBetween
                    }
                    flowerSearchingForStemBrace={
                      props.flowerSearchingForStemBrace
                    }
                    stemFoundForFlowerBrace={props.stemFoundForFlowerBrace}
                    backedUpStructureChunk={backedUpStructureChunk}
                  />
                )
              );
            })}
          <ToggleShowButton
            setShowTraitKeysGroup={setShowTraitKeysGroupTwo}
            showTraitKeysGroup={showTraitKeysGroupTwo}
            traitKeysHoldSomeValues={traitKeysGroup2.some(
              (traitKey) =>
                structureChunk[traitKey] &&
                !uUtils.isEmpty(structureChunk[traitKey].traitValue)
            )}
          />
          {showTraitKeysGroupTwo &&
            traitKeysGroup2.map(
              (traitKey) =>
                !traitsToNotDisplayInOwnBox.includes(traitKey) && (
                  <TraitBox
                    key={traitKey}
                    traitKey={traitKey}
                    traitObject={structureChunk[traitKey]}
                    word={props.word}
                    setStructureChunk={setStructureChunk}
                  />
                )
            )}
        </div>
      )}
    </div>
  );
};

export default ChunkCard;
