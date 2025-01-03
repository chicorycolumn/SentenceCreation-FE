import React, { useEffect, useState, Fragment } from "react";
import ChunkCard from "./ChunkCard";
import ListPopup from "../Cogs/ListPopup.jsx";
import ChunkOrdersPopup from "./ChunkOrdersPopup.jsx";
import AddChunkButton from "./AddChunkButton.jsx";
import Tooltip from "../Cogs/Tooltip.jsx";
import styles from "../css/ChunkCardTray.module.css";
import gstyles from "../css/Global.module.css";
import LineHolder from "../Cogs/LineHolder";
import uUtils from "../utils/universalUtils.js";
import flUtils from "../utils/flowerUtils.js";
import jqUtils from "../utils/jQueryUtils.js";
import uiUtils from "../utils/userInputUtils.js";
import idUtils, {
  agreementTraits,
  getNewFormulaId,
} from "../utils/identityUtils.js";
import icons from "../utils/icons.js";
import $ from "jquery";
const putUtils = require("../utils/putUtils.js");
const stUtils = require("../utils/storageUtils.js");
const scUtils = require("../utils/structureChunkUtils.js");
const fiUtils = require("../utils/femulaItemUtils.js");

const ChunkCardTray = (props) => {
  const [elementsToDrawLinesBetween, setElementsToDrawLinesBetween] = useState(
    []
  );
  const [drawnLinesAsBold, setDrawnLinesAsBold] = useState(false);
  const [linesAreDrawn, setLinesAreDrawn] = useState(false);
  const [flowerSearchingForStem, setFlowerSearchingForStem] = useState();
  const [stemFoundForFlower, setStemFoundForFlower] = useState();
  const [meaninglessCounter, setMeaninglessCounter] = useState(0);
  const [listPopupData, setListPopupData] = useState();
  const [showAllTraitBoxes, setShowAllTraitBoxes] = useState(true);
  const [showChunkOrdersPopup, setShowChunkOrdersPopup] = useState();
  const [highlightedCard, setHighlightedCard] = useState();
  const [meaninglessCounterTraitBox, setMeaninglessCounterTraitBox] =
    useState(0);
  const [sentenceWasQueriedSuccessfully, setSentenceWasQueriedSuccessfully] =
    useState();

  const editLemmaOfThisFemulaItem = (
    femulaItemId,
    index,
    newGuideword,
    chunkId,
    structureChunk
  ) => {
    console.log("editLemmaOfThisFemulaItem START", {
      femulaItemId,
      index,
      newGuideword,
      chunkId,
      structureChunk,
    });

    function updateFlowers(newFemula, chunkId, newChunkId) {
      newFemula.forEach((fItem) => {
        if (fItem.structureChunk) {
          Object.keys(fItem.structureChunk).forEach((traitKey) => {
            if (
              idUtils.agreementTraits.includes(traitKey) &&
              fItem.structureChunk[traitKey].traitValue === chunkId
            ) {
              fItem.structureChunk[traitKey].traitValue = newChunkId;
            }
          });
        }
      });
    }

    props.setFemula((prevFemula) => {
      prevFemula = uUtils.copyWithoutReference(prevFemula);

      if (!newGuideword) {
        // Clause 1: Delete this fItem (don't request new stCh from BE).
        let newFemula = prevFemula.filter(
          (femulaItem) => femulaItem.femulaItemId !== femulaItemId
        );
        updateFlowers(newFemula, chunkId, null);
        return newFemula;
      }

      let currentFemulaItem = prevFemula.find(
        (femulaItem) => femulaItem.femulaItemId === femulaItemId
      );

      delete currentFemulaItem.guideword;
      currentFemulaItem.guideword = scUtils.improveGuideword(
        newGuideword,
        structureChunk
      );

      let currentChunkId = currentFemulaItem.structureChunk
        ? currentFemulaItem.structureChunk.chunkId.traitValue
        : null;
      currentFemulaItem._previousChunkId = currentChunkId;

      if (structureChunk) {
        // Clause 2: Update stCh.

        delete currentFemulaItem.structureChunk;
        currentFemulaItem.structureChunk = structureChunk;
        updateFlowers(
          prevFemula,
          currentChunkId,
          structureChunk.chunkId.traitValue
        );
      } else {
        // Clause 3: Keep fItem but delete its stCh (request new stCh from BE using new guideword).

        delete currentFemulaItem.structureChunk;
        delete currentFemulaItem.backedUpStructureChunk;
      }

      console.log(
        "Setting currentFemulaItem.structureChunk to",
        newGuideword,
        structureChunk
      );

      console.log("NEW formula is:", prevFemula);
      return prevFemula;
    });
    setMeaninglessCounter((prev) => prev + 1);
    setTimeout(() => {
      setMeaninglessCounterTraitBox((prev) => prev + 1);
    }, 100);
  };

  useEffect(() => {
    setTimeout(() => {
      jqUtils.expandTrayHeightToFitTraitBoxes(props.batch);
      setTimeout(() => {
        jqUtils.expandTrayHeightToFitTraitBoxes(props.batch);
      }, 500);
    }, 500);

    $(`#cardTray-${props.batch}`).on("click", "*", function () {
      jqUtils.expandTrayHeightToFitTraitBoxes(props.batch);
    });
  }, []);

  useEffect(() => {
    if (
      !props.chunkOrders.length &&
      props.femula.every((fItem) => fItem.structureChunk)
    ) {
      props.setChunkOrders([
        {
          isPrimary: true,
          order: props.femula
            .filter((fItem) => !fItem.structureChunk.isGhostChunk)
            .map((fItem) => fItem.structureChunk.chunkId.traitValue),
        },
      ]);
    }

    //Chunk was modified ie formula changed. Un-checking "Mark formula ready".
    console.log("Δδ");

    props.markFormulaReady();
    setSentenceWasQueriedSuccessfully();
  }, [props.femula, props.chunkOrders]);

  useEffect(() => {
    if (
      props.chunkOrders.length &&
      props.femula.every((fItem) => fItem.structureChunk)
    ) {
      props.setChunkOrders((prev) =>
        fiUtils.updateChunkOrders(prev, props.femula)
      );
    }
  }, [props.femula]);

  useEffect(() => {
    if (!elementsToDrawLinesBetween.length) {
      setDrawnLinesAsBold(false);
    }
  }, [elementsToDrawLinesBetween]);

  let idNotUnique =
    props.fetchedFormulaIds &&
    idUtils.formulaIdNotUnique(props.fetchedFormulaIds, props.chosenFormulaId);

  return (
    <div className={styles.cardTrayContainer}>
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
          chunkOrders={props.chunkOrders}
          setChunkOrders={props.setChunkOrders}
          femula={props.femula}
        />
      )}
      <div className={styles.buttonHolder}>
        <p
          className={`${gstyles.tooltipHolderDelayed1s} ${styles.buttonHolderTitle} `}
        >
          {idNotUnique && (
            <Tooltip text="Formula ID not unique. You will be overwriting this formula. Click Snowflake or Save Formula if you want to change." />
          )}
          {props.batch} sentence:{" "}
          {props.chosenFormulaId + `${idNotUnique ? "⚠" : ""}`}
        </p>
        <div className={styles.buttonSubholder}>
          <button
            alt="Alternate arrows icon"
            className={`${gstyles.cardButton1} ${gstyles.cardButtonWidthMedium} ${gstyles.tooltipHolderDelayed1s}`}
            onClick={(e) => {
              e.target.blur();
              if (uiUtils.checkForStChsWithNoLObjs(props.femula)) {
                return;
              }
              setShowChunkOrdersPopup(true);
            }}
          >
            &#10562;
            <Tooltip text="Set orders" />
          </button>
          <button
            alt="Snowflake icon"
            className={`${gstyles.cardButton1} ${gstyles.cardButtonWidthMedium} ${gstyles.tooltipHolderDelayed1s}`}
            onClick={(e) => {
              e.target.blur();

              let response = window.prompt(
                "Extra options:\n\nType letter to activate.\n\na - Change current formula ID\n\nb - Log props.\n\nc - Send deliberately awry formula to check that BE doesn't spend too long on too-unspecified formulas."
              );
              if (response === "a") {
                let newId = getNewFormulaId(
                  props.fetchedFormulaIds,
                  props.lang1
                );

                if (newId !== props.chosenFormulaId) {
                  props.setChosenFormulaId(newId);
                  alert("Now changing formula ID to be unique.");
                } else {
                  alert("Formula ID already unique. Will not change it.");
                }
              } else if (response === "b") {
                console.log(props);
              } else if (response === "c") {
                let fxnId = "fetchSentence3:Snowflake";

                let protoFormula = stUtils.getProtoFormula(props);
                if (!protoFormula) {
                  console.log(fxnId + " Formula failed validation.");
                  return;
                }

                protoFormula.sentenceStructure.forEach((stCh) => {
                  if (stCh.andTags) {
                    stCh.andTags.traitValue = [];
                  }
                  if (stCh.specificIds) {
                    stCh.specificIds.traitValue = [];
                  }
                });

                putUtils._fetchSentence(
                  props.beEnv,
                  props.lang1,
                  protoFormula,
                  fxnId,
                  null,
                  setListPopupData
                );
              }
            }}
          >
            &#10053;
            <Tooltip text="Extra options" />
          </button>
          <button
            alt="Save icon"
            className={`${gstyles.cardButton1} ${gstyles.cardButtonWidthMedium} ${gstyles.tooltipHolderDelayed1s}`}
            onClick={(e) => {
              e.target.blur();
              props.saveUnfinishedFemula(
                stUtils.getSaveableUnfinishedFemula(props)
              );
            }}
          >
            &#9112;
            <Tooltip text="Save unfinished femula" />
          </button>
          <button
            alt="Star icon"
            className={`${gstyles.cardButton1} ${gstyles.cardButtonWidthMedium} ${gstyles.tooltipHolderDelayed1s}`}
            onClick={(e) => {
              e.target.blur();
              let fxnId = "fetchSentence1:Star";

              let protoFormula = stUtils.getProtoFormula(props);
              if (!protoFormula) {
                console.log(fxnId + " Formula failed validation.");
                return;
              }

              putUtils._fetchSentence(
                props.beEnv,
                props.lang1,
                protoFormula,
                fxnId,
                null,
                (payload, protoFormula) => {
                  setListPopupData(payload, protoFormula);
                  if (payload.rows && payload.rows.length) {
                    setSentenceWasQueriedSuccessfully(true);
                  }
                }
              );
            }}
          >
            &#9733;
            <Tooltip text="Query sentence" />
          </button>
          <button
            alt="Checkmark tick icon"
            className={`${gstyles.cardButton1} ${
              gstyles.cardButtonWidthMedium
            } ${gstyles.tooltipHolderDelayed1s} ${
              props.formulaIsSaved
                ? gstyles.tickableButtonActive
                : sentenceWasQueriedSuccessfully
                ? gstyles.tickableButtonHalfwayActive
                : gstyles.tickableButton
            }`}
            onMouseOver={() => {
              console.log({ sentenceWasQueriedSuccessfully });
            }}
            onClick={(e) => {
              e.target.blur();

              if (props.formulaIsSaved) {
                return;
              }

              let fxnId = `fetchSentence2:Mark ${props.batch} formula ready`;

              let uniqueId = idUtils.getUniqueFormulaIdIfPrompted(
                props.lang1,
                props.fetchedFormulaIds,
                props.chosenFormulaId
              );
              if (uniqueId) {
                props.setChosenFormulaId(uniqueId);
              }

              let protoFormula = stUtils.getProtoFormula(props, uniqueId);
              if (!protoFormula) {
                console.log(fxnId + " Formula failed validation.");
                return;
              }

              const callbackSaveFormula = (queriedSuccessfully, formula) => {
                if (queriedSuccessfully) {
                  props.markFormulaReady(formula);

                  $.each(
                    $(`button[id^='ToggleShowButtonAll-${props.batch}']`),
                    function () {
                      jqUtils.collapseIfNotCollapsed(
                        $(this)[0],
                        showAllTraitBoxes
                      );
                    }
                  );
                } else {
                  alert(
                    `Sorry, no sentences were created for your ${props.batch} formula when I queried it just now, so I will not save it.`
                  );
                }
              };

              if (sentenceWasQueriedSuccessfully) {
                putUtils.prepareFormula(props.lang1, protoFormula);
                callbackSaveFormula(true, protoFormula);
              } else {
                putUtils._fetchSentence(
                  props.beEnv,
                  props.lang1,
                  protoFormula,
                  fxnId,
                  callbackSaveFormula
                );
              }
            }}
          >
            &#10004;
            <Tooltip text="Mark formula ready" />
          </button>
          <button
            alt="Connection icon"
            className={`${gstyles.cardButton1} ${gstyles.cardButtonWidthMedium} ${gstyles.cardButton_inactive} ${gstyles.tooltipHolderDelayed1s}`}
            onMouseEnter={(e) => {
              e.target.blur();
              if (linesAreDrawn) {
                return;
              }
              setLinesAreDrawn(true);
              $("*[id*=traitTitleHolder-chunkId]").each(function () {
                let id = $(this).parent()[0].id;
                let value = $(this).parent().find("textarea")[0].value;
                flUtils.connectChunkIdWithItsFlowers(id, value, [
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
                flUtils.connectChunkIdWithItsFlowers(
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
            id={`ToggleShowButtonAll-${props.batch}`}
            className={`${gstyles.cardButton1} ${gstyles.cardButtonWidthMedium} ${gstyles.tooltipHolderDelayed1s}`}
            onMouseEnter={() => {
              console.log("showAllTraitBoxes", showAllTraitBoxes);
            }}
            onClick={(e) => {
              e.target.blur();
              setShowAllTraitBoxes((prev) => !prev);

              $.each(
                $(`button[id^='ToggleShowButton-${props.batch}-']`),
                function () {
                  jqUtils.collapseIfNotCollapsed($(this)[0], showAllTraitBoxes);
                }
              );

              $.each(
                $(
                  `button[id^='ToggleShowButtonAll-${idUtils.invertBatch(
                    props.batch
                  )}']`
                ),
                function () {
                  jqUtils.collapseIfNotCollapsed(
                    $(this)[0],
                    showAllTraitBoxes,
                    true
                  );
                }
              );
            }}
          >
            {showAllTraitBoxes
              ? icons.downBlackTriangle
              : icons.upBlackTriangle}
            <Tooltip text="Show or hide trait boxes" />
          </button>
          <button
            alt="Dashed up arrow icon"
            className={`${gstyles.cardButton1} ${gstyles.cardButtonWidthMedium} ${gstyles.tooltipHolderDelayed1s}`}
            onClick={(e) => {
              e.target.blur();
              jqUtils.expandTrayHeightToFitTraitBoxes();
            }}
          >
            &#8673;
            <Tooltip text="Reduce space between Question formula display and Answer formula display" />
          </button>
          <button
            alt="Cross icon"
            className={`${gstyles.cardButton1} ${gstyles.cardButtonWidthMedium} ${gstyles.tooltipHolderDelayed1s}`}
            onClick={(e) => {
              e.target.blur();
              if (
                window.confirm("Are you sure you want to wipe this formula?")
              ) {
                props.setFemula([]);
              }
            }}
          >
            &times;
            <Tooltip text="Delete formula" />
          </button>
        </div>
      </div>
      <div
        className={styles.cardTray}
        id={`cardTray-${props.batch}`}
        key={meaninglessCounter}
      >
        <LineHolder
          elementsToDrawLineBetween={[]}
          id="Unused LineHolder for flexbox spacing."
        />

        {props.femula.map((femulaItem, index) => {
          let {
            guideword,
            structureChunk,
            backedUpStructureChunk,
            femulaItemId,
            chunkIdFromQ,
          } = femulaItem;

          let finalIndex = props.femula.length - 1;

          return (
            <Fragment key={`chunkCardOuterFragment-${index}`}>
              <AddChunkButton
                setFemula={props.setFemula}
                femulaItemIndex={index}
              />
              <ChunkCard
                lang={props.lang1}
                beEnv={props.beEnv}
                femulaItemId={femulaItemId}
                chunkIdFromQ={chunkIdFromQ}
                key={`${femulaItemId}-${guideword}`}
                batch={props.batch}
                chunkCardKey={`${femulaItemId}-${guideword}`}
                guideword={guideword}
                structureChunk={structureChunk}
                backedUpStructureChunk={backedUpStructureChunk}
                chunkCardIndex={index}
                femula={props.femula}
                showAllTraitBoxes={showAllTraitBoxes}
                setStructureChunkOnFemula={(newStCh) => {
                  props.setFemula((prevFemula) => {
                    let newFemula = prevFemula.map((femulaItem) => {
                      if (femulaItem.femulaItemId === femulaItemId) {
                        femulaItem.structureChunk = newStCh;

                        let bodgeTransfers = ["guideword"];
                        bodgeTransfers.forEach((bodgeTransferKey) => {
                          if (
                            newStCh[bodgeTransferKey] &&
                            newStCh[bodgeTransferKey].traitValue
                          ) {
                            femulaItem[bodgeTransferKey] =
                              newStCh[bodgeTransferKey].traitValue;
                            delete newStCh[bodgeTransferKey];
                          }
                        });
                      }
                      return femulaItem;
                    });

                    let replacedChunkIds = newFemula
                      .filter((fItem) => fItem._previousChunkId)
                      .map((fItem) => {
                        return {
                          old: fItem._previousChunkId,
                          new: fItem.structureChunk.chunkId.traitValue,
                        };
                      });

                    replacedChunkIds.forEach((replacedChunkId) => {
                      newFemula.forEach((fItem) => {
                        agreementTraits.forEach((agreementTrait) => {
                          if (
                            fItem.structureChunk[agreementTrait] &&
                            fItem.structureChunk[agreementTrait].traitValue ===
                              replacedChunkId.old
                          ) {
                            fItem.structureChunk[agreementTrait].traitValue =
                              replacedChunkId.new;
                          }
                        });
                      });
                    });

                    return newFemula;
                  });
                }}
                backUpStCh={(newStCh) => {
                  props.setFemula((prevFemula) => {
                    return prevFemula.map((femulaItem) => {
                      if (femulaItem.femulaItemId === femulaItemId) {
                        femulaItem.backedUpStructureChunk =
                          uUtils.copyWithoutReference(newStCh);
                      }
                      return femulaItem;
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
                editLemma={(newGuideword, chunkId, stCh) => {
                  editLemmaOfThisFemulaItem(
                    femulaItemId,
                    index,
                    newGuideword,
                    chunkId,
                    stCh
                  );
                }}
                setPopup={setListPopupData}
                highlightedCard={highlightedCard}
                setHighlightedCard={setHighlightedCard}
                femulaWasLoadedFromBE={props.femulaWasLoadedFromBE}
                meaninglessCounterTraitBox={meaninglessCounterTraitBox}
                setMeaninglessCounterTraitBox={setMeaninglessCounterTraitBox}
              />
              {index === finalIndex ? (
                <AddChunkButton
                  setFemula={props.setFemula}
                  femulaItemIndex={index + 1}
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

export default ChunkCardTray;
