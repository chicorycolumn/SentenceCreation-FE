import React, { useState, useContext } from "react";
import LanguagesForm from "./Create/LanguagesForm.jsx";
import FormulaSymbolForm from "./Create/FormulaSymbolForm.jsx";
import ChunkCardHolder from "./Create/ChunkCardHolder.jsx";
import { LanguageContextProvider } from "./context/LanguageContext.js";

const Create = () => {
  const [lang1, setLang1] = useState("ENG");
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState(null);
  const [formulaSymbol, setFormulaSymbol] = useState(
    // "My doctor's doctor is a woman"
    // "Woman women bear doctor's doctor"
    // "kobieta"
    "The woman is red"
  );

  return (
    <LanguageContextProvider value={lang1}>
      <div>
        <h1>Create new sentences</h1>
        <LanguagesForm setLang1={setLang1} />
        <FormulaSymbolForm setFormulaSymbol={setFormulaSymbol} />
        <ChunkCardHolder
          formulaSymbol={formulaSymbol}
          setFormulaSymbol={setFormulaSymbol}
        />
      </div>
    </LanguageContextProvider>
  );
};

export default Create;
