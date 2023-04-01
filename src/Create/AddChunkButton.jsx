import React from "react";
import styles from "../css/ChunkCardHolder.module.css";
import { getRandomNumberString } from "../utils/universalUtils.js";
const uiUtils = require("../utils/userInputUtils.js");

const AddChunkButton = (props) => {
  return (
    <div
      key={`plusButton-${props.formulaItemIndex}`}
      alt="Plus icon"
      className={styles.plusButton}
      onClick={() => {
        let newWords = uiUtils.promptGuideword();
        if (!newWords) {
          return;
        }
        let { guideword } = newWords;

        props.setFormula((prevFormula) => {
          let newFormulaItem = {
            guideword,
            structureChunk: null,
            formulaItemId: getRandomNumberString(10),
          };
          return [
            ...prevFormula.slice(0, props.formulaItemIndex),
            newFormulaItem,
            ...prevFormula.slice(props.formulaItemIndex),
          ];
        });
      }}
    >
      &#8853;
    </div>
  );
};

export default AddChunkButton;
