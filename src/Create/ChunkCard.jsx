import React, { useState, useEffect, useContext } from "react";
import styles from "../css/ChunkCard.module.css";
import gstyles from "../css/Global.module.css";
import { fetchLObjsByLemma } from "../utils/getUtils.js";
import LanguageContext from "../context/LanguageContext.js";
import TraitBox from "./TraitBox.jsx";
import ToggleShowButton from "./ToggleShowButton.jsx";
import { testStChs } from "../utils/testData.js";
const uUtils = require("../utils/universalUtils.js");
const diUtils = require("../utils/displayUtils.js");
const traitsWithoutTraitBoxes = ["orTags", "id", "lemma"];

const ChunkCard = (props) => {
  const [lObjs, setLObjs] = useState([]);
  const [structureChunk, setStructureChunk] = useState();
  const [showTraitKeysGroupOne, setShowTraitKeysGroupOne] = useState(true);
  const [showTraitKeysGroupTwo, setShowTraitKeysGroupTwo] = useState();
  const lang1 = useContext(LanguageContext);

  useEffect(() => {
    if (lObjs) {
      let fetchedLObjs = lObjs;
      // console.log("");
      // console.log("word:", props.word);
      // console.log("index:", props.chunkCardIndex);
      // console.log("fetchedLObjs.length:", fetchedLObjs.length);

      if (structureChunk) {
        console.log("Already done this one actually.");
        return;
      }

      if (fetchedLObjs.length) {
        let stCh = fetchedLObjs[0];
        if (fetchedLObjs.length > 1) {
          let id = prompt(
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
          let matchingStChs = fetchedLObjs.filter((lObj) => lObj.id === id);
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
      }
    }
  }, [
    lObjs,
    props.chunkCardIndex,
    props.word,
    structureChunk,
    props.formulaSymbol,
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
  let wordtype = null;

  if (structureChunk) {
    let { orderedTraitKeysGroup1, orderedTraitKeysGroup2, wordtypeFromStCh } =
      diUtils.orderTraitKeys(structureChunk);
    traitKeysGroup1 = orderedTraitKeysGroup1;
    traitKeysGroup2 = orderedTraitKeysGroup2;
    wordtype = wordtypeFromStCh;
  }

  return (
    <div
      className={`${styles.card} ${wordtype && gstyles[wordtype]}`}
      key={props.word}
    >
      <div className={styles.cardButtonsHolder}>
        <button className={styles.cardButton}>Edit</button>
        <button className={styles.cardButton}>Query</button>
        <button className={styles.cardButton}>Link</button>
      </div>
      <h1
        onClick={() => {
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
                !traitsWithoutTraitBoxes.includes(traitKey) && (
                  <TraitBox
                    chunkCardKey={props.chunkCardKey}
                    key={`${props.chunkCardKey}-${traitKey}`}
                    traitKey={traitKey}
                    traitKey2={traitKey2}
                    traitObject={traitObject}
                    traitObject2={traitObject2}
                    word={props.word}
                    setStructureChunk={setStructureChunk}
                    wordtype={wordtype}
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
                !traitsWithoutTraitBoxes.includes(traitKey) && (
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
