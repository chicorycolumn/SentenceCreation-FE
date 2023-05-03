import React, { useState, useEffect } from "react";
import styles from "../css/ChunkOrdersPopup.module.css";
import Tooltip from "../Cogs/Tooltip.jsx";
import pstyles from "../css/Popup.module.css";
import gstyles from "../css/Global.module.css";
import uUtils from "../utils/universalUtils.js";
import $ from "jquery";
import ChunkOrdersButton from "./ChunkOrdersButton";

const ChunkOrdersPopup = (props) => {
  const [orderBuilt, setOrderBuilt] = useState([]);
  const [meaninglessCounter, setMeaninglessCounter] = useState(0);
  const [highlightedButton, setHighlightedButton] = useState();

  const { mode } = props;

  const getGuidewordFromFemula = (chunkId, femula, femula2) => {
    let femulaItem = femula.find(
      (fItem) => fItem.structureChunk.chunkId.traitValue === chunkId
    );
    if (mode === "Q2A" && !femulaItem) {
      femulaItem = femula2.find(
        (fItem) => fItem.structureChunk.chunkId.traitValue === chunkId
      );
    }
    if (!femulaItem) {
      console.log(
        `getGuidewordFromFemula found no femula item for "${chunkId}".`
      );
      return "?10";
    }
    return femulaItem.guideword;
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
          props.chunkOrders.filter((orderObj, index) => {
            let chunkOrder = orderObj.order;
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
    if (
      props.chunkOrders.length &&
      !props.chunkOrders.some((chunkOrder) => chunkOrder.isPrimary)
    ) {
      $("#isPrimaryButton-0").click();
      setTimeout(() => {
        $(document).off("keyup");
        props.exit();
      }, 250);
      return;
    }

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
          <h1 className={pstyles.title}>
            {mode === "Q2A"
              ? "Select Q to A connections. Pick a card from top row (Q) then a card from bottom row (A) then click the green tick."
              : "Select orders for sentence."}
          </h1>
          <button
            id="ChunkOrdersPopup-exitbutton"
            alt="Checkmark tick icon"
            className={`${gstyles.sideButton} ${gstyles.greyButton}`}
            onClick={exit}
          >
            &#10004;
          </button>
        </div>

        <div className={styles.buttonHolder}>
          {props.femula.map((fItem, fiIndex) => (
            <ChunkOrdersButton
              key={`ChunkOrdersButton-0-${fiIndex}`}
              rowNumber={0}
              fItem={fItem}
              chunkOrders={props.chunkOrders}
              setOrderBuilt={setOrderBuilt}
              addOrder={addOrder}
              orderBuilt={orderBuilt}
              clearOrder={clearOrder}
              highlightedButton={highlightedButton}
              disable={mode === "Q2A" && orderBuilt.length !== 0}
              mode={mode}
            />
          ))}
        </div>

        {props.femula2 && (
          <div className={styles.buttonHolder}>
            {props.femula2.map((fItem, fiIndex) => (
              <ChunkOrdersButton
                key={`ChunkOrdersButton-1-${fiIndex}`}
                rowNumber={1}
                fItem={fItem}
                chunkOrders={props.chunkOrders}
                setOrderBuilt={setOrderBuilt}
                addOrder={addOrder}
                orderBuilt={orderBuilt}
                clearOrder={clearOrder}
                highlightedButton={highlightedButton}
                disable={mode === "Q2A" && orderBuilt.length !== 1}
                mode={mode}
              />
            ))}
          </div>
        )}

        <div className={styles.orderBuilderHolder}>
          <div className={styles.orderBuilder}>
            {orderBuilt.map((chunkId, index) => {
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
                  {getGuidewordFromFemula(chunkId, props.femula, props.femula2)}
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
            {props.chunkOrders.map((orderObj, index) => {
              let { isPrimary, order } = orderObj;
              return (
                <li className={styles.listitem} key={`chunkOrder-${index}`}>
                  <span className={styles.indexSpan}>{index + 1}</span>
                  {mode !== "Q2A" && (
                    <button
                      id={`isPrimaryButton-${index}`}
                      alt="Black circle icon / White circle icon"
                      className={`${gstyles.blueButton} ${styles.microButton} ${gstyles.tooltipHolder}`}
                      onClick={() => {
                        setMeaninglessCounter((prev) => prev + 1);
                        setTimeout(() => {
                          props.setChunkOrders((prev) => {
                            let newArr = prev.map((orderObj, i) => {
                              if (i === index) {
                                orderObj.isPrimary = !prev[index].isPrimary;
                              }
                              return orderObj;
                            });
                            return newArr;
                          });
                        }, 0);
                      }}
                    >
                      {isPrimary ? "●" : "○"}
                      <Tooltip
                        text={
                          "Toggle whether this is a regular or merely additional order"
                        }
                        number={5}
                      />
                    </button>
                  )}
                  <button
                    alt="Cross icon"
                    className={`${gstyles.redButton} ${styles.microButton}`}
                    onClick={() => {
                      if (mode !== "Q2A" && props.chunkOrders.length === 1) {
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
                  {order.map((chunkId, subIndex) => (
                    <span
                      key={`chunkOrder-${index}-${chunkId}-${subIndex}`}
                      className={`${styles.wordspan} ${
                        !isPrimary && gstyles.translucent2
                      }`}
                    >
                      {getGuidewordFromFemula(
                        chunkId,
                        props.femula,
                        props.femula2
                      )}
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
