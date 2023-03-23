import React, { useState, useEffect } from "react";
import LanguagesForm from "./Create/LanguagesForm.jsx";
import FormulaForm from "./Create/FormulaForm.jsx";
import ChunkCardHolder from "./Create/ChunkCardHolder.jsx";
import ListPopup from "./Cogs/ListPopup.jsx";
import { LanguageContextProvider } from "./context/LanguageContext.js";
import { fetchFormula } from "./utils/putUtils.js";
import $ from "jquery";

const Create = () => {
  const [lang1, setLang1] = useState("POL");
  const [lang2, setLang2] = useState("ENG");
  const [beEnv, setBeEnv] = useState("ref");
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState(null);
  const [formulaWasLoaded, setFormulaWasLoaded] = useState(0);
  const [formula, setFormula] = useState([]);
  const [showFormulasPopup, setShowFormulasPopup] = useState();
  const [chosenFormulaID, setChosenFormulaID] = useState();

  let testFetchedFormulas = {
    title: "Formulas",
    headers: ["Formula ID", "Guidewords"],
    rows: [
      ["POL-00-101c", "Kobieta czyta."],
      ["POL-00-101a", "Jestem lekarzem."],
    ],
    rowCallback: (row) => {
      let formulaID = row[0];
      setChosenFormulaID(formulaID);
      setShowFormulasPopup();
    },
  };

  useEffect(() => {
    if (chosenFormulaID) {
      fetchFormula(chosenFormulaID, "ENG").then((data) => {
        console.log(
          "\nHey look I got this data back from fetchFormula",
          data,
          "\n"
        );

        setFormula(data.questionSentenceFormula.sentenceStructure);
        setFormulaWasLoaded((prev) => prev + 1);
        setChosenFormulaID();
      });
    }
  }, [chosenFormulaID]);

  return (
    <LanguageContextProvider value={`${lang1}-${lang2}-${beEnv}`}>
      <div>
        <h1>Create new sentences</h1>
        <button
          onClick={(e) => {
            e.preventDefault();
            console.log(formula);
          }}
        >
          see formula
        </button>
        <LanguagesForm
          setLang1={(newValue) => {
            setLang1((prev) => {
              if (lang2 === newValue) {
                $(`#lang2_${prev}_label`).click();
              }
              return newValue;
            });
          }}
          setLang2={(newValue) => {
            setLang2((prev) => {
              if (lang1 === newValue) {
                $(`#lang1_${prev}_label`).click();
              }
              return newValue;
            });
          }}
          setBeEnv={setBeEnv}
        />
        <FormulaForm setFormula={setFormula} />
        {showFormulasPopup && (
          <ListPopup
            exit={() => {
              setShowFormulasPopup();
            }}
            data={testFetchedFormulas}
          />
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            setShowFormulasPopup(true);
          }}
        >
          Load a formula
        </button>

        <ChunkCardHolder
          formula={formula}
          setFormula={setFormula}
          batch={"QuestionBatch"}
          formulaWasLoaded={formulaWasLoaded}
          setFormulaWasLoaded={setFormulaWasLoaded}
        />
      </div>
    </LanguageContextProvider>
  );
};

export default Create;
