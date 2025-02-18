import React, { useState } from 'react';
import Tabla from '../components/Table';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';

const Capacitaciones = () => {
  const [capacitaciones, setCapacitaciones] = useState([
    { id: 1, cliente: 'Juan Pérez', obra: 'Obra1', contacto: '123456789', horario: '10:00 AM' },
    { id: 2, cliente: 'Ana López', obra: 'Obra2', contacto: '987654321', horario: '02:30 PM' },
  ]);

  const columnasCapacitaciones = [
    { field: 'cliente', headerName: 'Cliente', flex: 1 },
    { field: 'obra', headerName: 'Obra', flex: 1 },
    { field: 'contacto', headerName: 'Contacto', flex: 1 },
    { field: 'horario', headerName: 'Horario', flex: 1 },
  ];

  return (
    <div>
      <h1>Registro de Capacitaciones</h1>
      <Tabla
        datos={capacitaciones}
        columnas={columnasCapacitaciones}
        filtroClave="cliente"
        filtroPlaceholder="Nombre del cliente"
      />
      
        <Button
          variant="contained"
          color="primary"
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
