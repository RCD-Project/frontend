// Drawer.jsx
import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  FileText,
  Calendar,
  Users,
  ClipboardList,
  Truck,
  Factory,
  ClipboardPenLine,
  Hammer,
  MapPinCheck,
  LogOut,
  UserPlus,
  Camera,
} from "lucide-react";
import "../styles/drawer.css";
import { AuthContext } from "../pages/context/AuthContext";
import { SolicitudesContext } from "../pages/context/SolicitudContext";

const menuItems = [
  {
    path: "/listarusuarios",
    label: "Usuarios",
    icon: <UserPlus size={24} />,
    roles: ["superadmin"],
  },
  {
    path: "/clientes",
    label: "Clientes",
    icon: <Users size={24} />,
    roles: ["superadmin", "coordinador", "coordinadorlogistico"],
  },
  {
    path: "/listadeobras",
    label: "Obras",
    icon: <Hammer size={24} />,
    roles: ["superadmin", "cliente", "coordinadorlogistico"],
  },
  {
    path: "/solicitudes",
    label: "Solicitudes",
    icon: <ClipboardList size={24} />,
    roles: ["superadmin", "coordinador", "coordinadorlogistico"],
  },
  {
    path: "/coordinaciones",
    label: "Coordinaciones",
    icon: <Calendar size={24} />,
    roles: ["superadmin", "supervisor", "cliente", "tecnico", "coordinadorlogistico"],
  },
  {
    path: "/transportistas",
    label: "Transportistas",
    icon: <Truck size={24} />,
    roles: ["superadmin", "coordinadorlogistico"],
  },
  {
    path: "/empresasgestoras",
    label: "Empresa Gestora",
    icon: <Factory size={24} />,
    roles: ["superadmin", "coordinadorlogistico"],
  },
  {
    path: "/capacitaciones",
    label: "Capacitaciones",
    icon: <GraduationCap size={24} />,
    roles: ["superadmin", "tecnico"],
  },
  {
    path: "/informes",
    label: "Informes",
    icon: <FileText size={24} />,
    roles: ["superadmin", "coordinador", 'tecnico'],
  },
  {
    path: "/imagenes",
    label: "Imagenes",
    icon: <Camera size={24} />,
    roles: ["superadmin", "tecnico"],
  },
  {
    path: "/obraslist",
    label: "Formularios",
    icon: <ClipboardPenLine size={24} />,
    roles: ["superadmin", "tecnico"],
  },
  {
    path: "/puntolimpio",
    label: "Puntos Limpios",
    icon: <MapPinCheck size={24} />,
    roles: ["superadmin", "coordinador", "coordinadorlogistico"],
  },
];

const Drawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { role, logout } = useContext(AuthContext);
  const { pendingSolicitudes } = useContext(SolicitudesContext);
  const showVincularMessage = pendingSolicitudes.length > 0;

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(role)
  );

  const handleLogout = () => {
    logout();
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const closeDrawer = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        className="drawer-toggle"
        onClick={toggleDrawer}
        style={{
          position: "fixed",
          top: "80px",
          left: "10px",
          zIndex: 110,
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        ☰
      </button>

      <motion.nav
        className={`drawer ${isOpen ? "open" : ""}`}
        initial={{ width: "60px" }}
        animate={{ width: isOpen ? "220px" : "60px" }}
        transition={{ duration: 0.3 }}
        style={{ overflowX: "hidden", maxWidth: "100vw" }}
        onMouseEnter={() => window.innerWidth > 768 && setIsOpen(true)}
        onMouseLeave={() => window.innerWidth > 768 && setIsOpen(false)}
      >
        {window.innerWidth <= 768 && isOpen && (
          <button
            className="close-drawer-button"
            onClick={closeDrawer}
            style={{
              alignSelf: "flex-end",
              margin: "10px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "1.5rem",
            }}
          >
            ×
          </button>
        )}

        <ul className="drawer-menu">
          {filteredMenuItems.map((item, index) => (
            <motion.li
              key={index}
              className="drawer-item"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1, delay: isOpen ? 0.15 : 0 }}
            >
              <Link to={item.path} className="drawer-link">
                <div className="drawer-icon" style={{ position: "relative" }}>
                  {item.icon}
                  {item.label === "Solicitudes" && showVincularMessage && (
                    <span
                      className="notification-dot"
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "8px",
                        height: "8px",
                        background: "red",
                        borderRadius: "50%",
                      }}
                    ></span>
                  )}
                </div>
                <motion.span
                  className="drawer-text"
                  animate={{ opacity: isOpen ? 1 : 0 }}
                >
                  {item.label}
                </motion.span>
              </Link>
            </motion.li>
          ))}
        </ul>

        <div className="logout-button">
          <Link to="/" className="logout-link" onClick={handleLogout}>
            <div className="drawer-icon">
              <LogOut size={24} />
            </div>
            <span className="drawer-text">Cerrar sesión</span>
          </Link>
        </div>
      </motion.nav>
    </>
  );
};

export default Drawer;
