import React, { useState } from "react";
import { fetchTags, fetchWordsByTag } from "./utils/getUtils.js";
import LanguagesForm from "./Create/LanguagesForm.jsx";
import FormulaSymbolForm from "./Create/FormulaSymbolForm.jsx";
import LemmaCardHolder from "./Create/LemmaCardHolder.jsx";

const Create = () => {
  const [lang1, setLang1] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formulaSymbol, setFormulaSymbol] = useState("");

  return (
    <div>
      <h1>Create new sentences</h1>
      {isLoading ? <p>Loading...</p> : <p>{lang1}</p>}

      <LanguagesForm setLang1={setLang1} />
      <FormulaSymbolForm setFormulaSymbol={setFormulaSymbol} />
      <LemmaCardHolder formulaSymbol={formulaSymbol} />
    </div>
  );
};

export default Create;
