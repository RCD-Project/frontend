// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./pages/context/AuthContext";

import Header from "./components/Header";
import Drawer from "./components/Drawer";
import Body from "./components/Body";

// Importa tus páginas
import Clientes from "./pages/Clientes";
import Coordinaciones from "./pages/Coordinaciones";
import Transportistas from "./pages/Transportistas";
import EmpresasGestoras from "./pages/EmpresasGestoras";
import AltaCliente from "./pages/AltaClientes";
import DetallesCliente from "./pages/DetallesCliente";
import EditarCliente from "./pages/EditarCliente";
import ListaDeObras from "./pages/ListaDeObras";
import Informes from "./pages/Informes";
import Solicitudes from "./pages/Solicitudes";
import Capacitaciones from "./pages/Capacitaciones";
import ObrasList from "./pages/ListaObrasTecnico";
import AltaObra from "./pages/AltaObra";
import DetallesObra from "./pages/DetallesObra";
import EditarObra from "./pages/EditarObra";
import DetallesTransportista from "./pages/DetallesTransportista";
import EditarTransportista from "./pages/EditarTransportista";
import AltaTransportistas from "./pages/AltaTransportistas";
import AltaEmpresas from "./pages/AltaEmpresas";
import AltaCapacitaciones from "./pages/AltaCapacitaciones";
import LoginForm from "./pages/login";
import RoleBasedRoute from "./pages/RutasProtegidas";
import Landing from "./pages/Landing";

import "./styles/App.css";

const App = () => {
  const [headerOpacity, setHeaderOpacity] = useState(1);
  const [drawerWidth, setDrawerWidth] = useState("var(--drawer-width)");
  // Estado para simular la autenticación
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Comprobar si hay token en localStorage para determinar el estado de autenticación
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      let newOpacity = 1 - scrollTop / 200;
      if (newOpacity < 0.5) newOpacity = 0.5;
      setHeaderOpacity(newOpacity);
      document.documentElement.style.setProperty(
        "--header-fade-opacity",
        newOpacity
      );
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Botón para alternar el estado de autenticación (para pruebas)
  const toggleAuth = () => {
    setIsLoggedIn((prev) => {
      const newState = !prev;
      if (newState) {
        localStorage.setItem("token", "test");
      } else {
        localStorage.removeItem("token");
      }
      return newState;
    });
  };

  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          {/* Botón de prueba para alternar logueo */}
          <button
            onClick={toggleAuth}
            style={{
              position: "fixed",
              top: "80px",
              right: "20px",
              zIndex: 300,
              padding: "0.5rem 1rem",
            }}
          >
            {isLoggedIn ? "Simular deslogueo" : "Simular logueo"}
          </button>

          <Header opacity={headerOpacity} isLoggedIn={isLoggedIn} />
          {isLoggedIn && <Drawer onWidthChange={setDrawerWidth} />}
          <main
            className="body-content"
            style={{
              marginLeft: isLoggedIn ? drawerWidth : 0,
              width: isLoggedIn ? "calc(100vw - var(--drawer-width))" : "100vw",
            }}
          >
            <Body>
              <Routes>
                <Route
                  path="/"
                  element={isLoggedIn ? <ListaDeObras /> : <Landing />}
                />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/coordinaciones" element={<Coordinaciones />} />
                <Route path="/transportistas" element={<Transportistas />} />
                <Route
                  path="/empresasgestoras"
                  element={<EmpresasGestoras />}
                />
                <Route path="/altacliente" element={<AltaCliente />} />
                <Route path="/detallescliente" element={<DetallesCliente />} />
                <Route path="/editarcliente" element={<EditarCliente />} />
                <Route
                  path="/listadeobras"
                  element={
                    <RoleBasedRoute allowedRoles={["Cliente", "Superadmin"]} />
                  }
                />
                <Route path="/informes" element={<Informes />} />
                <Route path="/solicitudes" element={<Solicitudes />} />
                <Route path="/capacitaciones" element={<Capacitaciones />} />
                <Route path="/obraslist" element={<ObrasList />} />
                <Route path="/altaobra" element={<AltaObra />} />
                <Route path="/detallesobra" element={<DetallesObra />} />
                <Route path="/editarobra" element={<EditarObra />} />
                <Route path="/login" element={<LoginForm />} />
                <Route
                  path="/detalletransportista"
                  element={<DetallesTransportista />}
                />
                <Route
                  path="/editartransportista"
                  element={<EditarTransportista />}
                />
                <Route
                  path="/altatransportistas"
                  element={<AltaTransportistas />}
                />
                <Route path="/altaempresas" element={<AltaEmpresas />} />
                <Route
                  path="/altacapacitaciones"
                  element={<AltaCapacitaciones />}
                />
              </Routes>
            </Body>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
