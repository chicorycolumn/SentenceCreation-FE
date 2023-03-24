exports.addSpecificId = (stCh, traitsAffectedBySpecificId) => {
  stCh.specificIds.traitValue = [stCh.lObjId];
  console.log("Blanking", traitsAffectedBySpecificId);
  traitsAffectedBySpecificId.forEach((traitKey) => {
    stCh[traitKey].traitValue = [];
  });
};

exports.removeSpecificId = (
  stCh,
  traitsAffectedBySpecificId,
  backedUpStructureChunk
) => {
  stCh.specificIds.traitValue = [];
  console.log("Resetting", traitsAffectedBySpecificId);
  traitsAffectedBySpecificId.forEach((traitKey) => {
    stCh[traitKey].traitValue =
      backedUpStructureChunk[traitKey].traitValue.slice();
  });
};

exports.upgradeSpecificId = (stCh, originalStCh) => {
  stCh.specificIds.traitValue = originalStCh.specificIds.traitValue.map(
    (tv) => `^${tv}`
  );
};
