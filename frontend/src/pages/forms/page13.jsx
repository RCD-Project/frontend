import React, { useEffect } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Grid,
  Checkbox,
  FormControlLabel,
  TextField,
  Paper,
} from "@mui/material";
import { useFormStore } from "../context/FormContext";

const gridColumnTitles = ["Óptimo", "Regular", "Deficiente"];
const gridRowLabels = Array.from({ length: 5 }, (_, i) => `Fila ${i + 1}`);

const checkboxOptions = [
  "Tanques vacíos",
  "Tanques llenos (coordinar retiro)",
  "Falta cajón antiderrame",
  "Falta orden",
  "Contiene residuos que no corresponde",
  "Otro",
];

const Page13 = () => {
  const { data, updateData } = useFormStore();
  const pageIndex = "page13";

  const defaultPage13 = {
    puntoAcopio: "",
    puntoAcopioGrid: Array(5).fill(null),
    puntoAcopioOpciones: [],
    puntoAcopioOtro: "",
    puntoAcopioObservaciones: "",
  };

  const storedData = data[pageIndex] || defaultPage13;
  const formData = { ...defaultPage13, ...storedData };

  useEffect(() => {
    if (!data[pageIndex]) {
      updateData(pageIndex, defaultPage13);
    }
  }, [data, pageIndex, updateData]);

  const handleDropdownChange = (event) => {
    updateData(pageIndex, { ...formData, puntoAcopio: event.target.value });
  };

  const handleGridChange = (rowIndex, colIndex) => {
    const newGrid = formData.puntoAcopioGrid.map((val, idx) =>
      idx === rowIndex ? colIndex : val
    );
    updateData(pageIndex, { ...formData, puntoAcopioGrid: newGrid });
  };

  const handleCheckboxChange = (option) => {
    const newOpciones = formData.puntoAcopioOpciones.includes(option)
      ? formData.puntoAcopioOpciones.filter((item) => item !== option)
      : [...formData.puntoAcopioOpciones, option];

    updateData(pageIndex, { ...formData, puntoAcopioOpciones: newOpciones });
  };

  const handleOtroChange = (event) => {
    updateData(pageIndex, { ...formData, puntoAcopioOtro: event.target.value });
  };

  const handleObservationsChange = (event) => {
    updateData(pageIndex, { ...formData, puntoAcopioObservaciones: event.target.value });
  };

  return (
    <Box sx={{ width: "90%", margin: "auto", mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        Punto de acopio
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Espacio accesible, con tanques de contención para los peligrosos, con bandeja antiderrame, bajo techo, accesibles y con ventilación. Separación de productos químicos / residuos con pinturas / residuos de hidrocarburos.
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Seleccionar</InputLabel>
        <Select value={formData.puntoAcopio} onChange={handleDropdownChange}>
          <MenuItem value="Aplica">Aplica</MenuItem>
          <MenuItem value="No aplica">No aplica</MenuItem>
        </Select>
      </FormControl>

      {formData.puntoAcopio === "Aplica" && (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Seleccione una opción en cada fila:
          </Typography>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Grid container spacing={1}>
              <Grid container item>
                <Grid item xs={3} sx={{ fontWeight: "bold", textAlign: "center", p: 1 }}>
                  -
                </Grid>
                {gridColumnTitles.map((title, index) => (
                  <Grid
                    item
                    xs={1.5}
                    key={index}
                    sx={{
                      textAlign: "center",
                      borderBottom: "1px solid gray",
                      p: 1,
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                    }}
                  >
                    {title}
                  </Grid>
                ))}
              </Grid>
              {gridRowLabels.map((row, rowIndex) => (
                <Grid container item key={rowIndex} alignItems="center">
                  <Grid
                    item
                    xs={3}
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      p: 1,
                      borderRight: "1px solid gray",
                    }}
                  >
                    {row}
                  </Grid>
                  {gridColumnTitles.map((_, colIndex) => (
                    <Grid item xs={1.5} key={colIndex} sx={{ textAlign: "center", p: 1 }}>
                      <Checkbox
                        checked={formData.puntoAcopioGrid[rowIndex] === colIndex}
                        onChange={() => handleGridChange(rowIndex, colIndex)}
                      />
                    </Grid>
                  ))}
                </Grid>
              ))}
            </Grid>
          </Paper>

          {checkboxOptions.map((option, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={formData.puntoAcopioOpciones.includes(option)}
                  onChange={() => handleCheckboxChange(option)}
                />
              }
              label={option}
            />
          ))}

          {formData.puntoAcopioOpciones.includes("Otro") && (
            <TextField
              label="Especificar Otro"
              fullWidth
              sx={{ mt: 2 }}
              value={formData.puntoAcopioOtro}
              onChange={handleOtroChange}
            />
          )}
        </>
      )}

      <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
        Peligrosos - Otras observaciones / Sugerencias / Acciones a tomar
      </Typography>
      <TextField
        label="Observaciones"
        fullWidth
        multiline
        rows={4}
        value={formData.puntoAcopioObservaciones}
        onChange={handleObservationsChange}
      />
    </Box>
  );
};

export default Page13;
