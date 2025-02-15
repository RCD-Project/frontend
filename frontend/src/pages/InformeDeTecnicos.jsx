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

const InformeDeTecnicos = () => {
  const [informes, setInformes] = useState([
    { id: 1, tecnico: 'Carlos Díaz', obra: 'Edificio Central', fecha: '2024-02-15', hora: '10:00 AM' },
    { id: 2, tecnico: 'Marta Gómez', obra: 'Puente Costanera', fecha: '2024-02-16', hora: '02:30 PM' },
  ]);

  const navigate = useNavigate();

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
    { field: 'tecnico', headerName: 'Técnico', flex: 1 },
    { field: 'obra', headerName: 'Obra', flex: 1 },
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
      <h1>Informe de Técnicos</h1>
      <Tabla
        datos={informes}
        columnas={columnasInformes}
        filtroClave="tecnico"
        filtroPlaceholder="Nombre del técnico"
      />

      {/* Menú de Acciones */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { handleMenuClose(); navigate(`/detalleinforme?id=${selectedInforme?.id}`); }}>
          <VisibilityIcon /> Ver informe
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); navigate(`/editarinforme?id=${selectedInforme?.id}`); }}>
          <EditIcon /> Editar
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); eliminarInforme(selectedInforme?.id); }}>
          <DeleteIcon style={{ color: 'red' }} /> Eliminar
        </MenuItem>
      </Menu>

      <Link to="/subirinforme">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          style={{ marginTop: '20px' }}
        >
          Subir Informe
        </Button>
      </Link>
    </div>
  );
};

export default InformeDeTecnicos;
