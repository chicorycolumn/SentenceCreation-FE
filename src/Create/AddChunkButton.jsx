import React from "react";
import styles from "../css/ChunkCardHolder.module.css";

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
            let newFormulaObject = {
              word: newLemma,
              structureChunk: null,
            };
            return [
              ...prevFormula.slice(0, props.formulaItemIndex),
              newFormulaObject,
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
