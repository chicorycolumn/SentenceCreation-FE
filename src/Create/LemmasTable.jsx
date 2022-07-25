import React from "react";
import Tooltip from "../Cogs/Tooltip.jsx";
import styles from "../css/LemmasTable.module.css";
import gstyles from "../css/Global.module.css";
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
                  <Tooltip text={diUtils.asString(lObj.tags)} number="2" />
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
