import React, { useEffect, useState } from "react";
import styles from "../css/Popup.module.css";
import gstyles from "../css/Global.module.css";
import uUtils from "../utils/universalUtils.js";
import $ from "jquery";

const stringifyIt = (item) => {
  return item ? item.toString() : "";
};

const ListPopup = (props) => {
  const [headersWhichAreSortedDescending, setHeadersWhichAreSortedDescending] =
    useState([]);

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
      <div className={`${styles.mainbox} ${props.wide && styles.mainboxWide}`}>
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
                    <th
                      key={`${props.data.title.slice(0, 10)}-th-${hIndex}`}
                      className={`${styles.listHeader} ${
                        props.setData && styles.listHeaderHoverable
                      } ${gstyles.noSelect}`}
                      onClick={(e) => {
                        e.preventDefault();

                        if (props.setData) {
                          props.setData((prev) => {
                            prev.rows = prev.rows.sort((x, y) => {
                              let xItem = stringifyIt(x[hIndex]);
                              let yItem = stringifyIt(y[hIndex]);

                              return headersWhichAreSortedDescending.includes(
                                header
                              )
                                ? xItem.localeCompare(yItem)
                                : yItem.localeCompare(xItem);
                            });
                            return prev;
                          });

                          setHeadersWhichAreSortedDescending((prev) => {
                            return prev.includes(header)
                              ? prev.filter((x) => x !== header)
                              : [...prev, header];
                          });
                        }
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {props.data.rows.map((el, rIndex) => (
                  <tr
                    className={`${styles.tablerow} ${
                      props.data.rowCallback && styles.hoverableRow
                    }`}
                    key={`${props.data.title}-tr-${rIndex}`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (props.data.rowCallback) {
                        props.data.rowCallback(el);
                      }
                    }}
                  >
                    <td>{rIndex + 1}</td>
                    {el.map((item, dIndex) => (
                      <td key={`${props.data.title}-td-${dIndex}`}>
                        {stringifyIt(item)}
                      </td>
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
