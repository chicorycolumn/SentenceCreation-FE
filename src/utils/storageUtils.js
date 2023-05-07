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
        let newState = [unfinishedFemulaToSave, ...prev];
        localStorage.setItem(key, JSON.stringify(newState));
        return newState;
      });
    }
  };
};

export const getSaveableUnfinishedFemula = (props) => {
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
