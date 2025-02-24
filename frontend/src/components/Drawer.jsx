import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Building, FileText, Calendar, Users, ClipboardList, Truck, Factory, Eye, FileCog } from "lucide-react";
import "../styles/drawer.css";
import { AuthContext } from "../pages/context/AuthContext"; // Se asume que el AuthContext tiene el rol

// Agregamos la propiedad roles a cada item de menú
const menuItems = [
  { path: "/listadeobras", label: "Lista de Obras", icon: <Building size={24} />, roles: ["superadmin", "cliente"] },
  { path: "/informes", label: "Informes", icon: <FileText size={24} />, roles: ["superadmin", "coordinadorlogistico"] },
  { path: "/coordinaciones", label: "Coordinaciones", icon: <Calendar size={24} />, roles: ["superadmin", "supervisor", "cliente"] },
  { path: "/clientes", label: "Clientes", icon: <Users size={24} />, roles: ["superadmin"] },
  { path: "/solicitudes", label: "Solicitudes", icon: <ClipboardList size={24} />, roles: ["superadmin", "coordinador", "coordinadorlogistico"] },
  { path: "/transportistas", label: "Transportistas", icon: <Truck size={24} />, roles: ["superadmin", "coordinadorlogistico"] },
  { path: "/empresasgestoras", label: "Empresa Gestora", icon: <Factory size={24} />, roles: ["superadmin", 'coordinadorlogistico'] },
  { path: "/capacitaciones", label: "Capacitaciones", icon: <Eye size={24} />, roles: ["superadmin", "tecnico"] },
  { path: "/obraslist", label: "Formularios", icon: <Users size={24} />, roles: ["superadmin", "tecnico"] },
];

const Drawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Se asume que el AuthContext provee una propiedad 'role' con el rol del usuario
  const { role } = useContext(AuthContext);

  // Filtramos los items que se mostrarán según el rol
  const filteredMenuItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <motion.nav
      className={`drawer ${isOpen ? "open" : ""}`}
      initial={{ width: "60px" }}
      animate={{ width: isOpen ? "225px" : "60px" }}
      transition={{ duration: 0.1, ease: "easeInOut" }}
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
              <div className="drawer-icon">
                {item.icon}
              </div>
              <motion.span
                className="drawer-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.1, delay: isOpen ? 0.15 : 0 }}
              >
                {item.label}
              </motion.span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </motion.nav>
  );
};

export default Drawer;
