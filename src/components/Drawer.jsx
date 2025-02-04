// src/components/Drawer.jsx
import React, { useState, useEffect } from "react";
import '../styles/drawer.css';

const Drawer = () => {

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

  return (
    <nav className="drawer" style={{ width: isMobile ? "100%" : "var(--drawer-width)" }}>
      <ul className="drawer-menu" style={{ display: isMobile ? "flex" : "block", overflowX: isMobile ? "auto" : "hidden" }}>
        <li><a href="/" className="drawer-link">Clientes</a></li>
        <li><a href="/coordinaciones" className="drawer-link">Coordinaciones</a></li>
        <li><a href="/transportistas" className="drawer-link">Transportistas</a></li>
        <li><a href="/gestora" className="drawer-link">Empresa Gestora</a></li>
        <li><a href="/perfil" className="drawer-link">Mi Perfil</a></li>
      </ul>
    </nav>
  );
};

export default Drawer;
