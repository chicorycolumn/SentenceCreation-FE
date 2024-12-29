import React, { useState, useEffect } from "react";
import LanguagesForm from "./Create/LanguagesForm.jsx";
import DifficultyAndTopicsSelector from "./Create/DifficultyAndTopicsSelector.jsx";
import { LanguageContextProvider } from "./context/LanguageContext.js";
import $ from "jquery";
import gstyles from "./css/Global.module.css";
import styles from "./css/Play.module.css";
const getUtils = require("./utils/getUtils.js");

const Play = () => {
  const [langQ, setLangQ] = useState("POL");
  const [langA, setLangA] = useState("ENG");
  const [beEnv, setBeEnv] = useState("prod");

  const [allTopics, setAllTopics] = useState([]);
  const [fTopics, setFTopics] = useState([]);
  const [formulaDifficulty, setFormulaDifficulty] = useState(1);

  useEffect(() => {
    if (!allTopics.length) {
      getUtils.fetchTopics(beEnv, langQ).then((fetchedFTopics) => {
        setAllTopics(fetchedFTopics);
      });
    }
  }, []);

  const getAndSetPalette = () => {
    getUtils.fetchPalette(beEnv, langQ, langA, fTopics, formulaDifficulty);
  };

  return (
    <LanguageContextProvider value={`${langQ}-${langA}-${beEnv}`}>
      <div
        className={`${gstyles.obscurus} ${gstyles.spinnerHolder}`}
        id="spinnerHolder"
      >
        <div className={gstyles.spinner} id="spinner"></div>
      </div>
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
      <h1 className={gstyles.heading1}>Welcome, Player!</h1>
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
      <div className={`${gstyles.flexHorizontal}`}>
        <DifficultyAndTopicsSelector
          allTopics={allTopics}
          fTopics={fTopics}
          setFTopics={setFTopics}
          formulaDifficulty={formulaDifficulty}
          setFormulaDifficulty={setFormulaDifficulty}
        />
        <button
          className={`${gstyles.purpleButton} ${styles.playButton}`}
          onClick={getAndSetPalette}
        >
          Let's play
        </button>
      </div>
    </LanguageContextProvider>
  );
};

export default Play;
