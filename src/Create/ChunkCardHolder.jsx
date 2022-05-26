import React, { useEffect, useState } from "react";
import ChunkCard from "./ChunkCard";
import styles from "../css/ChunkCardHolder.module.css";
import gstyles from "../css/Global.module.css";
import LineHolder from "../Cogs/LineHolder";
import { isAgreeOrConnected } from "../utils/identityUtils";
import diUtils from "../utils/displayUtils.js";
import $ from "jquery";
import { fetchWordByExplicitChunk } from "../utils/putUtils";

const ChunkCardHolder = (props) => {
  const [elementsToDrawLinesBetween, setElementsToDrawLinesBetween] = useState(
    []
  );
  const [drawnLinesAsBold, setDrawnLinesAsBold] = useState(false);
  const [flowerSearchingForStem, setFlowerSearchingForStem] = useState();
  const [stemFoundForFlower, setStemFoundForFlower] = useState();
  const [meaninglessCounter, setMeaninglessCounter] = useState(0);
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

  useEffect(() => {
    if (!elementsToDrawLinesBetween.length) {
      setDrawnLinesAsBold(false);
    }
  }, [elementsToDrawLinesBetween]);

  return (
    <div className={styles.cardHolderContainer}>
      <div className={styles.buttonHolder}>
        <button
          alt="Star icon to query"
          className={`${gstyles.cardButton1}`}
          onClick={() => {
            fetchWordByExplicitChunk(
              "ENG", //swde
              props.formula.map((el) => el.structureChunk)
            ).then(
              (fetchedData) => {
                console.log(fetchedData);
                alert(
                  `Fetched ${fetchedData.length} sentence${
                    fetchedData.length > 1 ? "s" : ""
                  } with the traits you've specified:\n\n` +
                    fetchedData.join("\n")
                );
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
      </div>
      <div className={styles.cardHolder} key={meaninglessCounter}>
        <LineHolder elementsToDrawLineBetween={[]} />
        {/* Unused LineHolder for flexbox spacing. */}
        {props.formula.map((structureChunkObject, index) => {
          let { word, structureChunk } = structureChunkObject;
          return (
            <ChunkCard
              key={`${index}-${word}`}
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
