import React, { useState, useEffect, useContext } from 'react';
import Tabla from '../components/Table';
import { IconButton, Tab, Tabs, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import '../styles/Solicitudes.css';
import { AuthContext } from '../pages/context/AuthContext';

const Solicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [value, setValue] = useState(0);
  const { token } = useContext(AuthContext);

  // Función para formatear la fecha a dd/MM/yyyy
  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  useEffect(() => {
    // Si no hay token, no realizamos las solicitudes
    if (!token) return;

    Promise.all([
      fetch('http://127.0.0.1:8000/api/clientes/solicitudes/', {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
      }).then((res) => res.json()),
      fetch('http://127.0.0.1:8000/api/obras/solicitudes/', {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
      }).then((res) => res.json()),
    ])
      .then(([clientesSolicitudes, obrasSolicitudes]) => {
        const clientesData = clientesSolicitudes.map((item) => ({
          ...item,
          tipo: 'cliente',
          id: item.cliente_id
            ? `cliente-${item.cliente_id}`
            : `cliente-${item.cliente?.cliente_id || Math.random()}`,
          nombre:
            item.cliente_nombre ||
            (item.cliente && item.cliente.cliente_nombre) ||
            'Sin nombre',
          solicitante: item.cliente_nombre || 'Sin solicitante',
          fecha: formatDate(item.cliente?.fecha_solicitud || item.fecha_solicitud),
        }));

        const obrasData = obrasSolicitudes.map((item) => ({
          ...item,
          tipo: 'obra',
          id: item.obra
            ? `obra-${item.obra}`
            : `obra-${item.obra?.obra || Math.random()}`,
          nombre: item.obra?.obra || item.obra || 'Sin nombre',
          solicitante: item.cliente  || 'Sin solicitante',
        }));

        setSolicitudes([...clientesData, ...obrasData]);
      })
      .catch((error) =>
        console.error('Error al obtener solicitudes:', error)
      );
  }, [token]);

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
      const obraId = id.split('-')[1];
      url = `http://127.0.0.1:8000/api/obras/solicitudes/${obraId}/aprobar/`;
    }

    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          setSolicitudes(
            solicitudes.map((sol) =>
              sol.id === id
                ? {
                    ...sol,
                    estado: "aceptado",
                    // Actualizamos la fecha de aceptación con el formato deseado
                    fecha: formatDate(new Date().toISOString()),
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
    // Buscamos la solicitud en nuestro estado
    const solicitud = solicitudes.find((sol) => sol.id === id);
    if (!solicitud) {
      console.error("Solicitud no encontrada", id);
      return;
    }
    let url = "";
    if (solicitud.tipo === "cliente") {
      const clientId = id.split('-')[1];
      url = `http://127.0.0.1:8000/api/clientes/solicitudes/${clientId}/rechazar/`;
    } else if (solicitud.tipo === "obra") {
      const obraId = id.split('-')[1];
      url = `http://127.0.0.1:8000/api/obras/solicitudes/${obraId}/rechazar/`;
    }

    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          setSolicitudes(
            solicitudes.map((sol) =>
              sol.id === id ? { ...sol, estado: "Rechazado" } : sol
            )
          );
        } else {
          console.error("Error al rechazar la solicitud");
        }
      })
      .catch((error) => {
        console.error("Error en red:", error);
      });
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
            <CheckCircleIcon sx={{ color: '#a8c948' }} />
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
    { field: 'fecha', headerName: 'Hora de Aceptación', flex: 1 },
  ];

  const columnasTerminadas = [
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'solicitante', headerName: 'Solicitante', flex: 1 },
  ];

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="solicitudes-container">
      <Box sx={{ width: '100%' }}>
        <Tabs value={value} onChange={handleChangeTab} aria-label="Solicitudes">
          <Tab label="Pendientes" />
          <Tab label="Aceptadas" />
          <Tab label="Terminadas" />
        </Tabs>

        {value === 0 && (
          <div>
            <Tabla
              datos={solicitudes.filter(
                (sol) => sol.estado?.toLowerCase() === 'pendiente'
              )}
              columnas={columnasPendientes}
              filtroClave="nombre"
              filtroPlaceholder="Nombre del cliente"
              getRowId={(row) => row.id}
            />
          </div>
        )}

        {value === 1 && (
          <div>
            <Tabla
              datos={solicitudes.filter(
                (sol) => sol.estado?.toLowerCase() === 'aceptado'
              )}
              columnas={columnasAceptadas}
              filtroClave="nombre"
              filtroPlaceholder="Nombre del cliente"
              getRowId={(row) => row.id}
            />
          </div>
        )}

        {value === 2 && (
          <div>
            <Tabla
              datos={solicitudes.filter((sol) => sol.estado === 'terminado')}
              columnas={columnasTerminadas}
              filtroClave="nombre"
              filtroPlaceholder="Nombre del cliente"
              className="tabla-terminadas"
              getRowId={(row) => row.id}
            />
          </div>
        )}
      </Box>
    </div>
  );
};

export default Solicitudes;
