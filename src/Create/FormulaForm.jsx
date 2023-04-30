import React, { useState, useContext } from "react";
import LanguageContext from "../context/LanguageContext.js";
import idUtils from "../utils/identityUtils.js";
import styles from "../css/FormulaForm.module.css";
import gstyles from "../css/Global.module.css";
import Tooltip from "../Cogs/Tooltip.jsx";
const uUtils = require("../utils/universalUtils.js");

const FormulaForm = (props) => {
  const [femulaStringInput, setFemulaStringInput] = useState(
    // "on jest cebula on jest cebula"
    "kobieta jest *bardzo czerwona"
    // "on jest niebieskim chłopcem"
  );

  return (
    <div className={styles.formHolder}>
      <h4
        className={styles.title}
      >{`New ${props.batch} sentence (${props.lang1})`}</h4>
      <form className={`${styles.form} ${gstyles.tooltipHolderDelayed}`}>
        <Tooltip
          text="Prefix with an asterisk to make a fixed chunk, eg 'my name is *Jen'"
          number={4}
        />
        <input
          rows={2}
          className={styles.input}
          onChange={(e) => {
            setFemulaStringInput(e.target.value);
          }}
          placeholder="Enter example sentence"
          value={femulaStringInput}
        ></input>
        <button
          alt="Right arrow go arrow icon"
          className={styles.button1}
          type="submit"
          onClick={(e) => {
            e.preventDefault();

            if (props.batch === "Answer") {
              alert(
                "Let's match up the chunkIds from Question sentence first."
              );
            }
            props.formatAndSetFemulaFromWrittenInput(
              props.lang1,
              props.lang2,
              femulaStringInput
            );
          }}
        >
          &#10157;
        </button>
      </form>

      <div className={styles.button2Holder}>
        <button className={styles.button2} onClick={props.onClickFetchFemulas}>
          or select existing formula
        </button>
      </div>
    </div>
  );
};

export default FormulaForm;
