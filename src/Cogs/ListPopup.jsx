import React, { useEffect, useState } from "react";
import styles from "../css/Popup.module.css";
import gstyles from "../css/Global.module.css";
import uUtils from "../utils/universalUtils.js";
import Tooltip from "../Cogs/Tooltip.jsx";
import $ from "jquery";

const ListPopup = (props) => {
  const [headersWhichAreSortedDescending, setHeadersWhichAreSortedDescending] =
    useState([]);
  const [meaninglessCounter, setMeaninglessCounter] = useState(0);

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
      <div
        key={meaninglessCounter}
        className={`${styles.mainbox} ${props.wide && styles.mainboxWide}`}
      >
        <div className={styles.topHolder}>
          <div className={`${gstyles.sideButton} ${gstyles.invisible}`}></div>
          <h1 className={styles.title}>{props.data.title}</h1>
          <div className={styles.topRightButtonHolder}>
            {props.data.repeatCallback && (
              <button
                alt="Repeat icon"
                className={`${gstyles.sideButton} ${gstyles.greyButton} ${gstyles.squareButton} ${gstyles.tooltipHolderDelayed1s}`}
                onClick={() => {
                  props.data.repeatCallback(() => {
                    setMeaninglessCounter((prev) => prev + 1);
                  });
                }}
              >
                &#10561;
                <Tooltip text="Repeat query" />
              </button>
            )}
            <button
              id="ListPopup-exitbutton"
              alt="Exit icon"
              className={`${gstyles.sideButton} ${gstyles.greyButton} ${gstyles.squareButton}`}
              onClick={exit}
            >
              &#8679;
            </button>
          </div>
        </div>

        <div className={styles.bottomHolder}>
          {props.data.text ? (
            props.data.text.split("<br>").map((line) => <p>{line}</p>)
          ) : (
            <table>
              <thead>
                <tr>
                  <th className={styles.indexHeader}>#</th>
                  {props.data.headers.map((header, hIndex) => (
                    <th
                      key={`${props.data.title.slice(0, 10)}-th-${hIndex}`}
                      className={`${styles.listHeader} ${
                        props.setData && styles.listHeaderHoverable
                      } ${gstyles.noSelect} ${
                        props.evenColumns && styles.listHeaderEvenColumns
                      }`}
                      onClick={(e) => {
                        e.preventDefault();

                        if (props.setData) {
                          props.setData((prev) => {
                            prev.rows = prev.rows.sort((x, y) => {
                              let xItem = uUtils.stringify(x[hIndex]);
                              let yItem = uUtils.stringify(y[hIndex]);

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
                {props.data.rows.map((r, rIndex) => (
                  <tr
                    className={`${styles.tablerow} ${
                      props.data.rowCallback && styles.hoverableRow
                    }`}
                    key={`${props.data.title}-tr-${rIndex}`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (props.data.rowCallback) {
                        props.data.rowCallback(r, rIndex);
                      }
                    }}
                  >
                    <td>{rIndex + 1}</td>
                    {r.map((item, dIndex) => (
                      <td key={`${props.data.title}-td-${dIndex}`}>
                        {uUtils.stringify(item)}
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
