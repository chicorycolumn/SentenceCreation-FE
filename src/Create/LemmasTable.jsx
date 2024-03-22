import React from "react";
import Tooltip from "../Cogs/Tooltip.jsx";
import styles from "../css/LemmasTable.module.css";
import gstyles from "../css/Global.module.css";
import diUtils from "../utils/displayUtils.js";

const LemmasTable = (props) => {
  return (
    <table
      className={`${
        !props.fetchedWordsByWordtype.length && styles.translucent
      }`}
    >
      <thead>
        <tr>
          <th>Lemma</th>
          <th>ID</th>
        </tr>
      </thead>

      <tbody>
        {props.focusedWordtype &&
          props.fetchedWordsByWordtype
            .sort((x, y) => x.id.localeCompare(y.id))
            .map((lObj) => (
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
