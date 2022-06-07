import React from "react";
import styles from "../css/Popup.module.css";
import gstyles from "../css/Global.module.css";

const ListPopup = (props) => {
  return (
    <>
      <div className={gstyles.obscurus} onClick={props.exit}></div>
      <div className={`${styles.mainbox}`}>
        <div className={styles.topHolder}>
          <div className={`${gstyles.sideButton} ${gstyles.invisible}`}></div>
          <h1 className={styles.title}>{props.data.title}</h1>
          <button
            alt="Exit icon"
            className={`${gstyles.sideButton} ${gstyles.greyButton} ${gstyles.squareButton}`}
            onClick={props.exit}
          >
            &#8679;
          </button>
        </div>

        <div className={styles.bottomHolder}>
          <table>
            <thead>
              <tr>
                <th>#</th>
                {props.data.headers.map((header, hIndex) => (
                  <th key={`${props.data.title.slice(0, 10)}-th-${hIndex}`}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {props.data.rows.map((el, rIndex) => (
                <tr
                  className={styles.tablerow}
                  key={`${props.data.title}-tr-${rIndex}`}
                >
                  <td>{rIndex + 1}</td>
                  {el.map((item, dIndex) => (
                    <td key={`${props.data.title}-td-${dIndex}`}>{item}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ListPopup;
