import React from "react";
import gstyles from "../css/Global.module.css";

const Tooltip = (props) => {
  let dict = {
    1: gstyles.tooltip1,
    2: gstyles.tooltip2,
    3: gstyles.tooltip3,
    4: gstyles.tooltip4,
  };

  let tooltipType = props.number || 1;

  let tooltipTypeClass = dict[tooltipType];

  return (
    <span className={`${gstyles.tooltip} ${tooltipTypeClass}`}>
      {props.text}
    </span>
  );
};

export default Tooltip;
