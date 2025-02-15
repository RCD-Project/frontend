import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Tabla from '../components/Table';
import { Button, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';

const Transportistas = () => {
  const [transportistas, setTransportistas] = useState([
    { id: 1, nombre: 'Carlos Díaz', contacto: '123456789', tipoMaterial: 'Madera' },
    { id: 2, nombre: 'Marta Gómez', contacto: '987654321', tipoMaterial: 'Plástico' },
  ]);

  const navigate = useNavigate();

  const eliminarTransportista = (id) => {
    const confirmacion = window.confirm("¿Seguro que deseas eliminar este transportista?");
    if (confirmacion) {
      setTransportistas(transportistas.filter((transportista) => transportista.id !== id));
    }
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
    { field: 'tipoMaterial', headerName: 'Tipo de material', flex: 1 },
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
      <h1>Listado de Transportistas</h1>
      <Tabla
        datos={transportistas}
        columnas={columnasTransportistas}
        filtroClave="nombre"
        filtroPlaceholder="Nombre del transportista"
      />

      {/* Menú de Acciones */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { handleMenuClose(); navigate(`/detalletransportista?id=${selectedTransportista?.id}`); }}>
          <VisibilityIcon /> Ver detalles
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); navigate(`/editartransportista?id=${selectedTransportista?.id}`); }}>
          <EditIcon /> Editar
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); eliminarTransportista(selectedTransportista?.id); }}>
          <DeleteIcon style={{ color: 'red' }} /> Eliminar
        </MenuItem>
      </Menu>

      <Link to="/altatransportista">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          style={{ marginTop: '20px' }}
        >
          Añadir Transportista
        </Button>
      </Link>
    </div>
  );
};

export default Transportistas;
