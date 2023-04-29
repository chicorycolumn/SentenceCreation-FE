import React, { useContext, useEffect } from "react";
import LanguageContext from "../context/LanguageContext.js";
import RadioForm from "../Cogs/RadioForm";
import gstyles from "../css/Global.module.css";
import styles from "../css/LanguagesForm.module.css";
import idUtils from "../utils/identityUtils.js";
const putUtils = require("../utils/putUtils.js");

const LanguagesForm = (props) => {
  const { langQ, langA, beEnv } = idUtils.getLangsAndEnv(
    useContext(LanguageContext)
  );

  useEffect(() => {
    document.getElementById(`langQ_${langQ}`).checked = true;
  }, []);

  useEffect(() => {
    document.getElementById(`langA_${langA}`).checked = true;
  }, []);

  useEffect(() => {
    document.getElementById(`beEnv_${beEnv}`).checked = true;
  }, []);

  return (
    <div className={styles.formHolder}>
      <div className={gstyles.floatTop}>
        <button
          onClick={() => {
            console.log({ langQ, langA, beEnv }); //devlogging
          }}
        >
          ł1
        </button>
        <button
          onClick={() => {
            console.log(props.devSavedFormulas); //devlogging
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
        callbackSetValue={props.setLangQ}
        title={"Choose Question Language"}
        idString={"langQ"}
        vals={[
          { short: "ENG", long: "English" },
          { short: "POL", long: "Polish" },
          { short: "SPA", long: "Spanish" },
        ]}
      />
      <RadioForm
        callbackSetValue={props.setLangA}
        title={"Choose Answer Language"}
        idString={"langA"}
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
