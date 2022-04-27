import React, { Component } from "react";
import styles from "../css/TraitBox.module.css";
const uUtils = require("../utils/universalUtils.js");

const asString = (values) => {
  if (!uUtils.isEmpty(values, true)) {
    return String(values);
  }
};

const asArray = (str, strict = false) => {
  if (!str) {
    return strict ? null : [];
  }
  let split = Array.isArray(str) ? str : str.split(",");
  let res = split.map((element) => element.trim()).filter((element) => element);
  return strict && !res.length ? null : res;
};

class TraitBox extends Component {
  state = {
    traitValueInputString: asString(this.props.traitObject.traitValue),
    hasJustBlurred: false,
    isInputActive: false,
    isHovered: false,
    isSelected: false,
    forceShowInput: false,
  };

  render() {
    let { traitKey, word, traitObject, setSelectedLObj } = this.props;

    const exitTraitBox = () => {
      this.setState({
        isInputActive: false,
        isHovered: false,
        isSelected: false,
        forceShowInput: false,
        hasJustBlurred: true,
      });

      setTimeout(() => {
        this.setState({
          hasJustBlurred: false,
          traitValueInputString: asString(this.props.traitObject.traitValue),
        });
      }, 1000);
    };

    const checkAndSetTraitValue = () => {
      console.log("@");
      setSelectedLObj((prevSelectedLObj) => {
        let newSelectedLObj = {
          ...prevSelectedLObj,
        };

        let newTraitValue = this.state.traitValueInputString;
        let expectedType = newSelectedLObj[traitKey].expectedTypeOnStCh;

        if (expectedType === "array") {
          console.log("::", newTraitValue);
          if (!uUtils.isEmpty(newTraitValue)) {
            newTraitValue = asArray(newTraitValue);
          }
          console.log(":::", newTraitValue);
        } else if (expectedType === "string") {
          if (newTraitValue.includes(",")) {
            alert("Just one string value expected but you have input a comma?");
            this.setState({
              traitValueInputString: asString(
                this.props.traitObject.traitValue
              ),
            });
            return newSelectedLObj; //Aborting without changing anything.
          }
        } else if (expectedType === "boolean") {
          newTraitValue = newTraitValue === "true" ? true : false;
        }

        newSelectedLObj[traitKey] = {
          ...newSelectedLObj[traitKey],
        };

        if (!uUtils.isEmpty(newTraitValue, true)) {
          newSelectedLObj[traitKey].traitValue = newTraitValue;
        } else {
          if (expectedType === "array") {
            newSelectedLObj[traitKey].traitValue = [];
          } else {
            delete newSelectedLObj[traitKey].traitValue;
          }
        }
        return newSelectedLObj;
      });

      exitTraitBox();
    };

    return (
      <div
        onMouseEnter={() => {
          this.setState({ isHovered: true });
        }}
        onMouseLeave={() => {
          if (!this.state.isInputActive) {
            this.setState({ isHovered: false });
          }
        }}
        key={`${word}-${traitKey}`}
        className={`${styles.traitBox}  ${
          !traitObject.traitValue && styles.traitBoxEmpty
        }
        ${this.state.hasJustBlurred && styles.shimmer}
        ${
          (this.state.isHovered || this.state.isSelected) &&
          styles.traitBoxHover
        }
        ${this.state.isSelected && styles.traitBoxSelected}
        
        `}
      >
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
              this.setState({ isSelected: true });
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
            <input
              className={styles.traitValuesInput}
              value={this.state.traitValueInputString}
              onChange={(e) => {
                this.setState({ traitValueInputString: e.target.value });
              }}
              onFocus={() => {
                this.setState({ isHovered: true, isInputActive: true });
              }}
              onBlur={checkAndSetTraitValue}
            />
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
                          type="checkbox"
                          id={`${traitKey}-${index}`}
                          name={`${traitKey}-${index}`}
                          value={possibleTraitValue}
                          checked={
                            this.state.traitValueInputString &&
                            asArray(this.state.traitValueInputString).includes(
                              possibleTraitValue
                            )
                          }
                          onChange={(e) => {
                            this.setState((prevState) => {
                              if (
                                prevState.traitValueInputString &&
                                asArray(
                                  prevState.traitValueInputString
                                ).includes(e.target.value) &&
                                !e.target.checked
                              ) {
                                let newtraitValueInputString = asString(
                                  asArray(
                                    prevState.traitValueInputString
                                  ).filter((el) => el !== e.target.value)
                                );
                                return {
                                  traitValueInputString:
                                    newtraitValueInputString,
                                };
                              } else if (
                                (!prevState.traitValueInputString ||
                                  !asArray(
                                    prevState.traitValueInputString
                                  ).includes(e.target.value)) &&
                                e.target.checked
                              ) {
                                let newtraitValueInputString = asString([
                                  ...asArray(prevState.traitValueInputString),
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
                        <label htmlFor={`${traitKey}-${index}`}>
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
                <label htmlFor={`${traitKey}-0`}>True</label>
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
