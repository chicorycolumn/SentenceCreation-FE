import React from "react";
import styles from "../css/ChunkCard.module.css";

const ToggleShowButton = (props) => {
  return (
    <button
      className={styles.toggleShowButton}
      onClick={() => {
        props.setShowTraitKeysGroup((prevState) => !prevState);
      }}
    >
      {props.showTraitKeysGroup ? (
        props.traitKeysHoldSomeValues ? (
          <span className={styles.toggleShowButtonSpan}>&#9660;</span> //down black
        ) : (
          <span className={styles.toggleShowButtonSpan}>&#9663;</span> //down white
        )
      ) : props.traitKeysHoldSomeValues ? (
        <span className={styles.toggleShowButtonSpan}>&#9650;</span> //up black
      ) : (
        <span className={styles.toggleShowButtonSpan}>&#9653;</span> //up white
      )}
    </button>
  );
};

export default ToggleShowButton;
