import React from "react";
import { Link, useLocation } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "../styles/header.css";
import logoImage from "../assets/isologo.png";

const Header = ({ opacity, isLoggedIn }) => {
  const location = useLocation();
  // Define las rutas en las que se debe mostrar el icono de volver
  const allowedRoutes = ["/login", "/altacliente"];
  const showBackIcon = !isLoggedIn && allowedRoutes.includes(location.pathname);

  const headerText = isLoggedIn
    ? "Gestión de residuos de obra"
    : "Bienvenido – Inicia Sesión o Regístrate";

  return (
    <header className="site-header" style={{ opacity }}>
      <div className="header-container">
        {showBackIcon && (
          <Link to="/" className="header-back-button">
            <ArrowBackIcon sx={{ color: "#fff", fontSize: 30 }} />
          </Link>
        )}
        <h1 className="site-title">{headerText}</h1>
        <img src={logoImage} alt="Logo" className="header-logo" />
      </div>
    </header>
  );
};

export default Header;
