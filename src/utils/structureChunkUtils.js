exports.setNewTraitValue = (stCh, traitKey, newTraitValue) => {
  if (newTraitValue) {
    stCh[traitKey].traitValue = newTraitValue;
  } else {
    let expectedType = stCh[traitKey].expectedTypeOnStCh;

    if (expectedType === "array") {
      stCh[traitKey].traitValue = [];
    } else {
      delete stCh[traitKey].traitValue;
    }
  }
};
