import React, { useContext, useEffect } from "react";
import LanguageContext from "../context/LanguageContext.js";
import RadioForm from "../Cogs/RadioForm";
import gstyles from "../css/Global.module.css";
import styles from "../css/LanguagesForm.module.css";
import idUtils from "../utils/identityUtils.js";
const putUtils = require("../utils/putUtils.js");

const LanguagesForm = (props) => {
  const { lang1, lang2, beEnv } = idUtils.getLangsAndEnv(
    useContext(LanguageContext)
  );

  useEffect(() => {
    document.getElementById(`lang1_${lang1}`).checked = true;
  }, []);

  useEffect(() => {
    document.getElementById(`lang2_${lang2}`).checked = true;
  }, []);

  useEffect(() => {
    document.getElementById(`beEnv_${beEnv}`).checked = true;
  }, []);

  return (
    <div className={styles.formHolder}>
      <div className={gstyles.floatTop}>
        <button
          onClick={() => {
            console.log({ lang1, lang2, beEnv }); //devlogging
          }}
        >
          ł1
        </button>
        <button
          onClick={() => {
            console.log("2"); //devlogging
          }}
        >
          ł2
        </button>
        <button
          onClick={() => {
            console.log("3"); //devlogging
          }}
        >
          ł3
        </button>
      </div>
      <RadioForm
        callbackSetValue={props.setLang1}
        title={"Choose Question Language"}
        idString={"lang1"}
        vals={[
          { short: "ENG", long: "English" },
          { short: "POL", long: "Polish" },
          { short: "SPA", long: "Spanish" },
        ]}
      />
      <RadioForm
        callbackSetValue={props.setLang2}
        title={"Choose Answer Language"}
        idString={"lang2"}
        vals={[
          { short: "ENG", long: "English" },
          { short: "POL", long: "Polish" },
          { short: "SPA", long: "Spanish" },
        ]}
      />
      <RadioForm
        callbackSetValue={props.setBeEnv}
        title={"Choose BE environment"}
        idString={"beEnv"}
        vals={[{ short: "ref" }, { short: "dev" }]}
      />
    </div>
  );
};

export default LanguagesForm;
