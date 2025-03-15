import React from 'react';

function Navbar() {
  return (
    <nav>
      <div className="nav-center">
        <h4>homepage</h4>
        <ul className="nav-links">
          <li>
            <a href="#homepage">homepage</a>
          </li>
          <li>
            <a href="#sidebar">sidebar</a>
          </li>
          <li>
            <a href="#modal">modal</a>
          </li>
          <li>
            <a href="#questions">questions</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;