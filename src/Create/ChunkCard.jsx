import React, { useState, useEffect, useContext } from "react";
import styles from "../css/ChunkCard.module.css";
import { fetchLObjsByLemma } from "../utils/getUtils.js";
import LanguageContext from "../context/LanguageContext.js";

const ChunkCard = (props) => {
  const [lObjs, setLObjs] = useState([]);
  const [selectedLObj, setSelectedLObj] = useState({
    postHocAgreeWithPrimary: {
      expectedTypeOnStCh: "string",
      mustBeExistingChunkId: true,
    },
    postHocAgreeWithSecondary: {
      expectedTypeOnStCh: "string",
      mustBeExistingChunkId: true,
    },
    postHocAgreeWithTertiary: {
      expectedTypeOnStCh: "string",
      mustBeExistingChunkId: true,
    },
    person: {
      isLexical: true,
      compatibleWordtypes: ["nounPerson", "nounCommon", "verb", "pronombre"],
      expectedTypeOnStCh: "array",
      possibleTraitValues: ["1per", "2per", "3per", "impersonal"],
    },
    gender: {
      traitValue: ["f"],
      isLexical: true,
      compatibleWordtypes: [
        "nounPerson",
        "nounCommon",
        "verb",
        "adjective",
        "pronombre",
      ],
      expectedTypeOnStCh: "array",
      possibleTraitValues: [
        "m",
        "m1",
        "m2",
        "m3",
        "f",
        "f",
        "f",
        "n",
        "n",
        "n",
        "virile",
        "virile",
        "virile",
        "nonvirile",
        "nonvirile",
        "nonvirile",
      ],
    },
    number: {
      isLexical: true,
      compatibleWordtypes: [
        "nounPerson",
        "nounCommon",
        "verb",
        "adjective",
        "pronombre",
      ],
      expectedTypeOnStCh: "array",
      possibleTraitValues: ["singular", "plural"],
      traitValue: ["singular"],
    },
    gcase: {
      isLexical: true,
      compatibleWordtypes: [
        "nounPerson",
        "nounCommon",
        "adjective",
        "pronombre",
      ],
      expectedTypeOnStCh: "array",
      possibleTraitValues: ["nom", "gen", "dat", "acc", "ins", "loc"],
      traitValue: ["nom"],
    },
    preventAddingFurtherClarifiers: {
      expectedTypeOnStCh: "boolean",
    },
    pleaseShowMultipleWordtypeAllohomClarifiers: {
      expectedTypeOnStCh: "boolean",
      needsNoValidation: true,
    },
    educatorBlocksAnnotationsForTheseTraitKeys: {
      expectedTypeOnStCh: "array",
      ultimatelyMultipleTraitValuesOkay: true,
      needsNoValidation: true,
    },
    formulaImportantTraitKeys: {
      expectedTypeOnStCh: "array",
      ultimatelyMultipleTraitValuesOkay: true,
      needsNoValidation: true,
    },
    blockedTenseDescriptions: {
      expectedTypeOnStCh: "array",
      ultimatelyMultipleTraitValuesOkay: true,
      needsNoValidation: true,
    },
    blockedLemmaObjects: {
      expectedTypeOnStCh: "array",
      ultimatelyMultipleTraitValuesOkay: true,
      needsNoValidation: true,
    },
    hiddenTraits: {
      expectedTypeOnStCh: "array",
      ultimatelyMultipleTraitValuesOkay: true,
      needsNoValidation: true,
    },
    traitsToForceOntoAnswer: {
      expectedTypeOnStCh: "keyValueObject",
      needsNoValidation: true,
    },
    doNotUpdateSpecificLemmasAsIsJustOneMDN: {
      expectedTypeOnStCh: "boolean",
      needsNoValidation: true,
    },
    counterfactuallyImportantTraitKeys: {
      expectedTypeOnStCh: "array",
      ultimatelyMultipleTraitValuesOkay: true,
    },
    dontSpecifyOnThisChunk: {
      expectedTypeOnStCh: "boolean",
    },
    specificLemmas: {
      expectedTypeOnStCh: "array",
      ultimatelyMultipleTraitValuesOkay: true,
    },
    specificIds: {
      expectedTypeOnStCh: "array",
      ultimatelyMultipleTraitValuesOkay: true,
    },
    andTags: {
      expectedTypeOnStCh: "array",
      ultimatelyMultipleTraitValuesOkay: true,
      traitValue: ["animate", "personTest1", "concrete"],
    },
    orTags: {
      expectedTypeOnStCh: "array",
      ultimatelyMultipleTraitValuesOkay: true,
    },
    form: {
      expectedTypeOnStCh: "array",
      isLexical: true,
    },
    chunkId: {
      expectedTypeOnStCh: "string",
    },
    preferredChoicesForQuestionSentence: {
      expectedTypeOnStCh: "keyValueObject",
    },
    agreeWith: {
      expectedTypeOnStCh: "string",
      mustBeExistingChunkId: true,
    },
    connectedTo: {
      expectedTypeOnStCh: "string",
      mustBeExistingChunkId: true,
    },
  });
  const lang1 = useContext(LanguageContext);

  useEffect(() => {
    if (lang1) {
      fetchLObjsByLemma(lang1, props.word).then((fetchedLObjs) => {
        console.log(fetchedLObjs);
        setLObjs(fetchedLObjs);
      });
    }
  }, [lang1, props.word]);

  return (
    <div
      onClick={() => {
        console.log(lObjs);
      }}
      className={styles.card}
      key={props.word}
    >
      <div className={styles.cardButtonsHolder}>
        <button className={styles.cardButton}>E</button>
        <button className={styles.cardButton}>Q</button>
        <button className={styles.cardButton}>L</button>
      </div>
      <h1 className={styles.lemma}>{props.word}</h1>
      {selectedLObj ? (
        <div className={styles.traitsHolder}>
          {Object.keys(selectedLObj).map((traitKey) => (
            <div
              key={`${props.word}-${traitKey}`}
              className={`${styles.traitBox}  ${
                !selectedLObj[traitKey].traitValue && styles.traitBoxEmpty
              }`}
            >
              <p
                className={`${styles.traitTitle} ${
                  selectedLObj[traitKey].isLexical && styles.lexicalTraitTitle
                }`}
              >
                {traitKey}
              </p>
              {selectedLObj[traitKey].traitValue && (
                <div className={styles.traitValuesBox}>
                  <input
                    className={styles.traitValuesInput}
                    value={selectedLObj[traitKey].traitValue}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        {}
      )}
    </div>
  );
};

export default ChunkCard;
