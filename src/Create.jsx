import React, { useState, useEffect } from "react";
import LanguagesForm from "./Create/LanguagesForm.jsx";
import FormulaForm from "./Create/FormulaForm.jsx";
import ChunkCardHolder from "./Create/ChunkCardHolder.jsx";
import ListPopup from "./Cogs/ListPopup.jsx";
import { LanguageContextProvider } from "./context/LanguageContext.js";
import { fetchFemula, fetchFormulaIds } from "./utils/putUtils.js";
import $ from "jquery";
import gstyles from "./css/Global.module.css";
import styles from "./css/Create.module.css";
import idUtils from "./utils/identityUtils.js";
const uUtils = require("./utils/universalUtils.js");

const Create = () => {
  const [lang1, setLang1] = useState("POL");
  const [lang2, setLang2] = useState("ENG");
  const [beEnv, setBeEnv] = useState("ref");
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState(null);
  const [femulaWasLoadedFromBE, setFemulaWasLoadedFromBE] = useState(0);

  const [femulaQU, setFemulaQU] = useState([]);
  const [femulaAN, setFemulaAN] = useState([]);
  const [chunkOrdersQU, setChunkOrdersQU] = useState([]);
  const [chunkOrdersAN, setChunkOrdersAN] = useState([]);

  const [showFormulaIdsPopup, setShowFormulaIdsPopup] = useState();
  const [chosenFormulaId, setChosenFormulaId] = useState();
  const [shouldFetchFemula, setShouldFetchFemula] = useState();
  const [fetchedFormulaIds, setFetchedFormulaIds] = useState();
  const [devSavedFormulas, setDevSavedFormulas] = useState([]);

  const fetchAndSetFormulaIds = (
    lang1,
    lang2,
    beEnv,
    loadFemulaFromWrittenInput
  ) => {
    fetchFormulaIds(lang1, lang2, beEnv).then((data) => {
      console.log(
        "\nHey look I got this data back from fetchFormulaIds",
        data,
        "\n"
      );

      let formattedData = {
        title: "Formulas",
        headers: ["Formula ID", "Guidewords", "Equivalents"],
        rows: data.formulaIds.sort((x, y) => {
          let xItem = x[0];
          let yItem = y[0];
          return xItem.localeCompare(yItem);
        }),
        rowCallback: (row) => {
          let formulaId = row[0];
          setChosenFormulaId(formulaId);
          setShouldFetchFemula(true);
          setShowFormulaIdsPopup();
        },
      };

      setFetchedFormulaIds(formattedData);
      if (loadFemulaFromWrittenInput) {
        loadFemulaFromWrittenInput(formattedData);
      } else {
        setShowFormulaIdsPopup(true);
      }
    });
  };

  const onClickFetchFemulas = (e) => {
    e.preventDefault();
    fetchAndSetFormulaIds(lang1, lang2, beEnv);
  };

  useEffect(() => {
    if (chosenFormulaId && shouldFetchFemula) {
      fetchFemula(chosenFormulaId, lang2).then((data) => {
        data.questionSentenceFormula.sentenceStructure.forEach(
          (sentenceStructureItem) => {
            sentenceStructureItem.backedUpStructureChunk =
              uUtils.copyWithoutReference(sentenceStructureItem.structureChunk);
          }
        );

        setFemulaQU(data.questionSentenceFormula.sentenceStructure);
        setChunkOrdersQU(data.questionSentenceFormula.orders);
        setFemulaWasLoadedFromBE((prev) => prev + 1);
      });
    }
  }, [chosenFormulaId, shouldFetchFemula]);

  const formatAndSetFemulaFromWrittenInput = (
    langA,
    langB,
    femulaStringInput
  ) => {
    if (!langA) {
      alert("No language specified.");
      return;
    }
    if (!femulaStringInput) {
      return;
    }

    console.log("CARD IT!", langA, femulaStringInput);

    let femulaFromWrittenInput = femulaStringInput
      .split(" ")
      .map((guideword) => {
        return {
          guideword,
          structureChunk: null,
          femulaItemId: null,
        };
      });

    let uniqueIdNumbers = uUtils.getUniqueNumberStrings(
      10,
      femulaFromWrittenInput.length
    );
    femulaFromWrittenInput.forEach((fItem, index) => {
      fItem.femulaItemId = uniqueIdNumbers[index];
    });

    const _loadFemulaFromWrittenInput = (existingIdsData) => {
      let uniqueId = idUtils.getNewFormulaId(existingIdsData, langA);

      setFemula(femulaFromWrittenInput);
      setShouldFetchFemula();
      setChunkOrdersQU([]);
      setChosenFormulaId(uniqueId);
      setFemulaWasLoadedFromBE(0);
    };

    if (!fetchedFormulaIds) {
      fetchAndSetFormulaIds(langA, langB, beEnv, _loadFemulaFromWrittenInput);
    } else {
      _loadFemulaFromWrittenInput(fetchedFormulaIds);
    }
  };

  return (
    <LanguageContextProvider value={`${lang1}-${lang2}-${beEnv}`}>
      <div className={styles.mainDivCreate}>
        <h1 className={gstyles.heading1}>Create new sentences</h1>
        <div className={styles.horizontalHolder}>
          <FormulaForm
            langA={lang1}
            langB={lang2}
            formatAndSetFemulaFromWrittenInput={
              formatAndSetFemulaFromWrittenInput
            }
            onClickFetchFemulas={onClickFetchFemulas}
          />
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
            devSavedFormulas={devSavedFormulas}
          />
        </div>

        {showFormulaIdsPopup && (
          <ListPopup
            exit={() => {
              setShowFormulaIdsPopup();
            }}
            data={fetchedFormulaIds}
            setData={setFetchedFormulaIds}
            wide={true}
          />
        )}

        <ChunkCardHolder
          femula={femula}
          chunkOrders={chunkOrdersQU}
          setChunkOrders={setChunkOrdersQU}
          setFemula={setFemula}
          chosenFormulaId={chosenFormulaId}
          setChosenFormulaId={setChosenFormulaId}
          batch={"QuestionBatch"}
          femulaWasLoadedFromBE={femulaWasLoadedFromBE}
          fetchedFormulaIds={fetchedFormulaIds}
          setDevSavedFormulas={setDevSavedFormulas}
          formatAndSetFemulaFromWrittenInput={
            formatAndSetFemulaFromWrittenInput
          }
        />
      </div>
    </LanguageContextProvider>
  );
};

export default Create;
