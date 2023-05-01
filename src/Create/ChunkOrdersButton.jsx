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
  return (
    <button
      key={chunkId}
      disabled={props.fItem.structureChunk.isGhostChunk}
      className={`${styles.chunkButton} ${
        chunkIsUnused && styles.chunkButtonBad
      } ${props.highlightedButton === chunkId && styles.highlightedButton}`}
      onClick={() => {
        props.setOrderBuilt((prev) => [...prev, chunkId]);
      }}
      onKeyUp={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onKeyDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("via ChunkOrdersPopup document listened keyup:", e.key);
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
      {chunkIsUnused && <p className={`${gstyles.floatJustAbove}`}>unused</p>}
      <p className={styles.buttonTopHalf}>{props.fItem.guideword}</p>
      <p className={styles.buttonBottomHalf}>{chunkId}</p>
    </button>
  );
};

export default ChunkOrdersButton;
