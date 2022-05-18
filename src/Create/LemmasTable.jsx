import React from "react";
import styles from "../css/LemmasTable.module.css";
import gstyles from "../css/Global.module.css";
import { asString } from "../utils/displayUtils";
import diUtils from "../utils/displayUtils.js";

const LemmasTable = (props) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Lemma</th>
          <th>ID</th>
        </tr>
      </thead>

      <tbody>
        {props.wordtypeInFocus &&
          Object.keys(props.fetchedLObjs).includes(props.wordtypeInFocus) &&
          props.fetchedLObjs[props.wordtypeInFocus]
            .sort((x, y) => x.id.localeCompare(y.id))
            .map((lObj) => (
              <tr key={`${lObj.id}`}>
                <td className={`${gstyles.tooltipHolder}`}>
                  <span className={`${gstyles.tooltip} ${styles.tooltipCell}`}>
                    {diUtils.asString(lObj.tags)}
                  </span>
                  {lObj.lemma}
                </td>
                <td>{lObj.id}</td>
              </tr>
            ))}
      </tbody>
    </table>
  );
};

export default LemmasTable;
