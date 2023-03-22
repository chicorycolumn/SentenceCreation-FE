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
        let newLemma = prompt("Enter new lemma");
        if (newLemma) {
          props.setFormula((prevFormula) => {
            let newFormulaItem = {
              guideword: newLemma,
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
