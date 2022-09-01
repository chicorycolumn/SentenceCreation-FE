import React, { Component } from "react";
import TagInterface from "./TagInterface.jsx";
import Tooltip from "../Cogs/Tooltip.jsx";
import styles from "../css/TraitBox.module.css";
import gstyles from "../css/Global.module.css";
import $ from "jquery";
import diUtils from "../utils/displayUtils.js";
const uUtils = require("../utils/universalUtils.js");
const idUtils = require("../utils/identityUtils.js");
const scUtils = require("../utils/structureChunkUtils.js");
const consol = require("../utils/loggingUtils.js");
const helpTexts = require("../utils/helpTexts.js");

class TraitBox extends Component {
  state = {
    traitValueInputString: diUtils.asString(this.props.traitObject.traitValue),
    traitValueInputString2:
      this.props.traitObject2 &&
      diUtils.asString(this.props.traitObject2.traitValue),
    hasJustBlurred: false,
    isInputActive: false,
    isHovered: false,
    isSelected: false,
    isSoftHighlighted: false,
    isHighlighted: false,
    isExtraHighlighted: false,
    isFlowerSearchingForStem: false,
    forceShowInput: false,
    showTagInterface: false,
    justCopied: false,
    activeTextarea: null,
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.meaninglessCounterTraitBox !==
      this.props.meaninglessCounterTraitBox
    ) {
      this.setState({
        traitValueInputString: diUtils.asString(
          this.props.traitObject.traitValue
        ),
      });
    }
  }

  setShowTagInterface = (val) => {
    if (!val) {
      this.props.setHighlightedCard();
    }
    this.setState({ showTagInterface: val });
  };

  revertTraitValueInputString = (isSecondary = false) => {
    console.log("£revertTraitValueInputString");
    const innerFunction = (
      traitValueInputStringKey = "traitValueInputString",
      traitObjectKey = "traitObject"
    ) => {
      this.setState(() => {
        let newState = {};
        newState[traitValueInputStringKey] = diUtils.asString(
          this.props[traitObjectKey].traitValue
        );
        return newState;
      });
    };

    if (isSecondary) {
      innerFunction("traitValueInputString2", "traitObject2");
    } else {
      innerFunction();
    }
  };

  pushpopTraitValueInputString = (
    val,
    add = true,
    secondary = false,
    overWrite = false
  ) => {
    console.log("£pushpopTraitValueInputString");
    const innerFunction = (
      traitValueInputStringKey = "traitValueInputString"
    ) => {
      let arr = diUtils.asArray(this.state[traitValueInputStringKey]);

      if (overWrite) {
        arr = [];
      }

      if (val && val.length) {
        let values = Array.isArray(val) ? val : [val];

        if (add) {
          values.forEach((v) => {
            if (!arr.includes(v)) {
              arr.push(v);
            }
          });
        } else {
          arr = arr.filter((el) => !values.includes(el));
        }
      }

      this.setState(() => {
        let newState = {};
        newState[traitValueInputStringKey] = diUtils.asString(arr);
        return newState;
      });
    };

    if (secondary) {
      innerFunction("traitValueInputString2");
    } else {
      innerFunction();
    }
  };

  handleKey = (e, type, blurFunction) => {
    if (["Enter"].includes(e.key)) {
      e.preventDefault();
      blurFunction(e);
      return;
    } else if (["Escape"].includes(e.key)) {
      e.preventDefault();
      let value = diUtils.asString(
        this.props.structureChunk[this.props.traitKey].traitValue
      );
      blurFunction(e, value);
      setTimeout(() => {
        $(`#${this.props.chunkCardKey}-${this.props.traitKey}_${type}`).blur();
      }, 500);
      return;
    }
  };

  render() {
    let {
      traitKey,
      traitObject,
      traitKey2,
      word,
      wordtype,
      lObjId,
      structureChunk,
    } = this.props;

    const exitTraitBox = (changeToValue = true) => {
      console.log("£exitTraitBox");
      $(document).off("keyup");
      this.setState({
        isInputActive: false,
        isHovered: false,
        isSelected: false,
        forceShowInput: false,
        hasJustBlurred: changeToValue,
        hasJustBlurredRegardlessOfChange: true,
      });
      this.setShowTagInterface();

      setTimeout(() => {
        this.setState({ hasJustBlurredRegardlessOfChange: false });
      }, 50);

      setTimeout(
        () => {
          this.setState({
            hasJustBlurred: false,
            traitValueInputString: diUtils.asString(
              this.props.traitObject.traitValue
            ),
            traitValueInputString2:
              this.props.traitObject2 &&
              diUtils.asString(this.props.traitObject2.traitValue),
          });
        },
        changeToValue ? 500 : 0
      );
    };

    const checkAndSetTraitValue = (secondaryAsWellAsPrimary = false) => {
      console.log(`(${structureChunk.lemma})`, "£checkAndSetTraitValue");

      const innerFunction = (
        traitKeyKey = "traitKey",
        traitValueInputStringKey = "traitValueInputString",
        traitObjectKey = "traitObject"
      ) => {
        const traitKey = this.props[traitKeyKey];
        console.log(`(${structureChunk.lemma})`, "@...");
        console.log(
          `(${structureChunk.lemma})`,
          `this.state[traitValueInputStringKey]`,
          this.state[traitValueInputStringKey],
          typeof this.state[traitValueInputStringKey]
        );

        if (
          this.state[traitValueInputStringKey] !==
            diUtils.asString(this.props[traitObjectKey].traitValue) &&
          !(
            uUtils.isEmpty(this.state[traitValueInputStringKey], true) &&
            uUtils.isEmpty(this.props[traitObjectKey].traitValue, true)
          )
        ) {
          console.log(`(${structureChunk.lemma})`, "@You have changed value.");
          console.log(
            `(${structureChunk.lemma})`,
            `@this.state[traitValueInputStringKey]`,
            this.state[traitValueInputStringKey],
            typeof this.state[traitValueInputStringKey]
          );
          console.log(
            `(${structureChunk.lemma})`,
            `@this.props[traitObjectKey].traitValue`,
            this.props[traitObjectKey].traitValue,
            typeof this.props[traitObjectKey].traitValue
          );
          console.log(`(${structureChunk.lemma})`, "/@");

          let newStructureChunk = {
            ...structureChunk,
          };

          let newTraitValue = this.state[traitValueInputStringKey];
          newTraitValue = uUtils.isEmpty(newTraitValue, true)
            ? null
            : newTraitValue;

          let expectedType = newStructureChunk[traitKey].expectedTypeOnStCh;

          if (expectedType === "array") {
            console.log(`(${structureChunk.lemma})`, "::", newTraitValue);
            if (newTraitValue) {
              newTraitValue = diUtils.asArray(newTraitValue);
            }
            console.log(`(${structureChunk.lemma})`, ":::", newTraitValue);
          } else if (expectedType === "string") {
            if (newTraitValue && newTraitValue.includes(",")) {
              alert(
                "Just one string value expected but you have input a comma."
              );
              this.setState({
                traitValueInputString: diUtils.asString(
                  this.props[traitObjectKey].traitValue
                ),
              });
              //Aborting without changing anything.
              console.log(
                `(${structureChunk.lemma})`,
                "@1 No change to value."
              );
              exitTraitBox(); //alpha why both exitTraitBox?
              exitTraitBox(false);
            }
          } else if (expectedType === "boolean") {
            newTraitValue = newTraitValue === "true" ? true : false;
          }

          newStructureChunk[traitKey] = {
            ...newStructureChunk[traitKey],
          };

          scUtils.setNewTraitValue(newStructureChunk, traitKey, newTraitValue);

          if (idUtils.agreementTraits.includes(traitKey)) {
            let traitsAffectedByAgreementTrait =
              structureChunk._info.inheritableInflectionKeys;
            traitsAffectedByAgreementTrait.forEach((tk) => {
              if (newTraitValue) {
                scUtils.setNewTraitValue(newStructureChunk, tk, null);
              } else {
                newStructureChunk[tk].traitValue = uUtils.copyWithoutReference(
                  this.props.backedUpStructureChunk[tk].traitValue
                );
              }
            });

            setTimeout(() => {
              this.props.setMeaninglessCounterTraitBox((prev) => prev + 1);
            }, 100);
          }

          this.props.modifyStructureChunkOnThisFormulaItem(newStructureChunk);
          console.log(`(${structureChunk.lemma})`, "@2 Changing value.");
          exitTraitBox();
          exitTraitBox(false);
        }
        console.log(`(${structureChunk.lemma})`, "@3 No change to value.");
        exitTraitBox();
        exitTraitBox(false);
      };

      console.log(`(${structureChunk.lemma})`, "###");
      console.log(`(${structureChunk.lemma})`, "checkAndSetTraitValue PRIMARY");
      console.log(`(${structureChunk.lemma})`, "###");
      innerFunction();

      if (secondaryAsWellAsPrimary) {
        console.log(`(${structureChunk.lemma})`, "###");
        console.log(
          `(${structureChunk.lemma})`,
          "checkAndSetTraitValue SECONDARY"
        );
        console.log(`(${structureChunk.lemma})`, "###");
        innerFunction("traitKey2", "traitValueInputString2", "traitObject2");
      }
    };

    const forceShowInputThenFocus = (id) => {
      this.setState({ forceShowInput: true });
      setTimeout(() => {
        $(`#${id}`).focus();
      }, 50);
    };

    const traitBoxID = `${this.props.chunkCardKey}-${traitKey}_maindiv`;

    if (
      this.state.isFlowerSearchingForStem &&
      this.props.flowerSearchingForStemBrace[0] === this.props.chunkId &&
      this.props.stemFoundForFlowerBrace[0]
    ) {
      let stemFound = this.props.stemFoundForFlowerBrace[0];
      this.props.flowerSearchingForStemBrace[1](null);
      this.props.stemFoundForFlowerBrace[1](null);
      this.setState({
        traitValueInputString: stemFound,
        isFlowerSearchingForStem: false,
      });
      setTimeout(() => {
        checkAndSetTraitValue();
      }, 50);
    }

    const isClickableFlowerstem = (propsObject) => {
      return (
        propsObject.traitKey === "chunkId" &&
        propsObject.flowerSearchingForStemBrace[0] &&
        propsObject.flowerSearchingForStemBrace[0] !==
          propsObject.traitObject.traitValue
      );
    };

    const wipeTraitValue = (
      traitBoxID,
      traitValueInputStringKey,
      isSecondary
    ) => {
      diUtils.connectChunkIdWithItsFlowers(
        traitBoxID,
        this.state.traitValueInputString,
        [this.props.setElementsToDrawLinesBetween],
        true,
        ["chunkId"]
      );
      this.setState(() => {
        let newState = {};
        newState[traitValueInputStringKey] = null;
        return newState;
      });
      setTimeout(() => {
        checkAndSetTraitValue(isSecondary);
      }, 500);
    };

    const traitKeyRegulatorIsActive = (traitKeyRegulator, traitKey) => {
      return (
        this.props.traitRegulatorValues[traitKeyRegulator.name] &&
        this.props.traitRegulatorValues[traitKeyRegulator.name].includes(
          traitKey
        )
      );
    };

    return (
      <>
        {this.state.isSelected && (
          <div
            className={gstyles.obscurus}
            onClick={() => {
              exitTraitBox(false);
            }}
          ></div>
        )}

        {this.state.showTagInterface && (
          <TagInterface
            traitValueInputString={this.state.traitValueInputString}
            traitValueInputString2={this.state.traitValueInputString2}
            setShowTagInterface={this.setShowTagInterface}
            pushpopTraitValueInputString={this.pushpopTraitValueInputString}
            revertTraitValueInputString={this.revertTraitValueInputString}
            checkAndSetTraitValue={checkAndSetTraitValue}
            exitTraitBox={exitTraitBox}
            wordtype={wordtype}
            word={word}
            lObjId={lObjId}
            backedUpTags={this.props.backedUpStructureChunk.andTags.traitValue}
          />
        )}

        <div
          id={traitBoxID}
          key={traitBoxID}
          className={`${styles.preventSelection} ${styles.traitBox} ${
            idUtils.agreementTraits.includes(traitKey) && styles.traitBoxCircle1
          } ${idUtils.isChunkId(traitKey) && styles.traitBoxCircle2} ${
            !traitObject.traitValue && styles.traitBoxEmpty
          } ${this.state.hasJustBlurred && styles.shimmer} ${
            this.state.hasJustBlurredRegardlessOfChange && styles.briefBlur
          } ${
            (this.state.isHovered || this.state.isSelected) &&
            styles.traitBoxHover
          } ${this.state.isSoftHighlighted && gstyles.highlighted0} ${
            this.state.isSelected && styles.traitBoxSelected
          } ${
            (this.state.isHighlighted || isClickableFlowerstem(this.props)) &&
            gstyles.highlighted1
          } ${
            (this.state.isExtraHighlighted ||
              this.state.isFlowerSearchingForStem) &&
            gstyles.highlighted2
          } 
          ${
            idUtils.isTagTrait(traitKey) &&
            idUtils.isBadChunk(structureChunk) &&
            styles.badBox
          } 
          ${this.props.traitKeysGroup === 2 && gstyles.oddEdges}
        `}
          onClick={() => {
            if (isClickableFlowerstem(this.props)) {
              this.props.stemFoundForFlowerBrace[1](this.props.chunkId);
              this.setState({ isExtraHighlighted: false });
            }
          }}
          onMouseEnter={() => {
            if (isClickableFlowerstem(this.props)) {
              this.setState({ isExtraHighlighted: true });
            } else if (traitKey === "chunkId") {
              diUtils.connectChunkIdWithItsFlowers(
                traitBoxID,
                this.state.traitValueInputString,
                [this.props.setElementsToDrawLinesBetween]
              );
            } else if (idUtils.agreementTraits.includes(traitKey)) {
              diUtils.connectChunkIdWithItsFlowers(
                traitBoxID,
                this.state.traitValueInputString,
                [this.props.setElementsToDrawLinesBetween],
                false,
                ["chunkId"]
              );
            }
          }}
          onMouseLeave={() => {
            if (traitKey === "chunkId") {
              this.setState({ isExtraHighlighted: false });
              diUtils.connectChunkIdWithItsFlowers(
                traitBoxID,
                this.state.traitValueInputString,
                [this.props.setElementsToDrawLinesBetween],
                true
              );
            } else if (idUtils.agreementTraits.includes(traitKey)) {
              diUtils.connectChunkIdWithItsFlowers(
                traitBoxID,
                this.state.traitValueInputString,
                [this.props.setElementsToDrawLinesBetween],
                true,
                ["chunkId"]
              );
            }
            this.setState({ isHighlighted: false, isSoftHighlighted: false });
          }}
        >
          {this.state.justCopied && (
            <div className={gstyles.floatingAlert}>Copied</div>
          )}
          {idUtils.isTagTrait(traitKey) &&
            !this.state.isHovered &&
            !this.state.hasJustBlurred && (
              <button
                alt="Magnifying glass icon"
                className={styles.floatingButton}
                onMouseOver={() => {
                  this.setState({ isHovered: true, isInputActive: true });
                }}
              >
                &#128269;
              </button>
            )}
          <div
            className={`${styles.traitTitleHolder} ${
              idUtils.isChunkId(traitKey) && gstyles.hidden
            }`}
            id={`traitTitleHolder-${traitKey}`}
            onMouseEnter={() => {
              consol.logTraitBox(this.state, this.props); //devlogging
            }}
            onClick={(e) => {
              console.log("%traitTitleHolder");
              if (traitKey === "chunkId") {
                return;
              }
              if (idUtils.isTagTrait(traitKey)) {
                this.setShowTagInterface(true);
                this.props.setHighlightedCard(
                  structureChunk.chunkId.traitValue
                );
                return;
              }
              if (idUtils.agreementTraits.includes(traitKey)) {
                if (this.state.isFlowerSearchingForStem) {
                  this.props.flowerSearchingForStemBrace[1]();
                  this.setState({ isFlowerSearchingForStem: false });
                } else {
                  this.props.flowerSearchingForStemBrace[1](this.props.chunkId);
                  this.setState({
                    isHighlighted: false,
                    isFlowerSearchingForStem: true,
                  });
                  e.target.focus();
                }
                return;
              }
              if (this.state.isSelected) {
                checkAndSetTraitValue();
              } else {
                this.setState({
                  isSelected: true,
                });
                uUtils.addListener($, document, "keyup", (e) => {
                  e.preventDefault();
                  console.log(
                    `via Traitbox ${this.props.chunkCardKey}-${this.props.traitKey} document listened keyup:`,
                    e.key
                  );

                  if (this.state.isSelected) {
                    if (e.key === "Enter") {
                      checkAndSetTraitValue();
                    } else if (e.key === "Escape") {
                      exitTraitBox(false);
                    } else if (e.key === "Backspace") {
                      wipeTraitValue(traitBoxID, "traitValueInputString");
                    }
                  }
                });

                if (traitObject.expectedTypeOnStCh === "string") {
                  forceShowInputThenFocus(
                    `${this.props.chunkCardKey}-${traitKey}_textarea`
                  );
                }
              }
            }}
          >
            <p
              className={`${styles.traitTitle} ${
                traitObject.isLexical && styles.lexicalTraitTitle
              }`}
            >
              {traitKey}
              {traitKey2 && ` / ${traitKey2}`}
            </p>
            {this.state.isSelected &&
              !["booleanTraits"].includes(traitKey) &&
              traitObject.possibleTraitValues && (
                <button
                  className={`${styles.floatRightButton} ${gstyles.tooltipHolderDelayed}`}
                  alt="Six dots icon"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    this.setState((prevState) => {
                      let newString =
                        prevState.traitValueInputString &&
                        diUtils.asArray(prevState.traitValueInputString)
                          .length === traitObject.possibleTraitValues.length
                          ? ""
                          : diUtils.asString(traitObject.possibleTraitValues);

                      return {
                        traitValueInputString: newString,
                      };
                    });
                  }}
                >
                  &#10303;
                  <Tooltip text="Select all" number={6} />
                </button>
              )}
          </div>
          {(!uUtils.isEmpty(traitObject.traitValue) ||
            this.state.forceShowInput ||
            idUtils.isTagTrait(traitKey) ||
            traitObject.isLexical) && (
            <div
              key={`${this.state.traitValueInputString}-${
                this.state.traitValueInputString2
                  ? this.state.traitValueInputString2
                  : ""
              }`}
              onMouseLeave={() => {
                this.setState({
                  isHovered: false,
                  isInputActive: false,
                });
              }}
            >
              {[traitKey, traitKey2]
                .filter((el) => el)
                .map((traitKey, index) => {
                  const isSecondary = index === 1;
                  const traitValueInputStringKey = isSecondary
                    ? "traitValueInputString2"
                    : "traitValueInputString";

                  const textareaBlur = (e, value) => {
                    console.log("%traitValuesInput-onBlur");
                    if (!value && value !== "") {
                      value = e.target.value;
                    }
                    if (idUtils.isTagTrait(traitKey)) {
                      e.preventDefault();
                      return;
                    }
                    this.setState(() => {
                      let newState = {};
                      newState[traitValueInputStringKey] = value;
                      newState.activeTextarea = null;
                      return newState;
                    });
                    setTimeout(() => {
                      checkAndSetTraitValue(isSecondary);
                    }, 50);
                  };

                  return (
                    <div
                      key={`${this.props.chunkCardKey}-${traitKey}_div-for-textarea`}
                      className={`
                      ${styles.traitValuesBox} 
                      ${
                        idUtils.agreementTraits.includes(traitKey) &&
                        styles.reducedHeight
                      } 
                      ${
                        traitKey === "chunkId" && gstyles.tooltipHolderDelayed
                      }`}
                    >
                      {traitKey === "chunkId" && (
                        <Tooltip text="chunk ID" number={3} />
                      )}
                      <textarea
                        key={`${this.props.chunkCardKey}-${traitKey}_textarea`}
                        id={`${this.props.chunkCardKey}-${traitKey}_textarea`}
                        disabled={
                          idUtils.isTagTrait(traitKey) ||
                          idUtils.isChunkId(traitKey) ||
                          idUtils.agreementTraits.includes(traitKey) ||
                          traitObject.possibleTraitValues
                        }
                        className={`
                        ${
                          traitKey === "chunkId"
                            ? styles.chunkIdDisplay
                            : styles.traitValuesInput
                        } 
                        ${
                          idUtils.isTagTrait(traitKey) &&
                          styles.traitValuesInputLarge
                        } 
                        ${styles.preventSelection} 
                        ${
                          [
                            "booleanTraits",
                            ...idUtils.agreementTraits,
                          ].includes(traitKey) && styles.verySmallText
                        }`}
                        value={
                          `textarea-${traitKey}` === this.state.activeTextarea
                            ? null
                            : this.state[traitValueInputStringKey]
                        }
                        onClick={(e) => {
                          console.log("%textarea");
                          e.stopPropagation();
                          if (
                            idUtils.agreementTraits.includes(traitKey) ||
                            idUtils.isChunkId(traitKey)
                          ) {
                            e.target.select();
                          } else {
                            this.setState({
                              isSelected: true,
                            });
                          }
                        }}
                        onMouseEnter={() => {
                          //devlogging
                          console.log(
                            "textarea.value:",
                            document.getElementById(
                              `${this.props.chunkCardKey}-${traitKey}_textarea`
                            ).value
                          );
                        }}
                        onBlur={(e) => {
                          e.stopPropagation();
                          if (
                            `textarea-${traitKey}` === this.state.activeTextarea
                          ) {
                            textareaBlur(e);
                          }
                        }}
                        onKeyDown={(e) => {
                          this.handleKey(e, "textarea", textareaBlur);
                        }}
                        onChange={(e) => {
                          e.stopPropagation();
                          console.log("%traitValuesInput-onChange");
                          console.log(
                            "textarea.value:",
                            document.getElementById(
                              `${this.props.chunkCardKey}-${traitKey}_textarea`
                            ).value
                          );
                          if (idUtils.isTagTrait(traitKey)) {
                            e.preventDefault();
                            return;
                          }
                          this.setState({
                            activeTextarea: `textarea-${traitKey}`,
                          });
                        }}
                      />
                      {traitKey === "chunkId" ? (
                        <button
                          alt="Clipboard icon"
                          className={`${gstyles.blueButton} ${gstyles.sideButton} ${styles.copyButton}`}
                          onClick={(e) => {
                            console.log("%clipboard");
                            e.stopPropagation();
                            navigator.clipboard.writeText(
                              this.state.traitValueInputString
                            );
                            this.setState({ justCopied: true });
                            setTimeout(() => {
                              this.setState({ justCopied: false });
                            }, 500);
                          }}
                        >
                          &#x1f4cb;
                        </button>
                      ) : (
                        !this.state.isHovered && (
                          <div className={styles.sideButtonHolder}>
                            <button
                              alt="Cross icon"
                              className={`
                              ${gstyles.sideButton} 
                              ${gstyles.fullHeight} 
                              ${gstyles.redButton} 
                              ${
                                traitObject.isLexical
                                  ? styles.clearButtonMini
                                  : styles.clearButton
                              }`}
                              onClick={(e) => {
                                console.log("%cross1");
                                e.stopPropagation();
                                wipeTraitValue(
                                  traitBoxID,
                                  traitValueInputStringKey,
                                  isSecondary
                                );
                              }}
                            >
                              &times;
                            </button>
                            {traitObject.isLexical && (
                              <div className={styles.miniButtonHolder}>
                                {idUtils.traitKeyRegulators.map(
                                  (traitKeyRegulator) => (
                                    <button
                                      key={traitKeyRegulator.name}
                                      alt={traitKeyRegulator.altText}
                                      className={`${gstyles.blueButton} ${
                                        styles.miniButton
                                      } ${gstyles.tooltipHolderDelayed} ${
                                        traitKeyRegulatorIsActive(
                                          traitKeyRegulator,
                                          traitKey
                                        ) && gstyles.blueButtonActive
                                      }`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (traitKeyRegulator.name) {
                                          this.props.regulateTraitKey(
                                            traitKey,
                                            traitKeyRegulator.name
                                          );
                                        } else {
                                          this.props.setPopup(
                                            helpTexts.traitKeyRegulators
                                          );
                                        }
                                      }}
                                    >
                                      {traitKeyRegulator.buttonText}
                                      <Tooltip
                                        text={traitKeyRegulator.tooltipText}
                                        number={4}
                                      />
                                    </button>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  );
                })}
            </div>
          )}

          {this.state.isSelected && (
            <div
              className={`${
                traitKey === "booleanTraits"
                  ? styles.inputOptionsHolder2
                  : styles.inputOptionsHolder
              } ${traitKey === "booleanTraits" && styles.verySmallText}`}
            >
              {traitObject.expectedTypeOnStCh === "array" && (
                <div
                  className={
                    traitKey === "booleanTraits"
                      ? styles.inputOptionsSubHolder2
                      : styles.inputOptionsSubHolder
                  }
                >
                  {traitObject.possibleTraitValues ? (
                    traitObject.possibleTraitValues.map(
                      (possibleTraitValue, index) => (
                        <div
                          key={`${traitKey}-${index}`}
                          className={
                            traitKey === "booleanTraits"
                              ? styles.inputOption2
                              : styles.inputOption
                          }
                        >
                          <input
                            className={
                              traitKey === "booleanTraits"
                                ? styles.checkbox2
                                : styles.checkbox
                            }
                            type="checkbox"
                            id={`${traitKey}-${index}`}
                            name={`${traitKey}-${index}`}
                            value={possibleTraitValue}
                            checked={
                              this.state.traitValueInputString &&
                              diUtils
                                .asArray(this.state.traitValueInputString)
                                .includes(possibleTraitValue)
                            }
                            onChange={(e) => {
                              e.stopPropagation();
                              console.log("%checkbox-onChange");
                              this.setState((prevState) => {
                                if (
                                  prevState.traitValueInputString &&
                                  diUtils
                                    .asArray(prevState.traitValueInputString)
                                    .includes(e.target.value) &&
                                  !e.target.checked
                                ) {
                                  let newtraitValueInputString =
                                    diUtils.asString(
                                      diUtils
                                        .asArray(
                                          prevState.traitValueInputString
                                        )
                                        .filter((el) => el !== e.target.value)
                                    );
                                  return {
                                    traitValueInputString:
                                      newtraitValueInputString,
                                  };
                                } else if (
                                  (!prevState.traitValueInputString ||
                                    !diUtils
                                      .asArray(prevState.traitValueInputString)
                                      .includes(e.target.value)) &&
                                  e.target.checked
                                ) {
                                  let newtraitValueInputString =
                                    diUtils.asString([
                                      ...diUtils.asArray(
                                        prevState.traitValueInputString
                                      ),
                                      e.target.value,
                                    ]);
                                  return {
                                    traitValueInputString:
                                      newtraitValueInputString,
                                  };
                                }
                              });
                            }}
                          />
                          <label
                            className={`
                            ${styles.checkboxLabel}
                            ${
                              [
                                "booleanTraits",
                                ...idUtils.agreementTraits,
                              ].includes(traitKey) && styles.smallText
                            }
                            `}
                            htmlFor={`${traitKey}-${index}`}
                          >
                            {possibleTraitValue}
                          </label>
                        </div>
                      )
                    )
                  ) : (
                    <button
                      onClick={(e) => {
                        console.log("%msv");
                        e.stopPropagation();
                        forceShowInputThenFocus(
                          `${this.props.chunkCardKey}-${traitKey}_textarea`
                        );
                      }}
                    >
                      Multiple string values, comma separated
                    </button>
                  )}
                </div>
              )}
              {traitObject.expectedTypeOnStCh === "string" && (
                <button
                  onClick={(e) => {
                    console.log("%osv");
                    e.stopPropagation();
                    this.setState({ forceShowInput: true });
                  }}
                >
                  One string value
                </button>
              )}

              {!["string", "boolean", "array"].includes(
                traitObject.expectedTypeOnStCh
              ) && <p>expectedTypeOnStCh: {traitObject.expectedTypeOnStCh}</p>}
            </div>
          )}
        </div>
      </>
    );
  }
}

export default TraitBox;
