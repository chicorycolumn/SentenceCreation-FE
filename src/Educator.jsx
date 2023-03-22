import React from "react";
import { Outlet, Link } from "react-router-dom";
import gstyles from "../src/css/Global.module.css";

const Educator = () => {
  return (
    <div>
      <h1>Educator Portal</h1>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/educator/create">Create a sentence</Link>
          </li>
          <li>
            <Link to="/educator/curriculums">Review curriculums</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </div>
  );
};

export default Educator;
