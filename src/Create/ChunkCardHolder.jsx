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
        />
      ))}
      <LineHolder elementsToDrawLineBetween={elementsToDrawLinesBetween} />
    </div>
  );
};

export default ChunkCardHolder;
