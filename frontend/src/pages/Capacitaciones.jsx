import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Tabla from '../components/Table';
import { Button, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';

const Capacitaciones = () => {
  const [capacitaciones, setCapacitaciones] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/api/capacitaciones/lista/')
      .then((response) => response.json())
      .then((data) => setCapacitaciones(data))
      .catch((error) => console.error('Error al obtener capacitaciones:', error));
  }, []);

  const eliminarCapacitacion = (id) => {
    const confirmacion = window.confirm("¿Seguro que deseas eliminar esta capacitación?");
    if (confirmacion) {
      fetch(`http://localhost:8000/api/capacitaciones/${id}/eliminar/`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
          }
          return res.text();
        })
        .then(() => {
          setCapacitaciones(capacitaciones.filter((capacitacion) => capacitacion.id !== id));
        })
        .catch((error) => console.error("Error al eliminar capacitación:", error));
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCapacitacion, setSelectedCapacitacion] = useState(null);

  const handleMenuOpen = (event, capacitacion) => {
    setAnchorEl(event.currentTarget);
    setSelectedCapacitacion(capacitacion);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCapacitacion(null);
  };

  const columnasCapacitaciones = [
    { field: 'fecha', headerName: 'Fecha', flex: 1 },
    { field: 'motivo', headerName: 'Motivo', flex: 1 },
    { field: 'obra', headerName: 'Obra', flex: 1 },
    { field: 'tecnico', headerName: 'Técnico', flex: 1 },
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
      <h1>Listado de Capacitaciones</h1>
      <Tabla
        datos={capacitaciones}
        columnas={columnasCapacitaciones}
        filtroClave="motivo"
        filtroPlaceholder="Buscar capacitación"
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem 
          onClick={() => {
            handleMenuClose();
            navigate(`/detallescapacitaciones?id=${selectedCapacitacion?.id}`);
          }}
        >
          <VisibilityIcon /> Ver detalles
        </MenuItem>

        <MenuItem 
          onClick={() => {
            handleMenuClose();
            eliminarCapacitacion(selectedCapacitacion?.id);
          }}
        >
          <DeleteIcon style={{ color: 'red' }} /> Eliminar
        </MenuItem>
      </Menu>

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
