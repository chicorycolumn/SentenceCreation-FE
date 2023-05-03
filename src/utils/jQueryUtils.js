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
  collapseIfNotCollapsed: (
    showAllButton,
    showAllTraitBoxes,
    buttonIsOppositeBatch
  ) => {
    let showAllButtonIsUncollapsed = [
      icons.downBlackTriangle,
      icons.downWhiteTriangle,
    ].includes(showAllButton.innerText);

    if (!buttonIsOppositeBatch) {
      if (showAllTraitBoxes && showAllButtonIsUncollapsed) {
        showAllButton.click();
      }
      return;
    }

    if (
      (!showAllTraitBoxes && showAllButtonIsUncollapsed) ||
      (showAllTraitBoxes &&
        !showAllButtonIsUncollapsed &&
        (!!showAllButton.id.match("Group1") ||
          showAllButton.innerText === icons.upBlackTriangle))
    ) {
      showAllButton.click();
    }
  },
};

export default jqUtils;
