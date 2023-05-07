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
  collapseIfNotCollapsed: (button, willHideContent, buttonIsOppositeBatch) => {
    let buttonIsShowingContent = [
      icons.downBlackTriangle,
      icons.downWhiteTriangle,
    ].includes(button.innerText);

    if (buttonIsOppositeBatch) {
      if (!willHideContent && buttonIsShowingContent) {
        // ie I am about to show all traitBoxes but button of opposite batch is currently showing all traitboxes.
        button.click();
      }
      return;
    }

    if (willHideContent && buttonIsShowingContent) {
      button.click();
    }

    if (
      !willHideContent &&
      !buttonIsShowingContent &&
      button.id.match("Group") && // ie not the All button
      button.innerText !== icons.upWhiteTriangle
    ) {
      button.click();
    }
  },
};

export default jqUtils;
