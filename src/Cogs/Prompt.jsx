import React from "react";
import styles from "../css/Popup.module.css";
import gstyles from "../css/Global.module.css";
import uUtils from "../utils/universalUtils.js";
import $ from "jquery";

const Prompt = (props) => {
  let { data } = props;

  return (
    <>
      <div className={gstyles.obscurus}></div>
      <div className={`${styles.mainbox} ${styles.mainboxFit}`}>
        <h1 className={styles.title}>{data.title}</h1>
        <p className={styles.message}>{data.message}</p>
        <div className={styles.buttonHolder}>
          {data.options.map((option) => (
            <div key={option.text} className={styles.buttonSubholder}>
              <button
                className={`${styles.button} ${option.color}`}
                key={option.text}
                onClick={option.callback}
              >
                {option.text}
              </button>
              {option.extraInfo &&
                option.extraInfo.map((extraInfo, index) => (
                  <p
                    key={extraInfo}
                    className={`${styles.extraInfo} ${!index && gstyles.bold}`}
                  >
                    {extraInfo}
                  </p>
                ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Prompt;
