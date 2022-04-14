import React, { useState } from "react";

const FormulaSymbolForm = (props) => {
  const [formulaSymbolInput, setFormulaSymbolInput] = useState("");

  return (
    <div>
      <h3>FormulaSymbolForm</h3>
      <form>
        <input
          onChange={(e) => {
            setFormulaSymbolInput(e.target.value);
          }}
          placeholder="Enter example sentence"
        ></input>
        <button
          onClick={(e) => {
            e.preventDefault();
            if (formulaSymbolInput) {
              props.setFormulaSymbol(formulaSymbolInput);
            }
          }}
        >
          Card it
        </button>
        <button>Run it</button>
      </form>
    </div>
  );
};

export default FormulaSymbolForm;
