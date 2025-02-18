import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Tabla from '../components/Table';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

const Informes = () => {
  const [informes, setInformes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/api/informes/')
      .then((response) => response.json())
      .then((data) => {
        const informesOrdenados = data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        setInformes(informesOrdenados);
      })
      .catch((error) => console.error('Error al obtener informes:', error));
  }, []);

  const eliminarInforme = (id) => {
    const confirmacion = window.confirm("¿Seguro que deseas eliminar este informe?");
    if (confirmacion) {
      setInformes(informes.filter((informe) => informe.id !== id));
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedInforme, setSelectedInforme] = useState(null);

  const handleMenuOpen = (event, informe) => {
    setAnchorEl(event.currentTarget);
    setSelectedInforme(informe);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedInforme(null);
  };

  const columnasInformes = [
    { field: 'nombreTecnico', headerName: 'Nombre del Técnico', flex: 1 },
    { field: 'nombreObra', headerName: 'Nombre de la Obra', flex: 1 },
    { field: 'fecha', headerName: 'Fecha', flex: 1 },
    { field: 'hora', headerName: 'Hora', flex: 1 },
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
      <h1>Listado de Informes</h1>
      <Tabla
        datos={informes}
        columnas={columnasInformes}
        filtroClave="nombreObra"
        filtroPlaceholder="Nombre de la obra"
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { handleMenuClose(); navigate(`/detallesinforme?id=${selectedInforme?.id}`); }}>
          <VisibilityIcon /> Ver detalles
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); eliminarInforme(selectedInforme?.id); }}>
          <DeleteIcon style={{ color: 'red' }} /> Eliminar
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Informes;
