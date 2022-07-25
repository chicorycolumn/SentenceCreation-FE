import React, { useEffect, useState, useContext, Fragment } from "react";
import ChunkCard from "./ChunkCard";
import LanguageContext from "../context/LanguageContext.js";
import ListPopup from "../Cogs/ListPopup.jsx";
import ChunkOrdersPopup from "./ChunkOrdersPopup.jsx";
import Tooltip from "../Cogs/Tooltip.jsx";
import styles from "../css/ChunkCardHolder.module.css";
import gstyles from "../css/Global.module.css";
import LineHolder from "../Cogs/LineHolder";
import uUtils from "../utils/universalUtils.js";
import diUtils from "../utils/displayUtils.js";
import idUtils from "../utils/identityUtils.js";
import icons from "../utils/icons.js";
import $ from "jquery";
const putUtils = require("../utils/putUtils.js");

const ChunkCardHolder = (props) => {
  const lang1 = useContext(LanguageContext);
  const [elementsToDrawLinesBetween, setElementsToDrawLinesBetween] = useState(
    []
  );
  const [drawnLinesAsBold, setDrawnLinesAsBold] = useState(false);
  const [linesAreDrawn, setLinesAreDrawn] = useState(false);
  const [flowerSearchingForStem, setFlowerSearchingForStem] = useState();
  const [stemFoundForFlower, setStemFoundForFlower] = useState();
  const [meaninglessCounter, setMeaninglessCounter] = useState(0);
  const [showListPopup, setShowListPopup] = useState();
  const [listPopupData, setListPopupData] = useState();
  const [chunkOrders, setChunkOrders] = useState([]);
  const [showAllTraitBoxes, setShowAllTraitBoxes] = useState(false);

  const [showChunkOrdersPopup, setShowChunkOrdersPopup] = useState();
  const [highlightedCard, setHighlightedCard] = useState();

  const editLemmaAtIndex = (index, newLemma, chunkId, structureChunk) => {
    function updateFlowers(newFormula, chunkId, newChunkId) {
      newFormula.forEach((stChObj) => {
        if (stChObj.structureChunk) {
          Object.keys(stChObj.structureChunk).forEach((traitKey) => {
            if (
              idUtils.isAgreeOrConnected(traitKey) &&
              stChObj.structureChunk[traitKey].traitValue === chunkId
            ) {
              stChObj.structureChunk[traitKey].traitValue = newChunkId;
            }
          });
        }
      });
    }

    props.setFormula((prevFormula) => {
      if (!newLemma) {
        let newFormula = prevFormula.filter((el, i) => i !== index);
        updateFlowers(newFormula, chunkId, null);
        return newFormula;
      }
      prevFormula[index] = { word: newLemma, structureChunk };
      updateFlowers(prevFormula, chunkId, null);
      return prevFormula;
    });
    setMeaninglessCounter((prev) => prev + 1);
  };

  const setPopup = (data) => {
    setListPopupData(data);
    setShowListPopup(true);
  };

  const checkForStChsWithNoLObjs = () => {
    let sentenceStructure = props.formula.map((el) => el.structureChunk);

    let indexesOfStChsWithNoLobjs = sentenceStructure
      .map((el, index) => {
        return { el, index };
      })
      .filter((obj) => !obj.el)
      .map((obj) => obj.index);

    if (indexesOfStChsWithNoLobjs.length) {
      alert(
        `Sorry, chunk(s) number ${indexesOfStChsWithNoLobjs
          .map((i) => i + 1)
          .join(", ")} are null.`
      );
      return true;
    }
  };

  const checkForStChsWithNoTags = () => {
    let sentenceStructure = props.formula.map((el) => el.structureChunk);

    let badChunks = sentenceStructure.filter(
      (stCh) =>
        idUtils.wordtypesWhichMustHavePopulatedTags.includes(stCh.wordtype) &&
        uUtils.isEmpty(stCh.andTags.traitValue) &&
        uUtils.isEmpty(stCh.orTags.traitValue)
    );

    if (badChunks.length) {
      alert(
        `Cannot query whole sentence because no tags are specified on chunk "${badChunks
          .map((badCh) => badCh.chunkId.traitValue)
          .join('","')}".`
      );
      return true;
    }
  };

  useEffect(() => {
    if (props.formula.every((obj) => obj.structureChunk)) {
      if (!chunkOrders.length) {
        setChunkOrders([
          {
            isPrimary: true,
            isDefault: true,
            order: props.formula.map(
              (obj) => obj.structureChunk.chunkId.traitValue
            ),
          },
        ]);
      } else {
        let defaultChunkOrders = chunkOrders.filter(
          (chunkOrder) => chunkOrder.isDefault
        );

        if (defaultChunkOrders.length) {
          defaultChunkOrders.forEach((defaultChunkOrder) => {
            defaultChunkOrder.order = props.formula.map(
              (obj) => obj.structureChunk.chunkId.traitValue
            );
          });
        }
      }
    }
  }, [props.formula, chunkOrders]);

  useEffect(() => {
    if (!elementsToDrawLinesBetween.length) {
      setDrawnLinesAsBold(false);
    }
  }, [elementsToDrawLinesBetween]);

  return (
    <div className={styles.cardHolderContainer}>
      {showListPopup && (
        <ListPopup
          exit={() => {
            setShowListPopup(false);
            setHighlightedCard();
          }}
          data={listPopupData}
        />
      )}
      {showChunkOrdersPopup && (
        <ChunkOrdersPopup
          exit={() => {
            setShowChunkOrdersPopup(false);
          }}
          chunkOrders={chunkOrders}
          setChunkOrders={setChunkOrders}
          formula={props.formula}
        />
      )}
      <div className={styles.buttonHolder}>
        <p className={styles.buttonHolderTitle}>Question sentence</p>
        <div className={styles.buttonSubholder}>
          <button
            alt="Three dots icon"
            className={`${gstyles.cardButton1} ${gstyles.tooltipHolderDelayed}`}
            onClick={(e) => {
              e.target.blur();
              if (checkForStChsWithNoLObjs()) {
                return;
              }
              setShowChunkOrdersPopup(true);
            }}
          >
            &#11819;
            <Tooltip text="Set orders" />
          </button>
          <button
            alt="Star icon"
            className={`${gstyles.cardButton1} ${gstyles.tooltipHolderDelayed}`}
            onClick={(e) => {
              e.target.blur();

              if (checkForStChsWithNoLObjs() || checkForStChsWithNoTags()) {
                return;
              }

              let sentenceStructure = props.formula.map(
                (el) => el.structureChunk
              );

              putUtils
                .fetchSentence(lang1, sentenceStructure, chunkOrders)
                .then(
                  (fetchedDataObj) => {
                    if (fetchedDataObj.messages) {
                      alert(
                        Object.keys(fetchedDataObj.messages).map((key) => {
                          let val = fetchedDataObj.messages[key];
                          return `${key}:       ${val}`;
                        })
                      );
                      return;
                    }

                    let fetchedData = fetchedDataObj.data;

                    setPopup({
                      title: `${fetchedData.length} sentence${
                        fetchedData.length > 1 ? "s" : ""
                      } from traits you specified`,
                      headers: ["sentence"],
                      rows: fetchedData.map((el) => [el]),
                    });
                  },
                  (error) => {
                    console.log("ERROR 0302:", error);
                  }
                );
            }}
          >
            &#9733;
            <Tooltip text="Query sentence" />
          </button>
          <button
            alt="Connection icon"
            className={`${gstyles.cardButton1} ${gstyles.tooltipHolderDelayed}`}
            onClick={(e) => {
              e.target.blur();
              if (linesAreDrawn) {
                return;
              }
              setLinesAreDrawn(true);
              $("*[id*=traitTitleHolder-chunkId]").each(function () {
                let id = $(this).parent()[0].id;
                let value = $(this).parent().find("textarea")[0].value;
                diUtils.connectChunkIdWithItsFlowers(id, value, [
                  setElementsToDrawLinesBetween,
                  setDrawnLinesAsBold,
                ]);
              });
            }}
            onMouseLeave={() => {
              setLinesAreDrawn(false);
              $("*[id*=traitTitleHolder-chunkId]").each(function () {
                let id = $(this).parent()[0].id;
                let value = $(this).parent().find("textarea")[0].value;
                diUtils.connectChunkIdWithItsFlowers(
                  id,
                  value,
                  [setElementsToDrawLinesBetween],
                  true
                );
              });
            }}
          >
            &#42476;
            <Tooltip text="View dependencies between chunks" />
          </button>
          <button
            alt="Triangle icon"
            className={`${gstyles.cardButton1} ${gstyles.tooltipHolderDelayed}`}
            onMouseEnter={() => {
              console.log("showAllTraitBoxes", showAllTraitBoxes);
            }}
            onClick={(e) => {
              e.target.blur();
              setShowAllTraitBoxes((prev) => !prev);

              $.each(
                $(`button[id^='ToggleShowButton-${props.batch}-']`),
                function () {
                  let button = $(this)[0];
                  let buttonIsShowing = [
                    icons.downBlackTriangle,
                    icons.downWhiteTriangle,
                  ].includes(button.innerText);

                  if (
                    (!showAllTraitBoxes && buttonIsShowing) |
                    (showAllTraitBoxes &&
                      !buttonIsShowing &&
                      (!!button.id.match("Group1") ||
                        button.innerText === icons.upBlackTriangle))
                  ) {
                    button.click();
                  }
                }
              );
            }}
          >
            {showAllTraitBoxes
              ? icons.upBlackTriangle
              : icons.downBlackTriangle}
            <Tooltip text="Show or hide trait boxes" />
          </button>
        </div>
      </div>
      <div className={styles.cardHolder} key={meaninglessCounter}>
        <LineHolder elementsToDrawLineBetween={[]} />
        {/* Unused LineHolder for flexbox spacing. */}
        {props.formula.map((formulaItem, index) => {
          let { word, structureChunk } = formulaItem;
          return (
            <Fragment key={`chunkCardOuterFragment-${index}`}>
              {index ? (
                <div
                  key={`plusButton-${index}`}
                  alt="Plus icon"
                  className={styles.plusButton}
                  onClick={() => {
                    let newLemma = prompt("Enter new lemma");
                    if (newLemma) {
                      console.log("swde4");
                      props.setFormula((prevFormula) => {
                        let newFormulaObject = {
                          word: newLemma,
                          structureChunk: null,
                        };
                        return [
                          ...prevFormula.slice(0, index),
                          newFormulaObject,
                          ...prevFormula.slice(index),
                        ];
                      });
                    }
                  }}
                >
                  &#8853;
                </div>
              ) : (
                ""
              )}
              <ChunkCard
                key={`${index}-${word}`}
                batch={props.batch}
                chunkCardKey={`${index}-${word}`}
                word={word}
                index={index}
                structureChunk={structureChunk}
                chunkCardIndex={index}
                formula={props.formula}
                setFormula={props.setFormula}
                setElementsToDrawLinesBetween={setElementsToDrawLinesBetween}
                flowerSearchingForStemBrace={[
                  flowerSearchingForStem,
                  setFlowerSearchingForStem,
                ]}
                stemFoundForFlowerBrace={[
                  stemFoundForFlower,
                  setStemFoundForFlower,
                ]}
                editLemma={(newLemma, chunkId, stCh) => {
                  editLemmaAtIndex(index, newLemma, chunkId, stCh);
                }}
                setPopup={setPopup}
                highlightedCard={highlightedCard}
                setHighlightedCard={setHighlightedCard}
              />
            </Fragment>
          );
        })}
        <LineHolder
          elementsToDrawLineBetween={elementsToDrawLinesBetween}
          drawnLinesAsBold={drawnLinesAsBold}
        />
      </div>
    </div>
  );
};

export default ChunkCardHolder;
