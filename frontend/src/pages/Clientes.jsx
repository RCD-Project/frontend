// src/pages/Home.jsx
import React from 'react';
import Tables from '../components/Table'
import { Button, AddIcon } from 'evergreen-ui'
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';


const handleFilterChange = (e) => {
  setEstadoFiltro(e.target.value);
};

const handleFilterSubmit = (e) => {
  e.preventDefault();
  // Aquí se podría hacer la llamada a la API con el filtro seleccionado
};

const Clientes = () => {
  const [estadoFiltro, setEstadoFiltro] = useState('Filter...')

  return (
    //Agregar useEffect para cuando se filtre algo se realice dicho filtrado
    
    <div>
      <h1>Listado clientes</h1>
      <Tables></Tables>
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
