import React from "react";
import styles from "../css/LineHolder.module.css";
import flUtils from "../utils/flowerUtils";

const LineHolder = (_props) => {
  return (
    <div id="lineHolder" className={styles.lineHolder}>
      {flUtils
        .multiplyOutStemAndFlowers(_props.elementsToDrawLineBetween)
        .map((elementIDs) => {
          let el1ID = elementIDs[0];
          let el2ID = elementIDs[1];
          let lineID = `${el1ID}-${el2ID}-connectingLine`;

          setTimeout(() => {
            flUtils.drawLineBetweenElements(el1ID, el2ID, lineID);
          }, 1);

          return (
            <div
              id={lineID}
              key={lineID}
              className={`${styles.line} ${
                _props.drawnLinesAsBold && styles.boldLine
              }`}
            ></div>
          );
        })}
    </div>
  );
};

export default LineHolder;
