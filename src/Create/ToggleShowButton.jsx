import React from "react";
import styles from "../css/ChunkCard.module.css";

const ToggleShowButton = (props) => {
  return (
    <button
      className={styles.toggleShowButton}
      onClick={() => {
        props.setShowTraitKeysGroupTwo((prevState) => !prevState);
      }}
    >
      {props.showTraitKeysGroupTwo ? (
        <span className={styles.toggleShowButtonSpan}>&#9661;</span>
      ) : (
        <span className={styles.toggleShowButtonSpan}>&#9651;</span>
      )}
    </button>
  );
};

export default ToggleShowButton;
