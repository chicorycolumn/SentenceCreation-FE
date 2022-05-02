import React, { useContext, useEffect } from "react";
import gstyles from "../css/Global.module.css";
import LanguageContext from "../context/LanguageContext.js";

const LanguagesForm = (props) => {
  const lang1 = useContext(LanguageContext);

  useEffect(() => {
    document.getElementById("lang_english").checked = true;
  }, []);

  return (
    <div>
      <h3>LanguagesForm</h3>
      <div className={gstyles.floatTop}>
        <button
          onClick={() => {
            console.log("");
            console.log(lang1);
            console.log("");
          }}
        >
          1
        </button>
        <button
          onClick={() => {
            console.log("");
            console.log("2");
            console.log("");
          }}
        >
          2
        </button>
        <button
          onClick={() => {
            console.log("");
            console.log("3");
            console.log("");
          }}
        >
          3
        </button>
      </div>
      <form
        onChange={(e) => {
          console.log(e.target.value);
          props.setLang1(e.target.value);
        }}
      >
        <input type="radio" id="lang_english" name="lang" value="ENG" />
        <label htmlFor="lang_english">English</label>
        <input type="radio" id="lang_polish" name="lang" value="POL" />
        <label htmlFor="lang_polish">Polish</label>
      </form>
    </div>
  );
};

export default LanguagesForm;
