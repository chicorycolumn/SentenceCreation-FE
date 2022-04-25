import React, { Component } from "react";
import styles from "../css/TraitBox.module.css";
const uUtils = require("../utils/universalUtils.js");

class TraitBox extends Component {
  state = {
    traitValueInput: this.props.traitObject.traitValue,
    hasJustBlurred: false,
    isInputActive: false,
    isHovered: false,
    isSelected: false,
    forceShowInput: false,
  };

  render() {
    let { traitKey, word, traitObject, setSelectedLObj } = this.props;

    const checkAndSetTraitValue = () => {
      setSelectedLObj((prevSelectedLObj) => {
        let newSelectedLObj = {
          ...prevSelectedLObj,
        };

        newSelectedLObj[traitKey] = {
          ...newSelectedLObj[traitKey],
          traitValue: this.state.traitValueInput,
        };

        return newSelectedLObj;
      });
      this.setState({
        isInputActive: false,
        isHovered: false,
        isSelected: false,
        forceShowInput: false,
        hasJustBlurred: true,
      });
      setTimeout(() => {
        this.setState({ hasJustBlurred: false });
      }, 1000);
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
              value={this.state.traitValueInput}
              onChange={(e) => {
                this.setState({ traitValueInput: e.target.value });
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
                {traitObject.possibleTraitValues &&
                  traitObject.possibleTraitValues.map(
                    (possibleTraitValue, index) => (
                      <div key={`${traitKey}-${index}`}>
                        <input
                          type="checkbox"
                          id={`${traitKey}-${index}`}
                          name={`${traitKey}-${index}`}
                          value={possibleTraitValue}
                          checked={this.state.traitValueInput.includes(
                            possibleTraitValue
                          )}
                          onChange={(e) => {
                            this.setState((prevState) => {
                              if (
                                prevState.traitValueInput.includes(
                                  e.target.value
                                ) &&
                                !e.target.checked
                              ) {
                                let newTraitValueInput =
                                  prevState.traitValueInput.filter(
                                    (el) => el !== e.target.value
                                  );
                                return { traitValueInput: newTraitValueInput };
                              } else if (
                                prevState.traitValueInput &&
                                !prevState.traitValueInput.includes(
                                  e.target.value
                                ) &&
                                e.target.checked
                              ) {
                                let newTraitValueInput = [
                                  ...prevState.traitValueInput,
                                  e.target.value,
                                ];
                                return { traitValueInput: newTraitValueInput };
                              }
                            });
                          }}
                        />
                        <label htmlFor={`${traitKey}-${index}`}>
                          {possibleTraitValue}
                        </label>
                      </div>
                    )
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
                  checked={this.state.traitValueInput === true}
                  onChange={(e) => {
                    this.setState((prevState) => {
                      if (
                        prevState.traitValueInput === true &&
                        !e.target.checked
                      ) {
                        return { traitValueInput: false };
                      } else if (
                        prevState.traitValueInput !== true &&
                        e.target.checked
                      ) {
                        return { traitValueInput: true };
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
