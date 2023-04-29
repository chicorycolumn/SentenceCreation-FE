exports.addListener = ($, element, eventName, handler) => {
  const add = () => {
    $(element)[eventName](handler);
  };

  let events = $._data($(document)[0], "events");

  if (!events) {
    add();
  } else {
    let listeners = events[eventName];
    if (!listeners || !listeners.length) {
      add();
    }
  }
};

exports.randomString = (length) => {
  const alph = "abcdefghijklmnopqrstuvwxyz";
  let str = "";
  for (let i = 0; i < length; i++) {
    str += alph[Math.floor(Math.random() * alph.length)];
  }
  return str;
};

exports.numToString = (num, desiredLength) => {
  let str = num.toString();
  if (str.length < desiredLength) {
    str = `${"0".repeat(desiredLength - str.length)}${str}`;
  }
  return str;
};

exports.combineTwoKeyValueObjectsCarefully = (obj1, obj2) => {
  Object.keys(obj1).forEach((obj1Key) => {
    if (Object.keys(obj2).includes(obj1Key)) {
      throw `qoko combineTwoObjectsCarefully. Oh no, "${obj1Key}" present in both objects.`;
    }
  });
  Object.keys(obj2).forEach((obj2Key) => {
    if (Object.keys(obj1).includes(obj2Key)) {
      throw `qoko combineTwoObjectsCarefully. Oh no, "${obj2Key}" present in both objects.`;
    }
  });

  let combinedObj = {};

  Object.keys(obj1).forEach((obj1Key) => {
    let obj1Value = obj1[obj1Key];
    combinedObj[obj1Key] = this.copyWithoutReference(obj1Value);
  });

  Object.keys(obj2).forEach((obj2Key) => {
    let obj2Value = obj2[obj2Key];
    combinedObj[obj2Key] = this.copyWithoutReference(obj2Value);
  });

  return combinedObj;
};

exports.addToArrayAtKey = (object, keyOrKeyArray, item) => {
  if (Array.isArray(keyOrKeyArray)) {
    keyOrKeyArray.forEach((key, i) => {
      if (i < keyOrKeyArray.length - 1) {
        if (!object[key]) {
          object[key] = {};
        }
        object = object[key];
      } else {
        if (!object[key]) {
          object[key] = [];
        }
        object[key].push(item);
      }
    });
    return;
  }

  let key = keyOrKeyArray;
  if (!object[key]) {
    object[key] = [];
  }
  object[key].push(item);
};

exports.selectRandom = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

exports.capitaliseFirst = (string) => {
  return string[0].toUpperCase() + string.slice(1);
};

exports.areTwoFlatArraysEqual = (arr1, arr2, mustHaveSameOrder) => {
  return arr1.length !== arr2.length
    ? false
    : mustHaveSameOrder
    ? arr1.every((item, index) => arr2[index] === item)
    : arr1.every((item) => arr2.includes(item)) &&
      arr2.every((item) => arr1.includes(item));
};

exports.doKeyValuesMatch = (object, keyValues) => {
  return Object.keys(keyValues).every((key) => {
    if (
      typeof keyValues[key] === "number" ||
      typeof keyValues[key] === "string"
    ) {
      return object[key] === keyValues[key];
    } else if (Array.isArray(keyValues[key]) && Array.isArray(object[key])) {
      return this.areTwoFlatArraysEqual(object[key], keyValues[key]);
    }
  });
};

exports.isEmpty = (obj, strict = false) => {
  if (strict && this.typeof(obj) === "string") {
    obj = obj.trim();
  }
  return (
    !obj ||
    (this.isKeyValueTypeObject(obj) && !Object.keys(obj).length) ||
    (Array.isArray(obj) &&
      (!obj.length ||
        (strict && !obj.some((element) => !this.isEmpty(element, true)))))
  );
};

exports.isKeyValueTypeObject = (item) => {
  return typeof item === "object" && item !== null && !Array.isArray(item);
};

exports.isKeyValueTypeObjectOrArray = (item) => {
  return typeof item === "object" && item !== null;
};

