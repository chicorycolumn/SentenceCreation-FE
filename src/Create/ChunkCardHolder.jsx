import React, { useState } from "react";
import ChunkCard from "./ChunkCard";
import styles from "../css/ChunkCardHolder.module.css";
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
          stemFoundForFlowerBrace={[stemFoundForFlower, setStemFoundForFlower]}
          editLemma={(newLemma) => {
            editLemmaAtIndex(index, newLemma);
          }}
        />
      ))}
      <LineHolder elementsToDrawLineBetween={elementsToDrawLinesBetween} />
    </div>
  );
};

export default ChunkCardHolder;
