import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, AuthContext } from "./pages/context/AuthContext";

import Header from "./components/Header";
import Drawer from "./components/Drawer";
import Body from "./components/body";
// import RoleSelector from "./components/RolSelector";

// Importa tus páginas
import Clientes from "./pages/Clientes";
import AltaCliente from "./pages/AltaClientes";
import DetallesCliente from "./pages/DetallesCliente";
import EditarCliente from "./pages/EditarCliente";
import PuntoLimpio from "./pages/PuntoLimpio";
import AltaPuntoLimpio from "./pages/AltaPuntoLimpio";
import DetallesPuntoLimpio from "./pages/DetallesPuntoLimpio";
import EditarPuntoLimpio from "./pages/EditarPuntoLimpio";
import Coordinaciones from "./pages/Coordinaciones";
import ListaDeCoordinaciones from './pages/ListaCoordinaciones'; 
import Transportistas from "./pages/Transportistas";
import EmpresasGestoras from "./pages/EmpresasGestoras";
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
import EditarEmpresasGestoras from "./pages/EditarEmpresasGestoras";
import AltaCapacitaciones from "./pages/AltaCapacitaciones";
import DetallesCapacitaciones from "./pages/DetallesCapacitaciones";
import LoginForm from "./pages/login";
import RoleBasedRoute from "./pages/RutasProtegidas";
import Landing from "./pages/Landing";
import Error403 from "./403error";
import Formularios from "./pages/Formularios";

import "./styles/App.css";