exports.findKeysInObjectAndExecuteCallback = (obj, soughtKey, callback) => {
  if (obj && typeof obj === "object") {
    Object.keys(obj).forEach((key) => {
      if (key === soughtKey) {
        callback(obj);
      } else {
        this.findKeysInObjectAndExecuteCallback(obj[key], soughtKey, callback);
      }
    });
  }
};

exports.copyWithoutReference = (source) => {
  const _recursivelyCopyObject = (input, targ) => {
    Object.keys(input).forEach((key) => {
      let item = input[key];

      if (typeof item !== "object" || item === null) {
        targ[key] = item;
        return;
      } else if (Array.isArray(item)) {
        targ[key] = [];
        _recursivelyCopyObject(item, targ[key]);
        return;
      } else {
        targ[key] = {};
        _recursivelyCopyObject(item, targ[key]);
        return;
      }
    });
    return targ;
  };

  if (typeof source !== "object" || source === null) {
    return source;
  }

  if (Array.isArray(source)) {
    return _recursivelyCopyObject(source, []);
  }

  return _recursivelyCopyObject(source, {});
};

exports.copyValueOfKey = (
  navigatedObject,
  sourceKey,
  targetKeyArr,
  shouldDeleteSourceKey
) => {
  targetKeyArr.forEach((targetKey) => {
    navigatedObject[targetKey] = this.copyWithoutReference(
      navigatedObject[sourceKey]
    );
  });

  if (shouldDeleteSourceKey) {
    delete navigatedObject[sourceKey];
  }
};

exports.arrayExploder = (superArray) => {
  if (!superArray) {
    return [];
  }

  superArray = superArray.filter((array) => array.length);

  if (!superArray.length) {
    return [];
  }

  if (superArray.length === 1) {
    return superArray[0].map((item) => [item]);
  }

  let result = [];

  const _arrayExploderRecursion = (src, res, miniRes) => {
    let arr = src[0];

    arr.forEach((item, itemIndex) => {
      miniRes.push(item);

      if (src.length > 1) {
        _arrayExploderRecursion(src.slice(1), res, miniRes);
      } else {
        res.push(miniRes.slice(0));
        miniRes.pop();
      }
    });
    miniRes.pop();
  };

  _arrayExploderRecursion(superArray, result, []);

  return result;
};

exports.doesArrContainDifferentItems = (arr) => {
  if (!arr.length) {
    return false;
  }

  arr.sort((a, b) => a - b);

  return arr[0] !== arr[arr.length - 1];
};

exports.doesArrHaveOnlyTheseMembers = (arr1, arr2, disallowDuplicates) => {
  if (disallowDuplicates && arr1.length !== arr2.length) {
    return false;
  }

  let differingItems = arr1.filter((item) => !arr2.includes(item));
  return !differingItems.length;
};

exports.isArraySubsetOfArray = (array1, array2) => {
  return array1.every((arr1Item) =>
    array2.find((arr2Item) => exports.areTwoObjectsEqual(arr1Item, arr2Item))
  );
};

exports.typeof = (item) => {
  return Array.isArray(item)
    ? "array"
    : item === null
    ? "null"
    : typeof item === "object"
    ? "keyValueObject"
    : typeof item;
};

exports.areTwoObjectsEqual = (obj1, obj2) => {
  //Returns false for arrays if in different order.
  if (this.typeof(obj1) !== this.typeof(obj2)) {
    return false;
  }

  if (!["keyValueObject", "array"].includes(this.typeof(obj1))) {
    return obj1 === obj2;
  }

  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }

  return Object.keys(obj1).every((obj1Key) => {
    return this.areTwoObjectsEqual(obj1[obj1Key], obj2[obj1Key]);
  });
};

exports.checkEachSequentialPairing = (arr, checkFxn, allowArrayOfZeroOrOne) => {
  if (arr.length < 2) {
    return !!allowArrayOfZeroOrOne;
  }

  for (let i = 0; i < arr.length - 1; i++) {
    if (!checkFxn(arr[i], arr[i + 1])) {
      return false;
    }
  }

  return true;
};

