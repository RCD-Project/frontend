import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Tabla from '../components/Table';
import { Button, IconButton, Menu, MenuItem, Alert } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { AuthContext } from '../pages/context/AuthContext';

const ListaDeObras = () => {
  const [obras, setObras] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { role, user } = useContext(AuthContext);

  const successMessage = location.state?.successMessage || "";

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/obras/aprobadas/")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (role === "cliente" && user) {
          setObras(data.filter((obra) => obra.cliente === 1)); //cambiar user.id para probar
        } else {
          setObras(data);
        }
      })
      .catch((err) => console.error("Error al obtener obras aprobadas:", err));
  }, [role, user]);

  const eliminarObra = (id) => {
    const confirmacion = window.confirm("¿Seguro que deseas eliminar esta obra?");
    if (confirmacion) {
      fetch(`http://127.0.0.1:8000/api/obras/${id}/eliminar/`, {
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
          setObras(obras.filter((obra) => obra.id !== id));
        })
        .catch((err) => console.error("Error al eliminar obra:", err));
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
    { field: 'nombre_obra', headerName: 'Nombre', flex: 1 },
    { field: 'direccion', headerName: 'Dirección', flex: 1 },
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
      <h1>Lista de Obras</h1>
      

      { successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert> }
      
      <Tabla
        datos={obras}
        columnas={columnasObras}
        filtroClave="id"
        filtroPlaceholder="Nombre de la obra"
      />

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
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
        startIcon={<AddIcon />}
        component={Link}
        to="/altaobra"
        sx={{
          marginTop: '20px',
          backgroundColor: '#abbf9d',
          '&:hover': { backgroundColor: '#d1e063' },
        }}
      >
        Añadir Obra
      </Button>
    </div>
  );
};

export default ListaDeObras;
