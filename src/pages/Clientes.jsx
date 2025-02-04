import React, { useState, useEffect } from "react";
import Tables from "../components/Table";
import { Button, AddIcon } from "evergreen-ui";
import { Link } from "react-router-dom";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/clientes/aprobados/", {
          mode: "cors", // Esto es lo normal en solicitudes cross-origin
          headers: {
            "Accept": "application/json"
          }
        });
        if (!response.ok) {
          throw new Error("Error al obtener los clientes");
        }
        const data = await response.json();
        console.log("Clientes recibidos:", data); // 👈 Verificar datos en consola
        setClientes(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchClientes();
  }, []);

  return (
    <div>
      <h1>Listado clientes</h1>
      <Tables clientes={clientes} />
      <Link to="/altacliente">
        <Button marginRight={16} intent="success">
          <AddIcon />
          Añadir
        </Button>
      </Link>
    </div>
  );
};

export default Clientes;
