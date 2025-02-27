import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    // Mapeamos el rol recibido a la nomenclatura que espera el Drawer
    const roleMapping = {
      super_administrador: "superadmin",
      coordinador_obra: "coordinador",
      coordinador_logistico: "coordinadorlogistico",
      supervisor_obra: "supervisor",
      tecnico: "tecnico",
      cliente: "cliente",
    };
    setRole(roleMapping[userData.rol] || userData.rol);
    localStorage.setItem("token", tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, role, setRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
