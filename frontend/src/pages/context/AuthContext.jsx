// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

// Creamos el contexto
export const AuthContext = createContext();

// Proveedor del contexto, que envolverá a la aplicación
export const AuthProvider = ({ children }) => {
  // Estado para almacenar los datos del usuario (por ejemplo, token, roles, etc.)
  const [user, setUser] = useState(null);

  // Al montar, verificamos si existe un usuario almacenado (por ejemplo, en localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Función para iniciar sesión (aquí se integraría la llamada a la API de autenticación)
  const login = (userData) => {
    // userData podría incluir token, rol, etc.
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Se expone el estado y las funciones mediante el contexto
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
