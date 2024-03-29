import React, { Fragment, useState } from "react";
import styles from "../css/Navbar.module.css";
import { Link } from "react-router-dom";

const navbarInfos = [
  {
    title: "",
    items: [
      { text: "Home", link: "/" },
      { text: "Play", link: "/play", tooltipText: "Play the game" },
    ],
  },
  {
    title: "Educator Portal",
    items: [
      {
        text: "Sentences",
        link: "/educator/create",
        tooltipText: "Load, edit, save, and create sentence formulas",
      },
      {
        text: "Curriculums",
        link: "/educator/curriculums",
        tooltipText: "Review and create curriculums",
      },
    ],
  },
];

const Navbar = () => {
  const [meaninglessBoolean, setMeaninglessBoolean] = useState(false);

  return (
    <div className={styles.navbar}>
      {navbarInfos.map((info, index) => {
        let { title, items } = info;
        return (
          <Fragment key={`${index}-${info}`}>
            {title && <p className={styles.title}>{title}</p>}
            <nav className={styles.navEl}>
              {items.map((item) => (
                <Link
                  key={`${item.text}-${item.link}`}
                  to={item.link}
                  onClick={() => {
                    setMeaninglessBoolean((prev) => !prev);
                  }}
                  className={`${styles.navbarItem} ${
                    item.link !== "/" &&
                    window.location.href.includes(item.link) &&
                    styles.highlighted
                  }`}
                >
                  {item.text}
                </Link>
              ))}
            </nav>
          </Fragment>
        );
      })}
    </div>
  );
};

export default Navbar;
