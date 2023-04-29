import React, { useState, useEffect } from "react";
import LanguagesForm from "./Create/LanguagesForm.jsx";
import FormulaForm from "./Create/FormulaForm.jsx";
import ChunkCardTrayHolder from "./Create/ChunkCardTrayHolder.jsx";
import ListPopup from "./Cogs/ListPopup.jsx";
import { LanguageContextProvider } from "./context/LanguageContext.js";
import { fetchFemula, fetchFormulaIds } from "./utils/putUtils.js";
import idUtils from "./utils/identityUtils.js";
import $ from "jquery";
import gstyles from "./css/Global.module.css";
import styles from "./css/ChunkCardTrayHolder.module.css";
const uUtils = require("./utils/universalUtils.js");

const Create = () => {
  const [langQ, setLangQ] = useState("POL");
  const [langA, setLangA] = useState("ENG");
  const [beEnv, setBeEnv] = useState("ref");
  const [devSavedFormulas, setDevSavedFormulas] = useState([]);

  return (
    <LanguageContextProvider value={`${langQ}-${langA}-${beEnv}`}>
      <div className={styles.horizontalHolder}>
        <LanguagesForm
          setLangQ={(newValue) => {
            setLangQ((prev) => {
              if (langA === newValue) {
                $(`#langA_${prev}_label`).click();
              }
              return newValue;
            });
          }}
          setLangA={(newValue) => {
            setLangA((prev) => {
              if (langQ === newValue) {
                $(`#langQ_${prev}_label`).click();
              }
              return newValue;
            });
          }}
          setBeEnv={setBeEnv}
          devSavedFormulas={devSavedFormulas}
        />
      </div>
      <ChunkCardTrayHolder setDevSavedFormulas={setDevSavedFormulas} />
    </LanguageContextProvider>
  );
};

export default Create;
