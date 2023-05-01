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
  const [showAllTraitBoxes, setShowAllTraitBoxes] = useState(false);
  const [showChunkOrdersPopup, setShowChunkOrdersPopup] = useState();
  const [highlightedCard, setHighlightedCard] = useState();
  const [meaninglessCounterTraitBox, setMeaninglessCounterTraitBox] =
    useState(0);

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
          className={`${gstyles.tooltipHolderDelayed} ${styles.buttonHolderTitle} `}
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
            className={`${gstyles.cardButton1} ${gstyles.cardButtonWidthMedium} ${gstyles.tooltipHolderDelayed}`}
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
            alt="Star icon"
            className={`${gstyles.cardButton1} ${gstyles.cardButtonWidthMedium} ${gstyles.tooltipHolderDelayed}`}
            onClick={(e) => {
              e.target.blur();
              let fxnId = "fetchSentence1:Star";

              let protoFormula = putUtils.getProtoFormula(props);
              if (!protoFormula) {
                console.log(fxnId + " Formula failed validation.");
                return;
              }

              putUtils._fetchSentence(
                props.lang1,
                protoFormula,
                fxnId,
                null,
                setListPopupData
              );
            }}
          >
            &#9733;
            <Tooltip text="Query sentence" />
          </button>
          <button
            alt="Save icon"
            className={`${gstyles.cardButton1} ${gstyles.cardButtonWidthMedium} ${gstyles.tooltipHolderDelayed}`}
            onClick={(e) => {
              e.target.blur();
              let fxnId = "fetchSentence2:Save";

              let protoFormula = putUtils.getProtoFormula(props);
              if (!protoFormula) {
                console.log(fxnId + " Formula failed validation.");
                return;
              }

              idUtils.checkFormulaIdUniqueAndModify(
                props.lang1,
                props.fetchedFormulaIds,
                protoFormula,
                props.chosenFormulaId
              );

              const callbackSaveFormula = (payload, formula) => {
                if (payload.length) {
                  alert(
                    "Okay, I queried sentences for your formula, and we do get sentences created. So now let's save your formula. I'm console logging your formula now. Next we need to send this to BE and save it."
                  );
                  console.log("Let's save this formula:", formula);
                  props.setDevSavedFormulas((prev) => [...prev, formula]);
                } else {
                  alert(
                    "Sorry, no sentences were created for your formula when I queried it just now, so I will not save your formula on BE."
                  );
                }
              };

              putUtils._fetchSentence(
                props.lang1,
                protoFormula,
                fxnId,
                callbackSaveFormula
              );
            }}
          >
            &#9112;
            <Tooltip text="Save formula" />
          </button>
          {props.batch === "Question" && (
            <button
              alt="Checkmark tick icon"
              className={`${gstyles.cardButton1} ${gstyles.cardButtonWidthMedium} ${gstyles.tooltipHolderDelayed}`}
              onClick={(e) => {
                e.target.blur();
                let fxnId = "fetchSentence2:Mark Question formula ready";

                let protoFormula = putUtils.getProtoFormula(props);
                if (!protoFormula) {
                  console.log(fxnId + " Formula failed validation.");
                  return;
                }

                idUtils.checkFormulaIdUniqueAndModify(
                  props.lang1,
                  props.fetchedFormulaIds,
                  protoFormula,
                  props.chosenFormulaId
                );

                const callbackSaveFormula = (payload, formula) => {
                  if (payload.length) {
                    alert(
                      "Okay, I queried sentences for your formula, and we do get sentences created. So now you can start creating Answer formula."
                    );
                    props.setQuestionSavedFormula(formula);

                    $.each(
                      $(`button[id^='ToggleShowButton-Question']`),
                      function () {
                        jqUtils.collapseIfNotCollapsed(
                          $(this)[0],
                          showAllTraitBoxes,
                          true
                        );
                      }
                    );
                  } else {
                    alert(
                      "Sorry, no sentences were created for your formula when I queried it just now, so I will not save your formula on BE."
                    );
                  }
                };

                putUtils._fetchSentence(
                  props.lang1,
                  protoFormula,
                  fxnId,
                  callbackSaveFormula
                );
              }}
            >
              &#10004;
              <Tooltip text="Mark Question formula ready" />
            </button>
          )}
          <button
            alt="Connection icon"
            className={`${gstyles.cardButton1} ${gstyles.cardButtonWidthMedium} ${gstyles.cardButton_inactive} ${gstyles.tooltipHolderDelayed}`}
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
            className={`${gstyles.cardButton1} ${gstyles.cardButtonWidthMedium} ${gstyles.tooltipHolderDelayed}`}
            onMouseEnter={() => {
              console.log("showAllTraitBoxes", showAllTraitBoxes);
            }}
            onClick={(e) => {
              e.target.blur();
              setShowAllTraitBoxes((prev) => !prev);

              $.each(
                $(`button[id^='ToggleShowButton-${props.batch}-']`),
                function () {
                  jqUtils.collapseIfNotCollapsed(
                    $(this)[0],
                    showAllTraitBoxes,
                    true
                  );
                }
              );

              $.each(
                $(
                  `button[id^='ToggleShowButtonAll-${idUtils.invertBatch(
                    props.batch
                  )}']`
                ),
                function () {
                  jqUtils.collapseIfNotCollapsed($(this)[0], showAllTraitBoxes);
                }
              );
            }}
          >
            {showAllTraitBoxes
              ? icons.upBlackTriangle
              : icons.downBlackTriangle}
            <Tooltip text="Show or hide trait boxes" />
          </button>
          <button
            alt="Snowflake icon"
            className={`${gstyles.cardButton1} ${gstyles.cardButtonWidthMedium} ${gstyles.tooltipHolderDelayed}`}
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

                let protoFormula = putUtils.getProtoFormula(props);
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
