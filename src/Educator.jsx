import React from "react";
import { Outlet, Link } from "react-router-dom";

const Educator = () => {
  return (
    <div>
      <h1>Educator Portal</h1>

      <Outlet />
    </div>
  );
};

export default Educator;
