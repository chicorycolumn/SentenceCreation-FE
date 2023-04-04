import React from "react";
import { Outlet, Link } from "react-router-dom";
import gstyles from "../src/css/Global.module.css";

const Educator = () => {
  return (
    <div>
      <h1>Educator Portal</h1>

      <Outlet />
    </div>
  );
};

export default Educator;
