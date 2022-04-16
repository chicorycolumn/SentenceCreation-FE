import React from "react";
import ChunkCard from "./ChunkCard";
import styles from "../css/ChunkCardHolder.module.css";

const ChunkCardHolder = (props) => {
  return (
    <div className={styles.cardHolder}>
      {props.formulaSymbol.split(" ").map((word) => (
        <ChunkCard key={word} word={word} />
      ))}
    </div>
  );
};

export default ChunkCardHolder;
