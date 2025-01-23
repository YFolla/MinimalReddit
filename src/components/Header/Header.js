import React from 'react';
import { Link } from 'react-router-dom';
import SearchDropdown from './SearchDropdown';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <h1>Reddit Minimal</h1>
        </Link>
      </div>
      <div className="search">
        <SearchDropdown />
      </div>
    </header>
  );
};

export default Header; 