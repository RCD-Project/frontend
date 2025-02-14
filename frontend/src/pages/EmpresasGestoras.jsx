import React, { useState } from "react";
import Tabla from "../components/Table";
import { Button, AddIcon } from "evergreen-ui";
import { Link } from "react-router-dom";

const EmpresasGestoras = () => {
  const [empresas, setEmpresas] = useState([
    { id: 1, nombre: "Gestora S.A.", ubicacion: "Montevideo", contacto: "098123456" },
    { id: 2, nombre: "Reciclaje Uruguay", ubicacion: "Canelones", contacto: "099654321" },
  ]);

  const eliminarEmpresa = (id) => {
    setEmpresas(empresas.filter((empresa) => empresa.id !== id));
  };

  return (
    <div>
      <h1>Empresas Gestoras</h1>
      <Tabla
        datos={empresas}
        columnas={[
          { titulo: "Nombre", clave: "nombre" },
          { titulo: "Ubicación", clave: "ubicacion" },
          { titulo: "Contacto", clave: "contacto" },
        ]}
        onEliminar={eliminarEmpresa}
        filtroPlaceholder="nombre"
      />
      <Link to="/altaempresa">
        <Button marginRight={16} intent="success">
          <AddIcon />
          Añadir Empresa
        </Button>
      </Link>
    </div>
  );
};

export default EmpresasGestoras;
