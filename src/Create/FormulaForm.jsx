import React, { useState } from "react";

const FormulaForm = (props) => {
  const [formulaInput, setFormulaInput] = useState("");

  return (
    <div>
      <h3>FormulaForm</h3>
      <form>
        <input
          onChange={(e) => {
            setFormulaInput(e.target.value);
          }}
          placeholder="Enter example sentence"
        ></input>
        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            if (formulaInput) {
              props.setFormula(
                formulaInput.split(" ").map((word) => {
                  return { word, structureChunk: null };
                })
              );
            }
          }}
        >
          Card it
        </button>
        <button>Run it</button>
      </form>
      <p>Prefix a word with "*" to make it a fixed chunk</p>
    </div>
  );
};

export default FormulaForm;
