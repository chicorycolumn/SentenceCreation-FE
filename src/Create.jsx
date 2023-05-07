import React, { useState, useEffect, Fragment } from "react";
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
const stUtils = require("./utils/storageUtils.js");
const getUtils = require("./utils/getUtils.js");

const Create = () => {
  const [langQ, setLangQ] = useState("POL");
  const [langA, setLangA] = useState("ENG");
  const [beEnv, setBeEnv] = useState("ref");
  const [savedProgressFormulas, setSavedProgressFormulas] = useState([]);
  const [savedDualFormulas, setSavedDualFormulas] = useState([]);
  const [questionSavedFormula, setQuestionSavedFormula] = useState(); //rename to "ready" not "saved"
  const [answerSavedFormula, setAnswerSavedFormula] = useState(); //rename to "ready" not "saved"
  const [listPopupData, setListPopupData] = useState();
  const [invisibleTextarea, setInvisibleTextarea] = useState("");
  const [formulaTopics, setFormulaTopics] = useState([]);
  const [allTopics, setAllTopics] = useState([]);
  const [formulaDifficulty, setFormulaDifficulty] = useState([]);
  const [showLoadProgressFormulaPopup, setShowLoadProgressFormulaPopup] =
    useState();
  const [progressFemulaToLoad, setProgressFemulaToLoad] = useState();

  const rodButtonDisabled = !questionSavedFormula || !answerSavedFormula;

  const setAndStoreSavedProgressFormulas = stUtils.getSetAndStoreSavedFormulas(
    "savedProgressFormulas",
    setSavedProgressFormulas
  );

  const setAndStoreSavedDualFormulas = stUtils.getSetAndStoreSavedFormulas(
    "savedDualFormulas",
    setSavedDualFormulas
  );

  const getResetAndRequeryCallback = (queryButtonId) => {
    // This fxn has to be declared in this file.
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

    let storedProgressFormulas = localStorage.getItem("savedProgressFormulas");
    if (storedProgressFormulas) {
      setSavedProgressFormulas(JSON.parse(storedProgressFormulas));
    }

    let storedDualFormulas = localStorage.getItem("savedDualFormulas");
    if (storedDualFormulas) {
      setSavedDualFormulas(JSON.parse(storedDualFormulas));
    }
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
              if (
                !window.confirm(
                  "Are you happy with the formula topics and difficulty you have chosen?"
                )
              ) {
                return;
              }

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
                    topics: formulaTopics,
                    difficulty: formulaDifficulty,
                  };
                  dualFormula.NEXUS.equivalents[langQ] = [
                    qFormula.sentenceFormulaId,
                  ];
                  dualFormula.NEXUS.equivalents[langA] = [
                    aFormula.sentenceFormulaId,
                  ];

                  console.log("Saved this dual formula:", dualFormula);
                  setAndStoreSavedDualFormulas(dualFormula);

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
                "fetchDualSentence:Save",
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
              setState: setAndStoreSavedDualFormulas,
            },
            {
              name: "progress",
              data: savedProgressFormulas,
              setState: setAndStoreSavedProgressFormulas,
            },
          ].map((savedFormulasData) => (
            <Fragment key={`buttons_${savedFormulasData.name}`}>
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
            </Fragment>
          ))}
          <button
            key={`Load-progress-formula`}
            className={`${
              !savedProgressFormulas.length
                ? styles.rodButtonDisabled
                : styles.rodButton
            }`}
            disabled={!savedProgressFormulas.length}
            onClick={() => {
              setShowLoadProgressFormulaPopup(true);
            }}
          >
            Load saved progress formula
          </button>
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
              {allTopics.map((topicOption, tpoIndex) => (
                <option value={topicOption} key={`${tpoIndex}-${topicOption}`}>
                  {topicOption}
                </option>
              ))}
            </select>
            <button
              alt="Cross icon"
              className={`${styles.topicsButton} ${gstyles.redButton}`}
              onClick={() => {
                if (window.confirm("Wipe all formula topics?")) {
                  setFormulaTopics([]);
                }
              }}
            >
              &times;
            </button>
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
                setFormulaDifficulty(e.target.value);
              }}
            >
              {[1, 2, 3, 4, 5].map((difficultyOption, dioIndex) => (
                <option
                  value={difficultyOption}
                  key={`${dioIndex}-${difficultyOption}`}
                >
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
        {showLoadProgressFormulaPopup && (
          <ListPopup
            exit={setShowLoadProgressFormulaPopup}
            data={{
              title: "Load a progress formula",
              headers: ["ID", "Guidewords"],
              rows: savedProgressFormulas.map((saved) => [
                saved.chosenFormulaId,
                saved.femula.map((chunk) => chunk.guideword).join(" "),
              ]),
              rowCallback: (r, rIndex) => {
                setProgressFemulaToLoad(savedProgressFormulas[rIndex]);
                setShowLoadProgressFormulaPopup();
              },
            }}
          />
        )}
      </div>
      <ChunkCardTrayHolder
        batch={"Question"}
        lang1={langQ}
        lang2={langA}
        saveProgressFormula={setAndStoreSavedProgressFormulas}
        saveFinishedFormula={setQuestionSavedFormula}
        formulaIsSaved={!!questionSavedFormula}
        progressFemulaToLoad={progressFemulaToLoad}
      />
      <ChunkCardTrayHolder
        batch={"Answer"}
        lang1={langA}
        lang2={langQ}
        saveProgressFormula={setAndStoreSavedProgressFormulas}
        questionSavedFormula={questionSavedFormula}
        saveFinishedFormula={setAnswerSavedFormula}
        formulaIsSaved={!!answerSavedFormula}
        progressFemulaToLoad={progressFemulaToLoad}
      />
    </LanguageContextProvider>
  );
};

export default Create;
