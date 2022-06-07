import React, { useEffect, useState, useContext } from "react";
import ChunkCard from "./ChunkCard";
import styles from "../css/ChunkCardHolder.module.css";
import gstyles from "../css/Global.module.css";
import LineHolder from "../Cogs/LineHolder";
import { isAgreeOrConnected } from "../utils/identityUtils";
import diUtils from "../utils/displayUtils.js";
import icons from "../utils/icons.js";
import $ from "jquery";
import { fetchSentence } from "../utils/putUtils";
import LanguageContext from "../context/LanguageContext.js";
import ListPopup from "../Cogs/ListPopup.jsx";
import ChunkOrdersPopup from "./ChunkOrdersPopup.jsx";
import { isEmpty } from "../utils/universalUtils";

const ChunkCardHolder = (props) => {
  const lang1 = useContext(LanguageContext);
  const [elementsToDrawLinesBetween, setElementsToDrawLinesBetween] = useState(
    []
  );
  const [drawnLinesAsBold, setDrawnLinesAsBold] = useState(false);
  const [flowerSearchingForStem, setFlowerSearchingForStem] = useState();
  const [stemFoundForFlower, setStemFoundForFlower] = useState();
  const [meaninglessCounter, setMeaninglessCounter] = useState(0);
  const [showListPopup, setShowListPopup] = useState();
  const [listPopupData, setListPopupData] = useState();
  const [chunkOrders, setChunkOrders] = useState([]);
  const [showAllTraitBoxes, setShowAllTraitBoxes] = useState(false);

  const [showChunkOrdersPopup, setShowChunkOrdersPopup] = useState();
  const [highlightedCard, setHighlightedCard] = useState();
  const editLemmaAtIndex = (index, newLemma, chunkId) => {
    function updateFlowers(newFormula, chunkId, newChunkId) {
      newFormula.forEach((stChObj) => {
        if (stChObj.structureChunk) {
          Object.keys(stChObj.structureChunk).forEach((traitKey) => {
            if (
              isAgreeOrConnected(traitKey) &&
              stChObj.structureChunk[traitKey].traitValue === chunkId
            ) {
              stChObj.structureChunk[traitKey].traitValue = newChunkId;
            }
          });
        }
      });
    }

    props.setFormula((prevFormula) => {
      if (!newLemma) {
        let newFormula = prevFormula.filter((el, i) => i !== index);
        updateFlowers(newFormula, chunkId, null);
        return newFormula;
      }
      prevFormula[index] = { word: newLemma, structureChunk: null };
      updateFlowers(prevFormula, chunkId, null);
      return prevFormula;
    });
    setMeaninglessCounter((prev) => prev + 1);
  };
  const setPopup = (data) => {
    setListPopupData(data);
    setShowListPopup(true);
  };

  useEffect(() => {
    if (!chunkOrders.length) {
      if (props.formula.every((obj) => obj.structureChunk)) {
        setChunkOrders([
          {
            isPrimary: true,
            order: props.formula.map(
              (obj) => obj.structureChunk.chunkId.traitValue
            ),
          },
        ]);
      }
    }
  }, [props.formula, chunkOrders]);

  useEffect(() => {
    if (!elementsToDrawLinesBetween.length) {
      setDrawnLinesAsBold(false);
    }
  }, [elementsToDrawLinesBetween]);

  return (
    <div className={styles.cardHolderContainer}>
      {showListPopup && (
        <ListPopup
          exit={() => {
            setShowListPopup(false);
            setHighlightedCard();
          }}
          data={listPopupData}
        />
      )}
      {showChunkOrdersPopup && (
        <ChunkOrdersPopup
          exit={() => {
            setShowChunkOrdersPopup(false);
          }}
          chunkOrders={chunkOrders}
          setChunkOrders={setChunkOrders}
          formula={props.formula}
        />
      )}
      <div className={styles.buttonHolder}>
        <button
          alt="Three dots icon"
          className={`${gstyles.cardButton1}`}
          onClick={() => {
            setShowChunkOrdersPopup(true);
          }}
        >
          &#11819;
        </button>
        <button
          alt="Star icon"
          className={`${gstyles.cardButton1}`}
          onClick={() => {
            let sentenceStructure = props.formula.map(
              (el) => el.structureChunk
            );

            let badChunk = sentenceStructure.filter(
              (stCh) =>
                ["npe", "nco", "ver", "adj"].includes(stCh.wordtype) &&
                isEmpty(stCh.andTags.traitValue) &&
                isEmpty(stCh.orTags.traitValue)
            )[0];

            if (badChunk) {
              alert(
                `Cannot query whole sentence because no tags are specified on chunk "${badChunk.chunkId.traitValue}".`
              );
              return;
            }

            fetchSentence(lang1, sentenceStructure, chunkOrders).then(
              (fetchedData) => {
                setPopup({
                  title: `${fetchedData.length} sentence${
                    fetchedData.length > 1 ? "s" : ""
                  } from traits you specified`,
                  list: fetchedData,
                });
              },
              (error) => {
                console.log("ERROR 0302:", error);
              }
            );
          }}
        >
          &#9733;
        </button>
        <button
          alt="Connection icon"
          className={`${gstyles.cardButton1}`}
          onMouseEnter={() => {
            $("*[id*=traitTitleHolder-chunkId]").each(function () {
              let id = $(this).parent()[0].id;
              let value = $(this).parent().find("textarea")[0].value;
              diUtils.connectChunkIdWithItsFlowers(id, value, [
                setElementsToDrawLinesBetween,
                setDrawnLinesAsBold,
              ]);
            });
          }}
          onMouseLeave={() => {
            $("*[id*=traitTitleHolder-chunkId]").each(function () {
              let id = $(this).parent()[0].id;
              let value = $(this).parent().find("textarea")[0].value;
              diUtils.connectChunkIdWithItsFlowers(
                id,
                value,
                [setElementsToDrawLinesBetween],
                true
              );
            });
          }}
        >
          &#42476;
        </button>
        <button
          alt="Triangle icon"
          className={`${gstyles.cardButton1}`}
          onMouseEnter={() => {
            console.log("showAllTraitBoxes", showAllTraitBoxes);
          }}
          onClick={() => {
            setShowAllTraitBoxes((prev) => !prev);

            $.each(
              $(`button[id^='ToggleShowButton-${props.batch}-']`),
              function () {
                let button = $(this)[0];
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
              }
            );
          }}
        >
          {showAllTraitBoxes ? icons.upBlackTriangle : icons.downBlackTriangle}
        </button>
      </div>
      <div className={styles.cardHolder} key={meaninglessCounter}>
        <LineHolder elementsToDrawLineBetween={[]} />
        {/* Unused LineHolder for flexbox spacing. */}
        {props.formula.map((structureChunkObject, index) => {
          let { word, structureChunk } = structureChunkObject;
          return (
            <ChunkCard
              key={`${index}-${word}`}
              batch={props.batch}
              chunkCardKey={`${index}-${word}`}
              word={word}
              index={index}
              structureChunk={structureChunk}
              chunkCardIndex={index}
              formula={props.formula}
              setFormula={props.setFormula}
              setElementsToDrawLinesBetween={setElementsToDrawLinesBetween}
              flowerSearchingForStemBrace={[
                flowerSearchingForStem,
                setFlowerSearchingForStem,
              ]}
              stemFoundForFlowerBrace={[
                stemFoundForFlower,
                setStemFoundForFlower,
              ]}
              editLemma={(newLemma, chunkId) => {
                editLemmaAtIndex(index, newLemma, chunkId);
              }}
              setPopup={setPopup}
              highlightedCard={highlightedCard}
              setHighlightedCard={setHighlightedCard}
            />
          );
        })}
        <LineHolder
          elementsToDrawLineBetween={elementsToDrawLinesBetween}
          drawnLinesAsBold={drawnLinesAsBold}
        />
      </div>
    </div>
  );
};

export default ChunkCardHolder;
