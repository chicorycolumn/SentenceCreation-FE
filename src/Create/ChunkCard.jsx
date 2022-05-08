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
    if (lang1 && props.word) {
      fetchLObjsByLemma(lang1, props.word).then(
        (fetchedLObjs) => {
          setLObjs(fetchedLObjs);
          if (fetchedLObjs.length === 1) {
            let stCh = fetchedLObjs[0];
            let idSplit = stCh.id.split("-");
            stCh.chunkId.traitValue = `${idSplit[1]}-${idSplit[2]
              .split("")
              .reverse()
              .join("")}-${stCh.lemma}`;
            setStructureChunk(stCh);
          }
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
                    key={traitKey}
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
            traitKeysGroup2.map((traitKey) => (
              <TraitBox
                key={traitKey}
                traitKey={traitKey}
                traitObject={structureChunk[traitKey]}
                word={props.word}
                setStructureChunk={setStructureChunk}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default ChunkCard;
