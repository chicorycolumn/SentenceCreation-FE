import $ from "jquery";
import gstyles from "../css/Global.module.css";
import styles from "../css/TraitBox.module.css";

const uUtils = require("./universalUtils.js");
const idUtils = require("./identityUtils.js");

const flUtils = {
  connectChunkIdWithItsFlowers: (
    flowerstemID,
    flowerstemValue,
    setters,
    remove = false,
    flowerTraitTitles = idUtils.agreementTraits,
    flowerClasses = [gstyles.highlighted1, gstyles.zindex5],
    flowerstemClasses = [gstyles.highlighted1, gstyles.zindex7]
  ) => {
    let setElementsToDrawLinesBetween = setters[0];
    let setDrawnLinesAsBold = setters[1];

    let potentialFlowers = $(`.${styles.traitBox}`).filter(function () {
      return $(this)
        .find(`.${styles.traitTitle}`)
        .filter(function () {
          let traitTitle = $(this);
          return flowerTraitTitles.includes(traitTitle.text());
        }).length;
    });

    let flowers = potentialFlowers.filter(function () {
      let el = $(this);
      let textareas = el.find("textarea");
      return textareas.filter(function () {
        let textarea = $(this);
        return textarea.text() === flowerstemValue;
      }).length;
    });

    if (!flowers.length) {
      console.log(`No flowers for "${flowerstemValue}"`);
      return;
    }

    let flowerIDs = [];

    flowers.each(function () {
      let el = $(this);
      if (remove) {
        el.removeClass(flowerClasses.join(" "));
      } else {
        el.addClass(flowerClasses.join(" "));
        flowerIDs.push(el.attr("id"));
      }
    });

    if (flowers.length) {
      if (remove) {
        $(`#${flowerstemID}`).removeClass(flowerstemClasses.join(" "));
      } else {
        $(`#${flowerstemID}`).addClass(flowerstemClasses.join(" "));
      }
    } else {
      if (remove) {
        $(`#${flowerstemID}`).removeClass(gstyles.highlighted0);
      } else {
        $(`#${flowerstemID}`).addClass(gstyles.highlighted0);
      }
    }

    if (flowerIDs.length) {
      setElementsToDrawLinesBetween((prev) => {
        let arr = prev ? prev.slice(0) : [];
        arr.push({ flowerstem: flowerstemID, flowers: flowerIDs });
        return arr;
      });
      if (setDrawnLinesAsBold) {
        setDrawnLinesAsBold(true);
      }
    } else {
      setElementsToDrawLinesBetween([]);
    }
  },

  multiplyOutStemAndFlowers: (arr) => {
    let res = [];
    arr.forEach((obj) => {
      obj.flowers.forEach((flower) => {
        res.push([obj.flowerstem, flower]);
      });
    });
    return res;
  },

  drawLineBetweenElements: (elementOneId, elementTwoId, lineId) => {
    let line = document.getElementById(lineId);
    let from = document.getElementById(elementOneId);
    let to = document.getElementById(elementTwoId);
    let cease;
    [
      [elementOneId, from],
      [elementTwoId, to],
      [lineId, line],
    ].forEach((pair) => {
      if (!pair[1]) {
        console.log(`ERROR 5461: Could not find element with ID "${lineId}".`);
        cease = true;
      }
    });
    if (cease) {
      return;
    }

    let drawingFromHigherBoxToLowerBox = from.offsetTop < to.offsetTop;

    let fT =
      from.offsetTop +
      from.offsetHeight / (drawingFromHigherBoxToLowerBox ? 1.5 : 100);
    let tT =
      to.offsetTop +
      to.offsetHeight / (drawingFromHigherBoxToLowerBox ? 100 : 1.5);
    let fL = from.offsetLeft + from.offsetWidth / 2;
    let tL = to.offsetLeft + to.offsetWidth / 2;

    let CA = Math.abs(tT - fT);
    let CO = Math.abs(tL - fL);
    let H = Math.sqrt(CA * CA + CO * CO);
    let ANG = (180 / Math.PI) * Math.acos(CA / H);

    let top = 0;
    let left = 0;

    if (tT > fT) {
      top = (tT - fT) / 2 + fT;
    } else {
      top = (fT - tT) / 2 + tT;
    }
    if (tL > fL) {
      left = (tL - fL) / 2 + fL;
    } else {
      left = (fL - tL) / 2 + tL;
    }

    if (
      (fT < tT && fL < tL) ||
      (tT < fT && tL < fL) ||
      (fT > tT && fL > tL) ||
      (tT > fT && tL > fL)
    ) {
      ANG *= -1;
    }
    top -= H / 2;

    line.style["-webkit-transform"] = "rotate(" + ANG + "deg)";
    line.style["-moz-transform"] = "rotate(" + ANG + "deg)";
    line.style["-ms-transform"] = "rotate(" + ANG + "deg)";
    line.style["-o-transform"] = "rotate(" + ANG + "deg)";
    line.style["-transform"] = "rotate(" + ANG + "deg)";
    line.style.top = top + "px";
    line.style.left = left + "px";
    line.style.height = H + "px";
  },

  setStem: (props, setState) => {
    // Prevent A agree with B and B agree with A.
    let agreementTraitsToBlank = [];
    idUtils.agreementTraits.forEach((agreementTrait) => {
      if (
        props.structureChunk[agreementTrait] &&
        props.structureChunk[agreementTrait].traitValue &&
        props.structureChunk[agreementTrait].traitValue.includes(
          props.flowerSearchingForStemBrace[0]
        )
      ) {
        agreementTraitsToBlank.push(agreementTrait);
      }
    });
    if (agreementTraitsToBlank.length) {
      let newStCh = uUtils.copyWithoutReference(props.structureChunk);
      agreementTraitsToBlank.forEach((agreementTraitToBlank) => {
        newStCh[agreementTraitToBlank].traitValue = [];
      });
      props.modifyStructureChunkOnThisFormulaItem(
        "Prevent circular agreeWith",
        newStCh
      );
      props.refreshTraitBoxInputs(1);
    }

    props.stemFoundForFlowerBrace[1](props.chunkId);
    setState({ isExtraHighlighted: false });
  },

  cancelStem: (props, setState) => {
    props.flowerSearchingForStemBrace[1]();
    setState({ isExtraHighlighted: false });
  },
};

export default flUtils;
