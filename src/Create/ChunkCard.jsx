import React, { useState, useEffect, useContext } from "react";
import styles from "../css/ChunkCard.module.css";
import gstyles from "../css/Global.module.css";
import { fetchLObjsByLemma } from "../utils/getUtils.js";
import LanguageContext from "../context/LanguageContext.js";
import TraitBox from "./TraitBox.jsx";
const uUtils = require("../utils/universalUtils.js");
const diUtils = require("../utils/displayUtils.js");

const ChunkCard = (props) => {
  const [lObjs, setLObjs] = useState([]);
  const [structureChunk, setStructureChunk] = useState({
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
      traitValue: ["pet"],
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
  const [showMoreTraitKeys, setShowMoreTraitKeys] = useState();
  const lang1 = useContext(LanguageContext);

  useEffect(() => {
    if (lang1) {
      fetchLObjsByLemma(lang1, props.word).then((fetchedLObjs) => {
        setLObjs(fetchedLObjs);
      });
    }
  }, [lang1, props.word]);

  let traitKeysGroup1 = [];
  let traitKeysGroup2 = [];

  if (structureChunk) {
    let { orderedTraitKeysGroup1, orderedTraitKeysGroup2 } =
      diUtils.orderTraitKeys(structureChunk);
    traitKeysGroup1 = orderedTraitKeysGroup1;
    traitKeysGroup2 = orderedTraitKeysGroup2;
  }

  return (
    <div className={styles.card} key={props.word}>
      <div className={styles.cardButtonsHolder}>
        <button className={styles.cardButton}>Edit</button>
        <button className={styles.cardButton}>Query</button>
        <button className={styles.cardButton}>Link</button>
      </div>
      <h1
        onClick={() => {
          Object.keys(structureChunk).forEach((traitKey) => {
            let traitObject = structureChunk[traitKey];
            if (!uUtils.isEmpty(traitObject.traitValue)) {
              console.log(traitKey, traitObject.traitValue);
            }
          });
        }}
        className={styles.lemma}
      >
        {props.word}
      </h1>
      {structureChunk ? (
        <div className={styles.traitBoxesHolder}>
          {traitKeysGroup1.map((traitKey) => {
            let traitObject = structureChunk[traitKey];
            let traitKey2 = null;

            if (traitKey === "andTags") {
              traitKey2 = "orTags";
            }

            let traitObject2 = traitKey2 ? structureChunk[traitKey2] : null;

            return (
              traitKey !== "orTags" && (
                <TraitBox
                  key={traitKey}
                  traitKey={traitKey}
                  traitKey2={traitKey2}
                  traitObject={traitObject}
                  traitObject2={traitObject2}
                  word={props.word}
                  setStructureChunk={setStructureChunk}
                />
              )
            );
          })}
          <button
            onClick={() => {
              setShowMoreTraitKeys((prevState) => !prevState);
            }}
          >
            Show more
          </button>
          {(showMoreTraitKeys ||
            traitKeysGroup2.some(
              (traitKey) =>
                structureChunk[traitKey] &&
                !uUtils.isEmpty(structureChunk[traitKey].traitValue)
            )) &&
            traitKeysGroup2.map((traitKey) => (
              <TraitBox
                key={traitKey}
                traitKey={traitKey}
                traitObject={structureChunk[traitKey]}
                word={props.word}
                setStructureChunk={setStructureChunk}
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
