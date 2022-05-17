const uUtils = require("./universalUtils.js");

exports.multiplyOutStemAndFlowers = (arr) => {
  let res = [];
  arr.forEach((obj) => {
    obj.flowers.forEach((flower) => {
      res.push([obj.flowerstem, flower]);
    });
  });
  return res;
};

exports.drawLineBetweenElements = (elementOneId, elementTwoId, lineId) => {
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
};

exports.orderTraitKeys = (stCh) => {
  let orderedTraitKeys = [
    "chunkId",
    "andTags",
    "orTags",
    "agreeWith",
    "connectedTo",
  ];
  let lexicalTraitKeys = [];
  let booleanTraitKeys = [];
  Object.keys(stCh).forEach((traitKey) => {
    const traitValue = stCh[traitKey];
    if (traitValue.isLexical && !orderedTraitKeys.includes(traitKey)) {
      lexicalTraitKeys.push(traitKey);
    } else if (
      traitValue.expectedTypeOnStCh === "boolean" &&
      !orderedTraitKeys.includes(traitKey)
    ) {
      booleanTraitKeys.push(traitKey);
    }
  });
  lexicalTraitKeys = lexicalTraitKeys.sort((x, y) => y.localeCompare(x));
  booleanTraitKeys = booleanTraitKeys.sort((x, y) => x.localeCompare(y));

  orderedTraitKeys = [...orderedTraitKeys, ...lexicalTraitKeys];

  const length = orderedTraitKeys.length;

  orderedTraitKeys = [...orderedTraitKeys, ...booleanTraitKeys];

  orderedTraitKeys = [
    ...orderedTraitKeys,
    ...Object.keys(stCh)
      .filter((traitKey) => !orderedTraitKeys.includes(traitKey))
      .sort((x, y) => x.localeCompare(y)),
  ];
  if (orderedTraitKeys.length !== Object.keys(stCh).length) {
    throw `gluj: orderedTraitKeys.length ${
      orderedTraitKeys.length
    } !== Object.keys(stCh).length ${Object.keys(stCh).length}`;
  }

  orderedTraitKeys = orderedTraitKeys.filter(
    (traitKey) => !["wordtype"].includes(traitKey)
  );

  return {
    orderedTraitKeysGroup1: orderedTraitKeys.slice(0, length),
    orderedTraitKeysGroup2: orderedTraitKeys.slice(length),
    wordtypeFromStCh: stCh.wordtype,
  };
};

exports.asString = (values) => {
  if (!uUtils.isEmpty(values, true)) {
    return String(values).replace(/,/g, ", ");
  }
};

exports.asArray = (str, strict = false) => {
  if (!str) {
    return strict ? null : [];
  }
  let split = Array.isArray(str) ? str : str.split(",");
  let res = split.map((element) => element.trim()).filter((element) => element);
  return strict && !res.length ? null : res;
};
