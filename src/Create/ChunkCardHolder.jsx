import React, { useEffect, useState, useContext, Fragment } from "react";
import ChunkCard from "./ChunkCard";
import LanguageContext from "../context/LanguageContext.js";
import ListPopup from "../Cogs/ListPopup.jsx";
import ChunkOrdersPopup from "./ChunkOrdersPopup.jsx";
import AddChunkButton from "./AddChunkButton.jsx";
import Tooltip from "../Cogs/Tooltip.jsx";
import styles from "../css/ChunkCardHolder.module.css";
import gstyles from "../css/Global.module.css";
import LineHolder from "../Cogs/LineHolder";
import uUtils, { getRandomNumberString } from "../utils/universalUtils.js";
import diUtils from "../utils/displayUtils.js";
import idUtils, { isFixedChunk } from "../utils/identityUtils.js";
import icons from "../utils/icons.js";
import $ from "jquery";
const putUtils = require("../utils/putUtils.js");
const scUtils = require("../utils/structureChunkUtils.js");

const ChunkCardHolder = (props) => {
  const { lang1, lang2, beEnv } = idUtils.getLangsAndEnv(
    useContext(LanguageContext)
  );
  const [elementsToDrawLinesBetween, setElementsToDrawLinesBetween] = useState(
    []
  );
  const [drawnLinesAsBold, setDrawnLinesAsBold] = useState(false);
  const [linesAreDrawn, setLinesAreDrawn] = useState(false);
  const [flowerSearchingForStem, setFlowerSearchingForStem] = useState();
  const [stemFoundForFlower, setStemFoundForFlower] = useState();
  const [meaninglessCounter, setMeaninglessCounter] = useState(0);
  const [listPopupData, setListPopupData] = useState();
  const [chunkOrders, setChunkOrders] = useState([]);
  const [showAllTraitBoxes, setShowAllTraitBoxes] = useState(false);

  const [showChunkOrdersPopup, setShowChunkOrdersPopup] = useState();
  const [highlightedCard, setHighlightedCard] = useState();

  const editGuidewordOnly = (newGuideword, formulaItemId) => {
    props.setFormula((prevFormula) => {
      prevFormula = uUtils.copyWithoutReference(prevFormula);

      let currentFormulaItem = prevFormula.find(
        (formulaItem) => formulaItem.formulaItemId === formulaItemId
      );

      delete currentFormulaItem.guideword;
      currentFormulaItem.guideword = newGuideword;

      return prevFormula;
    });
    setMeaninglessCounter((prev) => prev + 1);
  };

  const editLemmaOfThisFormulaItem = (
    formulaItemId,
    index,
    newWords,
    chunkId,
    structureChunk
  ) => {
    console.log("editLemmaOfThisFormulaItem START", {
      formulaItemId,
      index,
      newWords,
      chunkId,
      structureChunk,
    });

    function updateFlowers(newFormula, chunkId, newChunkId) {
      newFormula.forEach((stChObj) => {
        if (stChObj.structureChunk) {
          Object.keys(stChObj.structureChunk).forEach((traitKey) => {
            if (
              idUtils.agreementTraits.includes(traitKey) &&
              stChObj.structureChunk[traitKey].traitValue === chunkId
            ) {
              stChObj.structureChunk[traitKey].traitValue = newChunkId;
            }
          });
        }
      });
    }

    props.setFormula((prevFormula) => {
      prevFormula = uUtils.copyWithoutReference(prevFormula);

      if (!newWords) {
        let newFormula = prevFormula.filter(
          (formulaItem) => formulaItem.formulaItemId !== formulaItemId
        );
        updateFlowers(newFormula, chunkId, null);
        return newFormula;
      }

      let currentFormulaItem = prevFormula.find(
        (formulaItem) => formulaItem.formulaItemId === formulaItemId
      );

      delete currentFormulaItem.guideword;
      currentFormulaItem.guideword = scUtils.improveGuideword(
        newWords.guideword,
        structureChunk
      );

      if (structureChunk) {
        delete currentFormulaItem.structureChunk;
        currentFormulaItem.structureChunk = structureChunk;
      } else {
        delete currentFormulaItem.structureChunk;
        delete currentFormulaItem.backedUpStructureChunk;
      }

      console.log(
        "Setting currentFormulaItem.structureChunk to",
        newWords,
        structureChunk
      );

      updateFlowers(prevFormula, chunkId, null);
      console.log("NEW formula is:", prevFormula);
      return prevFormula;
    });
    setMeaninglessCounter((prev) => prev + 1);
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

  useEffect(() => {
    if (props.formula.every((obj) => obj.structureChunk)) {
      if (!chunkOrders.length) {
        setChunkOrders([
          {
            isPrimary: true,
            isDefault: true, // Beta remove this.
            order: props.formula
              .filter((obj) => !obj.structureChunk.isGhostChunk)
              .map((obj) => obj.structureChunk.chunkId.traitValue),
          },
        ]);
      } else {
        let defaultChunkOrders = chunkOrders.filter(
          (chunkOrder) => chunkOrder.isDefault
        );

        if (defaultChunkOrders.length) {
          defaultChunkOrders.forEach((defaultChunkOrder) => {
            defaultChunkOrder.order = props.formula
              .filter((obj) => !obj.structureChunk.isGhostChunk)
              .map((obj) => obj.structureChunk.chunkId.traitValue);
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
      {listPopupData && (
        <ListPopup
          exit={() => {
            setHighlightedCard();
            setListPopupData();
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
        <p className={styles.buttonHolderTitle}>
          Question sentence: {props.chosenFormulaID}
        </p>
        <div className={styles.buttonSubholder}>
          <button
            alt="Alternate arrows icon"
            className={`${gstyles.cardButton1} ${gstyles.tooltipHolderDelayed}`}
            onClick={(e) => {
              e.target.blur();
              if (checkForStChsWithNoLObjs()) {
                return;
              }
              setShowChunkOrdersPopup(true);
            }}
          >
            &#10562;
            <Tooltip text="Set orders" />
          </button>
          <button
            alt="Star icon"
            className={`${gstyles.cardButton1} ${gstyles.tooltipHolderDelayed}`}
            onClick={(e) => {
              e.target.blur();

              let badChunks = idUtils.getBadChunks(props.formula);
              if (badChunks.length) {
                alert(
                  `Cannot query whole sentence because no tags are specified on chunk "${badChunks
                    .map((badCh) => badCh.chunkId.traitValue)
                    .join('","')}".`
                );
                return;
              }

              if (checkForStChsWithNoLObjs()) {
                return;
              }

              let formula = {
                sentenceStructure: props.formula.map((el) => el.structureChunk),
                orders: chunkOrders,
              };

              putUtils.fetchSentence(lang1, formula).then(
                (data) => {
                  let { payload, messages } = data;

                  if (messages) {
                    alert(
                      Object.keys(messages).map((key) => {
                        let val = messages[key];
                        return `${key}:       ${val}`;
                      })
                    );
                    return;
                  }

                  setListPopupData({
                    title: `${payload.length} sentence${
                      payload.length > 1 ? "s" : ""
                    } from traits you specified`,
                    headers: ["sentence"],
                    rows: payload.map((el) => [el]),
                  });
                },
                (e) => {
                  console.log("ERROR 0302:", e);
                }
              );
            }}
          >
            &#9733;
            <Tooltip text="Query sentence" />
          </button>
          <button
            alt="Connection icon"
            className={`${gstyles.cardButton1} ${gstyles.cardButton1_inactive} ${gstyles.tooltipHolderDelayed}`}
            onMouseEnter={(e) => {
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
            <Tooltip text="Hover to view dependencies between chunks" />
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
        <LineHolder
          elementsToDrawLineBetween={[]}
          id="Unused LineHolder for flexbox spacing."
        />

        {props.formula.map((formulaItem, index) => {
          let {
            guideword,
            structureChunk,
            backedUpStructureChunk,
            formulaItemId,
          } = formulaItem;

          let finalIndex = props.formula.length - 1;

          return (
            <Fragment key={`chunkCardOuterFragment-${index}`}>
              <AddChunkButton
                setFormula={props.setFormula}
                formulaItemIndex={index}
              />
              <ChunkCard
                formulaItemId={formulaItemId}
                key={`${formulaItemId}-${guideword}`}
                batch={props.batch}
                chunkCardKey={`${formulaItemId}-${guideword}`}
                guideword={guideword}
                structureChunk={structureChunk}
                backedUpStructureChunk={backedUpStructureChunk}
                chunkCardIndex={index}
                formula={props.formula}
                setStructureChunkOnFormula={(newStCh) => {
                  props.setFormula((prevFormula) => {
                    return prevFormula.map((formulaItem) => {
                      if (formulaItem.formulaItemId === formulaItemId) {
                        formulaItem.structureChunk = newStCh;

                        let bodgeTransfers = ["guideword"];
                        bodgeTransfers.forEach((bodgeTransferKey) => {
                          if (
                            newStCh[bodgeTransferKey] &&
                            newStCh[bodgeTransferKey].traitValue
                          ) {
                            formulaItem[bodgeTransferKey] =
                              newStCh[bodgeTransferKey].traitValue;
                            delete newStCh[bodgeTransferKey];
                          }
                        });
                      }
                      return formulaItem;
                    });
                  });
                }}
                backUpStCh={(newStCh) => {
                  props.setFormula((prevFormula) => {
                    return prevFormula.map((formulaItem) => {
                      if (formulaItem.formulaItemId === formulaItemId) {
                        formulaItem.backedUpStructureChunk =
                          uUtils.copyWithoutReference(newStCh);
                      }
                      return formulaItem;
                    });
                  });
                }}
                setElementsToDrawLinesBetween={setElementsToDrawLinesBetween}
                flowerSearchingForStemBrace={[
                  flowerSearchingForStem,
                  setFlowerSearchingForStem,
                ]}
                stemFoundForFlowerBrace={[
                  stemFoundForFlower,
                  setStemFoundForFlower,
                ]}
                editLemma={(newWords, chunkId, stCh) => {
                  editLemmaOfThisFormulaItem(
                    formulaItemId,
                    index,
                    newWords,
                    chunkId,
                    stCh
                  );
                }}
                editGuidewordOnly={(newGuideword) => {
                  editGuidewordOnly(newGuideword, formulaItemId);
                }}
                setPopup={setListPopupData}
                highlightedCard={highlightedCard}
                setHighlightedCard={setHighlightedCard}
                formulaWasLoaded={props.formulaWasLoaded}
                setFormulaWasLoaded={props.setFormulaWasLoaded}
              />
              {index === finalIndex ? (
                <AddChunkButton
                  setFormula={props.setFormula}
                  formulaItemIndex={index + 1}
                />
              ) : (
                ""
              )}
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
