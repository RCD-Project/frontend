import React, { useState, useEffect } from "react";
import { Button, IconButton, Menu, MenuItem, Box, Tabs, Tab } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useNavigate, Link } from "react-router-dom";
import Tabla from "../components/Table";
const PuntoLimpio = () => {
  const [puntosLimpios, setPuntosLimpios] = useState([]);
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/api/puntos-limpios/")
      .then((response) => response.json())
      .then((data) => setPuntosLimpios(data))
      .catch((error) => console.error("Error al obtener puntos limpios:", error));
  }, []);

  const toggleEstado = (id) => {
    const puntoLimpio = puntosLimpios.find((p) => p.id === id);
    const newEstado = puntoLimpio.estado === "activo" ? "inactivo" : "activo";

    fetch(`http://127.0.0.1:8000/api/puntos-limpios/modificar/${id}/`, {
      method: "PATCH", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ estado: newEstado }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setPuntosLimpios((prevPuntosLimpios) =>
          prevPuntosLimpios.map((p) =>
            p.id === id ? { ...p, estado: newEstado } : p
          )
        );
      })
      .catch((error) => {
        console.error("Error al actualizar el estado del punto limpio:", error);
      });
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPuntoLimpio, setSelectedPuntoLimpio] = useState(null);

  const handleMenuOpen = (event, punto) => {
    setAnchorEl(event.currentTarget);
    setSelectedPuntoLimpio(punto);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPuntoLimpio(null);
  };

  const columnasPuntosLimpios = [
    { field: "obra_nombre", headerName: "Nombre de la Obra", flex: 1 },
    { field: "tipo_material", headerName: "Tipo de Material", flex: 1 },
    { field: "tipo_contenedor", headerName: "Tipo de Contenedor", flex: 1 },
    { field: "estado", headerName: "Estado", flex: 1 },
    {
      field: "acciones",
      headerName: "Acciones",
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

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={value}
          onChange={handleChangeTab}
          aria-label="Puntos Limpios"
          textColor="primary"
          indicatorColor="primary"
          sx={{
            "& .MuiTab-root": {
              color: "#000000",
            },
            "& .Mui-selected": {
              backgroundColor: "#abbf9d",
              color: "#ffffff",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#abbf9d",
            },
          }}
        >
          <Tab label="Activos" />
          <Tab label="Inactivos" />
        </Tabs>

        {value === 0 && (
          <div>
            <Tabla
              datos={puntosLimpios.filter((p) => p.estado === "activo")}
              columnas={columnasPuntosLimpios}
              filtroClave="obra_nombre"
              filtroPlaceholder="Buscar por nombre de obra"
            />
          </div>
        )}

        {value === 1 && (
          <div>
            <Tabla
              datos={puntosLimpios.filter((p) => p.estado === "inactivo")}
              columnas={columnasPuntosLimpios}
              filtroClave="obra_nombre"
              filtroPlaceholder="Buscar por nombre de obra"
            />
          </div>
        )}
      </Box>

      <Button
        variant="contained"
        sx={{
          marginTop: "20px",
          backgroundColor: "#abbf9d",
          "&:hover": {
            backgroundColor: "#d1e063",
          },
        }}
        startIcon={<AddIcon />}
        component={Link}
        to="/altapuntolimpio"
      >
        Añadir Punto Limpio
      </Button>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate(`/detallespuntolimpio?id=${selectedPuntoLimpio?.id}`);
          }}
        >
          <VisibilityIcon /> Ver detalles
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            toggleEstado(selectedPuntoLimpio?.id);
          }}
        >
          {selectedPuntoLimpio?.estado === "activo" ? (
            <ToggleOffIcon />
          ) : (
            <ToggleOnIcon />
          )}
          Cambiar estado
        </MenuItem>
      </Menu>
    </div>
  );
};

export default PuntoLimpio;
