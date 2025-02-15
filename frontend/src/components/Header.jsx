// src/components/Header.jsx
import React from 'react'; 
import '../styles/header.css';


const Header = ({ opacity }) => {
  return (
    <header className="site-header" style={{ opacity }}>
      <h1 className="site-title">Gestión de residuos de obra</h1>
    </header>
  );
};

export default Header;

