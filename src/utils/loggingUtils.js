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
  console.log("props.formulaItemId:", props.formulaItemId);
  console.log("structureChunk:", stCh);
  console.log("backedUpStructureChunk:", props.backedUpStructureChunk);
  console.log("");
};
