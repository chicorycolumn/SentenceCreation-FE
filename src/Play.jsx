import React, { useState } from "react";
import styles from "./css/Play.module.css";
import LineHolder from "./Cogs/LineHolder";

const Play = () => {
  const [elementsToDrawLineBetween, setElementsToDrawLineBetween] = useState(
    []
  );
  return (
    <div>
      <h1>Welcome, Player!</h1>
      <h2>Begin game?</h2>
      <h1
        onClick={() => {
          setElementsToDrawLineBetween([
            { flowerstem: "A", flowers: ["B", "C"] },
            { flowerstem: "E", flowers: ["D", "F"] },
          ]);
        }}
      >
        Add lines
      </h1>
      <h1
        onClick={() => {
          setElementsToDrawLineBetween([]);
        }}
      >
        Destroy lines
      </h1>
      <div id="holder" className={styles.holder}>
        <div id="A" className={`${styles.mydiv} ${styles.divA}`}>
          A
        </div>
        <div id="B" className={`${styles.mydiv} ${styles.divB}`}>
          B
        </div>
        <div id="C" className={`${styles.mydiv} ${styles.divC}`}>
          C
        </div>
        <div id="D" className={`${styles.mydiv} ${styles.divD}`}>
          D
        </div>
        <div id="E" className={`${styles.mydiv} ${styles.divE}`}>
          E
        </div>
        <div id="F" className={`${styles.mydiv} ${styles.divF}`}>
          F
        </div>
        <LineHolder elementsToDrawLineBetween={elementsToDrawLineBetween} />
      </div>
    </div>
  );
};

export default Play;
