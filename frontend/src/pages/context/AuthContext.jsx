import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedRole = localStorage.getItem("role");

    if (storedToken && storedUser && storedRole) {
      setToken(storedToken);
      setUser(storedUser);
      setRole(storedRole);
    }
  }, []);

  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
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
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", roleMapping[userData.rol] || userData.rol);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ user, token, role, setRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
