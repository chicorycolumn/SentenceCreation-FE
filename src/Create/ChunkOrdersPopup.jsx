import React, { useState, useEffect } from "react";
import styles from "../css/ChunkOrdersPopup.module.css";
import pstyles from "../css/Popup.module.css";
import gstyles from "../css/Global.module.css";
import uUtils from "../utils/universalUtils.js";
import $ from "jquery";

const ChunkOrdersPopup = (props) => {
  const [orderBuilt, setOrderBuilt] = useState([]);
  const [meaninglessCounter, setMeaninglessCounter] = useState(0);
  const [highlightedButton, setHighlightedButton] = useState();

  const getLemmaFromFormula = (chunkId) => {
    return props.formula.filter(
      (obj) => obj.structureChunk.chunkId.traitValue === chunkId
    )[0].word;
  };

  const stringifyChunkOrder = (chunkOrder) => {
    return chunkOrder.join(" ");
  };

  const clearOrder = () => {
    if (orderBuilt.length) {
      setOrderBuilt([]);
    }
  };
  const addOrder = (orderBuilt) => {
    if (orderBuilt.length) {
      props.setChunkOrders((prev) => {
        let stringifiedOrderBuilt = stringifyChunkOrder(orderBuilt);
        let indexOfExistingOrder;

        if (
          props.chunkOrders.filter((obj, index) => {
            let chunkOrder = obj.order;
            if (stringifyChunkOrder(chunkOrder) === stringifiedOrderBuilt) {
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
        return [...prev, { isPrimary: true, order: [...orderBuilt] }];
      });
    }
  };

  const exit = () => {
    $(document).off("keyup");
    props.exit();
  };

  useEffect(() => {
    uUtils.addListener($, document, "keyup", (e) => {
      console.log("via ChunkOrdersPopup document listened keyup:", e.key);
      if (["Enter", "Escape", "Backspace"].includes(e.key)) {
        $("#ChunkOrdersPopup-exitbutton").addClass(gstyles.greyButtonActive);
        setTimeout(exit, 150);
      }
    });
  }, []);

  return (
    <>
      <div className={gstyles.obscurus} onClick={exit}></div>
      <div className={`${pstyles.mainbox} ${styles.mainboxWide}`}>
        <div className={pstyles.topHolder}>
          <div className={`${gstyles.sideButton} ${gstyles.invisible}`}></div>
          <h1 className={pstyles.title}>Select orders for sentence.</h1>
          <button
            id="ChunkOrdersPopup-exitbutton"
            alt="Exit icon"
            className={`${gstyles.sideButton} ${gstyles.greyButton}`}
            onClick={exit}
          >
            &#8679;
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
                onKeyUp={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onKeyDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log(
                    "via ChunkOrdersPopup document listened keyup:",
                    e.key
                  );
                  if (["Enter"].includes(e.key)) {
                    $("#ChunkOrdersPopup-tickbutton").addClass(
                      gstyles.tickButtonActive
                    );
                    setTimeout(() => {
                      addOrder(orderBuilt);
                      $("#ChunkOrdersPopup-tickbutton").removeClass(
                        gstyles.tickButtonActive
                      );
                    }, 50);
                    return;
                  } else if (["Backspace"].includes(e.key)) {
                    $("#ChunkOrdersPopup-clearbutton").addClass(
                      gstyles.redButtonActive
                    );
                    setTimeout(() => {
                      clearOrder();
                      $("#ChunkOrdersPopup-clearbutton").removeClass(
                        gstyles.redButtonActive
                      );
                    }, 50);
                    return;
                  }
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
            id="ChunkOrdersPopup-tickbutton"
            alt="Tick icon / Check icon"
            className={gstyles.tickButton}
            onClick={() => {
              addOrder(orderBuilt);
            }}
          >
            &#10003;
          </button>
          <button
            id="ChunkOrdersPopup-clearbutton"
            alt="Cross icon"
            className={`${gstyles.redButton} ${gstyles.rectangleButton}`}
            onClick={clearOrder}
          >
            &times;
          </button>
        </div>

        <div className={`${pstyles.bottomHolder} ${styles.bottomHolder}`}>
          <ul>
            {props.chunkOrders.map((obj, index) => {
              let { isPrimary, order } = obj;
              return (
                <li className={styles.listitem} key={`chunkOrder-${index}`}>
                  <span className={styles.indexSpan}>{index + 1}</span>
                  <button
                    alt="Black circle / White circle icon"
                    className={`${gstyles.blueButton} ${styles.microButton}`}
                    onClick={() => {
                      setMeaninglessCounter((prev) => prev + 1);
                      setTimeout(() => {
                        props.setChunkOrders((prev) => {
                          let newArr = prev.map((obj, i) => {
                            if (i === index) {
                              obj.isPrimary = !prev[index].isPrimary;
                            }
                            return obj;
                          });
                          return newArr;
                        });
                      }, 0);
                    }}
                  >
                    {isPrimary ? "●" : "○"}
                  </button>
                  <button
                    alt="Cross icon"
                    className={`${gstyles.redButton} ${styles.microButton}`}
                    onClick={() => {
                      if (props.chunkOrders.length === 1) {
                        alert(
                          "There must be at least one order. Add another before you remove this one."
                        );
                        return;
                      }
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
                  {order.map((chunkId, index) => (
                    <span
                      key={`chunkOrder-${index}-${chunkId}-${index}`}
                      className={`${styles.wordspan} ${
                        !isPrimary && gstyles.translucent2
                      }`}
                    >
                      {getLemmaFromFormula(chunkId)}
                    </span>
                  ))}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ChunkOrdersPopup;
