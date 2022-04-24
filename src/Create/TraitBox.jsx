import React, { Component } from "react";
import styles from "../css/TraitBox.module.css";

class TraitBox extends Component {
  state = {
    traitValueInput: this.props.traitObject.traitValue,
    isFinishedBeingActive: false,
    isInputActive: false,
    isActive: false,
  };

  render() {
    let { traitKey, word, traitObject, setSelectedLObj } = this.props;

    return (
      <div
        onMouseEnter={() => {
          this.setState({ isActive: true });
        }}
        onMouseLeave={() => {
          if (!this.state.isInputActive) {
            this.setState({ isActive: false });
          }
        }}
        key={`${word}-${traitKey}`}
        className={`${styles.traitBox}  ${
          !traitObject.traitValue && styles.traitBoxEmpty
        }
        ${this.state.isFinishedBeingActive && styles.shimmer}
        ${this.state.isActive && styles.traitBoxActive}
        
        `}
      >
        <p
          className={`${styles.traitTitle} ${
            traitObject.isLexical && styles.lexicalTraitTitle
          }`}
        >
          {traitKey}
        </p>
        {traitObject.traitValue && (
          <div className={styles.traitValuesBox}>
            <input
              className={styles.traitValuesInput}
              value={this.state.traitValueInput}
              onChange={(e) => {
                this.setState({ traitValueInput: e.target.value });
              }}
              onFocus={() => {
                this.setState({ isActive: true, isInputActive: true });
              }}
              onBlur={() => {
                //alpha Check if this is allowable value to set.

                setSelectedLObj((prevSelectLObj) => {
                  return {
                    ...prevSelectLObj,
                    traitValue: this.state.traitValueInput,
                  };
                });
                this.setState({
                  isInputActive: false,
                  isActive: false,
                  isFinishedBeingActive: true,
                });
                setTimeout(() => {
                  this.setState({ isFinishedBeingActive: false });
                }, 2000);
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

export default TraitBox;
