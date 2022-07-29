import React, { useState } from "react";
import LanguagesForm from "./Create/LanguagesForm.jsx";
import FormulaForm from "./Create/FormulaForm.jsx";
import ChunkCardHolder from "./Create/ChunkCardHolder.jsx";
import { LanguageContextProvider } from "./context/LanguageContext.js";

const Create = () => {
  const [lang1, setLang1] = useState("POL");
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState(null);
  const [formula, setFormula] = useState([]);

  return (
    <LanguageContextProvider value={lang1}>
      <div>
        <h1>Create new sentences</h1>
        <LanguagesForm setLang1={setLang1} />
        <FormulaForm setFormula={setFormula} />
        <ChunkCardHolder
          formula={formula}
          setFormula={setFormula}
          batch={"QuestionBatch"}
        />
      </div>
    </LanguageContextProvider>
  );
};

export default Create;
