import React, { Component } from "react";
import styles from "../css/TraitBox.module.css";
import gstyles from "../css/Global.module.css";
import TagInterface from "./TagInterface.jsx";
const uUtils = require("../utils/universalUtils.js");
const diUtils = require("../utils/displayUtils.js");

class TraitBox extends Component {
  state = {
    traitValueInputString: diUtils.asString(this.props.traitObject.traitValue),
    hasJustBlurred: false,
    isInputActive: false,
    isHovered: false,
    isSelected: false,
    forceShowInput: false,
    showTagInterface: false,
    thickBorder: false,
  };

  setShowTagInterface = (val) => {
    this.setState({ showTagInterface: val });
  };

  revertTraitValueInputString = () => {
    this.setState({
      traitValueInputString: diUtils.asString(
        this.props.traitObject.traitValue
      ),
    });
  };

  pushpopTraitValueInputString = (val, add = true) => {
    let arr = diUtils.asArray(this.state.traitValueInputString);

    if (add) {
      if (!arr.includes(val)) {
        arr.push(val);
      }
    } else {
      arr = arr.filter((el) => el !== val);
    }

    this.setState({
      traitValueInputString: diUtils.asString(arr),
    });
  };

  render() {
    let { traitKey, traitObject, word, setStructureChunk } = this.props;

    const exitTraitBox = (changeToValue = true) => {
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
          thickBorder: false,
          hasJustBlurred: false,
          traitValueInputString: diUtils.asString(
            this.props.traitObject.traitValue
          ),
        });
      }, 1000);
    };

    const checkAndSetTraitValue = () => {
      console.log("@...");
      console.log(
        "this.state.traitValueInputString",
        this.state.traitValueInputString,
        typeof this.state.traitValueInputString
      );

      if (
        this.state.traitValueInputString !==
          diUtils.asString(this.props.traitObject.traitValue) &&
        !(
          uUtils.isEmpty(this.state.traitValueInputString, true) &&
          uUtils.isEmpty(this.props.traitObject.traitValue, true)
        )
      ) {
        console.log("@You have changed value.");
        console.log(
          "@this.state.traitValueInputString",
          this.state.traitValueInputString,
          typeof this.state.traitValueInputString
        );
        console.log(
          "@this.props.traitObject.traitValue",
          this.props.traitObject.traitValue,
          typeof this.props.traitObject.traitValue
        );
        console.log("/@");
        setStructureChunk((prevStructureChunk) => {
          let newStructureChunk = {
            ...prevStructureChunk,
          };

          let newTraitValue = this.state.traitValueInputString;
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
                  this.props.traitObject.traitValue
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

    return (
      <div
        // onMouseEnter={() => {
        //   this.setState({ isHovered: true });
        // }}
        // onMouseLeave={() => {
        //   if (!this.state.isInputActive) {
        //     this.setState({ isHovered: false });
        //   }
        // }}
        key={`${word}-${traitKey}`}
        className={`${styles.preventSelection} ${styles.traitBox} ${
          !traitObject.traitValue && styles.traitBoxEmpty
        } ${this.state.hasJustBlurred && styles.shimmer} ${
          (this.state.isHovered || this.state.isSelected) &&
          styles.traitBoxHover
        } ${this.state.isSelected && styles.traitBoxSelected} ${
          this.state.thickBorder && styles.thickBorder
        }
        
        `}
      >
        {this.state.showTagInterface && (
          <TagInterface
            traitValueInputString={this.state.traitValueInputString}
            setTraitInputValueString={this.setTraitInputValueString}
            setShowTagInterface={this.setShowTagInterface}
            pushpopTraitValueInputString={this.pushpopTraitValueInputString}
            revertTraitValueInputString={this.revertTraitValueInputString}
            checkAndSetTraitValue={checkAndSetTraitValue}
            exitTraitBox={exitTraitBox}
          />
        )}
        <div
          onMouseEnter={() => {
            console.log(
              ">traitValueInputString",
              this.state.traitValueInputString
            );
            console.log(
              ">this.props.traitObject.traitValue",
              this.props.traitObject.traitValue
            );
          }}
          onClick={() => {
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
          </p>
        </div>
        {(!uUtils.isEmpty(traitObject.traitValue) ||
          this.state.forceShowInput) && (
          <div className={styles.traitValuesBox}>
            <textarea
              className={`${styles.traitValuesInput} ${
                diUtils.isTagTrait(traitKey) && styles.traitValuesInputLarge
              }`}
              value={this.state.traitValueInputString}
              onChange={(e) => {
                this.setState({ traitValueInputString: e.target.value });
              }}
              onFocus={() => {
                this.setState({ isHovered: true, isInputActive: true });
              }}
              onBlur={checkAndSetTraitValue}
            />
            <button
              className={`${gstyles.exitButton} ${styles.clearButton}`}
              onClick={() => {
                console.log("X!");
                this.setState({
                  traitValueInputString: null,
                  thickBorder: true,
                });
                setTimeout(checkAndSetTraitValue, 500);
              }}
            >
              &times;
            </button>
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
