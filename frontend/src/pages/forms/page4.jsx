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
} from "@mui/material";
import { useFormStore } from "../context/FormContext";

const opcionesPuntoLimpio = ["Si hay", "No hay"];
const titulosColumnas = [
  "Correcta",
  "A mejorar (Con observaciones)",
  "Incorrecta",
  "No aplica",
];
const titulosFilas = [
  "Ubicación",
  "Estructura",
  "Tipo de Contenedor",
  "Estado Contenedores (bolsones, etc)",
  "Señalética",
];

const Page4 = () => {
  const { data, updateData } = useFormStore();
  const pageIndex = "page4";

  const storedData = data[pageIndex] || {};
  const formData = {
    puntosLimpiosEdificio: storedData.puntosLimpiosEdificio ?? "",
    grillaPuntosLimpiosPisos:
      typeof storedData.grillaPuntosLimpiosPisos === "object"
        ? storedData.grillaPuntosLimpiosPisos
        : {},
    puntosLimpiosEdificioObservaciones:
      storedData.puntosLimpiosEdificioObservaciones ?? "",
  };

  const handleChange = (field, value) => {
    updateData(pageIndex, { ...formData, [field]: value });
  };

  const handlePuntosLimpiosEdificioChange = (value) => {
    if (value === "No hay") {
      handleChange("grillaPuntosLimpiosPisos", {});
    }
    handleChange("puntosLimpiosEdificio", value);
  };

  // Al hacer clic en el checkbox se guarda el valor de la columna
  const handleGridCheckboxChange = (row, col) => {
    handleChange("grillaPuntosLimpiosPisos", {
      ...formData.grillaPuntosLimpiosPisos,
      [row]: titulosColumnas[col],
    });
  };

  return (
    <Box sx={{ width: "90%", margin: "auto", mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Son los puntos limpios ubicados por pisos en edificio
      </Typography>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Punto limpio por pisos</InputLabel>
        <Select
          value={formData.puntosLimpiosEdificio}
          onChange={(e) => handlePuntosLimpiosEdificioChange(e.target.value)}
        >
          {opcionesPuntoLimpio.map((op, index) => (
            <MenuItem key={index} value={op}>
              {op}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {formData.puntosLimpiosEdificio === "Si hay" && (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            ¿Cómo se encuentran estos puntos limpios?
          </Typography>
          <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={1}>
              <Grid container item>
                <Grid
                  item
                  xs={3}
                  sx={{ fontWeight: "bold", textAlign: "center", p: 1 }}
                >
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
                  <Grid
                    item
                    xs={3}
                    sx={{ fontWeight: "bold", textAlign: "center", p: 1 }}
                  >
                    {fila}
                  </Grid>
                  {titulosColumnas.map((_, colIndex) => (
                    <Grid
                      item
                      xs={2.25}
                      key={colIndex}
                      sx={{ textAlign: "center", p: 1 }}
                    >
                      <Checkbox
                        checked={
                          formData.grillaPuntosLimpiosPisos[fila] ===
                          titulosColumnas[colIndex]
                        }
                        onChange={() =>
                          handleGridCheckboxChange(fila, colIndex)
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              ))}
            </Grid>
          </Paper>
        </>
      )}

      <Typography variant="h6" sx={{ mb: 2 }}>
        Puntos limpios intermedios / por pisos - Otras observaciones
      </Typography>
      <TextField
        label="Observaciones"
        fullWidth
        multiline
        rows={4}
        value={formData.puntosLimpiosEdificioObservaciones}
        onChange={(e) =>
          handleChange("puntosLimpiosEdificioObservaciones", e.target.value)
        }
      />
    </Box>
  );
};

export default Page4;
