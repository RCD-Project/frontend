import React from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Grid,
  Paper,
  Checkbox,
  Button,
} from "@mui/material";
import { useFormStore } from "../context/FormContext";

const opcionesPuntoLimpio = ["Si hay", "No hay"];
const titulosColumnas = [
  "Correcta",
  "A mejorar (Con observaciones)",
  "Incorrecta",
  "No aplica"
];
const titulosFilas = [
  "Ubicacion",
  "Estructura",
  "Tipo de Contenedor",
  "Estado Contenedores (bolsones, etc)",
  "Señalética"
];

const Page3 = () => {
  const { data, updateData } = useFormStore();
  const pageIndex = "page3";

  // Obtenemos los datos almacenados o usamos default
  const storedData = data[pageIndex] || {};
  const formData = {
    puntoLimpio: storedData.puntoLimpio ?? "",
    puntoLimpioObservaciones: storedData.puntoLimpioObservaciones ?? "",
    // Nos aseguramos de que sea un array, si no lo es, usamos un array vacío
    grillaPuntosLimpios: Array.isArray(storedData.grillaPuntosLimpios)
      ? storedData.grillaPuntosLimpios
      : [],
  };

  const handleChange = (field, value) => {
    updateData(pageIndex, { ...formData, [field]: value });
  };

  const handleCheckboxChange = (index, row, col) => {
    const newGrilla = [...formData.grillaPuntosLimpios];
    newGrilla[index] = newGrilla[index] || {};

    const newRowState = {};
    titulosColumnas.forEach((_, i) => (newRowState[i] = false));

    newRowState[col] = true;
    newGrilla[index][row] = newRowState;
    handleChange("grillaPuntosLimpios", newGrilla);
  };

  const agregarGrilla = () => {
    handleChange("grillaPuntosLimpios", [...formData.grillaPuntosLimpios, {}]);
  };

  const eliminarGrilla = (index) => {
    const newGrilla = [...formData.grillaPuntosLimpios];
    newGrilla.splice(index, 1);
    handleChange("grillaPuntosLimpios", newGrilla);
  };

  return (
    <Box sx={{ width: "90%", margin: "auto", mt: 4 }}>
      <h2>Formulario Técnico - Página 3</h2>

      {/* Dropdown para puntos limpios generales */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Son los puntos limpios generales, ubicados en espacios comunes sobre terreno, o en planta baja en edificios
      </Typography>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Punto limpio general</InputLabel>
        <Select
          value={formData.puntoLimpio}
          onChange={(e) => handleChange("puntoLimpio", e.target.value)}
        >
          {opcionesPuntoLimpio.map((op, index) => (
            <MenuItem
              key={index}
              value={op}
              disabled={op === "No hay" && formData.grillaPuntosLimpios.length > 0}
            >
              {op}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Botón para agregar puntos limpios: se deshabilita si se ha seleccionado "No hay" */}
      <Button
        variant="outlined"
        color="success"
        onClick={agregarGrilla}
        sx={{ mb: 2 }}
        disabled={formData.puntoLimpio === "No hay"}
      >
        Agregar Punto Limpio
      </Button>

      {/* Generar múltiples grillas dinámicamente */}
      {formData.grillaPuntosLimpios.map((grilla, grillaIndex) => (
        <Paper key={grillaIndex} elevation={3} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Punto Limpio {grillaIndex + 1}
          </Typography>
          <Grid container spacing={1}>
            <Grid container item>
              <Grid item xs={3} sx={{ fontWeight: "bold", textAlign: "center", p: 1 }}>
                -
              </Grid>
              {titulosColumnas.map((titulo, index) => (
                <Grid
                  item
                  xs={2.25}
                  key={index}
                  sx={{ textAlign: "center", fontWeight: "bold", p: 1 }}
                >
                  {titulo}
                </Grid>
              ))}
            </Grid>
            {titulosFilas.map((fila, rowIndex) => (
              <Grid container item key={rowIndex} alignItems="center">
                <Grid item xs={3} sx={{ fontWeight: "bold", textAlign: "center", p: 1 }}>
                  {fila}
                </Grid>
                {titulosColumnas.map((_, colIndex) => (
                  <Grid item xs={2.25} key={colIndex} sx={{ textAlign: "center", p: 1 }}>
                    <Checkbox
                      checked={!!formData.grillaPuntosLimpios[grillaIndex]?.[fila]?.[colIndex]}
                      onChange={() => handleCheckboxChange(grillaIndex, fila, colIndex)}
                    />
                  </Grid>
                ))}
              </Grid>
            ))}
          </Grid>
          <Button
            variant="outlined"
            color="warning"
            onClick={() => eliminarGrilla(grillaIndex)}
            sx={{ mt: 2 }}
          >
            Eliminar Punto Limpio
          </Button>
        </Paper>
      ))}

      {/* Observaciones */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Punto limpio general - Observaciones / Sugerencias / Acciones a tomar
      </Typography>
      <TextField
        label="Observaciones"
        fullWidth
        multiline
        rows={4}
        value={formData.puntoLimpioObservaciones}
        onChange={(e) => handleChange("puntoLimpioObservaciones", e.target.value)}
      />
    </Box>
  );
};

export default Page3;
