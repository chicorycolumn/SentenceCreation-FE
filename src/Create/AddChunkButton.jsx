import React from "react";
import styles from "../css/ChunkCardTray.module.css";
import jqUtils from "../utils/jQueryUtils.js";
const uUtils = require("../utils/universalUtils.js");
const uiUtils = require("../utils/userInputUtils.js");

const AddChunkButton = (props) => {
  return (
    <div
      key={`plusButton-${props.femulaItemIndex}`}
      alt="Plus icon"
      className={styles.plusButton}
      onClick={() => {
        let guideword = uiUtils.promptGuideword();
        if (!guideword) {
          return;
        }

        props.setFemula((prevFemula) => {
          let existingFemulaItemIds = prevFemula.map(
            (fItem) => fItem.femulaItemId
          );
          let femulaItemId = uUtils.getUniqueNumberStringForGivenArray(
            10,
            existingFemulaItemIds
          );

          let newFemulaItem = {
            guideword,
            structureChunk: null,
            femulaItemId,
          };
          return [
            ...prevFemula.slice(0, props.femulaItemIndex),
            newFemulaItem,
            ...prevFemula.slice(props.femulaItemIndex),
          ];
        });

        setTimeout(() => {
          jqUtils.expandTrayHeightToFitTraitBoxes(props.batch);
        }, 500);
      }}
    >
      &#8853;
    </div>
  );
};

export default AddChunkButton;
