import React, { useState, useEffect } from 'react';
import Tabla from '../components/Table';
import { Button, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneIcon from '@mui/icons-material/Done';
import { Link } from 'react-router-dom';
import '../styles/Solicitudes.css';

const Solicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('http://127.0.0.1:8000/api/clientes/solicitudes/')
        .then((res) => res.json()),
      fetch('http://127.0.0.1:8000/api/obras/solicitudes/')
        .then((res) => res.json()),
    ])
      .then(([clientesSolicitudes, obrasSolicitudes]) => {

        const clientesData = clientesSolicitudes.map((item) => ({
          ...item,
          tipo: 'cliente',

          id: item.cliente_id 
            ? `cliente-${item.cliente_id}` 
            : `cliente-${item.cliente?.id || Math.random()}`,
          nombre: item.cliente?.nombre || 'Sin nombre',
          solicitante: item.cliente?.nombre || 'Sin solicitante',
        }));
        const obrasData = obrasSolicitudes.map((item) => ({
          ...item,
          tipo: 'obra',

          id: item.obra 
            ? `obra-${item.obra}` 
            : `obra-${item.obra?.obra || Math.random()}`,
          nombre:
            item.obra?.nombre_obra ||
            item.obra?.nombre_constructora ||
            'Sin nombre',
          solicitante: item.obra?.cliente?.nombre || 'Sin solicitante',
        }));
        setSolicitudes([...clientesData, ...obrasData]);
      })
      .catch((error) =>
        console.error('Error al obtener solicitudes:', error)
      );
  }, []);


  const aceptarSolicitud = (id) => {
    // Buscamos la solicitud en nuestro estado
    const solicitud = solicitudes.find((sol) => sol.id === id);
    if (!solicitud) {
      console.error("Solicitud no encontrada", id);
      return;
    }
    let url = "";
    if (solicitud.tipo === "cliente") {

      const clientId = id.split('-')[1];
      url = `http://127.0.0.1:8000/api/clientes/solicitudes/${clientId}/aprobar/`;
    } else if (solicitud.tipo === "obra") {
      // Extraemos el id numérico de la obra
      const obraId = id.split('-')[1];
      url = `http://127.0.0.1:8000/api/obras/solicitudes/${obraId}/aprobar/`;
    }

    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {

          setSolicitudes(
            solicitudes.map((sol) =>
              sol.id === id
                ? {
                    ...sol,
                    estado: "Aceptada",
                    horaAceptacion: new Date().toLocaleTimeString(),
                  }
                : sol
            )
          );
        } else {
          console.error("Error al aprobar la solicitud");
        }
      })
      .catch((error) => {
        console.error("Error en red:", error);
      });
  };

  const rechazarSolicitud = (id) => {
    setSolicitudes(solicitudes.filter((sol) => sol.id !== id));
  };

  const marcarComoTerminada = (id) => {
    setSolicitudes(
      solicitudes.map((sol) =>
        sol.id === id ? { ...sol, estado: "Terminado" } : sol
      )
    );
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
          <IconButton
            className="icono-aceptar"
            onClick={() => aceptarSolicitud(params.row.id)}
          >
            <CheckCircleIcon color="success" />
          </IconButton>
          <IconButton
            className="icono-rechazar"
            onClick={() => rechazarSolicitud(params.row.id)}
          >
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
          <IconButton
            className="icono-terminar"
            onClick={() => marcarComoTerminada(params.row.id)}
          >
            <DoneIcon color="primary" />
          </IconButton>
        </div>
      ),
    },
  ];

  const columnasTerminadas = [
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'solicitante', headerName: 'Solicitante', flex: 1 },
  ];

  return (
    <div className="solicitudes-container">
      <div className="solicitudes-table">
        <h1>Solicitudes Pendientes</h1>
        <Tabla
          datos={solicitudes.filter(
            (sol) => sol.estado?.toLowerCase() === 'pendiente'
          )}
          columnas={columnasPendientes}
          filtroClave="nombre"
          filtroPlaceholder="Nombre del cliente"
          getRowId={(row) => row.id}
        />

        <h1>Solicitudes Aceptadas</h1>
        <Tabla
          datos={solicitudes.filter((sol) => sol.estado === 'Aceptada')}
          columnas={columnasAceptadas}
          filtroClave="nombre"
          filtroPlaceholder="Nombre del cliente"
          getRowId={(row) => row.id}
        />

        <h1>Solicitudes Terminadas</h1>
        <Tabla
          datos={solicitudes.filter((sol) => sol.estado === 'Terminado')}
          columnas={columnasTerminadas}
          filtroClave="nombre"
          filtroPlaceholder="Nombre del cliente"
          className="tabla-terminadas"
          getRowId={(row) => row.id}
        />

      </div>
    </div>
  );
};

export default Solicitudes;
