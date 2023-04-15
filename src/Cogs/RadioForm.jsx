import React from "react";
import styles from "../css/RadioForm.module.css";
import $ from "jquery";

const RadioForm = (props) => {
  return (
    <form
      onChange={(e) => {
        props.callbackSetValue(e.target.value);
      }}
      className={styles.form}
    >
      <h4 className={styles.title}>{props.title}</h4>
      <div>
        {props.vals.map((val) => {
          let id = `${props.idString}_${val.short}`;
          return (
            <div
              key={id}
              className={styles.formOption}
              onClick={() => {
                $(`#${id}_label`).click();
              }}
            >
              <input
                type="radio"
                id={id}
                name={props.idString}
                value={val.short}
              />
              <label htmlFor={id} id={`${id}_label`}>
                {val.long || val.short}
              </label>
            </div>
          );
        })}
      </div>
    </form>
  );
};

export default RadioForm;
