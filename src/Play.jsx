import React, { useState } from "react";
import styles from "./css/Play.module.css";
const diUtils = require("./utils/displayUtils");

const Play = () => {
  const [lineArray, setLineArray] = useState([]);
  return (
    <div>
      <h1>Welcome, Player!</h1>
      <h2>Begin game?</h2>
      <h1
        onClick={() => {
          diUtils.drawLineBetweenElements("apple", "banana", setLineArray);
        }}
      >
        Add lines
      </h1>
      <h1
        onClick={() => {
          setLineArray([]);
        }}
      >
        Destroy lines
      </h1>
      <div id="holder" className={styles.holder}>
        <div id="apple" className={`${styles.mydiv} ${styles.div1}`}></div>
        <div id="banana" className={`${styles.mydiv} ${styles.div2}`}></div>
        {lineArray.map((lineID) => (
          <div id={lineID} key={lineID} className={styles.line}></div>
        ))}
      </div>
    </div>
  );
};

export default Play;
