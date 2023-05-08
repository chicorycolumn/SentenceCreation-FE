exports.logTraitBox = (state, _props) => {
  console.log("");
  console.log("state.traitValueInputString HAS VALUE:");
  console.log("-->", state.traitValueInputString);
  console.log("_props.traitObject.traitValue HAS VALUE:");
  console.log("-->", _props.traitObject.traitValue);
  if (state.traitValueInputString2) {
    console.log("");
    console.log("state.traitValueInputString2 HAS VALUE:");
    console.log("-->", state.traitValueInputString2);
    console.log("_props.traitObject.traitValue2 HAS VALUE:");
    console.log("-->", _props.traitObject2.traitValue);
  }
};

exports.logChunkCard = (_props, stCh) => {
  console.log("");
  console.log("");
  console.log("_props.femulaItemId:", _props.femulaItemId);
  console.log("_props.guideword:", _props.guideword);
  console.log("structureChunk:", stCh);
  console.log("backedUpStructureChunk:", _props.backedUpStructureChunk);
  console.log("");
  console.log("");
};

exports.log1 = (stCh) => {
  return `${stCh.guideword}`;
};
