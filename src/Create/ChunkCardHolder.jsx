import React from "react";
import ChunkCard from "./ChunkCard";
import styles from "../css/ChunkCardHolder.module.css";

const ChunkCardHolder = (props) => {
  return (
    <div className={styles.cardHolder}>
      {props.formulaSymbol.split(" ").map((word, index) => (
        <ChunkCard
          key={`${index}-${word}`}
          word={word}
          index={index}
          formulaSymbol={props.formulaSymbol}
        />
      ))}
    </div>
  );
};

export default ChunkCardHolder;
