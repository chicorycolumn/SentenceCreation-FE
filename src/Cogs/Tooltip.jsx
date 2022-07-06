import React from "react";
import gstyles from "../css/Global.module.css";

const Tooltip = (props) => {
  return (
    <span
      className={`${gstyles.tooltip} ${
        props.tooltipType === "2" ? gstyles.tooltip2 : gstyles.tooltip1
      }`}
    >
      {props.text}
    </span>
  );
};

export default Tooltip;
