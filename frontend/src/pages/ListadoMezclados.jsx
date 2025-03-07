import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Tabla from "../components/Table";
import { Typography, Button, IconButton, Menu, MenuItem, Alert } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { AuthContext } from "../pages/context/AuthContext";

const ListaMezclados = () => {
  const [mezclados, setMezclados] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useContext(AuthContext);

  const successMessage = location.state?.successMessage || "";

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/mezclados/listar/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setMezclados(data.results);
      })
      .catch((err) => console.error("Error al obtener mezclados:", err));
  }, [token]);

  const eliminarMezclado = (id) => {
    const confirmacion = window.confirm("¿Seguro que deseas eliminar este mezclado?");
    if (confirmacion) {
      fetch(`http://127.0.0.1:8000/api/mezclados/${id}/eliminar/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
          }
          return res.text();
        })
        .then(() => {
          setMezclados(mezclados.filter((mezclado) => mezclado.id !== id));
        })
        .catch((err) => console.error("Error al eliminar mezclado:", err));
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMezclado, setSelectedMezclado] = useState(null);

  const handleMenuOpen = (event, mezclado) => {
    setAnchorEl(event.currentTarget);
    setSelectedMezclado(mezclado);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMezclado(null);
  };

  const columnasMezclados = [
    { field: "cliente", headerName: "Cliente", flex: 1, valueGetter: (params) => params.row.cliente?.nombre || "Sin Cliente" },
    { field: "fecha_registro", headerName: "Fecha", flex: 1 },
    { field: "pesaje", headerName: "Pesaje (kg)", flex: 1 },
    {
      field: "acciones",
      headerName: "Acciones",
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
      <Typography variant="h4" sx={{ textAlign: "center", mb: 4 }}>
        Lista de Mezclados
      </Typography>

      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

      <Tabla datos={mezclados} columnas={columnasMezclados} filtroClave="cliente" filtroPlaceholder="Nombre del cliente" />

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { handleMenuClose(); navigate(`/detallesmezclado?id=${selectedMezclado?.id}`); }}>
          <VisibilityIcon /> Ver detalles
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); eliminarMezclado(selectedMezclado?.id); }}>
          <DeleteIcon style={{ color: "red" }} /> Eliminar
        </MenuItem>
      </Menu>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        component={Link}
        to="/altamezclado"
        sx={{
          marginTop: "20px",
          backgroundColor: "#abbf9d",
          "&:hover": { backgroundColor: "#d1e063" },
        }}
      >
        Registrar Mezclado
      </Button>
    </div>
  );
};

export default ListaMezclados;
