import bfUtils from "./backendifyFrontendifyUtils.js";
const uiUtils = require("./userInputUtils.js");
const uUtils = require("../utils/universalUtils.js");

export const getSetAndStoreSavedFormulas = (key, setState) => {
  return (progressFormulaToSave) => {
    if (
      !progressFormulaToSave ||
      (Array.isArray(progressFormulaToSave) && !progressFormulaToSave.length)
    ) {
      setState([]);
      localStorage.removeItem(key);
    } else {
      setState((prev) => {
        let newState = [progressFormulaToSave, ...prev];
        localStorage.setItem(key, JSON.stringify(newState));
        return newState;
      });
    }
  };
};

export const getSaveableProgressFormula = (props) => {
  return {
    chosenFormulaId: props.chosenFormulaId,
    femula: props.femula,
    chunkOrders: props.chunkOrders,
  };
};

export const getProtoFormula = (props) => {
  if (uiUtils.validateFemulaToSend(props.femula)) {
    return;
  }

  return {
    sentenceFormulaId: props.chosenFormulaId,
    sentenceStructure: props.femula.map((el) => el.structureChunk),
    orders: bfUtils.backendifyOrders(props.chunkOrders), // Backendify-1: Orders
  };
};
