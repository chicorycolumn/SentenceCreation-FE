import React, { useState, useContext, useEffect } from "react";
import LanguageContext from "../context/LanguageContext.js";
import idUtils from "../utils/identityUtils.js";
import { egSentenceString1 } from "../utils/testData.js";
import { getRandomNumberString } from "../utils/universalUtils.js";

const FormulaForm = (props) => {
  const [formulaInput, setFormulaInput] = useState(); //egSentenceString1

  const [savedFormulaInput, setSavedFormulaInput] = useState();

  const cardIt = (lang, input) => {
    if (!lang) {
      alert("No language specified.");
      return;
    }

    let formula = formulaInput || input;
    console.log("CARD IT!", lang, formula);

    if (formula) {
      setSavedFormulaInput(formula);
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
