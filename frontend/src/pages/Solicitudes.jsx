import React, { useState } from 'react';
import Tabla from '../components/Table';
import { Button, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneIcon from '@mui/icons-material/Done';
import { Link } from 'react-router-dom';
import '../styles/Solicitudes.css';

const Solicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([
    { id: 1, nombre: 'Solicitud 1', solicitante: 'Juan Pérez', estado: 'Pendiente' },
    { id: 2, nombre: 'Solicitud 2', solicitante: 'Ana López', estado: 'Pendiente' },
    { id: 3, nombre: 'Solicitud 3', solicitante: 'Carlos Díaz', estado: 'Aceptada', horaAceptacion: '10:30 AM' },
    { id: 4, nombre: 'Solicitud 4', solicitante: 'María Pérez', estado: 'Aceptada', horaAceptacion: '12:45 PM' },
    { id: 5, nombre: 'Solicitud 5', solicitante: 'Luis Fernández', estado: 'Terminado' },
    { id: 6, nombre: 'Solicitud 6', solicitante: 'Andrea Gómez', estado: 'Terminado' }
  ]);

  const aceptarSolicitud = (id) => {
    setSolicitudes(solicitudes.map((sol) =>
      sol.id === id ? { ...sol, estado: 'Aceptada', horaAceptacion: new Date().toLocaleTimeString() } : sol
    ));
  };

  const rechazarSolicitud = (id) => {
    setSolicitudes(solicitudes.filter((sol) => sol.id !== id));
  };

  const marcarComoTerminada = (id) => {
    setSolicitudes(solicitudes.map((sol) =>
      sol.id === id ? { ...sol, estado: 'Terminado' } : sol
    ));
  };

  const columnasPendientes = [
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'solicitante', headerName: 'Solicitante', flex: 1 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div className="acciones-container">
          <IconButton className="icono-aceptar" onClick={() => aceptarSolicitud(params.row.id)}>
            <CheckCircleIcon color="success" />
          </IconButton>
          <IconButton className="icono-rechazar" onClick={() => rechazarSolicitud(params.row.id)}>
            <CancelIcon color="error" />
          </IconButton>
        </div>
      ),
    },
  ];

  const columnasAceptadas = [
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'solicitante', headerName: 'Solicitante', flex: 1 },
    { field: 'horaAceptacion', headerName: 'Hora de Aceptación', flex: 1 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div className="acciones-container">
          <IconButton className="icono-terminar" onClick={() => marcarComoTerminada(params.row.id)}>
            <DoneIcon color="primary" />
          </IconButton>
        </div>
      ),
    },
  ];

  const columnasTerminadas = [
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'solicitante', headerName: 'Solicitante', flex: 1 }
  ];

  return (
    <div className="solicitudes-container">
      <div className="solicitudes-table">
        <h1>Solicitudes Pendientes</h1>
        <Tabla
          datos={solicitudes.filter(sol => sol.estado === 'Pendiente')}
          columnas={columnasPendientes}
          filtroClave="nombre"
          filtroPlaceholder="Nombre del cliente"
        />
        
        <h1>Solicitudes Aceptadas</h1>
        <Tabla
          datos={solicitudes.filter(sol => sol.estado === 'Aceptada')}
          columnas={columnasAceptadas}
          filtroClave="nombre"
          filtroPlaceholder="Nombre del cliente"
        />

        <h1>Solicitudes Terminadas</h1>
        <Tabla
          datos={solicitudes.filter(sol => sol.estado === 'Terminado')}
          columnas={columnasTerminadas}
          filtroClave="nombre"
          filtroPlaceholder="Nombre del cliente"
          className="tabla-terminadas"
        />

        <Link to="/altasolicitud">
          <Button variant="contained" color="primary" style={{ marginTop: '20px' }}>
            Añadir Solicitud
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Solicitudes;
