import React from "react";
import styles from "../css/ChunkOrdersPopup.module.css";
import pstyles from "../css/Popup.module.css";
import gstyles from "../css/Global.module.css";
import diUtils from "../utils/displayUtils.js";

const ChunkOrdersPopup = (props) => {
  return (
    <div className={pstyles.mainbox}>
      <div className={pstyles.topHolder}>
        <div className={`${gstyles.sideButton} ${gstyles.invisible}`}></div>
        <h1 className={pstyles.title}>Select orders for sentence.</h1>
        <button
          alt="Cross icon"
          className={`${gstyles.sideButton} ${gstyles.redButton}`}
          onClick={props.exit}
        >
          &times;
        </button>
      </div>

      <div className={styles.buttonHolder}>
        {props.formula.map((obj) => {
          let chunkId = obj.structureChunk.chunkId.traitValue;
          let lemma = diUtils.getLemmaFromChunkId(chunkId);

          return (
            <button className={styles.chunkButton}>
              <p className={styles.buttonTopHalf}>{lemma}</p>
              <p className={styles.buttonBottomHalf}>{chunkId}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChunkOrdersPopup;
