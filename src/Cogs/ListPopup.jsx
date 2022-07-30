import React, { useEffect } from "react";
import styles from "../css/Popup.module.css";
import gstyles from "../css/Global.module.css";
import uUtils from "../utils/universalUtils.js";
import $ from "jquery";

const ListPopup = (props) => {
  const exit = () => {
    $(document).off("keyup");
    props.exit();
  };

  useEffect(() => {
    uUtils.addListener($, document, "keyup", (e) => {
      console.log("via ListPopup document listened keyup:", e.key);
      if (["Enter", "Escape", "Backspace"].includes(e.key)) {
        $("#ListPopup-exitbutton").addClass(gstyles.greyButtonActive);
        setTimeout(exit, 150);
      }
    });
  }, []);
  return (
    <>
      <div className={gstyles.obscurus} onClick={exit}></div>
      <div className={`${styles.mainbox}`}>
        <div className={styles.topHolder}>
          <div className={`${gstyles.sideButton} ${gstyles.invisible}`}></div>
          <h1 className={styles.title}>{props.data.title}</h1>
          <button
            id="ListPopup-exitbutton"
            alt="Exit icon"
            className={`${gstyles.sideButton} ${gstyles.greyButton} ${gstyles.squareButton}`}
            onClick={exit}
          >
            &#8679;
          </button>
        </div>

        <div className={styles.bottomHolder}>
          {props.data.text ? (
            props.data.text.split("<br>").map((line) => <p>{line}</p>)
          ) : (
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
          )}
        </div>
      </div>
    </>
  );
};

export default ListPopup;
