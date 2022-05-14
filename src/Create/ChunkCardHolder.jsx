import React, { useState } from "react";
import ChunkCard from "./ChunkCard";
import styles from "../css/ChunkCardHolder.module.css";
import LineHolder from "../Cogs/LineHolder";

const ChunkCardHolder = (props) => {
  const [elementsToDrawLinesBetween, setElementsToDrawLinesBetween] = useState(
    []
  );
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
        />
      ))}
      <LineHolder elementsToDrawLineBetween={elementsToDrawLinesBetween} />
    </div>
  );
};

export default ChunkCardHolder;
