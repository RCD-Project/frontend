import React from "react";
import { Box, TextField, FormControlLabel, Checkbox, Typography, Grid, Paper } from "@mui/material";
import { useFormStore } from "../context/FormContext";

const opcionesLogistica = ["Correcta", "Aceptable (con observaciones)", "Incorrecta", "Otro"];
const titulosColumnas = ["Participa Activamente", "Participa (puede mejorar)", "Poca Participación", "Falta Mayor Capacitación", "No Participan", "No hay"];
const titulosFilas = ["Jornal Ambiental", "Operarios", "Oficina Técnica (jefe de obra, capataz, etc.)"];
const titulosLimpiezaColumnas = ["Zona", "Estado", "Residuos", "Orden", "Observaciones"];
const titulosLimpiezaFilas = ["Área 1", "Área 2", "Área 3"];

const Page2 = () => {
  const { data, updateData } = useFormStore();
  const pageIndex = "page2";

  const formData = data[pageIndex] || {
    logistica: "",
    observaciones: "",
    participacion: {},
    limpieza: {},
  };

  const handleChange = (field, value) => {
    updateData(pageIndex, { ...formData, [field]: value });
  };

  const handleCheckboxChange = (field, row, col, columns) => {
    // Resetear toda la fila y marcar solo la seleccionada
    const newRowState = Object.fromEntries(columns.map((_, index) => [index, false]));
    newRowState[col] = true;

    handleChange(field, {
      ...formData[field],
      [row]: newRowState,
    });
  };

  return (
    <Box sx={{ width: "90%", margin: "auto", mt: 4 }}>
      {/* Participantes de Obra */}
      <Typography variant="h6" sx={{ mb: 2 }}>Participantes de Obra</Typography>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Grid container spacing={1}>
          <Grid container item>
            <Grid item xs={3} sx={{ fontWeight: "bold", textAlign: "center", p: 1 }}>-</Grid>
            {titulosColumnas.map((titulo, index) => (
              <Grid item xs={1.5} key={index} sx={{ textAlign: "center", borderBottom: "1px solid gray", p: 1, fontSize: "0.85rem", fontWeight: "bold" }}>{titulo}</Grid>
            ))}
          </Grid>
          {titulosFilas.map((fila, rowIndex) => (
            <Grid container item key={rowIndex} alignItems="center">
              <Grid item xs={3} sx={{ fontWeight: "bold", textAlign: "center", p: 1, borderRight: "1px solid gray" }}>{fila}</Grid>
              {titulosColumnas.map((_, colIndex) => (
                <Grid item xs={1.5} key={colIndex} sx={{ textAlign: "center", p: 1 }}>
                  <Checkbox
                    checked={!!formData.participacion[fila]?.[colIndex]}
                    onChange={() => handleCheckboxChange("participacion", fila, colIndex, titulosColumnas)}
                  />
                </Grid>
              ))}
            </Grid>
          ))}
        </Grid>
      </Paper>
      <TextField label="Participantes de obra - Observaciones" fullWidth sx={{ mt: 2 }} value={formData.observaciones} onChange={(e) => handleChange("observaciones", e.target.value)} />

      {/* Limpieza General de Obra */}
      <Typography variant="h6" sx={{ mt: 3 }}>Limpieza General de Obra</Typography>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Grid container spacing={1}>
          <Grid container item>
            <Grid item xs={3} sx={{ fontWeight: "bold", textAlign: "center", p: 1 }}>-</Grid>
            {titulosLimpiezaColumnas.map((titulo, index) => (
              <Grid item xs={1.8} key={index} sx={{ textAlign: "center", borderBottom: "1px solid gray", p: 1, fontSize: "0.85rem", fontWeight: "bold" }}>{titulo}</Grid>
            ))}
          </Grid>
          {titulosLimpiezaFilas.map((fila, rowIndex) => (
            <Grid container item key={rowIndex} alignItems="center">
              <Grid item xs={3} sx={{ fontWeight: "bold", textAlign: "center", p: 1, borderRight: "1px solid gray" }}>{fila}</Grid>
              {titulosLimpiezaColumnas.map((_, colIndex) => (
                <Grid item xs={1.8} key={colIndex} sx={{ textAlign: "center", p: 1 }}>
                  <Checkbox
                    checked={!!formData.limpieza[fila]?.[colIndex]}
                    onChange={() => handleCheckboxChange("limpieza", fila, colIndex, titulosLimpiezaColumnas)}
                  />
                </Grid>
              ))}
            </Grid>
          ))}
        </Grid>
      </Paper>
      <TextField label="Limpieza General - Observaciones" fullWidth sx={{ mt: 2 }} />

      {/* Logística de Obra */}
      <Typography variant="h6" sx={{ mt: 3 }}>Logística de Obra</Typography>
      {opcionesLogistica.map((op, index) => (
        <FormControlLabel
          key={index}
          control={<Checkbox checked={formData.logistica === op} onChange={() => handleChange("logistica", op)} />}
          label={op}
        />
      ))}
      {formData.logistica === "Otro" && <TextField label="Especificar" fullWidth sx={{ mt: 2 }} />}
      <TextField label="Logística de obra - Observaciones" fullWidth sx={{ mt: 2 }} value={formData.observaciones} onChange={(e) => handleChange("observaciones", e.target.value)} />
    </Box>
  );
};

export default Page2;
