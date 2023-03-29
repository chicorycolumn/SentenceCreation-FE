import React from "react";
import styles from "../css/ChunkCardHolder.module.css";
import { getRandomNumberString } from "../utils/universalUtils.js";

const AddChunkButton = (props) => {
  return (
    <div
      key={`plusButton-${props.formulaItemIndex}`}
      alt="Plus icon"
      className={styles.plusButton}
      onClick={() => {
        let info = prompt(
          'Enter new demo word, and guide word after a comma if different. eg "woman", or "kobieta,woman".'
        );
        if (!info) {
          return;
        }
        info = info.split(",").map((str) => str.trim());
        let newDemoword = info[0];
        let newGuideword = info[1] || info[0];
        if (newDemoword[0] === "*" && newGuideword[0] !== "*") {
          newGuideword = "*" + newGuideword;
        }

        if (newDemoword) {
          props.setFormula((prevFormula) => {
            let newFormulaItem = {
              guideword: newGuideword,
              demoword: newDemoword,
              structureChunk: null,
              formulaItemId: getRandomNumberString(10),
            };
            return [
              ...prevFormula.slice(0, props.formulaItemIndex),
              newFormulaItem,
              ...prevFormula.slice(props.formulaItemIndex),
            ];
          });
        }
      }}
    >
      &#8853;
    </div>
  );
};

export default AddChunkButton;
