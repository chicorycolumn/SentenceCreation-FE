import React from "react";
import styles from "./css/Play.module.css";

function adjustLine(from, to, line) {
  let fT = from.offsetTop + from.offsetHeight / 2;
  let tT = to.offsetTop + to.offsetHeight / 2;
  let fL = from.offsetLeft + from.offsetWidth / 2;
  let tL = to.offsetLeft + to.offsetWidth / 2;

  let CA = Math.abs(tT - fT);
  let CO = Math.abs(tL - fL);
  let H = Math.sqrt(CA * CA + CO * CO);
  let ANG = (180 / Math.PI) * Math.acos(CA / H);

  let top = 0;
  let left = 0;

  if (tT > fT) {
    top = (tT - fT) / 2 + fT;
  } else {
    top = (fT - tT) / 2 + tT;
  }
  if (tL > fL) {
    left = (tL - fL) / 2 + fL;
  } else {
    left = (fL - tL) / 2 + tL;
  }

  if (
    (fT < tT && fL < tL) ||
    (tT < fT && tL < fL) ||
    (fT > tT && fL > tL) ||
    (tT > fT && tL > fL)
  ) {
    ANG *= -1;
  }
  top -= H / 2;

  line.style["-webkit-transform"] = "rotate(" + ANG + "deg)";
  line.style["-moz-transform"] = "rotate(" + ANG + "deg)";
  line.style["-ms-transform"] = "rotate(" + ANG + "deg)";
  line.style["-o-transform"] = "rotate(" + ANG + "deg)";
  line.style["-transform"] = "rotate(" + ANG + "deg)";
  line.style.top = top + "px";
  line.style.left = left + "px";
  line.style.height = H + "px";
}

const Play = () => {
  return (
    <div>
      <h1>Welcome, Player!</h1>
      <h2>Begin game?</h2>
      <h1
        onClick={() => {
          console.log("adjustLine!");
          adjustLine(
            document.getElementById("div1"),
            document.getElementById("div2"),
            document.getElementById("line")
          );
        }}
      >
        Image testing...
      </h1>
      <div className={styles.holder}>
        <div id="div1" className={`${styles.mydiv} ${styles.div1}`}></div>
        <div id="div2" className={`${styles.mydiv} ${styles.div2}`}></div>
        <div id="line" className={styles.line}></div>
      </div>
    </div>
  );
};

export default Play;
