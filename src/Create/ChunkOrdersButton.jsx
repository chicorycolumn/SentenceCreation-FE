import React, { useState, useEffect } from "react";
import styles from "../css/ChunkOrdersPopup.module.css";
import Tooltip from "../Cogs/Tooltip.jsx";
import pstyles from "../css/Popup.module.css";
import gstyles from "../css/Global.module.css";
import uUtils from "../utils/universalUtils.js";
import $ from "jquery";

const ChunkOrdersButton = (props) => {
  let chunkId = props.fItem.structureChunk.chunkId.traitValue;
  let chunkIsUnused =
    !props.fItem.structureChunk.isGhostChunk &&
    !props.chunkOrders.some((orderObj) =>
      orderObj.order.includes(props.fItem.structureChunk.chunkId.traitValue)
    );
  let disabled =
    props.disable ||
    props.fItem.structureChunk.isGhostChunk ||
    (props.mode === "Q2A" &&
      props.chunkOrders.some(
        (chunkOrderObj) => chunkOrderObj.order[props.rowNumber] === chunkId
      ));

  return (
    <button
      key={chunkId}
      // disabled={disabled} // This would block the onKeyDown Enter being detected.
      className={`${
        disabled ? styles.chunkButtonDisabled : styles.chunkButton
      } ${chunkIsUnused && styles.chunkButtonBad} ${
        props.highlightedButton === chunkId && styles.highlightedButton
      }`}
      onClick={() => {
        if (!disabled) {
          props.setOrderBuilt((prev) => [...prev, chunkId]);
        }
      }}
      onKeyUp={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onKeyDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("via ChunkOrdersButton document listened keyup:", e.key);
        if (["Enter"].includes(e.key)) {
          $("#ChunkOrdersPopup-tickbutton").addClass(gstyles.tickButtonActive);
          setTimeout(() => {
            props.addOrder(props.orderBuilt);
            $("#ChunkOrdersPopup-tickbutton").removeClass(
              gstyles.tickButtonActive
            );
          }, 50);
          return;
        } else if (["Backspace"].includes(e.key)) {
          $("#ChunkOrdersPopup-clearbutton").addClass(gstyles.redButtonActive);
          setTimeout(() => {
            props.clearOrder();
            $("#ChunkOrdersPopup-clearbutton").removeClass(
              gstyles.redButtonActive
            );
          }, 50);
          return;
        }
      }}
    >
      <p className={styles.buttonTopHalf}>{props.fItem.guideword}</p>
      <p className={styles.buttonBottomHalf}>{chunkId}</p>
      {chunkIsUnused && <p className={`${styles.warningSmall}`}>unused</p>}
    </button>
  );
};

export default ChunkOrdersButton;
