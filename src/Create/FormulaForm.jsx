import React, { useState, useContext, useEffect } from "react";
import LanguageContext from "../context/LanguageContext.js";
import idUtils from "../utils/identityUtils.js";
import { getRandomNumberString } from "../utils/universalUtils.js";

const FormulaForm = (props) => {
  const [formulaInput, setFormulaInput] = useState(
    "kobieta jest *bardzo czerwona"
  ); //

  const cardIt = (lang, input) => {
    if (!lang) {
      alert("No language specified.");
      return;
    }

    let formula = formulaInput || input;
    console.log("CARD IT!", lang, formula);

    if (formula) {
      let formulaItemsArr = formula.split(" ").map((guideword) => {
        return {
          guideword,
          structureChunk: null,
          formulaItemId: getRandomNumberString(10),
        };
      });
      props.setFormula(formulaItemsArr);
    }
  };

  const { lang1, lang2, beEnv } = idUtils.getLangsAndEnv(
    useContext(LanguageContext)
  );

  return (
    <div>
      <h3>FormulaForm</h3>
      <form>
        <input
          onChange={(e) => {
            setFormulaInput(e.target.value);
          }}
          placeholder="Enter example sentence"
          value={formulaInput}
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
