// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Drawer from "./components/Drawer";
import Body from "./components/body";

import Clientes from "./pages/Clientes";
import Coordinaciones from "./pages/Coordinaciones";
import Transportistas from "./pages/Transportistas";
import EmpresasGestoras from "./pages/EmpresasGestoras";
import AltaClientes from "./pages/AltaClientes";
import DetallesCliente from "./pages/DetallesCliente";
import EditarCliente from "./pages/EditarCliente";
import ListaDeObras from "./pages/ListaDeObras";
import Informes from "./pages/Informes";
import Solicitudes from "./pages/Solicitudes";
import Capacitaciones from "./pages/Capacitaciones";
import InformeDeTecnicos from "./pages/InformeDeTecnicos";
import Formularios from "./pages/Formularios";
import DetallesObra from './pages/DetallesObra';
import EditarObra from './pages/EditarObra';
import DetallesTransportista from './pages/DetallesTransportista';
import EditarTransportista from './pages/EditarTransportista';







import "./styles/App.css";

const App = () => {
  const [headerOpacity, setHeaderOpacity] = useState(1);
  const [drawerWidth, setDrawerWidth] = useState("var(--drawer-width)");

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      let opacidadNueva = 1 - scrollTop / 200;
      if (opacidadNueva < 0.5) opacidadNueva = 0.5;

      setHeaderOpacity(opacidadNueva);
      document.documentElement.style.setProperty(
        "--header-fade-opacity",
        opacidadNueva
      );
    };
    

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Header opacity={headerOpacity} />
        <Drawer onWidthChange={setDrawerWidth} />
        
        <main className="body-content" style={{ marginLeft: drawerWidth }}>

          <Body>
            <Routes>
              <Route path="/" element={<Clientes />} />
              <Route path="/coordinaciones" element={<Coordinaciones />} />
              <Route path="/transportistas" element={<Transportistas />} />
              <Route path="/empresasgestoras" element={<EmpresasGestoras />} />
              <Route path="/altaclientes" element={<AltaClientes />} />
              <Route path="/detallescliente" element={<DetallesCliente />} />
              <Route path="/editarcliente" element={<EditarCliente />} />
              <Route path="/listadeobras" element={<ListaDeObras />} />
              <Route path="/informes" element={<Informes />} />
              <Route path="/solicitudes" element={<Solicitudes />} />
              <Route path="/capacitaciones" element={<Capacitaciones />} />
              <Route path="/informedetecnicos" element={<InformeDeTecnicos />} />
              <Route path="/formularios" element={<Formularios />} />
              <Route path="/detallesobra" element={<DetallesObra />} />
              <Route path="/editarobra" element={<EditarObra />} />
              <Route path="/detalletransportista" element={<DetallesTransportista />} />
              <Route path="/editartransportista" element={<EditarTransportista />} />
              {/*<Route path="/miperfil" element={<Miperfil />} />*/}


            </Routes>
          </Body>
        </main>
      </div>
    </Router>
  );
};

export default App;
