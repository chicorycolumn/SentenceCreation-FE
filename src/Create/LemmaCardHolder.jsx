import React from "react";
import LemmaCard from "./LemmaCard";

const LemmaCardHolder = (props) => {
  return (
    <div>
      {props.formulaSymbol.split(" ").map((word) => (
        <LemmaCard key={word} word={word} />
      ))}
    </div>
  );
};

export default LemmaCardHolder;
