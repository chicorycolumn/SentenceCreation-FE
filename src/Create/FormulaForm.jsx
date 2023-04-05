import React, { useState, useContext } from "react";
import LanguageContext from "../context/LanguageContext.js";
import idUtils from "../utils/identityUtils.js";
import { getRandomNumberString } from "../utils/universalUtils.js";
import styles from "../css/FormulaForm.module.css";
import gstyles from "../css/Global.module.css";
import Tooltip from "../Cogs/Tooltip.jsx";

const FormulaForm = (props) => {
  const [formulaInput, setFormulaInput] = useState(
    "kobieta jest *bardzo czerwona"
    // "on jest"
  );

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
    <div className={styles.formHolder}>
      <h4 className={styles.title}>New sentence</h4>
      <form className={`${styles.form} ${gstyles.tooltipHolderDelayed}`}>
        <Tooltip
          text="Prefix with an asterisk to make a fixed chunk, eg 'my name is *Jen'"
          number={4}
        />
        <input
          rows={2}
          className={styles.input}
          onChange={(e) => {
            setFormulaInput(e.target.value);
          }}
          placeholder="Enter example sentence"
          value={formulaInput}
        ></input>
        <button
          className={styles.button1}
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            cardIt(lang1);
          }}
        >
          &#10157;
        </button>
      </form>

      <div className={styles.button2Holder}>
        <button className={styles.button2} onClick={props.onClickFetchFormulas}>
          or select existing formula
        </button>
      </div>
    </div>
  );
};

export default FormulaForm;
