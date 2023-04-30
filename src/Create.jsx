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
  const [questionSavedFormula, setQuestionSavedFormula] = useState();

  return (
    <LanguageContextProvider value={`${langQ}-${langA}-${beEnv}`}>
      <div className={gstyles.floatTop}>
        <button
          onClick={() => {
            console.log({ langQ, langA, beEnv }); //devlogging
          }}
        >
          ł1
        </button>
        <button
          onClick={() => {
            console.log("devSavedFormulas:", devSavedFormulas); //devlogging
          }}
        >
          ł2
        </button>
        <button
          onClick={() => {
            console.log("questionSavedFormula:", questionSavedFormula); //devlogging
          }}
        >
          ł3
        </button>
      </div>
      <h1 className={gstyles.heading1}>Create new sentences</h1>
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
        />
      </div>
      <ChunkCardTrayHolder
        batch={"Question"}
        lang1={langQ}
        lang2={langA}
        setDevSavedFormulas={setDevSavedFormulas}
        setQuestionSavedFormula={setQuestionSavedFormula}
      />
      <ChunkCardTrayHolder
        batch={"Answer"}
        lang1={langA}
        lang2={langQ}
        setDevSavedFormulas={setDevSavedFormulas}
        questionSavedFormula={questionSavedFormula}
      />
    </LanguageContextProvider>
  );
};

export default Create;
