import React from "react";

const LemmaCard = (props) => {
  return (
    <div key={props.word} style={{ border: "blue solid 2pt" }}>
      {props.word}
    </div>
  );
};

export default LemmaCard;
