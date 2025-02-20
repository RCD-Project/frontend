import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Tabla from '../components/Table';
import { Button, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import '../styles/EmpresasGestoras.css';

const EmpresasGestoras = () => {
  const [empresas, setEmpresas] = useState([]);
  const navigate = useNavigate();

  // Se hace fetch a la API para obtener la lista de empresas gestoras
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/empresas/lista/')
      .then(response => response.json())
      .then(data => setEmpresas(data))
      .catch(error => console.error('Error fetching empresas:', error));
  }, []);

  const eliminarEmpresa = (id) => {
    const confirmacion = window.confirm("¿Seguro que deseas eliminar esta empresa?");
    if (confirmacion) {
      setEmpresas(empresas.filter((empresa) => empresa.id !== id));
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);

  const handleMenuOpen = (event, empresa) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmpresa(empresa);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEmpresa(null);
  };

  const columnasEmpresas = [
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'ubicacion', headerName: 'Ubicación', flex: 1 },
    { field: 'contacto', headerName: 'Contacto', flex: 1 },
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
      <h1>Empresas Gestoras</h1>
      <Tabla
        datos={empresas}
        columnas={columnasEmpresas}
        filtroClave="nombre"
        filtroPlaceholder="Nombre de la empresa"
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { handleMenuClose(); navigate(`/detalleempresa?id=${selectedEmpresa?.id}`); }}>
          <VisibilityIcon /> Ver detalles
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); navigate(`/editarempresa?id=${selectedEmpresa?.id}`); }}>
          <EditIcon /> Editar
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); eliminarEmpresa(selectedEmpresa?.id); }}>
          <DeleteIcon style={{ color: 'red' }} /> Eliminar
        </MenuItem>
      </Menu>

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
        component={Link}
        to="/altaempresas"
        style={{ marginTop: '20px' }}
      >
        Añadir Empresa
      </Button>
    </div>
  );
};

export default EmpresasGestoras;
