const uUtils = require("./universalUtils.js");

exports.updateChunkOrders = (chunkOrders, formula) => {
  console.log("update chunkOrders.");
  return chunkOrders
    .map((chunkOrderObj) => {
      chunkOrderObj.order = chunkOrderObj.order
        .map((chunkId) => {
          // 1. Swap if a chunk corresponds to a formulaItemId that is extant but that has a new chunkId.

          let prevFItemForChunkId = formula.find(
            (fItem) => fItem._previousChunkId === chunkId
          );
          if (prevFItemForChunkId) {
            return prevFItemForChunkId.structureChunk.chunkId.traitValue;
          }

          let fItemForChunkId = formula.find(
            (fItem) => fItem.structureChunk.chunkId.traitValue === chunkId
          );

          // 2. Reject if chunk no longer extant.

          if (!fItemForChunkId) {
            return null;
          }

          // 3. Reject if chunk was made ghost.       (But I cannot re-enter into chunkOrders a chunk you un-made a ghostChunk. Do that yourself.)

          if (fItemForChunkId.structureChunk.isGhostChunk) {
            return null;
          }

          return chunkId;
        })
        .filter((x) => x);
      return chunkOrderObj;
    })
    .filter((chunkOrderObj) => chunkOrderObj.order.length);
};
