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

const Clientes = () => {
  const [clientes, setClientes] = useState([
    { id: 1, nombre: 'Juan Pérez', ultimaActividad: '2024-01-01', cantidadObras: 5 },
    { id: 2, nombre: 'Ana López', ultimaActividad: '2024-02-01', cantidadObras: 3 },
  ]);

  const navigate = useNavigate(); // 🚀 Hook para la navegación

  const eliminarCliente = (id) => {
    const confirmacion = window.confirm("¿Seguro que deseas eliminar este cliente?");
    if (confirmacion) {
      setClientes(clientes.filter((cliente) => cliente.id !== id));
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCliente, setSelectedCliente] = useState(null);

  const handleMenuOpen = (event, cliente) => {
    setAnchorEl(event.currentTarget);
    setSelectedCliente(cliente);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCliente(null);
  };

  const columnasClientes = [
    { field: 'nombre', headerName: 'Nombres', flex: 1 },
    { field: 'ultimaActividad', headerName: 'Fecha de ingreso', flex: 1 },
    { field: 'cantidadObras', headerName: 'Cantidad de obras', flex: 1 },
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
      <h1>Listado de Clientes</h1>
      <Tabla
        datos={clientes}
        columnas={columnasClientes}
        filtroClave="nombre"
        filtroPlaceholder="Nombre del cliente"
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { handleMenuClose(); navigate(`/detallescliente?id=${selectedCliente?.id}`); }}>
          <VisibilityIcon /> Ver detalles
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); navigate(`/editarcliente?id=${selectedCliente?.id}`); }}>
          <EditIcon /> Editar
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); eliminarCliente(selectedCliente?.id); }}>
          <DeleteIcon style={{ color: 'red' }} /> Eliminar
        </MenuItem>
      </Menu>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        component={Link}
        to="/altacliente"
        style={{ marginTop: '20px' }}
      >
        Añadir Cliente
      </Button>
    </div>
  );
};

export default Clientes;
