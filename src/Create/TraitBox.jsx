import React, { Component } from "react";
import styles from "../css/TraitBox.module.css";
import gstyles from "../css/Global.module.css";
import TagInterface from "./TagInterface.jsx";
import $ from "jquery";
const uUtils = require("../utils/universalUtils.js");
const diUtils = require("../utils/displayUtils.js");

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

  pushpopTraitValueInputString = (val, add = true, secondary = false) => {
    console.log("£pushpopTraitValueInputString");
    const innerFunction = (
      traitValueInputStringKey = "traitValueInputString"
    ) => {
      let arr = diUtils.asArray(this.state[traitValueInputStringKey]);

      if (add) {
        if (!arr.includes(val)) {
          arr.push(val);
        }
      } else {
        arr = arr.filter((el) => el !== val);
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
      setStructureChunk,
      wordtype,
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
          setStructureChunk((prevStructureChunk) => {
            let newStructureChunk = {
              ...prevStructureChunk,
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
                return newStructureChunk; //Aborting without changing anything.
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
            return newStructureChunk;
          });
          exitTraitBox();
          return;
        }
        console.log("@No change to value.");
        console.log("/@");
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

    const connectChunkIdWithItsFlowers = (
      flowerstemID,
      remove = false,
      value = this.state.traitValueInputString,
      flowerTraitTitles = ["agreeWith", "connectedTo"],
      flowerClasses = [gstyles.highlighted1],
      flowerstemClasses = [gstyles.highlighted1, gstyles.zindex5]
    ) => {
      let potentialFlowers = $(`.${styles.traitBox}`).filter(function () {
        return $(this)
          .find(`.${styles.traitTitle}`)
          .filter(function () {
            let traitTitle = $(this);
            return flowerTraitTitles.includes(traitTitle.text());
          }).length;
      });

      let flowers = potentialFlowers.filter(function () {
        let el = $(this);
        let textareas = el.find("textarea");
        return textareas.filter(function () {
          let textarea = $(this);
          return textarea.text() === value;
        }).length;
      });

      let flowerIDs = [];

      flowers.each(function () {
        let el = $(this);
        if (remove) {
          el.removeClass(flowerClasses.join(" "));
        } else {
          el.addClass(flowerClasses.join(" "));
          flowerIDs.push(el.attr("id"));
        }
      });

      if (flowers.length) {
        if (remove) {
          $(`#${flowerstemID}`).removeClass(flowerstemClasses.join(" "));
        } else {
          $(`#${flowerstemID}`).addClass(flowerstemClasses.join(" "));
        }
      }

      if (flowerIDs.length) {
        this.props.setElementsToDrawLinesBetween((prev) => {
          let arr = prev ? prev.slice(0) : [];
          arr.push({ flowerstem: flowerstemID, flowers: flowerIDs });
          return arr;
        });
      } else {
        this.props.setElementsToDrawLinesBetween([]);
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
      console.log("FOUND STEM", stemFound);
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
          !traitObject.traitValue && styles.traitBoxEmpty
        } ${this.state.hasJustBlurred && styles.shimmer} ${
          (this.state.isHovered || this.state.isSelected) &&
          styles.traitBoxHover
        } ${this.state.isSelected && styles.traitBoxSelected} ${
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
            connectChunkIdWithItsFlowers(traitBoxID);
          } else if (["agreeWith", "connectedTo"].includes(traitKey)) {
            this.setState({ isHighlighted: true });
          }
        }}
        onMouseLeave={() => {
          if (traitKey === "chunkId") {
            this.setState({ isExtraHighlighted: false });
            connectChunkIdWithItsFlowers(traitBoxID, true);
          }
          this.setState({ isHighlighted: false });
        }}
      >
        {this.state.justCopied && (
          <div className={styles.floatingAlert}>Copied</div>
        )}
        {diUtils.isTagTrait(traitKey) &&
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
          />
        )}
        <div
          className={styles.traitTitleHolder}
          onMouseEnter={() => {
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
          onClick={() => {
            console.log("%traitTitleHolder");
            if (traitKey === "chunkId") {
              return;
            }
            if (["agreeWith", "connectedTo"].includes(traitKey)) {
              if (this.state.isFlowerSearchingForStem) {
                this.props.flowerSearchingForStemBrace[1]();
                this.setState({ isFlowerSearchingForStem: false });
              } else {
                this.props.flowerSearchingForStemBrace[1](this.props.chunkId);
                this.setState({
                  isHighlighted: false,
                  isFlowerSearchingForStem: true,
                });
              }
              return;
            }
            if (this.state.isSelected) {
              checkAndSetTraitValue();
            } else {
              this.setState({
                isSelected: true,
                showTagInterface: diUtils.isTagTrait(traitKey),
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
          diUtils.isTagTrait(traitKey)) && (
          <div
            key={`${this.state.traitValueInputString}-${
              this.state.traitValueInputString2
                ? this.state.traitValueInputString2
                : ""
            }`}
            onMouseOut={() => {
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
                        diUtils.isTagTrait(traitKey) ||
                        traitObject.possibleTraitValues ||
                        traitObject.expectedTypeOnStCh === "boolean"
                      }
                      className={`${styles.traitValuesInput} ${
                        diUtils.isTagTrait(traitKey) &&
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
                          ["chunkId", "connectedTo", "agreeWith"].includes(
                            traitKey
                          )
                        ) {
                          e.target.select();
                        }
                      }}
                      onMouseEnter={() => {
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
                        if (diUtils.isTagTrait(traitKey)) {
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
                        if (diUtils.isTagTrait(traitKey)) {
                          console.log("prevent default");
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
                            console.log("X!");
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
