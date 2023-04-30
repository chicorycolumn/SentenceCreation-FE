import React, { useState, useEffect, useContext } from "react";
import FormulaForm from "./FormulaForm.jsx";
import ChunkCardTray from "./ChunkCardTray.jsx";
import ListPopup from "../Cogs/ListPopup.jsx";
import LanguageContext from "../context/LanguageContext.js";
import { fetchFemula, fetchFormulaIds } from ".././utils/putUtils.js";
import gstyles from ".././css/Global.module.css";
import styles from ".././css/ChunkCardTrayHolder.module.css";
import idUtils from ".././utils/identityUtils.js";
const uUtils = require(".././utils/universalUtils.js");

const ChunkCardTrayHolder = (props) => {
  const [femulaWasLoadedFromBE, setFemulaWasLoadedFromBE] = useState(0);
  const [femula, setFemula] = useState([]);
  const [chunkOrders, setChunkOrders] = useState([]);
  const [showFemulasPopup, setShowFemulasPopup] = useState();
  const [chosenFormulaId, setChosenFormulaId] = useState();
  const [shouldFetchFemula, setShouldFetchFemula] = useState();
  const [fetchedFormulaIds, setFetchedFormulaIds] = useState();

  const { beEnv } = idUtils.getLangsAndEnv(useContext(LanguageContext));

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
          setShowFemulasPopup();
        },
      };

      setFetchedFormulaIds(formattedData);
      if (loadFemulaFromWrittenInput) {
        loadFemulaFromWrittenInput(formattedData);
      } else {
        setShowFemulasPopup(true);
      }
    });
  };

  const onClickFetchFemulas = (e) => {
    e.preventDefault();
    fetchAndSetFormulaIds(props.lang1, props.lang2, beEnv);
  };

  useEffect(() => {
    if (chosenFormulaId && shouldFetchFemula) {
      fetchFemula(chosenFormulaId, props.lang2).then((data) => {
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

  const formatAndSetFemulaFromWrittenInput = (
    lang1,
    lang2,
    femulaStringInput
  ) => {
    if (!lang1) {
      alert("No language specified.");
      return;
    }
    if (!femulaStringInput) {
      return;
    }

    console.log("CARD IT!", lang1, femulaStringInput);

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
      let uniqueId = idUtils.getNewFormulaId(existingIdsData, lang1);

      setFemula(femulaFromWrittenInput);
      setShouldFetchFemula();
      setChunkOrders([]);
      setChosenFormulaId(uniqueId);
      setFemulaWasLoadedFromBE(0);
    };

    if (!fetchedFormulaIds) {
      fetchAndSetFormulaIds(lang1, lang2, beEnv, _loadFemulaFromWrittenInput);
    } else {
      _loadFemulaFromWrittenInput(fetchedFormulaIds);
    }
  };

  return (
    <div
      className={styles.chunkCardTrayHolder}
      id={`chunkCardTrayHolder-${props.batch}`}
    >
      <div className={`{styles.horizontalHolder} ${styles.marginAdjustA}`}>
        <FormulaForm
          batch={props.batch}
          lang1={props.lang1}
          lang2={props.lang2}
          formatAndSetFemulaFromWrittenInput={
            formatAndSetFemulaFromWrittenInput
          }
          onClickFetchFemulas={onClickFetchFemulas}
          questionSavedFormula={props.questionSavedFormula}
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

      {femula.length ? (
        <ChunkCardTray
          lang1={props.lang1}
          lang2={props.lang2}
          femula={femula}
          chunkOrders={chunkOrders}
          setChunkOrders={setChunkOrders}
          setFemula={setFemula}
          chosenFormulaId={chosenFormulaId}
          setChosenFormulaId={setChosenFormulaId}
          batch={props.batch}
          femulaWasLoadedFromBE={femulaWasLoadedFromBE}
          fetchedFormulaIds={fetchedFormulaIds}
          setDevSavedFormulas={props.setDevSavedFormulas}
          setQuestionSavedFormula={props.setQuestionSavedFormula}
          formatAndSetFemulaFromWrittenInput={
            formatAndSetFemulaFromWrittenInput
          }
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default ChunkCardTrayHolder;
