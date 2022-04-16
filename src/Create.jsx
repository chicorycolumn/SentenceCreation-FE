import React, { useState, useContext } from "react";
import { fetchTags, fetchWordsByTag } from "./utils/getUtils.js";
import LanguagesForm from "./Create/LanguagesForm.jsx";
import FormulaSymbolForm from "./Create/FormulaSymbolForm.jsx";
import ChunkCardHolder from "./Create/ChunkCardHolder.jsx";
import { LanguageContextProvider } from "./context/LanguageContext.js";

const Create = () => {
  const [lang1, setLang1] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formulaSymbol, setFormulaSymbol] = useState(
    // "My doctor's doctor is a woman"
    "Woman women bear doctor's doctor"
  );

  return (
    <LanguageContextProvider value={lang1}>
      <div>
        <h1>Create new sentences</h1>
        {isLoading ? <p>Loading...</p> : <p>{lang1}</p>}

        <LanguagesForm setLang1={setLang1} />
        <FormulaSymbolForm setFormulaSymbol={setFormulaSymbol} />
        <ChunkCardHolder formulaSymbol={formulaSymbol} />
      </div>
    </LanguageContextProvider>
  );
};

export default Create;
