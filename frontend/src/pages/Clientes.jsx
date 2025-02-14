import React, { useState } from 'react';
import Tabla from '../components/Table';
import { Button, AddIcon } from 'evergreen-ui';
import { Link } from 'react-router-dom';

const Clientes = () => {
  const [clientes, setClientes] = useState([
    { id: 1, nombre: 'Juan Pérez', ultimaActividad: '2024-01-01', cantidadObras: 5 },
    { id: 2, nombre: 'Ana López', ultimaActividad: '2024-02-01', cantidadObras: 3 },
  ]);

  const eliminarCliente = (id) => {
    const confirmacion = window.confirm("¿Seguro que deseas eliminar este cliente?");
    if (confirmacion) {
      setClientes(clientes.filter((cliente) => cliente.id !== id));
    }
  };

  const columnasClientes = [
    { titulo: 'Nombres', clave: 'nombre' },
    { titulo: 'Fecha de ingreso', clave: 'ultimaActividad' },
    { titulo: 'Cantidad de obras', clave: 'cantidadObras' }
  ];

  return (
    <div>
      <h1>Listado de Clientes</h1>
      <Tabla
        datos={clientes}
        columnas={columnasClientes}
        onEliminar={eliminarCliente}
        filtroPlaceholder="nombre" // Esto permite filtrar por la columna 'nombre'
      />
      <Link to="/altacliente">
        <Button marginRight={16} intent="success">
          <AddIcon />
          Añadir Cliente
        </Button>
      </Link>
    </div>
  );
};

export default Clientes;
