exports.testStChs = {
  npeStCh: {
    wordtype: "npe",
    postHocAgreeWithPrimary: {
      expectedTypeOnStCh: "string",
      mustBeExistingChunkId: true,
    },
    postHocAgreeWithSecondary: {
      expectedTypeOnStCh: "string",
      mustBeExistingChunkId: true,
    },
    postHocAgreeWithTertiary: {
      expectedTypeOnStCh: "string",
      mustBeExistingChunkId: true,
    },
    person: {
      isLexical: true,
      compatibleWordtypes: ["nounPerson", "nounCommon", "verb", "pronombre"],
      expectedTypeOnStCh: "array",
      traitValue: [],
      possibleTraitValues: ["1per", "2per", "3per", "impersonal"],
    },
    gender: {
      traitValue: ["f"],
      isLexical: true,
      compatibleWordtypes: [
        "nounPerson",
        "nounCommon",
        "verb",
        "adjective",
        "pronombre",
      ],
      expectedTypeOnStCh: "array",
      possibleTraitValues: [
        "m",
        "m1",
        "m2",
        "m3",
        "f",
        "n",
        "virile",
        "nonvirile",
      ],
    },
    number: {
      isLexical: true,
      compatibleWordtypes: [
        "nounPerson",
        "nounCommon",
        "verb",
        "adjective",
        "pronombre",
      ],
      expectedTypeOnStCh: "array",
      possibleTraitValues: ["singular", "plural"],
      traitValue: ["singular"],
    },
    gcase: {
      isLexical: true,
      compatibleWordtypes: [
        "nounPerson",
        "nounCommon",
        "adjective",
        "pronombre",
      ],
      expectedTypeOnStCh: "array",
      possibleTraitValues: ["nom", "gen", "dat", "acc", "ins", "loc"],
      traitValue: ["nom"],
    },
    preventAddingFurtherClarifiers: {
      expectedTypeOnStCh: "boolean",
    },
    pleaseShowMultipleWordtypeAllohomClarifiers: {
      expectedTypeOnStCh: "boolean",
      needsNoValidation: true,
    },
    educatorBlocksAnnotationsForTheseTraitKeys: {
      expectedTypeOnStCh: "array",
      traitValue: [],
      ultimatelyMultipleTraitValuesOkay: true,
      needsNoValidation: true,
    },
    formulaImportantTraitKeys: {
      expectedTypeOnStCh: "array",
      traitValue: [],
      ultimatelyMultipleTraitValuesOkay: true,
      needsNoValidation: true,
    },
    blockedTenseDescriptions: {
      expectedTypeOnStCh: "array",
      traitValue: [],
      ultimatelyMultipleTraitValuesOkay: true,
      needsNoValidation: true,
    },
    blockedLemmaObjects: {
      expectedTypeOnStCh: "array",
      traitValue: [],
      ultimatelyMultipleTraitValuesOkay: true,
      needsNoValidation: true,
    },
    hiddenTraits: {
      expectedTypeOnStCh: "array",
      traitValue: [],
      ultimatelyMultipleTraitValuesOkay: true,
      needsNoValidation: true,
    },
    traitsToForceOntoAnswer: {
      expectedTypeOnStCh: "keyValueObject",
      needsNoValidation: true,
    },
    doNotUpdateSpecificLemmasAsIsJustOneMDN: {
      expectedTypeOnStCh: "boolean",
      needsNoValidation: true,
    },
    counterfactuallyImportantTraitKeys: {
      expectedTypeOnStCh: "array",
      traitValue: [],
      ultimatelyMultipleTraitValuesOkay: true,
    },
    dontSpecifyOnThisChunk: {
      expectedTypeOnStCh: "boolean",
    },
    specificLemmas: {
      expectedTypeOnStCh: "array",
      traitValue: [],
      ultimatelyMultipleTraitValuesOkay: true,
    },
    specificIds: {
      expectedTypeOnStCh: "array",
      traitValue: [],
      ultimatelyMultipleTraitValuesOkay: true,
    },
    andTags: {
      expectedTypeOnStCh: "array",
      ultimatelyMultipleTraitValuesOkay: true,
      traitValue: ["animate", "personTest1", "concrete"],
    },
    orTags: {
      expectedTypeOnStCh: "array",
      traitValue: ["pet"],
      ultimatelyMultipleTraitValuesOkay: true,
    },
    form: {
      expectedTypeOnStCh: "array",
      traitValue: [],
      isLexical: true,
    },
    chunkId: {
      expectedTypeOnStCh: "string",
    },
    preferredChoicesForQuestionSentence: {
      expectedTypeOnStCh: "keyValueObject",
    },
    agreeWith: {
      expectedTypeOnStCh: "string",
      mustBeExistingChunkId: true,
    },
    connectedTo: {
      expectedTypeOnStCh: "string",
      mustBeExistingChunkId: true,
    },
  },
  adjStCh: {
    wordtype: "adj",
    form: {
      expectedTypeOnStCh: "array",
      isLexical: true,
      compatibleWordtypes: ["adjective", "pronombre", "verb", "preposition"],
      possibleTraitValuesPerWordtype: {
        adjective: ["simple", "comparative", "superlative", "adverb"],
        pronombre: ["pronombre", "pronombreAndDeterminer"],
        verb: [
          "verbal",
          "infinitive",
          "contemporaryAdverbial",
          "passiveAdjectival",
          "activeAdjectival",
          "anteriorAdverbial",
          "verbalNoun",
        ],
        preposition: ["onlyForm"],
      },
      possibleTraitValues: ["simple", "comparative", "superlative", "adverb"],
      traitValue: ["simple"],
    },
    postHocAgreeWithPrimary: {
      expectedTypeOnStCh: "string",
      mustBeExistingChunkId: true,
    },
    postHocAgreeWithSecondary: {
      expectedTypeOnStCh: "string",
      mustBeExistingChunkId: true,
    },
    postHocAgreeWithTertiary: {
      expectedTypeOnStCh: "string",
      mustBeExistingChunkId: true,
    },
    gender: {
      isLexical: true,
      compatibleWordtypes: [
        "nounPerson",
        "nounCommon",
        "verb",
        "adjective",
        "pronombre",
      ],
      expectedTypeOnStCh: "array",
      possibleTraitValues: [
        "m",
        "m1",
        "m2",
        "m3",
        "f",
        "n",
        "virile",
        "nonvirile",
      ],
      traitValue: ["m3"],
    },
    number: {
      isLexical: true,
      compatibleWordtypes: [
        "nounPerson",
        "nounCommon",
        "verb",
        "adjective",
        "pronombre",
      ],
      expectedTypeOnStCh: "array",
      possibleTraitValues: ["singular", "plural"],
      traitValue: ["singular"],
    },
    gcase: {
      isLexical: true,
      compatibleWordtypes: [
        "nounPerson",
        "nounCommon",
        "adjective",
        "pronombre",
      ],
      expectedTypeOnStCh: "array",
      possibleTraitValues: ["nom", "gen", "dat", "acc", "ins", "loc"],
      traitValue: ["acc"],
    },
    preventAddingFurtherClarifiers: {
      expectedTypeOnStCh: "boolean",
    },
    pleaseShowMultipleWordtypeAllohomClarifiers: {
      expectedTypeOnStCh: "boolean",
      needsNoValidation: true,
    },
    educatorBlocksAnnotationsForTheseTraitKeys: {
      expectedTypeOnStCh: "array",
      ultimatelyMultipleTraitValuesOkay: true,
      needsNoValidation: true,
      traitValue: [],
    },
    formulaImportantTraitKeys: {
      expectedTypeOnStCh: "array",
      ultimatelyMultipleTraitValuesOkay: true,
      needsNoValidation: true,
      traitValue: [],
    },
    blockedTenseDescriptions: {
      expectedTypeOnStCh: "array",
      ultimatelyMultipleTraitValuesOkay: true,
      needsNoValidation: true,
      traitValue: [],
    },
    blockedLemmaObjects: {
      expectedTypeOnStCh: "array",
      ultimatelyMultipleTraitValuesOkay: true,
      needsNoValidation: true,
      traitValue: [],
    },
    hiddenTraits: {
      expectedTypeOnStCh: "array",
      ultimatelyMultipleTraitValuesOkay: true,
      needsNoValidation: true,
      traitValue: [],
    },
    traitsToForceOntoAnswer: {
      expectedTypeOnStCh: "keyValueObject",
      needsNoValidation: true,
    },
    doNotUpdateSpecificLemmasAsIsJustOneMDN: {
      expectedTypeOnStCh: "boolean",
      needsNoValidation: true,
    },
    counterfactuallyImportantTraitKeys: {
      expectedTypeOnStCh: "array",
      ultimatelyMultipleTraitValuesOkay: true,
      traitValue: [],
    },
    dontSpecifyOnThisChunk: {
      expectedTypeOnStCh: "boolean",
    },
    specificLemmas: {
      expectedTypeOnStCh: "array",
      ultimatelyMultipleTraitValuesOkay: true,
      traitValue: [],
    },
    specificIds: {
      expectedTypeOnStCh: "array",
      ultimatelyMultipleTraitValuesOkay: true,
      traitValue: [],
    },
    andTags: {
      expectedTypeOnStCh: "array",
      ultimatelyMultipleTraitValuesOkay: true,
      traitValue: ["colour"],
    },
    orTags: {
      expectedTypeOnStCh: "array",
      ultimatelyMultipleTraitValuesOkay: true,
      traitValue: [],
    },
    chunkId: {
      expectedTypeOnStCh: "string",
    },
    preferredChoicesForQuestionSentence: {
      expectedTypeOnStCh: "keyValueObject",
    },
    agreeWith: {
      expectedTypeOnStCh: "string",
      mustBeExistingChunkId: true,
    },
    connectedTo: {
      expectedTypeOnStCh: "string",
      mustBeExistingChunkId: true,
    },
  },
};
