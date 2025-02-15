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

const ListaDeObras = () => {
  const [obras, setObras] = useState([
    { id: 1, nombre: 'Edificio Central', ubicacion: 'Montevideo' },
    { id: 2, nombre: 'Puente Costanera', ubicacion: 'Canelones' },
    { id: 3, nombre: 'Torre Norte', ubicacion: 'Maldonado' },
    { id: 4, nombre: 'Hospital Nuevo', ubicacion: 'Paysandú' },
  ]);

  const navigate = useNavigate();

  const eliminarObra = (id) => {
    const confirmacion = window.confirm("¿Seguro que deseas eliminar esta obra?");
    if (confirmacion) {
      setObras(obras.filter((obra) => obra.id !== id));
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedObra, setSelectedObra] = useState(null);

  const handleMenuOpen = (event, obra) => {
    setAnchorEl(event.currentTarget);
    setSelectedObra(obra);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedObra(null);
  };

  const columnasObras = [
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'ubicacion', headerName: 'Ubicación', flex: 1 },
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
      <h1>Lista de Obras en Progreso</h1>
      <Tabla
        datos={obras}
        columnas={columnasObras}
        filtroClave="nombre"
        filtroPlaceholder="Nombre de la obra"
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { handleMenuClose(); navigate(`/detallesobra?id=${selectedObra?.id}`); }}>
          <VisibilityIcon /> Ver detalles
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); navigate(`/editarobra?id=${selectedObra?.id}`); }}>
          <EditIcon /> Editar
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); eliminarObra(selectedObra?.id); }}>
          <DeleteIcon style={{ color: 'red' }} /> Eliminar
        </MenuItem>
      </Menu>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        component={Link}
        to="/altaobra"
        style={{ marginTop: '20px' }}
      >
        Añadir Obra
      </Button>
    </div>
  );
};

export default ListaDeObras;
