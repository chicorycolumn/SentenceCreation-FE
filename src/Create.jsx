import React, { useState, useEffect } from "react";
import LanguagesForm from "./Create/LanguagesForm.jsx";
import FormulaForm from "./Create/FormulaForm.jsx";
import ChunkCardTrayHolder from "./Create/ChunkCardTrayHolder.jsx";
import ListPopup from "./Cogs/ListPopup.jsx";
import { LanguageContextProvider } from "./context/LanguageContext.js";
import idUtils from "./utils/identityUtils.js";
import $ from "jquery";
import gstyles from "./css/Global.module.css";
import styles from "./css/ChunkCardTrayHolder.module.css";
import rfStyles from "./css/RadioForm.module.css";
const uUtils = require("./utils/universalUtils.js");
const putUtils = require("./utils/putUtils.js");
const getUtils = require("./utils/getUtils.js");

const Create = () => {
  const [langQ, setLangQ] = useState("POL");
  const [langA, setLangA] = useState("ENG");
  const [beEnv, setBeEnv] = useState("ref");
  const [savedProgressFormulas, setSavedProgressFormulas] = useState([]);
  const [savedDualFormulas, setSavedDualFormulas] = useState([]);
  const [questionSavedFormula, setQuestionSavedFormula] = useState();
  const [answerSavedFormula, setAnswerSavedFormula] = useState();
  const [listPopupData, setListPopupData] = useState();
  const [invisibleTextarea, setInvisibleTextarea] = useState("");
  const [formulaTopics, setFormulaTopics] = useState([]);
  const [allTopics, setAllTopics] = useState([]);

  const rodButtonDisabled = !questionSavedFormula || !answerSavedFormula;

  const getResetAndRequeryCallback = (queryButtonId) => {
    return (cb) => {
      setListPopupData((prev) => {
        prev.rows = [];
        return prev;
      });
      if (cb) {
        cb();
      }
      $(`#${queryButtonId}`).click();
    };
  };

  useEffect(() => {
    getUtils.fetchFormulaTopics().then((fetchedFormulaTopics) => {
      setAllTopics(fetchedFormulaTopics);
    });
  }, []);

  return (
    <LanguageContextProvider value={`${langQ}-${langA}-${beEnv}`}>
      <div className={gstyles.floatTop}>
        <button
          onClick={() => {
            console.log({ langQ, langA, beEnv });
          }}
        >
          ł1
        </button>
        <button
          onClick={() => {
            console.log("ł2");
          }}
        >
          ł2
        </button>
        <button
          onClick={() => {
            console.log("ł3");
          }}
        >
          ł3
        </button>
      </div>
      <h1 className={gstyles.heading1}>Create new sentences</h1>
      <div className={styles.horizontalHolder}>
        <textarea
          readOnly
          value={invisibleTextarea}
          className={gstyles.invisibleTextarea}
          id="invisibleTextarea_Create"
        ></textarea>
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
            id="Button_QueryDualFormula"
            className={`${
              rodButtonDisabled ? styles.rodButtonDisabled : styles.rodButton
            }`}
            disabled={rodButtonDisabled}
            onClick={() => {
              let id = "Button_QueryDualFormula";
              putUtils._fetchDualSentence(
                id,
                langQ,
                langA,
                questionSavedFormula,
                answerSavedFormula,
                setListPopupData,
                null,
                getResetAndRequeryCallback(id)
              );
            }}
          >
            ★ Query dual formula
          </button>
          <button
            id="Button_QueryDualFormulaReverse"
            className={`${
              rodButtonDisabled ? styles.rodButtonDisabled : styles.rodButton
            }`}
            disabled={rodButtonDisabled}
            onClick={() => {
              let id = "Button_QueryDualFormulaReverse";
              putUtils._fetchDualSentence(
                id,
                langA,
                langQ,
                answerSavedFormula,
                questionSavedFormula,
                setListPopupData,
                null,
                getResetAndRequeryCallback(id)
              );
            }}
          >
            ★ Query dual formula switch lang
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

                  console.log("Saved this dual formula:", dualFormula);
                  setSavedDualFormulas((prev) => [...prev, dualFormula]);

                  uUtils.copyToClipboard(
                    setInvisibleTextarea,
                    JSON.stringify(dualFormula),
                    "invisibleTextarea_Create"
                  );
                } else {
                  alert(
                    "Sorry, no sentences were created for your dual formula when I queried it just now, so I will not save it."
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
            {
              name: "dual",
              data: savedDualFormulas,
              setState: setSavedDualFormulas,
            },
            {
              name: "in-progress",
              data: savedProgressFormulas,
              setState: setSavedProgressFormulas,
            },
          ].map((savedFormulasData) => (
            <>
              <button
                key={`Save_${savedFormulasData.name}`}
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

                  let stringifiedSavedFormulas = JSON.stringify(
                    savedFormulasData.data
                  );

                  uUtils.copyToClipboard(
                    setInvisibleTextarea,
                    stringifiedSavedFormulas,
                    "invisibleTextarea_Create"
                  );

                  uUtils.downloadText(
                    savedFormulasData.name + "-formulas",
                    stringifiedSavedFormulas
                  );
                }}
              >
                {`View ${savedFormulasData.data.length} saved ${savedFormulasData.name} formulas`}
              </button>
              <button
                key={`Delete_${savedFormulasData.name}`}
                className={`${
                  !savedFormulasData.data.length
                    ? styles.rodButtonDisabled
                    : styles.rodButton
                }`}
                disabled={!savedFormulasData.data.length}
                onClick={() => {
                  if (
                    window.confirm(
                      `Are you sure you want to delete all saved ${savedFormulasData.name} formulas?`
                    )
                  ) {
                    savedFormulasData.setState([]);
                  }
                }}
              >
                {`Delete ${savedFormulasData.data.length} saved ${savedFormulasData.name} formulas`}
              </button>
            </>
          ))}
        </div>
        <div className={rfStyles.form}>
          <h4 className={rfStyles.titleSmall}>Formula topics</h4>
          <div className={styles.horizontalHolderMini}>
            <textarea
              className={styles.topics}
              readOnly
              value={formulaTopics.join(", ")}
            ></textarea>
            <select
              className={styles.topicsSelector}
              name="topics"
              onClick={(e) => {
                e.preventDefault();
                setFormulaTopics((prev) => {
                  let selectedTopic = e.target.value;
                  if (prev.includes(selectedTopic)) {
                    return prev.filter((x) => x !== selectedTopic);
                  }
                  return [...prev, selectedTopic];
                });
              }}
            >
              {allTopics.map((topicOption) => (
                <option value={topicOption} key={topicOption}>
                  {topicOption}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.horizontalHolderMini}>
            <h4 className={`${rfStyles.titleSmall} ${styles.difficultyHeader}`}>
              Formula difficulty
            </h4>
            <select
              className={styles.difficultySelector}
              name="difficulty"
              onClick={(e) => {
                e.preventDefault();
                console.log(e.target.value);
              }}
            >
              {[1, 2, 3, 4, 5].map((difficultyOption) => (
                <option value={difficultyOption} key={difficultyOption}>
                  {difficultyOption}
                </option>
              ))}
            </select>
          </div>
        </div>

        {listPopupData && (
          <ListPopup
            exit={setListPopupData}
            data={listPopupData}
            wide={true}
            evenColumns={true}
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
