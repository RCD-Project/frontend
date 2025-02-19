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
    fetch('http://localhost:8000/api/transportistas/')
      .then((response) => response.json())
      .then((data) => setTransportistas(data))
      .catch((error) => console.error('Error al obtener transportistas:', error));
  }, []);

  const toggleEstado = (id) => {
    setTransportistas((prevTransportistas) =>
      prevTransportistas.map((transportista) =>
        transportista.id === id
          ? { ...transportista, estado: transportista.estado === 'activo' ? 'inactivo' : 'activo' }
          : transportista
      )
    );
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
    { field: 'tipoMaterial', headerName: 'Tipo de Material', flex: 1 },
    { field: 'estado', headerName: 'Estado', flex: 1 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={(event) => handleMenuOpen(event, params.row)}>
            <MoreVertIcon />
          </IconButton>
        </>
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
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => navigate('/altatransportistas')}
        style={{ marginTop: '20px' }}
      >
        Añadir Transportista
      </Button>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { handleMenuClose(); navigate(`/detalletransportista?id=${selectedTransportista?.id}`); }}>
          <VisibilityIcon /> Ver detalles
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); toggleEstado(selectedTransportista?.id); }}>
          {selectedTransportista?.estado === 'activo' ? <ToggleOffIcon /> : <ToggleOnIcon />} Cambiar estado
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Transportistas;
