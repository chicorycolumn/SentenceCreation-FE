import React, { useState, useEffect } from "react";
import LanguagesForm from "./Create/LanguagesForm.jsx";
import FormulaForm from "./Create/FormulaForm.jsx";
import ChunkCardTrayHolder from "./Create/ChunkCardTrayHolder.jsx";
import ListPopup from "./Cogs/ListPopup.jsx";
import { LanguageContextProvider } from "./context/LanguageContext.js";
import {
  fetchDualSentence,
  fetchFemula,
  fetchFormulaIds,
} from "./utils/putUtils.js";
import idUtils from "./utils/identityUtils.js";
import $ from "jquery";
import gstyles from "./css/Global.module.css";
import styles from "./css/ChunkCardTrayHolder.module.css";
import rfStyles from "./css/RadioForm.module.css";
const uUtils = require("./utils/universalUtils.js");
const putUtils = require("./utils/putUtils.js");

const Create = () => {
  const [langQ, setLangQ] = useState("POL");
  const [langA, setLangA] = useState("ENG");
  const [beEnv, setBeEnv] = useState("ref");
  const [savedProgressFormulas, setSavedProgressFormulas] = useState([]);
  const [savedDualFormulas, setSavedDualFormulas] = useState([]);
  const [questionSavedFormula, setQuestionSavedFormula] = useState();
  const [answerSavedFormula, setAnswerSavedFormula] = useState();
  const [listPopupData, setListPopupData] = useState();

  const rodButtonDisabled = !questionSavedFormula || !answerSavedFormula;

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
            console.log("savedProgressFormulas:", savedProgressFormulas); //devlogging
            console.log("savedDualFormulas:", savedDualFormulas); //devlogging
          }}
        >
          ł2
        </button>
        <button
          onClick={() => {
            console.log("questionSavedFormula:", questionSavedFormula); //devlogging
            console.log("answerSavedFormula:", answerSavedFormula); //devlogging
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

        <div id={"rodButtonsHolder"} className={rfStyles.form}>
          <h4 className={rfStyles.titleSmall}>Complete</h4>
          <button
            className={`${
              rodButtonDisabled ? styles.rodButtonDisabled : styles.rodButton
            }`}
            disabled={rodButtonDisabled}
            onClick={() => {
              let fxnId = "fetchDualSentence:Query";

              putUtils._fetchDualSentence(
                fxnId,
                langQ,
                langA,
                questionSavedFormula,
                answerSavedFormula,
                setListPopupData
              );
            }}
          >
            ★ Query dual formula
          </button>
          <button
            className={`${
              rodButtonDisabled ? styles.rodButtonDisabled : styles.rodButton
            }`}
            disabled={rodButtonDisabled}
            onClick={() => {
              let fxnId = "fetchDualSentence:Save";
              const callbackSaveDualFormula = (payload, qFormula, aFormula) => {
                if (
                  payload.questionSentenceArr &&
                  payload.questionSentenceArr.length &&
                  payload.answerSentenceArr &&
                  payload.answerSentenceArr.length
                ) {
                  alert(
                    "Okay, I queried sentences for your dual formula, and we do get sentences created. So now let's save your formula. I'm console logging your formula now. Next we need to send this to BE and save it."
                  );
                  alert(
                    "Want to set Topics and Difficulty on the nexus object?"
                  );

                  let dualFormula = {};
                  dualFormula[langQ] = qFormula;
                  dualFormula[langA] = aFormula;

                  dualFormula.NEXUS = {
                    key: "SF-XXXX",
                    equivalents: {
                      ENG: [],
                      POL: [],
                      SPA: [],
                    },
                    topics: [],
                    difficulty: 0,
                  };
                  dualFormula.NEXUS.equivalents[langQ] = [
                    qFormula.sentenceFormulaId,
                  ];
                  dualFormula.NEXUS.equivalents[langA] = [
                    aFormula.sentenceFormulaId,
                  ];

                  console.log("Let's save this dual formula:", dualFormula);
                  setSavedDualFormulas((prev) => [...prev, dualFormula]);
                } else {
                  alert(
                    "Sorry, no sentences were created for your formula when I queried it just now, so I will not save your formula on BE."
                  );
                }
              };

              putUtils._fetchDualSentence(
                fxnId,
                langQ,
                langA,
                questionSavedFormula,
                answerSavedFormula,
                null,
                callbackSaveDualFormula
              );
            }}
          >
            ⎘ Save dual formula
          </button>
          {[
            { name: "dual", data: savedDualFormulas },
            { name: "in-progress", data: savedProgressFormulas },
          ].map((savedFormulasData) => (
            <button
              className={`${
                !savedFormulasData.data.length
                  ? styles.rodButtonDisabled
                  : styles.rodButton
              }`}
              disabled={!savedFormulasData.data.length}
              onClick={() => {
                console.log(
                  `View ${savedFormulasData.data.length} saved ${savedFormulasData.name} formulas`,
                  savedFormulasData.data
                );
              }}
            >
              {`View ${savedFormulasData.data.length} saved ${savedFormulasData.name} formulas`}
            </button>
          ))}
        </div>

        {listPopupData && (
          <ListPopup
            exit={() => {
              setListPopupData();
            }}
            data={listPopupData}
            wide={true}
          />
        )}
      </div>
      <ChunkCardTrayHolder
        batch={"Question"}
        lang1={langQ}
        lang2={langA}
        saveProgressFormula={setSavedProgressFormulas}
        saveFinishedFormula={setQuestionSavedFormula}
        formulaIsSaved={!!questionSavedFormula}
      />
      <ChunkCardTrayHolder
        batch={"Answer"}
        lang1={langA}
        lang2={langQ}
        saveProgressFormula={setSavedProgressFormulas}
        questionSavedFormula={questionSavedFormula}
        saveFinishedFormula={setAnswerSavedFormula}
        formulaIsSaved={!!answerSavedFormula}
      />
    </LanguageContextProvider>
  );
};

export default Create;
