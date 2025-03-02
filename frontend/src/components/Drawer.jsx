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
  UserPlus, // Importa el ícono para Alta Usuario
} from "lucide-react";
import "../styles/drawer.css";
import { AuthContext } from "../pages/context/AuthContext";

const menuItems = [
  { path: "/clientes", label: "Clientes", icon: <Users size={24} />, roles: ["superadmin", "coordinador", "coordinadorlogistico"] },
  { path: "/listadeobras", label: "Obras", icon: <Hammer size={24} />, roles: ["superadmin", "cliente"] },
  { path: "/solicitudes", label: "Solicitudes", icon: <ClipboardList size={24} />, roles: ["superadmin", "coordinador", "coordinadorlogistico"] },
  { path: "/coordinaciones", label: "Coordinaciones", icon: <Calendar size={24} />, roles: ["superadmin", "supervisor", "cliente"] },
  { path: "/transportistas", label: "Transportistas", icon: <Truck size={24} />, roles: ["superadmin", "coordinadorlogistico"] },
  { path: "/empresasgestoras", label: "Empresa Gestora", icon: <Factory size={24} />, roles: ["superadmin", "coordinadorlogistico"] },
  { path: "/capacitaciones", label: "Capacitaciones", icon: <GraduationCap size={24} />, roles: ["superadmin", "tecnico"] },
  { path: "/informes", label: "Informes", icon: <FileText size={24} />, roles: ["superadmin", "coordinadorlogistico", "coordinador"] },
  { path: "/Formularios", label: "Formularios", icon: <ClipboardPenLine size={24} />, roles: ["superadmin", "tecnico"] },
  { path: "/puntolimpio", label: "Puntos Limpios", icon: <MapPinCheck size={24} />, roles: ["superadmin", "cliente"] },
  // Nueva opción para Alta Usuario, visible solo para superadmin
  { path: "/altausuario", label: "Alta Usuario", icon: <UserPlus size={24} />, roles: ["superadmin"] },
];

const Drawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { role, logout } = useContext(AuthContext);

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(role));

  const handleLogout = () => {
    logout();
  };

  return (
    <motion.nav
      className={`drawer ${isOpen ? "open" : ""}`}
      initial={{ width: "60px" }}
      animate={{ width: isOpen ? "220px" : "60px" }}
      transition={{ duration: 0.3 }}
      style={{ overflowX: "hidden", maxWidth: "100vw" }} // 🔹 Evita que sobrepase la pantalla
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
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
              <div className="drawer-icon">{item.icon}</div>
              <motion.span className="drawer-text" animate={{ opacity: isOpen ? 1 : 0 }}>
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
  );
};

export default Drawer;
