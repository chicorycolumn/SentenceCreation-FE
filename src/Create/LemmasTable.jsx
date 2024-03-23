import React, { useState } from "react";
import Tooltip from "../Cogs/Tooltip.jsx";
import styles from "../css/LemmasTable.module.css";
import gstyles from "../css/Global.module.css";
import diUtils from "../utils/displayUtils.js";

const LemmasTable = (props) => {
  const [leftColAscending, setLeftColAscending] = useState(false);
  const [rightColAscending, setRightColAscending] = useState(false);
  const [middleColAscending, setMiddleColAscending] = useState(false);

  const sortFetched = (key, ascending) => {
    if (props.fetchedWordsByWordtype && props.fetchedWordsByWordtype.length) {
      let resortedArr = props.fetchedWordsByWordtype.sort((x, y) =>
        ascending ? x[key].localeCompare(y[key]) : y[key].localeCompare(x[key])
      );

      props.setFetchedWordsByWordtype(resortedArr);
      props.setMeaninglessCounterForLemmasTable((prev) => prev + 1);
    }
  };

  return (
    <table
      className={`${
        !props.fetchedWordsByWordtype.length && styles.translucent
      }`}
    >
      <thead>
        <tr>
          <th
            onClick={() => {
              sortFetched("lemma", leftColAscending);
              setLeftColAscending((prev) => !prev);
            }}
          >
            Lemma
          </th>
          <th
            onClick={() => {
              sortFetched("id", rightColAscending);
              setRightColAscending((prev) => !prev);
            }}
          >
            ID
          </th>
        </tr>
      </thead>

      <tbody>
        {props.focusedWordtype &&
          props.fetchedWordsByWordtype.map((lObj) => (
            <tr key={`${lObj.id}`}>
              <td
                className={`${
                  lObj.tags && lObj.tags.length && gstyles.tooltipHolder
                } ${styles.leftCellText}`}
              >
                {lObj.tags && lObj.tags.length ? (
                  <Tooltip text={diUtils.asString(lObj.tags)} number="2" />
                ) : (
                  ""
                )}
                {lObj.lemma}
              </td>
              <td
                className={`${styles.idButton}`}
                onClick={(e) => {
                  if (props.useClickedId) {
                    props.useClickedId(lObj.id);
                  }
                }}
              >
                {lObj.id.split("-").slice(0, 3).join("-")}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default LemmasTable;
