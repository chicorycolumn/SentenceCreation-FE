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
  const editLemmaAtIndex = (index, newLemma) => {
    props.setFormulaSymbol((prevFormulaSymbol) => {
      let formulaSymbolAsArr = prevFormulaSymbol.split(" ");
      if (!newLemma) {
        return formulaSymbolAsArr.filter((el, i) => i !== index).join(" ");
      }
      formulaSymbolAsArr[index] = newLemma;
      return formulaSymbolAsArr.join(" ");
    });
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
      <div className={styles.cardHolder}>
        {props.formulaSymbol.split(" ").map((word, index) => (
          <ChunkCard
            key={`${index}-${word}`}
            chunkCardKey={`${index}-${word}`}
            word={word}
            chunkCardIndex={index}
            formulaSymbol={props.formulaSymbol}
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
        ))}
        <LineHolder elementsToDrawLineBetween={elementsToDrawLinesBetween} />
      </div>
    </div>
  );
};

export default ChunkCardHolder;
