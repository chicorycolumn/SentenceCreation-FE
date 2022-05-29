import React, { Component } from "react";
import styles from "../css/TraitBox.module.css";
import gstyles from "../css/Global.module.css";
import TagInterface from "./TagInterface.jsx";
import $ from "jquery";
import diUtils from "../utils/displayUtils.js";
const uUtils = require("../utils/universalUtils.js");
const idUtils = require("../utils/identityUtils.js");

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

  setShowTagInterface = (val) => {
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

  render() {
    let {
      traitKey,
      traitObject,
      traitKey2,
      word,
      setStructureChunkAndFormula,
      wordtype,
      lObjId,
    } = this.props;

    const exitTraitBox = (changeToValue = true) => {
      console.log("£exitTraitBox");
      this.setState({
        isInputActive: false,
        isHovered: false,
        isSelected: false,
        forceShowInput: false,
        showTagInterface: false,
        hasJustBlurred: changeToValue,
      });

      setTimeout(() => {
        this.setState({
          hasJustBlurred: false,
          traitValueInputString: diUtils.asString(
            this.props.traitObject.traitValue
          ),
          traitValueInputString2:
            this.props.traitObject2 &&
            diUtils.asString(this.props.traitObject2.traitValue),
        });
      }, 500);
    };

    const checkAndSetTraitValue = (secondaryAsWellAsPrimary = false) => {
      console.log("£checkAndSetTraitValue");

      const innerFunction = (
        traitKeyKey = "traitKey",
        traitValueInputStringKey = "traitValueInputString",
        traitObjectKey = "traitObject"
      ) => {
        const traitKey = this.props[traitKeyKey];
        console.log("@...");
        console.log(
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
          console.log("@You have changed value.");
          console.log(
            `@this.state[traitValueInputStringKey]`,
            this.state[traitValueInputStringKey],
            typeof this.state[traitValueInputStringKey]
          );
          console.log(
            `@this.props[traitObjectKey].traitValue`,
            this.props[traitObjectKey].traitValue,
            typeof this.props[traitObjectKey].traitValue
          );
          console.log("/@");

          let newStructureChunk = {
            ...this.props.structureChunk,
          };

          let newTraitValue = this.state[traitValueInputStringKey];
          newTraitValue = uUtils.isEmpty(newTraitValue, true)
            ? null
            : newTraitValue;

          let expectedType = newStructureChunk[traitKey].expectedTypeOnStCh;

          if (expectedType === "array") {
            console.log("::", newTraitValue);
            if (newTraitValue) {
              newTraitValue = diUtils.asArray(newTraitValue);
            }
            console.log(":::", newTraitValue);
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
              console.log("@1 No change to value.");
              exitTraitBox();
              exitTraitBox(false);
            }
          } else if (expectedType === "boolean") {
            newTraitValue = newTraitValue === "true" ? true : false;
          }

          newStructureChunk[traitKey] = {
            ...newStructureChunk[traitKey],
          };

          if (newTraitValue) {
            newStructureChunk[traitKey].traitValue = newTraitValue;
          } else {
            if (expectedType === "array") {
              newStructureChunk[traitKey].traitValue = [];
            } else {
              delete newStructureChunk[traitKey].traitValue;
            }
          }

          this.props.setStructureChunkAndFormula(newStructureChunk);
          console.log("@2 Changing value.");
          exitTraitBox();
          exitTraitBox(false);
        }
        console.log("@3 No change to value.");
        exitTraitBox();
        exitTraitBox(false);
      };

      console.log("###");
      console.log("checkAndSetTraitValue PRIMARY");
      console.log("###");
      innerFunction();

      if (secondaryAsWellAsPrimary) {
        console.log("###");
        console.log("checkAndSetTraitValue SECONDARY");
        console.log("###");
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

    return (
      <div
        id={traitBoxID}
        key={traitBoxID}
        className={`${styles.preventSelection} ${styles.traitBox} ${
          idUtils.isAgreeOrConnected(traitKey) && styles.traitBoxCircle1
        } ${idUtils.isChunkId(traitKey) && styles.traitBoxCircle2} ${
          !traitObject.traitValue && styles.traitBoxEmpty
        } ${this.state.hasJustBlurred && styles.shimmer} ${
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
          } else if (idUtils.isAgreeOrConnected(traitKey)) {
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
          } else if (idUtils.isAgreeOrConnected(traitKey)) {
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
          <div className={styles.floatingAlert}>Copied</div>
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
          className={`${styles.traitTitleHolder} ${
            idUtils.isChunkId(traitKey) && gstyles.hidden
          }`}
          id={`traitTitleHolder-${traitKey}`}
          onMouseEnter={() => {
            //devlogging
            console.log("");
            console.log("state.traitValueInputString HAS VALUE:");
            console.log("> > >", this.state.traitValueInputString);
            console.log("props.traitObject.traitValue HAS VALUE:");
            console.log("> > >", this.props.traitObject.traitValue);
            if (this.state.traitValueInputString2) {
              console.log("");
              console.log("state.traitValueInputString2 HAS VALUE:");
              console.log("> > >", this.state.traitValueInputString2);
              console.log("props.traitObject.traitValue2 HAS VALUE:");
              console.log("> > >", this.props.traitObject2.traitValue);
            }
          }}
          onClick={(e) => {
            console.log("%traitTitleHolder");
            if (traitKey === "chunkId") {
              return;
            }
            if (idUtils.isAgreeOrConnected(traitKey)) {
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
                showTagInterface: idUtils.isTagTrait(traitKey),
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
        </div>
        {(!uUtils.isEmpty(traitObject.traitValue) ||
          this.state.forceShowInput ||
          idUtils.isTagTrait(traitKey)) && (
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

                return (
                  <div
                    key={`${this.props.chunkCardKey}-${traitKey}_div-for-textarea`}
                    className={styles.traitValuesBox}
                  >
                    <textarea
                      key={`${this.props.chunkCardKey}-${traitKey}_textarea`}
                      id={`${this.props.chunkCardKey}-${traitKey}_textarea`}
                      disabled={
                        idUtils.isTagTrait(traitKey) ||
                        idUtils.isChunkId(traitKey) ||
                        idUtils.isAgreeOrConnected(traitKey) ||
                        traitObject.possibleTraitValues ||
                        traitObject.expectedTypeOnStCh === "boolean"
                      }
                      className={`${styles.traitValuesInput} ${
                        idUtils.isTagTrait(traitKey) &&
                        styles.traitValuesInputLarge
                      } ${styles.preventSelection}`}
                      value={
                        `textarea-${traitKey}` === this.state.activeTextarea
                          ? null
                          : this.state[traitValueInputStringKey]
                      }
                      onClick={(e) => {
                        console.log("%textarea");
                        e.stopPropagation();
                        if (
                          idUtils.isAgreeOrConnected(traitKey) ||
                          idUtils.isChunkId(traitKey)
                        ) {
                          e.target.select();
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
                        console.log("%traitValuesInput-onBlur");
                        if (idUtils.isTagTrait(traitKey)) {
                          e.preventDefault();
                          return;
                        }
                        this.setState(() => {
                          let newState = {};
                          newState[traitValueInputStringKey] = e.target.value;
                          newState.activeTextarea = null;
                          return newState;
                        });
                        setTimeout(() => {
                          checkAndSetTraitValue(isSecondary);
                        }, 500);
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
                        <button
                          alt="Cross icon"
                          className={`${gstyles.sideButton} ${gstyles.redButton} ${styles.clearButton}`}
                          onClick={(e) => {
                            console.log("%cross1");
                            e.stopPropagation();
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
                          }}
                        >
                          &times;
                        </button>
                      )
                    )}
                  </div>
                );
              })}
          </div>
        )}

        {this.state.isSelected && (
          <div className={styles.inputOptionsHolder}>
            {traitObject.expectedTypeOnStCh === "array" && (
              <div>
                {traitObject.possibleTraitValues ? (
                  traitObject.possibleTraitValues.map(
                    (possibleTraitValue, index) => (
                      <div key={`${traitKey}-${index}`}>
                        <input
                          className={styles.checkbox}
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
                                let newtraitValueInputString = diUtils.asString(
                                  diUtils
                                    .asArray(prevState.traitValueInputString)
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
                                let newtraitValueInputString = diUtils.asString(
                                  [
                                    ...diUtils.asArray(
                                      prevState.traitValueInputString
                                    ),
                                    e.target.value,
                                  ]
                                );
                                return {
                                  traitValueInputString:
                                    newtraitValueInputString,
                                };
                              }
                            });
                          }}
                        />
                        <label
                          className={styles.checkboxLabel}
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
            {traitObject.expectedTypeOnStCh === "boolean" &&
              !traitObject.traitValue && (
                <div>
                  <input
                    className={styles.checkbox}
                    type="checkbox"
                    id={`${traitKey}-0`}
                    name={`${traitKey}-0`}
                    checked={this.state.traitValueInputString === "true"}
                    onChange={(e) => {
                      e.stopPropagation();
                      console.log("%checkbox2-onChange");
                      this.setState((prevState) => {
                        if (
                          prevState.traitValueInputString === "true" &&
                          !e.target.checked
                        ) {
                          return { traitValueInputString: "false" };
                        } else if (
                          prevState.traitValueInputString !== "true" &&
                          e.target.checked
                        ) {
                          return { traitValueInputString: "true" };
                        }
                      });
                    }}
                  />
                  <label
                    className={styles.checkboxLabel}
                    htmlFor={`${traitKey}-0`}
                  >
                    True
                  </label>
                </div>
              )}
            {!["string", "boolean", "array"].includes(
              traitObject.expectedTypeOnStCh
            ) && <p>expectedTypeOnStCh: {traitObject.expectedTypeOnStCh}</p>}
          </div>
        )}
      </div>
    );
  }
}

export default TraitBox;
