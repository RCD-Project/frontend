import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Inicia con un rol por defecto, por ejemplo "cliente"
  const [role, setRole] = useState("cliente");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem("token", tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, role, setRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
