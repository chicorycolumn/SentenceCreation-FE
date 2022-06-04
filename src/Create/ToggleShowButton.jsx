import React from "react";
import styles from "../css/ChunkCard.module.css";
import icons from "../utils/icons.js";

const ToggleShowButton = (props) => {
  return (
    <button
      id={props.id}
      className={styles.toggleShowButton}
      onClick={() => {
        props.setShowTraitKeysGroup((prevState) => !prevState);
      }}
    >
      {props.showTraitKeysGroup ? (
        props.traitKeysHoldSomeValues ? (
          <span className={styles.toggleShowButtonSpan}>
            {icons.downBlackTriangle}
          </span>
        ) : (
          <span className={styles.toggleShowButtonSpan}>
            {icons.downWhiteTriangle}
          </span>
        )
      ) : props.traitKeysHoldSomeValues ? (
        <span className={styles.toggleShowButtonSpan}>
          {icons.upBlackTriangle}
        </span>
      ) : (
        <span className={styles.toggleShowButtonSpan}>
          {icons.upWhiteTriangle}
        </span>
      )}
    </button>
  );
};

export default ToggleShowButton;
