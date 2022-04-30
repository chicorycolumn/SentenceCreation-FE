import React from "react";

const LanguagesForm = (props) => {
  return (
    <div>
      <h3>LanguagesForm</h3>
      <form
        onChange={(e) => {
          console.log(e.target.value);
          props.setLang1(e.target.value);
        }}
      >
        <input type="radio" id="english" name="lang" value="ENG" />
        <label htmlFor="english">English</label>
        <input type="radio" id="polish" name="lang" value="POL" />
        <label htmlFor="polish">Polish</label>
      </form>
    </div>
  );
};

export default LanguagesForm;
