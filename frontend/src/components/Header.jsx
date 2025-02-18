import React from 'react';
import '../styles/header.css';
import logoImage from '../assets/isologo.png';

const Header = ({ opacity }) => {
  return (
    <header className="site-header" style={{ opacity }}>
      <div className="header-container">
        <div className="header-placeholder" />
        <h1 className="site-title">Gestión de residuos de obra</h1>
        <img src={logoImage} alt="Logo" className="header-logo" />
      </div>
    </header>
  );
};

export default Header;
