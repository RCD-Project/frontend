import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Tabla from '../components/Table';
import { IconButton, Menu, MenuItem, Button } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import AddIcon from '@mui/icons-material/Add';

const Transportistas = () => {
  const [transportistas, setTransportistas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/api/transportistas/lista/')
      .then((response) => response.json())
      .then((data) => setTransportistas(data))
      .catch((error) => console.error('Error al obtener transportistas:', error));
  }, []);

  const toggleEstado = (id) => {
    // Encontrar el transportista seleccionado
    const transportista = transportistas.find((t) => t.id === id);
    const newEstado = transportista.estado === 'activo' ? 'inactivo' : 'activo';

    // Llamada a la API para actualizar el estado
    fetch(`http://127.0.0.1:8000/api/transportistas/modificar/${id}/`, {
      method: 'PATCH', // O 'PATCH' según lo que requiera tu API
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estado: newEstado }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Actualizar el estado local para reflejar el cambio
        setTransportistas((prevTransportistas) =>
          prevTransportistas.map((t) =>
            t.id === id ? { ...t, estado: newEstado } : t
          )
        );
      })
      .catch((error) => {
        console.error("Error al actualizar el estado del transportista:", error);
      });
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTransportista, setSelectedTransportista] = useState(null);

  const handleMenuOpen = (event, transportista) => {
    setAnchorEl(event.currentTarget);
    setSelectedTransportista(transportista);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTransportista(null);
  };

  const columnasTransportistas = [
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'contacto', headerName: 'Contacto', flex: 1 },
    { field: 'tipo_material', headerName: 'Tipo de Material', flex: 1 },
    { field: 'estado', headerName: 'Estado', flex: 1 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <IconButton onClick={(event) => handleMenuOpen(event, params.row)}>
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <div>
      <h1>Transportistas Activos</h1>
      <Tabla
        datos={transportistas.filter((t) => t.estado === 'activo')}
        columnas={columnasTransportistas}
        filtroClave="nombre"
        filtroPlaceholder="Nombre del transportista"
      />

      <h1>Transportistas Inactivos</h1>
      <Tabla
        datos={transportistas.filter((t) => t.estado === 'inactivo')}
        columnas={columnasTransportistas}
        filtroClave="nombre"
        filtroPlaceholder="Nombre del transportista"
      />

      <Button
        variant="contained"
        sx={{
          marginTop: '20px',
          backgroundColor: '#abbf9d', // Verde personalizado
          '&:hover': {
            backgroundColor: '#d1e063', // Color al hacer hover
          },
        }}
        startIcon={<AddIcon />}
        onClick={() => navigate('/altatransportistas')}
      >
        Añadir Transportista
      </Button>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate(`/detalletransportista?id=${selectedTransportista?.id}`);
          }}
        >
          <VisibilityIcon /> Ver detalles
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            toggleEstado(selectedTransportista?.id);
          }}
        >
          {selectedTransportista?.estado === 'activo' ? <ToggleOffIcon /> : <ToggleOnIcon />} Cambiar estado
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Transportistas;
