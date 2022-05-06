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
      {props.showTraitKeysGroupTwo ? "Hide" : "Show"}
    </button>
  );
};

export default ToggleShowButton;
