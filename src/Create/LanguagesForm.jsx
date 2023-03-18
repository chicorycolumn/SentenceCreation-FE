import React, { useContext, useEffect } from "react";
import LanguageContext from "../context/LanguageContext.js";
import gstyles from "../css/Global.module.css";

const putUtils = require("../utils/putUtils.js");

const LanguagesForm = (props) => {
  const lang1 = useContext(LanguageContext);

  useEffect(() => {
    document.getElementById(`lang_${lang1}`).checked = true;
  }, [lang1]);

  return (
    <div>
      <h3>LanguagesForm</h3>
      <div className={gstyles.floatTop}>
        <button
          onClick={() => {
            //devlogging
            console.log("");
            console.log({ lang1 });
            console.log("");
          }}
        >
          ł1
        </button>
        <button
          onClick={() => {
            //devlogging
            console.log("");
            console.log("2");
            console.log("");
            putUtils.fetchFormula("ENG-00-101a", "POL").then((data) => {
              console.log("");
              console.log("");
              console.log("");
              console.log("");
              console.log(data);
              console.log("");
              console.log("");
              console.log("");
              console.log("");
            });
          }}
        >
          ł2
        </button>
        <button
          onClick={() => {
            //devlogging
            console.log("");
            console.log("3");
            console.log("");
          }}
        >
          ł3
        </button>
      </div>
      <form
        onChange={(e) => {
          props.setLang1(e.target.value);
        }}
      >
        <input type="radio" id="lang_ENG" name="lang" value="ENG" />
        <label htmlFor="lang_ENG">English</label>
        <input type="radio" id="lang_POL" name="lang" value="POL" />
        <label htmlFor="lang_POL">Polish</label>
      </form>
    </div>
  );
};

export default LanguagesForm;