exports.oneStepCheck = (n1, n2) => {
  return Math.abs(n1 - n2) === 1;
};

exports.returnArrayWithItemAtIndexRemoved = (arr, indexToRemove) => {
  return [...arr.slice(0, indexToRemove), ...arr.slice(indexToRemove + 1)];
};

exports.valueInObject = (obj, soughtValue) => {
  let res = { found: false };

  const _vioInner = (obj, soughtValue, res) => {
    if (res.found) {
      return true;
    }
    if (typeof obj !== "object") {
      return false;
    }
    if (Object.values(obj).includes(soughtValue)) {
      res.found = true;
      return;
    }
    Object.values(obj).forEach((value) => {
      if (_vioInner(value, soughtValue, res)) {
        res.found = true;
        return;
      }
    });
  };

  _vioInner(obj, soughtValue, res);

  return res.found;
};

exports.isThisObjectInThisArrayOfObjects = (obj, arr) => {
  return arr.some((objFromArr) => this.areTwoObjectsEqual(objFromArr, obj));
};

exports.doStringsOrArraysMatch = (actual, sought, every = true) => {
  if (Array.isArray(actual) && Array.isArray(sought)) {
    return every
      ? sought.every((el) => actual.includes(el))
      : sought.some((el) => actual.includes(el));
  } else if (Array.isArray(actual)) {
    return actual.includes(sought);
  } else if (Array.isArray(sought)) {
    return sought.includes(actual);
  } else {
    return actual === sought;
  }
};

exports.selectRandomElementsFromArr = (arr, quantity = arr.length) => {
  if (arr.length > quantity) {
    let limitedArrIndexes = [];
    for (let i = 0; i < quantity; i++) {
      let selectedIndex;
      while (!selectedIndex) {
        let putativeIndex = Math.floor(Math.random() * arr.length);
        if (!limitedArrIndexes.includes(putativeIndex)) {
          selectedIndex = putativeIndex;
        }
      }
      limitedArrIndexes.push(selectedIndex);
    }
    return limitedArrIndexes.map((index) => arr[index]);
  } else {
    return arr;
  }
};

exports.flatten = (arr) => {
  let res = [];
  arr.forEach((el) => {
    if (Array.isArray(el)) {
      el.forEach((subEl) => {
        res.push(subEl);
      });
    } else {
      res.push(el);
    }
  });
  return res;
};

exports.round = (num) => {
  return Math.round(num * 1000) / 1000;
};

exports.getRandomNumberString = (len) => {
  return Math.random()
    .toString()
    .slice(2, len + 2);
};

exports.getUniqueNumberStringForGivenArray = (len, arr) => {
  const triesLimit = 100;
  let tries = 0;
  let s = exports.getRandomNumberString(len);
  while (arr.includes(s) && tries < triesLimit) {
    s = exports.getRandomNumberString(len);
    tries++;
  }
  return s;
};

exports.getUniqueNumberStrings = (len, quantity) => {
  const _addOneS = (res) => {
    const triesLimit = 100;
    let tries = 0;
    let s = exports.getRandomNumberString(len);
    while (res.includes(s) && tries < triesLimit) {
      s = exports.getRandomNumberString(len);
      tries++;
    }
    res.push(s);
  };

  if (!quantity || !len) {
    return [];
  }

  let res = [];

  for (let i = 0; i < quantity; i++) {
    _addOneS(res);
  }

  return res;
};

exports.stringify = (item) => {
  return item ? item.toString() : "";
};

exports.shuffle = (arr) => {
  arr.sort(() => (Math.random() > 0.5 ? 1 : -1));
};

exports.removePunctuation = (s) => {
  return s.replace(/\p{P}/gu, "");
};

exports.removePunctuationExceptApostrophe = (s) => {
  return s
    .split("")
    .filter((char) => [" ", "'"].includes(char) || /\p{L}/gu.test(char))
    .join("");
};

exports.purifyString = (s) => {
  return exports.removePunctuationExceptApostrophe(s.trim().toLowerCase());
};
