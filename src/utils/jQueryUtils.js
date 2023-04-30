import $ from "jquery";
import icons from "../utils/icons.js";
import gstyles from "../css/Global.module.css";

const uUtils = require("./universalUtils.js");
const idUtils = require("./identityUtils.js");

const jqUtils = {
  expandTrayHeightToFitTraitBoxes: (batch) => {
    setTimeout(() => {
      console.log("<Checking chunkCardTrayHolder height>");
      let heights = [];
      $.each($(`div[id^='traitBoxesHolder-${batch}-']`), function () {
        heights.push($(this).height());
      });
      if (heights.length) {
        let tallest = Math.max(...heights);
        if (tallest) {
          tallest += 300;
        }
        $(`#chunkCardTrayHolder-${batch}`).height(tallest);
      }
    }, 5);
  },
  collapseIfNotCollapsed1: (button, showAllTraitBoxes) => {
    let buttonIsShowing = [
      icons.downBlackTriangle,
      icons.downWhiteTriangle,
    ].includes(button.innerText);

    if (
      (!showAllTraitBoxes && buttonIsShowing) |
      (showAllTraitBoxes &&
        !buttonIsShowing &&
        (!!button.id.match("Group1") ||
          button.innerText === icons.upBlackTriangle))
    ) {
      button.click();
    }
  },
  collapseIfNotCollapsed2: (showAllButtonOfOtherBatch, showAllTraitBoxes) => {
    let showAllButtonOfCurrentWillCollapse = showAllTraitBoxes;

    let showAllButtonOfOtherBatchIsUncollapsed = [
      icons.downBlackTriangle,
      icons.downWhiteTriangle,
    ].includes(showAllButtonOfOtherBatch.innerText);

    if (
      showAllButtonOfCurrentWillCollapse &&
      showAllButtonOfOtherBatchIsUncollapsed
    ) {
      showAllButtonOfOtherBatch.click();
    }
  },
};

export default jqUtils;
