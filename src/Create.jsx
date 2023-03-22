import React, { useState } from "react";
import LanguagesForm from "./Create/LanguagesForm.jsx";
import FormulaForm from "./Create/FormulaForm.jsx";
import ChunkCardHolder from "./Create/ChunkCardHolder.jsx";
import { LanguageContextProvider } from "./context/LanguageContext.js";
import { fetchFormula } from "./utils/putUtils.js";

const Create = () => {
  const [lang1, setLang1] = useState("POL");
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState(null);
  const [formulaWasLoaded, setFormulaWasLoaded] = useState(0);

  const [formula, setFormula] = useState([]);

  return (
    <LanguageContextProvider value={lang1}>
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
        <LanguagesForm setLang1={setLang1} />
        <FormulaForm setFormula={setFormula} />
        <button
          onClick={(e) => {
            e.preventDefault();
            fetchFormula("POL-00-101c", "ENG").then((data) => {
              console.log("");
              console.log("");
              console.log("");
              console.log("");
              console.log(
                "Hey look I got this data back from fetchFormula",
                data
              );
              console.log("");
              console.log("");
              console.log("");
              console.log("");

              setFormula(data.questionSentenceFormula.sentenceStructure);
              setFormulaWasLoaded((prev) => prev + 1);
            });
          }}
        >
          Get a formula from BE
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
