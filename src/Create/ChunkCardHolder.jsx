import React, { useState } from "react";
import ChunkCard from "./ChunkCard";
import styles from "../css/ChunkCardHolder.module.css";
import gstyles from "../css/Global.module.css";
import LineHolder from "../Cogs/LineHolder";

const ChunkCardHolder = (props) => {
  const [elementsToDrawLinesBetween, setElementsToDrawLinesBetween] = useState(
    []
  );
  const [flowerSearchingForStem, setFlowerSearchingForStem] = useState();
  const [stemFoundForFlower, setStemFoundForFlower] = useState();
  const [meaninglessCounter, setMeaninglessCounter] = useState(0);
  const editLemmaAtIndex = (index, newLemma) => {
    props.setFormula((prevFormula) => {
      if (!newLemma) {
        return prevFormula.filter((el, i) => i !== index);
      }
      prevFormula[index] = { word: newLemma, structureChunk: null };
      return prevFormula;
    });
    setMeaninglessCounter((prev) => prev + 1);
  };
  return (
    <div className={styles.cardHolderContainer}>
      <div className={styles.buttonHolder}>
        <button
          alt="Star icon to query"
          className={`${gstyles.cardButton1}`}
          onClick={() => {
            alert("Let's query the whole Question sentence.");
          }}
        >
          &#9733;
        </button>
      </div>
      <div className={styles.cardHolder} key={meaninglessCounter}>
        <LineHolder elementsToDrawLineBetween={elementsToDrawLinesBetween} />
        {/* Unused LineHolder for flexbox spacing. */}
        {props.formula.map((structureChunkObject, index) => {
          let { word, structureChunk } = structureChunkObject;
          return (
            <ChunkCard
              key={`${index}-${word}`}
              chunkCardKey={`${index}-${word}`}
              word={word}
              index={index}
              structureChunk={structureChunk}
              chunkCardIndex={index}
              formula={props.formula}
              setFormula={props.setFormula}
              setElementsToDrawLinesBetween={setElementsToDrawLinesBetween}
              flowerSearchingForStemBrace={[
                flowerSearchingForStem,
                setFlowerSearchingForStem,
              ]}
              stemFoundForFlowerBrace={[
                stemFoundForFlower,
                setStemFoundForFlower,
              ]}
              editLemma={(newLemma) => {
                editLemmaAtIndex(index, newLemma);
              }}
            />
          );
        })}
        <LineHolder elementsToDrawLineBetween={elementsToDrawLinesBetween} />
      </div>
    </div>
  );
};

export default ChunkCardHolder;
