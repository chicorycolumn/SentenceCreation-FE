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
import uUtils from "../utils/universalUtils.js";
import flUtils from "../utils/flowerUtils.js";
import uiUtils from "../utils/userInputUtils.js";
import idUtils, {
  agreementTraits,
  getNewSentenceFormulaId,
  getWordtypeEnCh,
} from "../utils/identityUtils.js";
import icons from "../utils/icons.js";
import $ from "jquery";
const putUtils = require("../utils/putUtils.js");
const scUtils = require("../utils/structureChunkUtils.js");
const fiUtils = require("../utils/formulaItemUtils.js");

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
  const [showAllTraitBoxes, setShowAllTraitBoxes] = useState(false);
  const [showChunkOrdersPopup, setShowChunkOrdersPopup] = useState();
  const [highlightedCard, setHighlightedCard] = useState();
  const [meaninglessCounterTraitBox, setMeaninglessCounterTraitBox] =
    useState(0);

  const editLemmaOfThisFormulaItem = (
    formulaItemId,
    index,
    newGuideword,
    chunkId,
    structureChunk
  ) => {
    console.log("editLemmaOfThisFormulaItem START", {
      formulaItemId,
      index,
      newGuideword,
      chunkId,
      structureChunk,
    });

    function updateFlowers(newFormula, chunkId, newChunkId) {
      newFormula.forEach((fItem) => {
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

    props.setFormula((prevFormula) => {
      prevFormula = uUtils.copyWithoutReference(prevFormula);

      if (!newGuideword) {
        // Clause 1: Delete this fItem (don't request new stCh from BE).
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
        newGuideword,
        structureChunk
      );

      let currentChunkId = currentFormulaItem.structureChunk
        ? currentFormulaItem.structureChunk.chunkId.traitValue
        : null;
      currentFormulaItem._previousChunkId = currentChunkId;

      if (structureChunk) {
        // Clause 2: Update stCh.

        delete currentFormulaItem.structureChunk;
        currentFormulaItem.structureChunk = structureChunk;
        updateFlowers(prevFormula, currentChunkId, structureChunk.chunkId);
      } else {
        // Clause 3: Keep fItem but delete its stCh (request new stCh from BE using new guideword).

        delete currentFormulaItem.structureChunk;
        delete currentFormulaItem.backedUpStructureChunk;
      }

      console.log(
        "Setting currentFormulaItem.structureChunk to",
        newGuideword,
        structureChunk
      );

      console.log("NEW formula is:", prevFormula);
      return prevFormula;
    });
    setMeaninglessCounter((prev) => prev + 1);
    setTimeout(() => {
      setMeaninglessCounterTraitBox((prev) => prev + 1);
    }, 100);
  };

  useEffect(() => {
    if (
      !props.chunkOrders.length &&
      props.formula.every((fItem) => fItem.structureChunk)
    ) {
      props.setChunkOrders([
        {
          isPrimary: true,
          order: props.formula
            .filter((fItem) => !fItem.structureChunk.isGhostChunk)
            .map((fItem) => fItem.structureChunk.chunkId.traitValue),
        },
      ]);
    }
  }, [props.formula, props.chunkOrders]);

  useEffect(() => {
    if (
      props.chunkOrders.length &&
      props.formula.every((fItem) => fItem.structureChunk)
    ) {
      props.setChunkOrders((prev) =>
        fiUtils.updateChunkOrders(prev, props.formula)
      );
    }
  }, [props.formula]);

  useEffect(() => {
    if (!elementsToDrawLinesBetween.length) {
      setDrawnLinesAsBold(false);
    }
  }, [elementsToDrawLinesBetween]);

  let idNotUnique =
    props.fetchedFormulaIds &&
    idUtils.formulaIdNotUnique(props.fetchedFormulaIds, props.chosenFormulaID);

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
          chunkOrders={props.chunkOrders}
          setChunkOrders={props.setChunkOrders}
          formula={props.formula}
        />
      )}
      <div className={styles.buttonHolder}>
        <p
          className={`${gstyles.tooltipHolderDelayed} ${styles.buttonHolderTitle} `}
        >
          {idNotUnique && (
            <Tooltip text="Formula ID not unique. You will be overwriting this formula. Click Snowflake or Save Formula if you want to change." />
          )}
          Question sentence:{" "}
          {props.chosenFormulaID + `${idNotUnique ? "⚠" : ""}`}
        </p>
        <div className={styles.buttonSubholder}>
          <button
            alt="Alternate arrows icon"
            className={`${gstyles.cardButton1} ${gstyles.cardButtonWidthMedium} ${gstyles.tooltipHolderDelayed}`}
            onClick={(e) => {
              e.target.blur();
              if (uiUtils.checkForStChsWithNoLObjs(props.formula)) {
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

              let formulaToSend = putUtils.getFormulaToSend(props);
              if (!formulaToSend) {
                console.log(fxnId + " Formula failed validation.");
                return;
              }

              putUtils._fetchSentence(
                lang1,
                formulaToSend,
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

              let formulaToSend = putUtils.getFormulaToSend(props);
              if (!formulaToSend) {
                console.log(fxnId + " Formula failed validation.");
                return;
              }

              idUtils.checkFormulaIdUniqueAndModify(
                lang1,
                props.fetchedFormulaIds,
                formulaToSend,
                props.chosenFormulaID
              );

              const callbackSaveFormula = (payload, formulaToSend) => {
                if (payload.length) {
                  alert(
                    "Okay, I queried sentences for your formula, and we do get sentences created. So now let's save your formula. I'm console logging your formula now. Next we need to send this to BE and save it."
                  );
                  console.log("Let's save this formula:", formulaToSend);
                  props.setDevSavedFormulas((prev) => [...prev, formulaToSend]);
                } else {
                  alert(
                    "Sorry, no sentences were created for your formula when I queried it just now, so I will not save your formula on BE."
                  );
                }
              };

              putUtils._fetchSentence(
                lang1,
                formulaToSend,
                fxnId,
                callbackSaveFormula
              );
            }}
          >
            &#9112;
            <Tooltip text="Save formula" />
          </button>
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
          <button
            alt="Snowflake icon"
            className={`${gstyles.cardButton1} ${gstyles.cardButtonWidthMedium} ${gstyles.tooltipHolderDelayed}`}
            onClick={(e) => {
              e.target.blur();

              let response = window.prompt(
                "Extra options:\n\nType letter to activate.\n\na - Change current formula ID\n\nb - Log props.\n\nc - Send deliberately awry formula to check that BE doesn't spend too long on too-unspecified formulas."
              );
              if (response === "a") {
                let newId = getNewSentenceFormulaId(
                  props.fetchedFormulaIds,
                  lang1
                );

                if (newId !== props.chosenFormulaID) {
                  props.setChosenFormulaID(newId);
                  alert("Now changing formula ID to be unique.");
                } else {
                  alert("Formula ID already unique. Will not change it.");
                }
              } else if (response === "b") {
                console.log(props);
              } else if (response === "c") {
                let fxnId = "fetchSentence3:Snowflake";

                let formulaToSend = putUtils.getFormulaToSend(props);
                if (!formulaToSend) {
                  console.log(fxnId + " Formula failed validation.");
                  return;
                }

                formulaToSend.sentenceStructure.forEach((stCh) => {
                  if (stCh.andTags) {
                    stCh.andTags.traitValue = [];
                  }
                  if (stCh.specificIds) {
                    stCh.specificIds.traitValue = [];
                  }
                });

                putUtils._fetchSentence(
                  lang1,
                  formulaToSend,
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
                    let newFormula = prevFormula.map((formulaItem) => {
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

                    let replacedChunkIds = newFormula
                      .filter((fItem) => fItem._previousChunkId)
                      .map((fItem) => {
                        return {
                          old: fItem._previousChunkId,
                          new: fItem.structureChunk.chunkId.traitValue,
                        };
                      });

                    replacedChunkIds.forEach((replacedChunkId) => {
                      newFormula.forEach((fItem) => {
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

                    return newFormula;
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
                editLemma={(newGuideword, chunkId, stCh) => {
                  editLemmaOfThisFormulaItem(
                    formulaItemId,
                    index,
                    newGuideword,
                    chunkId,
                    stCh
                  );
                }}
                setPopup={setListPopupData}
                highlightedCard={highlightedCard}
                setHighlightedCard={setHighlightedCard}
                formulaWasLoadedFromBE={props.formulaWasLoadedFromBE}
                meaninglessCounterTraitBox={meaninglessCounterTraitBox}
                setMeaninglessCounterTraitBox={setMeaninglessCounterTraitBox}
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
