import React, { useState, useContext, useEffect } from "react";
import LanguageContext from "../context/LanguageContext.js";

const FormulaForm = (props) => {
  const [formulaInput, setFormulaInput] = useState(
    "kobieta tu jest *bardzo czerwona"
  );
  const [savedFormulaInput, setSavedFormulaInput] = useState();

  const cardIt = (lang, input) => {
    if (!lang) {
      return;
    }
    let formula = formulaInput || input;
    if (formula) {
      setSavedFormulaInput(formula);
      props.setFormula(
        formula.split(" ").map((word) => {
          return { word, structureChunk: null };
        })
      );
    }
  };

  const lang1 = useContext(LanguageContext);

  useEffect(() => {
    cardIt(lang1, savedFormulaInput);
  }, [lang1]);

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
            cardIt(lang1);
          }}
        >
          Card it
        </button>
      </form>
      <p>Prefix a word with "*" to make it a fixed chunk</p>
    </div>
  );
};

export default FormulaForm;
