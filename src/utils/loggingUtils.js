exports.logTraitBox = (state, props) => {
  console.log("");
  console.log("state.traitValueInputString HAS VALUE:");
  console.log("-->", state.traitValueInputString);
  console.log("props.traitObject.traitValue HAS VALUE:");
  console.log("-->", props.traitObject.traitValue);
  if (state.traitValueInputString2) {
    console.log("");
    console.log("state.traitValueInputString2 HAS VALUE:");
    console.log("-->", state.traitValueInputString2);
    console.log("props.traitObject.traitValue2 HAS VALUE:");
    console.log("-->", props.traitObject2.traitValue);
  }
};

exports.logChunkCard = (props, stCh) => {
  console.log("");
  console.log("");
  console.log("props.femulaItemId:", props.femulaItemId);
  console.log("props.guideword:", props.guideword);
  console.log("structureChunk:", stCh);
  console.log("backedUpStructureChunk:", props.backedUpStructureChunk);
  console.log("");
  console.log("");
};

exports.log1 = (stCh) => {
  return `${stCh.guideword}`;
};
