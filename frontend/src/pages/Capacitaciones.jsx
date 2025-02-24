import React, { useState, useEffect } from 'react';
import Tabla from '../components/Table';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';

const Capacitaciones = () => {
  const [capacitaciones, setCapacitaciones] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/capacitaciones/lista/')
      .then(response => response.json())
      .then(data => setCapacitaciones(data))
      .catch(error => console.error('Error fetching capacitaciones:', error));
  }, []);

  const columnasCapacitaciones = [
    { field: 'fecha', headerName: 'Fecha', flex: 1 },
    { field: 'motivo', headerName: 'Motivo', flex: 1 },
    { field: 'obra', headerName: 'Obra', flex: 1 },
    { field: 'tecnico', headerName: 'Técnico', flex: 1 },
    { field: 'comentario', headerName: 'Comentario', flex: 1 },
  ];

  return (
    <div>
      <h1>Registro de Capacitaciones</h1>
      <Tabla
        datos={capacitaciones}
        columnas={columnasCapacitaciones}
        filtroClave="motivo"
        filtroPlaceholder="Buscar capacitación"
      />
      <Button
        variant="contained"
        sx={{
          marginTop: '20px',
          backgroundColor: '#abbf9d',
          '&:hover': {
            backgroundColor: '#d1e063',
          },
        }}
        startIcon={<AddIcon />}
        component={Link}
        to="/altacapacitaciones"
        style={{ marginTop: '20px' }}
      >
        Añadir Capacitación
      </Button>
    </div>
  );
};

export default Capacitaciones;
