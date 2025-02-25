import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Tabla from '../components/Table';
import { IconButton, Menu, MenuItem, Button, Tabs, Tab, Box } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import AddIcon from '@mui/icons-material/Add';

const Transportistas = () => {
  const [transportistas, setTransportistas] = useState([]);
  const [value, setValue] = useState(0);
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

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };  
  

  return (
    <div>
      <Box sx={{ width: '100%' }}>
      <Tabs
        value={value}
        onChange={handleChangeTab}
        aria-label="Transportistas"
        textColor="primary"
        indicatorColor="primary" // Cambia el color del indicador
        sx={{
          '& .MuiTab-root': {
            color: '#000',  // Color de texto de las pestañas inactivas (negro o el color que elijas)
          },
          '& .Mui-selected': {
            backgroundColor: '#abbf9d',  // Color de fondo cuando la pestaña está seleccionada
            color: '#fff',  // Color de texto cuando está seleccionada (blanco)
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#abbf9d',  // Cambia el color de la línea debajo de la pestaña seleccionada
          },
        }}
      >
        <Tab label="Activos" />
        <Tab label="Inactivos" />
      </Tabs>

        {value === 0 && (
          <div>
            <Tabla
              datos={transportistas.filter((t) => t.estado === 'activo')}
              columnas={columnasTransportistas}
              filtroClave="nombre"
              filtroPlaceholder="Nombre del transportista"
            />
          </div>
        )}

        {value === 1 && (
          <div>
            <Tabla
              datos={transportistas.filter((t) => t.estado === 'inactivo')}
              columnas={columnasTransportistas}
              filtroClave="nombre"
              filtroPlaceholder="Nombre del transportista"
            />
          </div>
        )}
      </Box>

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
