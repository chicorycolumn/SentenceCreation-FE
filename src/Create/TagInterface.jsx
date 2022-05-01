import React, { Component, useEffect, useState } from "react";
import { fetchTags, fetchWordsByTag } from "../utils/getUtils.js";
import styles from "../css/TagInterface.module.css";
import traitBoxStyles from "../css/TraitBox.module.css";
import gstyles from "../css/Global.module.css";
const diUtils = require("../utils/displayUtils.js");

const TagInterface = (props) => {
  useEffect(() => {
    fetchTags("ENG").then((fetchedTags) => {
      setTags(fetchedTags);
    });
    fetchWordsByTag("ENG", diUtils.asArray(props.traitValueInputString)).then(
      (fetchedWords) => {
        console.log(fetchedWords);
        setFetchedLObjs(fetchedWords);
      }
    );
  });

  const [tags, setTags] = useState([
    "animate",
    "personTest1",
    "concrete",
    "AliceBlue",
    "AntiqueWhite",
    "Aqua",
    "Aquamarine",
    "Azure",
    "Beige",
    "Bisque",
    "Black",
    "BlanchedAlmond",
    "Blue",
    "BlueViolet",
    "Brown",
    "BurlyWood",
    "CadetBlue",
    "Chartreuse",
    "Chocolate",
    "Coral",
    "CornflowerBlue",
    "Cornsilk",
    "Crimson",
    "Cyan",
    "DarkBlue",
    "DarkCyan",
    "DarkGoldenRod",
    "DarkGray",
    "DarkGrey",
    "DarkGreen",
    "DarkKhaki",
    "DarkMagenta",
    "DarkOliveGreen",
    "DarkOrange",
    "DarkOrchid",
    "DarkRed",
    "DarkSalmon",
    "DarkSeaGreen",
    "DarkSlateBlue",
    "DarkSlateGray",
    "DarkSlateGrey",
    "DarkTurquoise",
    "DarkViolet",
    "DeepPink",
    "DeepSkyBlue",
    "DimGray",
    "DimGrey",
    "DodgerBlue",
    "FireBrick",
    "FloralWhite",
    "ForestGreen",
    "Fuchsia",
    "Gainsboro",
    "GhostWhite",
    "Gold",
    "GoldenRod",
    "Gray",
    "Grey",
    "Green",
    "GreenYellow",
    "HoneyDew",
    "HotPink",
    "IndianRed",
    "Indigo",
    "Ivory",
    "Khaki",
    "Lavender",
    "LavenderBlush",
    "LawnGreen",
    "LemonChiffon",
    "LightBlue",
    "LightCoral",
    "LightCyan",
    "LightGoldenRodYellow",
    "LightGray",
    "LightGrey",
    "LightGreen",
    "LightPink",
    "LightSalmon",
    "LightSeaGreen",
    "LightSkyBlue",
    "LightSlateGray",
    "LightSlateGrey",
    "LightSteelBlue",
    "LightYellow",
    "Lime",
    "LimeGreen",
    "Linen",
    "Magenta",
    "Maroon",
    "MediumAquaMarine",
    "MediumBlue",
    "MediumOrchid",
    "MediumPurple",
    "MediumSeaGreen",
    "MediumSlateBlue",
    "MediumSpringGreen",
    "MediumTurquoise",
    "MediumVioletRed",
    "MidnightBlue",
    "MintCream",
    "MistyRose",
    "Moccasin",
    "NavajoWhite",
    "Navy",
    "OldLace",
    "Olive",
    "OliveDrab",
    "Orange",
    "OrangeRed",
    "Orchid",
    "PaleGoldenRod",
    "PaleGreen",
    "PaleTurquoise",
    "PaleVioletRed",
    "PapayaWhip",
    "PeachPuff",
    "Peru",
    "Pink",
    "Plum",
    "PowderBlue",
    "Purple",
    "RebeccaPurple",
    "Red",
    "RosyBrown",
    "RoyalBlue",
    "SaddleBrown",
    "Salmon",
    "SandyBrown",
    "SeaGreen",
    "SeaShell",
    "Sienna",
    "Silver",
    "SkyBlue",
    "SlateBlue",
    "SlateGray",
    "SlateGrey",
    "Snow",
    "SpringGreen",
    "SteelBlue",
    "Tan",
    "Teal",
    "Thistle",
    "Tomato",
    "Turquoise",
    "Violet",
    "Wheat",
    "White",
    "WhiteSmoke",
    "Yellow",
    "YellowGreen",
  ]);
  const [fetchedLObjs, setFetchedLObjs] = useState({
    words: {
      npe: [
        {
          lemma: "woman",
          id: "eng-npe-001",
        },
        {
          lemma: "father",
          id: "eng-npe-013",
        },
        {
          lemma: "mother",
          id: "eng-npe-014",
        },
        {
          lemma: "boy",
          id: "eng-npe-002",
        },
        {
          lemma: "doctor",
          id: "eng-npe-012",
        },
      ],
      nco: [
        {
          lemma: "onion",
          id: "eng-nco-003",
        },
        {
          lemma: "apple",
          id: "eng-nco-004",
        },
        {
          lemma: "tomato",
          id: "eng-nco-015",
        },
        {
          lemma: "mirror",
          id: "eng-nco-005",
        },
        {
          lemma: "book",
          id: "eng-nco-006",
        },
        {
          lemma: "door",
          id: "eng-nco-007",
        },
        {
          lemma: "sheep",
          id: "eng-nco-008",
        },
        {
          lemma: "rat",
          id: "eng-nco-016",
        },
      ],
      adj: [],
      ver: [],
      pro: [],
      pre: [],
      art: [],
    },
  });

  return (
    <div className={styles.mainBox}>
      <h1>Select tags</h1>

      <button
        className={gstyles.tickButton}
        onClick={props.checkAndSetTraitValue}
      >
        &#10003;
      </button>

      <select
        className={styles.tagSelector}
        name="tag"
        onClick={(e) => {
          e.preventDefault();
          props.pushpopTraitValueInputString(e.target.value);
        }}
      >
        {tags.map((tag) => (
          <option value={tag} key={tag}>
            {tag}
          </option>
        ))}
      </select>
      <button
        className={gstyles.exitButton}
        onClick={() => {
          props.revertTraitValueInputString();
          props.exitTraitBox(false);
        }}
      >
        &times;
      </button>

      <div className={styles.etiquetteHolder}>
        {diUtils.asArray(props.traitValueInputString).map((tag) => (
          <div
            onClick={() => {
              props.pushpopTraitValueInputString(tag, false);
            }}
            className={`${styles.etiquette} ${styles.etiquetteClickable}`}
            key={tag}
          >
            {tag}
          </div>
        ))}
      </div>

      <div className={styles.etiquetteHolder}>
        {Object.keys(fetchedLObjs.words).map((wordtype) => {
          let words = fetchedLObjs.words[wordtype];
          return words.map((word) => {
            const { lemma, id } = word;
            return (
              <div
                className={`${styles.etiquette} ${gstyles.tooltipHolder} ${gstyles[wordtype]}`}
                key={lemma}
              >
                {lemma}
                <span className={gstyles.tooltip}>{id}</span>
              </div>
            );
          });
        })}
      </div>
    </div>
  );
};

export default TagInterface;
