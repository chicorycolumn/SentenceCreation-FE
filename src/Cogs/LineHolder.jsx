import React from "react";
import styles from "../css/LineHolder.module.css";
const diUtils = require("../utils/displayUtils");

const LineHolder = (props) => {
  return (
    <div id="lineHolder">
      {diUtils
        .multiplyOutMotherChildren(props.elementsToDrawLineBetween)
        .map((elementIDs) => {
          let el1ID = elementIDs[0];
          let el2ID = elementIDs[1];
          let lineID = `${el1ID}-${el2ID}-connectingLine`;

          setTimeout(() => {
            diUtils.drawLineBetweenElements(el1ID, el2ID, lineID);
          }, 50);

          return <div id={lineID} key={lineID} className={styles.line}></div>;
        })}
    </div>
  );
};

export default LineHolder;
