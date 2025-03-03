// DetallesFormulario.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Grid,
  Button,
} from "@mui/material";

// Definición de gridFields en el ámbito del archivo
const gridFields = [
  "grillaPuntosLimpiosPisos",
  "grilla",
  "escombro_checks",
  "plastico_opciones",
  "papel_carton_opciones",
  "metales_opciones",
  "madera_opciones",
  "mezclados_opciones",
  "puntoAcopioGrid",
  "puntoAcopioOpciones",
];

// Colores basados en #abbf9d y sus variantes
const baseColor = "#abbf9d";
const simplePaperBackground = "#e8f0e2"; // Fondo claro para campos simples
const gridPaperBackground = "#d0e1cf";   // Fondo para campos tipo grilla
const arrayPaperBackground = "#c2d4bb";  // Fondo para campos tipo array
const textColor = "#000";                // Todo el texto será negro

// Función para transformar el nombre del campo a un título legible con la primera letra en mayúscula
const displayFieldName = (key) => {
  let label = "";
  switch (key) {
    case "obra_nombre":
      label = "Obra";
      break;
    case "tecnico_nombre":
      label = "Técnico";
      break;
    default:
      label = key.replace(/_/g, " ");
      break;
  }
  return label
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const DetallesFormulario = () => {
  const { pk } = useParams();
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtención de datos del formulario
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8000/api/formularios/detalle/${pk}/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al cargar el formulario");
        }
        return res.json();
      })
      .then((data) => {
        setFormulario(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [pk]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" sx={{ textAlign: "center", mt: 4 }}>
        {error}
      </Typography>
    );
  }

  // Render para campos de tipo grilla (objeto)
  const renderGridField = (label, value) => (
    <Paper sx={{ p: 2, backgroundColor: gridPaperBackground, mb: 2 }} key={label}>
      <Typography variant="h6" sx={{ mb: 1, color: textColor }}>
        {label}
      </Typography>
      <Grid container spacing={2}>
        {Object.entries(value).map(([subKey, subValue]) => (
          <Grid item xs={6} key={subKey}>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: textColor }}>
              {subKey.charAt(0).toUpperCase() + subKey.slice(1)}
            </Typography>
            <Typography variant="body2" sx={{ color: textColor }}>
              {subValue}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );

  // Render para campos de tipo array
  const renderArrayField = (label, value) => (
    <Paper sx={{ p: 2, backgroundColor: arrayPaperBackground, mb: 2 }} key={label}>
      <Typography variant="h6" sx={{ mb: 1, color: textColor }}>
        {label}
      </Typography>
      <Grid container spacing={2}>
        {value.map((item, index) => (
          <Grid item xs={12} key={index}>
            <Typography variant="body2" sx={{ color: textColor }}>
              {item}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );

  // Render para campos simples
  const renderSimpleField = (label, value) => (
    <Paper sx={{ p: 2, backgroundColor: simplePaperBackground, mb: 2 }} key={label}>
      <Typography variant="h6" sx={{ color: textColor }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: textColor }}>
        {value}
      </Typography>
    </Paper>
  );

  // Función que decide si un campo tiene datos "ingresados"
  const hasData = (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === "string" && value.trim() === "") return false;
    if (Array.isArray(value) && value.length === 0) return false;
    if (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0)
      return false;
    return true;
  };

  return (
    <Box sx={{ p: 2 }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Volver
      </Button>
      <Typography variant="h4" sx={{ mb: 2, textAlign: "center", color: textColor }}>
        Detalles Del Formulario
      </Typography>
      <Box>
        {Object.entries(formulario)
          .filter(([key, value]) => {
            // No mostrar estos campos ni si están vacíos
            if (["id", "obra", "tecnico"].includes(key)) return false;
            return hasData(value);
          })
          .map(([key, value]) => {
            const label = displayFieldName(key);
            if (gridFields.includes(key)) {
              if (Array.isArray(value)) {
                return renderArrayField(label, value);
              }
              if (typeof value === "object" && value !== null) {
                return renderGridField(label, value);
              }
            }
            if (typeof value === "object" && value !== null) {
              return renderGridField(label, value);
            }
            return renderSimpleField(label, value);
          })}
      </Box>
    </Box>
  );
};

export default DetallesFormulario;
