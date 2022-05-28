import React from "react";
import styles from "../css/Popup.module.css";
import gstyles from "../css/Global.module.css";

const ListPopup = (props) => {
  return (
    <div className={styles.mainbox}>
      <div className={styles.topHolder}>
        <div className={`${gstyles.sideButton} ${gstyles.invisible}`}></div>
        <h1 className={styles.title}>{props.data.title}</h1>
        <button
          alt="Cross icon"
          className={`${gstyles.sideButton} ${gstyles.redButton}`}
          onClick={props.exit}
        >
          &times;
        </button>
      </div>

      <div className={styles.bottomHolder}>
        <ul>
          {props.data.list.map((element, index) => (
            <li className={styles.listItem} key={`listitem-${index}`}>
              <span className={styles.numbering}>{index + 1}</span> {element}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ListPopup;