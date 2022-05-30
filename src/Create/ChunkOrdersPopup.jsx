import React, { useState } from "react";
import styles from "../css/ChunkOrdersPopup.module.css";
import pstyles from "../css/Popup.module.css";
import gstyles from "../css/Global.module.css";
import diUtils from "../utils/displayUtils.js";
import uUtils from "../utils/universalUtils.js";

const ChunkOrdersPopup = (props) => {
  const [orderBuilt, setOrderBuilt] = useState([]);
  const [highlightedButton, setHighlightedButton] = useState();

  const getLemmaFromFormula = (chunkId) => {
    return props.formula.filter(
      (obj) => obj.structureChunk.chunkId.traitValue === chunkId
    )[0].word;
  };

  const stringifyChunkOrder = (chunkOrder) => {
    return chunkOrder.join(" ");
  };

  return (
    <div className={`${pstyles.mainbox} ${styles.mainboxWide}`}>
      <div className={pstyles.topHolder}>
        <div className={`${gstyles.sideButton} ${gstyles.invisible}`}></div>
        <h1 className={pstyles.title}>Select orders for sentence.</h1>
        <button
          alt="Cross icon"
          className={`${gstyles.sideButton} ${gstyles.redButton}`}
          onClick={props.exit}
        >
          &times;
        </button>
      </div>

      <div className={styles.buttonHolder}>
        {props.formula.map((obj) => {
          let chunkId = obj.structureChunk.chunkId.traitValue;
          let lemma = obj.word;

          return (
            <button
              key={chunkId}
              className={`${styles.chunkButton} ${
                highlightedButton === chunkId && styles.highlightedButton
              }`}
              onClick={() => {
                setOrderBuilt((prev) => [...prev, chunkId]);
              }}
            >
              <p className={styles.buttonTopHalf}>{lemma}</p>
              <p className={styles.buttonBottomHalf}>{chunkId}</p>
            </button>
          );
        })}
      </div>

      <div className={styles.orderBuilderHolder}>
        <div className={styles.orderBuilder}>
          {orderBuilt.map((chunkId, index) => {
            let lemma = getLemmaFromFormula(chunkId);
            return (
              <button
                key={`orderBuilt-${chunkId}-${index}`}
                className={styles.chunkButtonMini}
                onMouseEnter={() => {
                  setHighlightedButton(chunkId);
                }}
                onMouseLeave={() => {
                  setHighlightedButton();
                }}
                onClick={() => {
                  setHighlightedButton();
                  setOrderBuilt((prev) =>
                    uUtils.returnArrayWithItemAtIndexRemoved(prev, index)
                  );
                }}
              >
                {lemma}
              </button>
            );
          })}
        </div>
        <button
          alt="Tick icon / Check icon"
          className={gstyles.tickButton}
          onClick={() => {
            props.setChunkOrders((prev) => {
              let stringifiedOrderBuilt = stringifyChunkOrder(orderBuilt);
              let indexOfExistingOrder;

              if (
                props.chunkOrders.filter((chunkOrder, index) => {
                  console.log(index);
                  if (
                    stringifyChunkOrder(chunkOrder) === stringifiedOrderBuilt
                  ) {
                    indexOfExistingOrder = index;
                    return true;
                  }

                  return false;
                }).length
              ) {
                alert(
                  `That chunk order is already present at ${
                    indexOfExistingOrder + 1
                  }.`
                );
                return prev;
              }
              setOrderBuilt([]);
              return [...prev, [...orderBuilt]];
            });
          }}
        >
          &#10003;
        </button>
        <button
          alt="Undo icon"
          className={`${gstyles.redButton} ${gstyles.rectangleButton}`}
          onClick={() => {
            setOrderBuilt([]);
          }}
        >
          &#8634;
        </button>
      </div>

      <div className={pstyles.bottomHolder}>
        <ul>
          {props.chunkOrders.map((chunkOrder, index) => (
            <li className={styles.listitem} key={`chunkOrder-${index}`}>
              <button
                className={`${gstyles.redButton}`}
                onClick={() => {
                  props.setChunkOrders(
                    uUtils.returnArrayWithItemAtIndexRemoved(
                      props.chunkOrders,
                      index
                    )
                  );
                }}
              >
                &times;
              </button>
              {chunkOrder.map((chunkId, index) => (
                <span
                  key={`chunkOrder-${index}-${chunkId}-${index}`}
                  className={styles.wordspan}
                >
                  {getLemmaFromFormula(chunkId)}
                </span>
              ))}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChunkOrdersPopup;
