import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Building, FileText, Calendar, Users, ClipboardList, Truck, Factory, Eye, FileCog } from "lucide-react";
import "../styles/drawer.css";

const menuItems = [
  { path: "/listadeobras", label: "Lista de Obras", icon: <Building size={24} /> },
  { path: "/informes", label: "Informes", icon: <FileText size={24} /> },
  { path: "/coordinaciones", label: "Coordinaciones", icon: <Calendar size={24} /> },
  { path: "/", label: "Clientes", icon: <Users size={24} /> },
  { path: "/solicitudes", label: "Solicitudes", icon: <ClipboardList size={24} /> },
  { path: "/transportistas", label: "Transportistas", icon: <Truck size={24} /> },
  { path: "/empresasgestoras", label: "Empresa Gestora", icon: <Factory size={24} /> },
  { path: "/capacitaciones", label: "Capacitaciones", icon: <Eye size={24} /> },
  { path: "/informedetecnicos", label: "Informe de Técnicos", icon: <FileCog size={24} /> },
  { path: "/obraslist", label: "Formularios", icon: <Users size={24} /> },
];
  

const Drawer = () => {
  const [isOpen, setIsOpen] = useState(false);

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
        {menuItems.map((item, index) => {
          return (
            <motion.li
              key={index}
              className="drawer-item"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1, delay: isOpen ? 0.15 : 0 }} // Sincronizamos con la apertura
            >
              <Link to={item.path} className="drawer-link">
                <div className="drawer-icon">
                  {item.icon} {/* Aquí se renderiza el ícono directamente */}
                </div>
                <motion.span
                  className="drawer-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.1, delay: isOpen ? 0.15 : 0 }} // Sincronización
                >
                  {item.label}
                </motion.span>
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </motion.nav>
  );
};

export default Drawer;
