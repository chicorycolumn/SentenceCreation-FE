import React, { useState, useEffect, useContext } from "react";
import styles from "../css/ChunkCard.module.css";
import { fetchLObjsByLemma } from "../utils/getUtils.js";
import LanguageContext from "../context/LanguageContext.js";

const ChunkCard = (props) => {
  const [lObjs, setLObjs] = useState([]);
  const [selectedLObj, setSelectedLObj] = useState({});
  const lang1 = useContext(LanguageContext);

  useEffect(() => {
    if (lang1) {
      fetchLObjsByLemma(lang1, props.word).then((fetchedLObjs) => {
        setLObjs(fetchedLObjs);
      });
    }
  }, [lang1, props.word]);

  return (
    <div className={styles.card} key={props.word}>
      {props.word}
      {lObjs.length ? (
        lObjs.map((lObj) => <p key={lObj.id}>{lObj.id}</p>)
      ) : (
        <p>~</p>
      )}
    </div>
  );
};

export default ChunkCard;
