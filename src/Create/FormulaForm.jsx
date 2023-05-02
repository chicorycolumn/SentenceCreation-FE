import React, { useState, useContext, useEffect } from "react";
import LanguageContext from "../context/LanguageContext.js";
import idUtils from "../utils/identityUtils.js";
import styles from "../css/FormulaForm.module.css";
import gstyles from "../css/Global.module.css";
import Tooltip from "../Cogs/Tooltip.jsx";
import ChunkOrdersPopup from "./ChunkOrdersPopup.jsx";
const uUtils = require("../utils/universalUtils.js");

const FormulaForm = (props) => {
  const [femulaStringInput, setFemulaStringInput] = useState(
    // "on jest cebula on jest cebula"
    props.batch === "Question"
      ? "kobieta jest *bardzo czerwona"
      : "the woman is *very blue"
    // "on jest niebieskim chłopcem"
  );
  const [showConnectionsQtoA, setShowConnectionsQtoA] = useState();
  const [doneConnectionsQtoA, setDoneConnectionsQtoA] = useState();
  const [connectionsQtoA, setConnectionsQtoA] = useState([]);

  useEffect(() => {
    if (doneConnectionsQtoA) {
      props.formatAndSetFemulaFromWrittenInput(
        props.lang1,
        props.lang2,
        femulaStringInput,
        connectionsQtoA
      );
    }
  }, [doneConnectionsQtoA]);

  return (
    <>
      {props.batch === "Question" || props.questionSavedFormula ? (
        <div className={styles.formHolder}>
          {props.batch === "Answer" && showConnectionsQtoA ? (
            <ChunkOrdersPopup
              mode={"222"}
              exit={() => {
                setShowConnectionsQtoA(false);
                setDoneConnectionsQtoA(true);
              }}
              chunkOrders={connectionsQtoA}
              setChunkOrders={setConnectionsQtoA}
              femula2={femulaStringInput.split(" ").map((s, sIndex) => {
                return {
                  guideword: s,
                  structureChunk: { chunkId: { traitValue: `${sIndex}-${s}` } },
                };
              })}
              femula={props.questionSavedFormula.sentenceStructure.map(
                (stCh) => {
                  return {
                    guideword: stCh.chunkId.split("-").slice(-1),
                    structureChunk: { chunkId: { traitValue: stCh.chunkId } },
                  };
                }
              )}
            />
          ) : (
            ""
          )}
          <h4
            className={styles.title}
          >{`New ${props.batch} sentence (${props.lang1})`}</h4>
          <form className={`${styles.form} ${gstyles.tooltipHolderDelayed}`}>
            <Tooltip
              text="Prefix with an asterisk to make a fixed chunk, eg 'my name is *Jen'"
              number={4}
            />
            <input
              rows={2}
              className={styles.input}
              onChange={(e) => {
                setFemulaStringInput(e.target.value);
              }}
              placeholder="Enter example sentence"
              value={femulaStringInput}
            ></input>
            <button
              alt="Right arrow go arrow icon"
              className={styles.button1}
              type="submit"
              onClick={(e) => {
                e.preventDefault();

                if (props.batch === "Answer") {
                  setShowConnectionsQtoA(true);
                  return;
                }
                props.formatAndSetFemulaFromWrittenInput(
                  props.lang1,
                  props.lang2,
                  femulaStringInput
                );
              }}
            >
              &#10157;
            </button>
          </form>

          <div className={styles.button2Holder}>
            <button
              className={styles.button2}
              onClick={props.onClickFetchFemulas}
            >
              or select existing formula
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.formHolder}>
          To unlock this box and create Answer sentence, first create Question
          sentence then mark ready by clicking ✔ button.
        </div>
      )}
    </>
  );
};

export default FormulaForm;
