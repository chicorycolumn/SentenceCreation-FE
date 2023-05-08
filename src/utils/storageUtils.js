import bfUtils from "./backendifyFrontendifyUtils.js";
const uiUtils = require("./userInputUtils.js");
const uUtils = require("../utils/universalUtils.js");

export const getSetAndStoreSavedFormulas = (key, setState) => {
  return (unfinishedFemulaToSave) => {
    if (
      !unfinishedFemulaToSave ||
      (Array.isArray(unfinishedFemulaToSave) && !unfinishedFemulaToSave.length)
    ) {
      setState([]);
      localStorage.removeItem(key);
    } else {
      setState((prev) => {
        let newState = [
          uUtils.copyWithoutReference(unfinishedFemulaToSave),
          ...prev,
        ];
        localStorage.setItem(key, JSON.stringify(newState));
        return newState;
      });
    }
  };
};

export const getSaveableUnfinishedFemula = (_props) => {
  return {
    chosenFormulaId: _props.chosenFormulaId,
    femula: _props.femula,
    chunkOrders: _props.chunkOrders,
  };
};

export const getProtoFormula = (_props) => {
  if (uiUtils.validateFemulaToSend(_props.femula)) {
    return;
  }

  return {
    sentenceFormulaId: _props.chosenFormulaId,
    sentenceStructure: _props.femula.map((el) => el.structureChunk),
    orders: bfUtils.backendifyOrders(_props.chunkOrders), // Backendify-1: Orders
  };
};
