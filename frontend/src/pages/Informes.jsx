// Informes.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
  CircularProgress,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Informes = () => {
  const [formularios, setFormularios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8000/api/formularios/listar/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al cargar los formularios");
        }
        return res.json();
      })
      .then((data) => {
        setFormularios(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

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

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ mb: 2, textAlign: "center" }}>
        Listado de Formularios
      </Typography>
      {formularios.map((formulario) => (
        <Paper key={formulario.id} sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2">Fecha:</Typography>
              <Typography variant="body1">{formulario.fecha || "N/A"}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2">Obra:</Typography>
              <Typography variant="body1">
                {formulario.obra_nombre || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle2">Técnico:</Typography>
              <Typography variant="body1">
                {formulario.tecnico_nombre || "N/A"}
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ textAlign: "right" }}>
            <Button
              variant="contained"
              onClick={() => navigate(`/formularios/detalle/${formulario.id}`)}
            >
              Ver Detalles
            </Button>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default Informes;
