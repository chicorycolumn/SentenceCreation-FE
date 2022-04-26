import React, { useState, useEffect, useContext } from "react";
import styles from "../css/ChunkCard.module.css";
import { fetchLObjsByLemma } from "../utils/getUtils.js";
import LanguageContext from "../context/LanguageContext.js";
import TraitBox from "./TraitBox.jsx";
const uUtils = require("../utils/universalUtils.js");

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
      traitValue: [],
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
        "n",
        "virile",
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
      traitValue: [],
      ultimatelyMultipleTraitValuesOkay: true,
      needsNoValidation: true,
    },
    formulaImportantTraitKeys: {
      expectedTypeOnStCh: "array",
      traitValue: [],
      ultimatelyMultipleTraitValuesOkay: true,
      needsNoValidation: true,
    },
    blockedTenseDescriptions: {
      expectedTypeOnStCh: "array",
      traitValue: [],
      ultimatelyMultipleTraitValuesOkay: true,
      needsNoValidation: true,
    },
    blockedLemmaObjects: {
      expectedTypeOnStCh: "array",
      traitValue: [],
      ultimatelyMultipleTraitValuesOkay: true,
      needsNoValidation: true,
    },
    hiddenTraits: {
      expectedTypeOnStCh: "array",
      traitValue: [],
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
      traitValue: [],
      ultimatelyMultipleTraitValuesOkay: true,
    },
    dontSpecifyOnThisChunk: {
      expectedTypeOnStCh: "boolean",
    },
    specificLemmas: {
      expectedTypeOnStCh: "array",
      traitValue: [],
      ultimatelyMultipleTraitValuesOkay: true,
    },
    specificIds: {
      expectedTypeOnStCh: "array",
      traitValue: [],
      ultimatelyMultipleTraitValuesOkay: true,
    },
    andTags: {
      expectedTypeOnStCh: "array",
      ultimatelyMultipleTraitValuesOkay: true,
      traitValue: ["animate", "personTest1", "concrete"],
    },
    orTags: {
      expectedTypeOnStCh: "array",
      traitValue: [],
      ultimatelyMultipleTraitValuesOkay: true,
    },
    form: {
      expectedTypeOnStCh: "array",
      traitValue: [],
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
    <div className={styles.card} key={props.word}>
      <div className={styles.cardButtonsHolder}>
        <button className={styles.cardButton}>Edit</button>
        <button className={styles.cardButton}>Query</button>
        <button className={styles.cardButton}>Link</button>
      </div>
      <h1
        onClick={() => {
          Object.keys(selectedLObj).forEach((traitKey) => {
            let traitObject = selectedLObj[traitKey];
            if (!uUtils.isEmpty(traitObject.traitValue)) {
              console.log(traitKey, traitObject.traitValue);
            }
          });
        }}
        className={styles.lemma}
      >
        {props.word}
      </h1>
      {selectedLObj ? (
        <div className={styles.traitBoxesHolder}>
          {Object.keys(selectedLObj).map((traitKey) => (
            <TraitBox
              key={traitKey}
              traitKey={traitKey}
              traitObject={selectedLObj[traitKey]}
              word={props.word}
              setSelectedLObj={setSelectedLObj}
            />
          ))}
        </div>
      ) : (
        {}
      )}
    </div>
  );
};

export default ChunkCard;
