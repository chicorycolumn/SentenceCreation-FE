import React, { useState, useContext } from "react";
import LanguagesForm from "./Create/LanguagesForm.jsx";
import FormulaForm from "./Create/FormulaForm.jsx";
import ChunkCardHolder from "./Create/ChunkCardHolder.jsx";
import { LanguageContextProvider } from "./context/LanguageContext.js";

const Create = () => {
  const [lang1, setLang1] = useState("POL");
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState(null);
  const [formula, setFormula] = useState(
    // "My doctor's doctor is a woman"
    // "Woman women bear doctor's doctor"
    // "kobieta"
    // [
    //   { word: "the", structureChunk: null },
    //   { word: "woman", structureChunk: null },
    //   { word: "is", structureChunk: null },
    //   { word: "red", structureChunk: null },
    // ]
    [
      { word: "kobieta", structureChunk: null },
      { word: "jest", structureChunk: null },
      { word: "czerwony", structureChunk: null },
    ]
  );

  return (
    <LanguageContextProvider value={lang1}>
      <div>
        <h1>Create new sentences</h1>
        <LanguagesForm setLang1={setLang1} />
        <FormulaForm setFormula={setFormula} />
        <ChunkCardHolder formula={formula} setFormula={setFormula} />
      </div>
    </LanguageContextProvider>
  );
};

export default Create;
