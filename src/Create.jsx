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
  const [femula, setFemula] = useState([]);
  const [chunkOrders, setChunkOrders] = useState([]);
  const [showFemulasPopup, setShowFemulasPopup] = useState();
  const [chosenFormulaId, setChosenFormulaId] = useState();
  const [shouldFetchFemula, setShouldFetchFemula] = useState();
  const [fetchedFormulaIds, setFetchedFormulaIds] = useState();
  const [devSavedFormulas, setDevSavedFormulas] = useState([]);

  const fetchAndSetFormulaIds = (lang1, lang2, beEnv, callback) => {
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
          setShowFemulasPopup();
        },
      };

      setFetchedFormulaIds(formattedData);
      if (callback) {
        callback(formattedData);
      } else {
        setShowFemulasPopup(true);
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

        setFemula(data.questionSentenceFormula.sentenceStructure);
        setChunkOrders(data.questionSentenceFormula.orders);
        setFemulaWasLoadedFromBE((prev) => prev + 1);
      });
    }
  }, [chosenFormulaId, shouldFetchFemula]);

  return (
    <LanguageContextProvider value={`${lang1}-${lang2}-${beEnv}`}>
      <div className={styles.mainDivCreate}>
        <h1 className={gstyles.heading1}>Create new sentences</h1>
        <div className={styles.horizontalHolder}>
          <FormulaForm
            setFemula={(femulaFromWrittenInput) => {
              let callback = (existingIdsData) => {
                let uniqueId = idUtils.getNewFormulaId(existingIdsData, lang1);

                setFemula(femulaFromWrittenInput);
                setShouldFetchFemula();
                setChunkOrders([]);
                setChosenFormulaId(uniqueId);
                setFemulaWasLoadedFromBE(0);
              };

              if (!fetchedFormulaIds) {
                fetchAndSetFormulaIds(lang1, lang2, beEnv, callback);
              } else {
                callback(fetchedFormulaIds);
              }
            }}
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

        {showFemulasPopup && (
          <ListPopup
            exit={() => {
              setShowFemulasPopup();
            }}
            data={fetchedFormulaIds}
            setData={setFetchedFormulaIds}
            wide={true}
          />
        )}

        <ChunkCardHolder
          femula={femula}
          chunkOrders={chunkOrders}
          setChunkOrders={setChunkOrders}
          setFemula={setFemula}
          chosenFormulaId={chosenFormulaId}
          setChosenFormulaId={setChosenFormulaId}
          batch={"QuestionBatch"}
          femulaWasLoadedFromBE={femulaWasLoadedFromBE}
          fetchedFormulaIds={fetchedFormulaIds}
          setDevSavedFormulas={setDevSavedFormulas}
        />
      </div>
    </LanguageContextProvider>
  );
};

export default Create;