const AppContent = () => {
  const [headerOpacity, setHeaderOpacity] = useState(1);
  const [drawerWidth, setDrawerWidth] = useState("60px");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Definir estado para el drawer visible  
  const { token: authToken, login, logout } = useContext(AuthContext);
  const isLoggedIn = Boolean(authToken); // Usa authToken aquí

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      let newOpacity = 1 - scrollTop / 200;
      if (newOpacity < 0.5) newOpacity = 0.5;
      setHeaderOpacity(newOpacity);
      document.documentElement.style.setProperty("--header-fade-opacity", newOpacity);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDrawerHover = (hoverState) => {
    if (hoverState) {
      setDrawerWidth("220px"); // Se expandirá cuando se pase el ratón
      setIsDrawerOpen(true); // Se abrirá el Drawer
    } else {
      setDrawerWidth("60px"); // Se reducirá cuando se retire el ratón
      setIsDrawerOpen(false); // Se cerrará el Drawer
    }
  };

  // Función para simular login/logout usando AuthContext
  const toggleAuth = () => {
    if (isLoggedIn) {
      logout();
    } else {
      // Simulamos un login asignando un token (por ejemplo, "test")
      login({ name: "Test User" }, "test");
    }
  };
  useEffect(() => {
    if (isLoggedIn) {
      setIsDrawerOpen(true); // Cambia 'setDrawerVisible' por 'setIsDrawerOpen'
    } else {
      setIsDrawerOpen(false); // Cambia 'setDrawerVisible' por 'setIsDrawerOpen'
    }
  }, [isLoggedIn]);
  

  return (
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

      {/* Componente para seleccionar rol en pruebas */}
      {/* {isLoggedIn && <RoleSelector />} */}

      <Header opacity={headerOpacity} isLoggedIn={isLoggedIn} />
      {isLoggedIn && (
        <Drawer
          isOpen={isDrawerOpen}
          onMouseEnter={() => handleDrawerHover(true)} // Cuando el ratón entra
          onMouseLeave={() => handleDrawerHover(false)} // Cuando el ratón sale
        />
      )}
      <main
        className="body-content"
        style={{
          marginLeft: isLoggedIn ? "60px" : 0, // Solo mover el contenido si el drawer está visible
          transition: "margin-left 0.3s ease", // Suavizar la transición
          marginTop: "70px",  // Ajuste para que no se superponga al header
          
        }}
      >
        <Body>
          <Routes>
            <Route path="/" element={isLoggedIn ? <ListaDeObras /> : <Landing />} />
            <Route
              path="/clientes"
              element={
                <RoleBasedRoute allowedRoles={["superadmin", "coordinadorlogistico", "coordinador"]}>
                  <Clientes />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/altacoordinaciones"
              element={
                <RoleBasedRoute allowedRoles={["superadmin", "supervisor", "cliente" ]}>
                  <Coordinaciones />
                </RoleBasedRoute>
              }
            />

<Route
              path="/coordinaciones"
              element={
                <RoleBasedRoute allowedRoles={["superadmin", "supervisor", "cliente" ]}>
                  <ListaDeCoordinaciones />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/transportistas"
              element={
                <RoleBasedRoute allowedRoles={["superadmin", "coordinadorlogistico" ]}>
                  <Transportistas />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/empresasgestoras"
              element={
                <RoleBasedRoute allowedRoles={["superadmin", "coordinadorlogistico" ]}>
                  <EmpresasGestoras />
                </RoleBasedRoute>
              }
            />
            <Route path="/altacliente" element={<AltaCliente />} />
            <Route path="/detallescliente" element={isLoggedIn ? <DetallesCliente /> : <Landing />} />
            <Route
              path="/editarcliente"
              element={
                <RoleBasedRoute allowedRoles={["cliente", "superadmin"]}>
                  <EditarCliente />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/listadeobras"
              element={
                <RoleBasedRoute allowedRoles={["cliente", "superadmin"]}>
                  <ListaDeObras />
                </RoleBasedRoute>
              }
            />
            <Route path="/informes" element={<Informes />} />
            <Route
              path="/informes"
              element={
                <RoleBasedRoute allowedRoles={["coordinadorlogistico", "superadmin", "coordinador"]}>
                  <Informes />
                </RoleBasedRoute>
              }
            />
            <Route path="/unauthorized" element={<Error403 />} />
            <Route
              path="/solicitudes"
              element={
                <RoleBasedRoute allowedRoles={["superadmin", "coordinador", "coordinadorlogistico"]}>
                  <Solicitudes />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/capacitaciones"
              element={
                <RoleBasedRoute allowedRoles={["cliente", "superadmin", "tecnico", "coordinador"]}>
                  <Capacitaciones />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/obraslist"
              element={
                <RoleBasedRoute allowedRoles={["tecnico", "superadmin"]}>
                  <ObrasList />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/puntolimpio"
              element={
                <RoleBasedRoute allowedRoles={["cliente", "superadmin"]}>
                  <PuntoLimpio />
                </RoleBasedRoute>
              }
            />

            <Route
              path="/altaobra"
              element={
                <RoleBasedRoute allowedRoles={["cliente", "superadmin"]}>
                  <AltaObra />
                </RoleBasedRoute>
              }
            />

            <Route
              path="/detallesobra"
              element={
                <RoleBasedRoute allowedRoles={["cliente", "superadmin"]}>
                  <DetallesObra />
                </RoleBasedRoute>
              }
            />

            <Route
              path="/editarobra"
              element={
                <RoleBasedRoute allowedRoles={["cliente", "superadmin", "supervisor"]}>
                  <EditarObra />
                </RoleBasedRoute>
              }
            />

            <Route
              path="/altapuntolimpio"
              element={
                <RoleBasedRoute allowedRoles={["cliente", "superadmin"]}>
                  <AltaPuntoLimpio />
                </RoleBasedRoute>
              }
            />

            <Route
              path="/detallespuntolimpio"
              element={
                <RoleBasedRoute allowedRoles={["cliente", "superadmin"]}>
                  <DetallesPuntoLimpio />
                </RoleBasedRoute>
              }
            />

            <Route
              path="/editarpuntolimpio"
              element={
                <RoleBasedRoute allowedRoles={["cliente", "superadmin"]}>
                  <EditarPuntoLimpio />
                </RoleBasedRoute>
              }
            />

            <Route path="/login" element={<LoginForm />} />
            
            <Route path="/detalletransportista" element={<DetallesTransportista />} />
            <Route
              path="/detallestransportista"
              element={
                <RoleBasedRoute allowedRoles={["coordinadorlogistico", "superadmin"]}>
                  <DetallesTransportista />
                </RoleBasedRoute>
              }
            />

            <Route
              path="/editartransportista"
              element={
                <RoleBasedRoute allowedRoles={["coordinadorlogistico", "superadmin"]}>
                  <EditarTransportista />
                </RoleBasedRoute>
              }
            />

            <Route
              path="/altatransportistas"
              element={
                <RoleBasedRoute allowedRoles={["coordinadorlogistico", "superadmin"]}>
                  <AltaTransportistas />
                </RoleBasedRoute>
              }
            />

            <Route path="/altaempresas" element={<AltaEmpresas />} />
            <Route
              path="/altaempresas"
              element={
                <RoleBasedRoute allowedRoles={["cliente", "superadmin"]}>
                  <AltaEmpresas />
                </RoleBasedRoute>
              }
            />

            <Route
              path="/editarempresasgestoras"
              element={
                <RoleBasedRoute allowedRoles={["coordinadorlogistico", "superadmin"]}>
                  <EditarEmpresasGestoras />
                </RoleBasedRoute>
              }
            />

            <Route
              path="/altacapacitaciones"
              element={
                <RoleBasedRoute allowedRoles={["tecnico", "superadmin"]}>
                  <AltaCapacitaciones />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/detallescapacitaciones"
              element={
                <RoleBasedRoute allowedRoles={["tecnico", "superadmin"]}>
                  <DetallesCapacitaciones />
                </RoleBasedRoute>
              }
            />

            <Route
              path="/Formularios"
              element={
                <RoleBasedRoute allowedRoles={["tecnico", "superadmin"]}>
                  <Formularios />
                </RoleBasedRoute>
              }
            />
          </Routes>
        </Body>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
