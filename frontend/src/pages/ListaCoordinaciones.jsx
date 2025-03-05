import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Tabla from '../components/Table';
import { Typography, Button, IconButton, Menu, MenuItem, Alert, CircularProgress } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { AuthContext } from '../pages/context/AuthContext';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

const ListaDeCoordinaciones = () => {
  const [coordinaciones, setCoordinaciones] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useContext(AuthContext);

  const successMessage = location.state?.successMessage || "";

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/coordinacionretiro/aceptadas/", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {

        setCoordinaciones(data);
      })
      .catch((err) =>
        console.error("Error al obtener coordinaciones aceptadas:", err)
      );
  }, [token]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCoordinacion, setSelectedCoordinacion] = useState(null);

  const handleMenuOpen = (event, coordinacion) => {
    setAnchorEl(event.currentTarget);
    setSelectedCoordinacion(coordinacion);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCoordinacion(null);
  };

  const columnasCoordinaciones = [
    {
      field: "nombre_obra",
      headerName: "Obra",
      flex: 1,
      renderCell: (params) => params.row.nombre_obra || "Sin nombre",
    },
    { field: 'tipo_material', headerName: 'Tipo de Material', flex: 1 },
    {
      field: "transportista_nombre",
      headerName: "Transportista",
      flex: 1,
      renderCell: (params) => params.row.transportista_nombre || "Sin nombre",
    },
    {
      field: 'fecha_solicitud',
      headerName: 'Fecha de Solicitud',
      flex: 1,
      renderCell: (params) =>
        params.row.fecha_solicitud
          ? dayjs(params.row.fecha_solicitud).format('DD/MM/YYYY')
          : "-",
    },
    {
      field: 'fecha_retiro',
      headerName: 'Fecha de Retiro',
      flex: 1,
      renderCell: (params) =>
        params.row.fecha_retiro
          ? dayjs(params.row.fecha_retiro).format('DD/MM/YYYY')
          : "-",
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      flex: 1,
      sortable: false,
      align: 'center',
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <IconButton onClick={(event) => handleMenuOpen(event, params.row)}>
            <MoreVertIcon />
          </IconButton>
        </div>
      ),
    },
  ];
  
  

  return (
    <div>
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 4 }}>
        Lista de Coordinaciones Aceptadas
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Tabla
        datos={coordinaciones}
        columnas={columnasCoordinaciones}
        filtroClave="obra"
        filtroPlaceholder="Buscar por obra"
      />

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { 
            handleMenuClose(); 
            navigate(`/detallescoordinacion?id=${selectedCoordinacion?.id}`);
          }}>
          <VisibilityIcon /> Ver detalles
        </MenuItem>
        <MenuItem onClick={() => { 
            handleMenuClose(); 
            navigate(`/editarcoordinacion?id=${selectedCoordinacion?.id}`);
          }}>
          <EditIcon /> Editar
        </MenuItem>
        <MenuItem onClick={() => { 
            handleMenuClose(); 
            /* Lógica de eliminación aquí */
          }}>
          <DeleteIcon style={{ color: 'red' }} /> Eliminar
        </MenuItem>
      </Menu>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        component={Link}
        to="/altacoordinaciones"
        sx={{
          marginTop: '20px',
          backgroundColor: '#abbf9d',
          '&:hover': { backgroundColor: '#d1e063' },
        }}
      >
        Añadir Coordinación
      </Button>
    </div>
  );
};

export default ListaDeCoordinaciones;
