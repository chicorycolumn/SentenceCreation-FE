import React, { useState, useEffect } from "react";
import LanguagesForm from "./Create/LanguagesForm.jsx";
import FormulaForm from "./Create/FormulaForm.jsx";
import ChunkCardHolder from "./Create/ChunkCardHolder.jsx";
import ListPopup from "./Cogs/ListPopup.jsx";
import { LanguageContextProvider } from "./context/LanguageContext.js";
import { fetchFormula, fetchFormulaIds } from "./utils/putUtils.js";
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
  const [formulaWasLoadedFromBE, setFormulaWasLoadedFromBE] = useState(0);
  const [formula, setFormula] = useState([]);
  const [chunkOrders, setChunkOrders] = useState([]);
  const [showFormulasPopup, setShowFormulasPopup] = useState();
  const [chosenFormulaID, setChosenFormulaID] = useState();
  const [shouldFetchFormula, setShouldFetchFormula] = useState();
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
          let formulaID = row[0];
          setChosenFormulaID(formulaID);
          setShouldFetchFormula(true);
          setShowFormulasPopup();
        },
      };

      setFetchedFormulaIds(formattedData);
      if (callback) {
        callback(formattedData);
      } else {
        setShowFormulasPopup(true);
      }
    });
  };

  const onClickFetchFormulas = (e) => {
    e.preventDefault();
    fetchAndSetFormulaIds(lang1, lang2, beEnv);
  };

  useEffect(() => {
    if (chosenFormulaID && shouldFetchFormula) {
      fetchFormula(chosenFormulaID, lang2).then((data) => {
        data.questionSentenceFormula.sentenceStructure.forEach(
          (sentenceStructureItem) => {
            sentenceStructureItem.backedUpStructureChunk =
              uUtils.copyWithoutReference(sentenceStructureItem.structureChunk);
          }
        );

        setFormula(data.questionSentenceFormula.sentenceStructure);
        setChunkOrders(data.questionSentenceFormula.orders);
        setFormulaWasLoadedFromBE((prev) => prev + 1);
      });
    }
  }, [chosenFormulaID, shouldFetchFormula]);

  return (
    <LanguageContextProvider value={`${lang1}-${lang2}-${beEnv}`}>
      <div className={styles.mainDivCreate}>
        <h1 className={gstyles.heading1}>Create new sentences</h1>
        <div className={styles.horizontalHolder}>
          <FormulaForm
            setFormula={(formulaItemsArr) => {
              let callback = (existingIdsData) => {
                let uniqueId = idUtils.getNewSentenceFormulaId(
                  existingIdsData,
                  lang1
                );

                setFormula(formulaItemsArr);
                setShouldFetchFormula();
                setChunkOrders([]);
                setChosenFormulaID(uniqueId);
                setFormulaWasLoadedFromBE(0);
              };

              if (!fetchedFormulaIds) {
                fetchAndSetFormulaIds(lang1, lang2, beEnv, callback);
              } else {
                callback(fetchedFormulaIds);
              }
            }}
            onClickFetchFormulas={onClickFetchFormulas}
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

        {showFormulasPopup && (
          <ListPopup
            exit={() => {
              setShowFormulasPopup();
            }}
            data={fetchedFormulaIds}
            setData={setFetchedFormulaIds}
            wide={true}
          />
        )}

        <ChunkCardHolder
          formula={formula}
          chunkOrders={chunkOrders}
          setChunkOrders={setChunkOrders}
          setFormula={setFormula}
          chosenFormulaID={chosenFormulaID}
          setChosenFormulaID={setChosenFormulaID}
          batch={"QuestionBatch"}
          formulaWasLoadedFromBE={formulaWasLoadedFromBE}
          fetchedFormulaIds={fetchedFormulaIds}
          setDevSavedFormulas={setDevSavedFormulas}
        />
      </div>
    </LanguageContextProvider>
  );
};

export default Create;
