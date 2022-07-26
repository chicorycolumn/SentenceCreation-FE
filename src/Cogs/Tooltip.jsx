import React from "react";
import gstyles from "../css/Global.module.css";

const Tooltip = (props) => {
  let tooltipTypeClass = gstyles[`tooltip${props.number || 1}`];

  return (
    <span className={`${gstyles.tooltip} ${tooltipTypeClass}`}>
      {props.text}
    </span>
  );
};

export default Tooltip;
