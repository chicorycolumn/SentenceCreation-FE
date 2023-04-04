import React from "react";
import { Outlet, Link } from "react-router-dom";
import Navbar from "./Cogs/Navbar.jsx";
import styles from "./css/App.module.css";

const App = () => {
  return (
    <>
      <div className={styles.navbarHolder}>
        <Navbar />
      </div>

      <Outlet />
    </>
  );
};

export default App;
