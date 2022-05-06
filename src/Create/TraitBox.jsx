import React, { Component } from "react";
import styles from "../css/TraitBox.module.css";
import gstyles from "../css/Global.module.css";
import TagInterface from "./TagInterface.jsx";
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
    forceShowInput: false,
    showTagInterface: false,
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
    let { traitKey, traitObject, traitKey2, word, setStructureChunk } =
      this.props;

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
      }, 1000);
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
                  "Just one string value expected but you have input a comma?"
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

    return (
      <div
        key={`${word}-${traitKey}`}
        className={`${styles.preventSelection} ${styles.traitBox} ${
          !traitObject.traitValue && styles.traitBoxEmpty
        } ${this.state.hasJustBlurred && styles.shimmer} ${
          (this.state.isHovered || this.state.isSelected) &&
          styles.traitBoxHover
        } ${this.state.isSelected && styles.traitBoxSelected}
        
        `}
      >
        {diUtils.isTagTrait(traitKey) && !this.state.isHovered && (
          <button
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
          />
        )}
        <div
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
            console.log("£traitTitleHolder-onClick");
            if (this.state.isSelected) {
              checkAndSetTraitValue();
            } else {
              this.setState({
                isSelected: true,
                showTagInterface: diUtils.isTagTrait(traitKey),
              });
            }
          }}
          className={styles.traitTitleHolder}
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
                    key={`div-for-textarea-${traitKey}`}
                    className={styles.traitValuesBox}
                  >
                    <textarea
                      key={`textarea-${traitKey}`}
                      disabled={
                        diUtils.isTagTrait(traitKey) ||
                        traitObject.possibleTraitValues ||
                        traitObject.expectedTypeOnStCh === "boolean"
                      }
                      className={`${styles.traitValuesInput} ${
                        diUtils.isTagTrait(traitKey) &&
                        styles.traitValuesInputLarge
                      }`}
                      value={this.state[traitValueInputStringKey]}
                      onBlur={(e) => {
                        console.log("£traitValuesInput-onBlur");
                        if (diUtils.isTagTrait(traitKey)) {
                          e.preventDefault();
                          return;
                        }
                        this.setState(() => {
                          let newState = {};
                          newState[traitValueInputStringKey] = e.target.value;
                          return newState;
                        });
                      }}
                      onChange={(e) => {
                        console.log("£traitValuesInput-onChange");
                        if (diUtils.isTagTrait(traitKey)) {
                          e.preventDefault();
                          return;
                        }
                      }}
                    />
                    <button
                      className={`${gstyles.exitButton} ${styles.clearButton}`}
                      onClick={() => {
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
                            console.log("£checkbox-onChange");
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
                      this.setState({ forceShowInput: true });
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
                  this.setState({ forceShowInput: true });
                }}
              >
                One string value
              </button>
            )}
            {traitObject.expectedTypeOnStCh === "boolean" && (
              <div>
                <input
                  className={styles.checkbox}
                  type="checkbox"
                  id={`${traitKey}-0`}
                  name={`${traitKey}-0`}
                  checked={this.state.traitValueInputString === "true"}
                  onChange={(e) => {
                    console.log("£checkbox2-onChange");
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
