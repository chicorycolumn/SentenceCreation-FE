import React from "react";
import { Outlet, Link } from "react-router-dom";

const App = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/educator">Educator</Link>
          </li>
          <li>
            <Link to="/play">Play</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  );
};

export default App;
