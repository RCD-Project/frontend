import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Checkbox,
  CircularProgress,
  TextField,
} from "@mui/material";
import { useFormStore } from "../context/FormContext";

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

  const obraSeleccionada = data.page1?.obra?.id || data.page1?.obraId;
  console.log("Obra seleccionada (Page3):", obraSeleccionada);

  const [loading, setLoading] = useState(false);

  // 🔹 Estado inicial de la grilla de evaluación general
  const [formData, setFormData] = useState({
    grillaPuntosLimpios: Array(titulosFilas.length).fill(""),  // 🔹 Ahora es una sola grilla general
    puntoLimpioObservaciones: data[pageIndex]?.puntoLimpioObservaciones || "",
  });

  useEffect(() => {
    if (JSON.stringify(data[pageIndex]) !== JSON.stringify(formData)) {
      updateData(pageIndex, formData);
    }
  }, [formData, pageIndex, updateData]);

  // ✅ Manejar cambios en la grilla general
  const handleCheckboxChange = (filaIndex, colIndex) => {
    const newGrilla = [...formData.grillaPuntosLimpios];
    newGrilla[filaIndex] = titulosColumnas[colIndex]; // Guarda la opción seleccionada
    setFormData({ ...formData, grillaPuntosLimpios: newGrilla });
  };

  // ✅ Manejar cambios en observaciones generales
  const handleObservationChange = (e) => {
    setFormData({ ...formData, puntoLimpioObservaciones: e.target.value });
  };

  return (
    <Box sx={{ width: "90%", margin: "auto", mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Evaluación General de los Puntos Limpios
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {/* 🔹 Grilla de evaluación */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Estado General de los Puntos Limpios
          </Typography>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Grid container spacing={1}>
              {/* 🔹 Encabezado de la grilla */}
              <Grid container item>
                <Grid item xs={3} sx={{ fontWeight: "bold", textAlign: "center", p: 1 }}>
                  -
                </Grid>
                {titulosColumnas.map((titulo, colIndex) => (
                  <Grid
                    item
                    xs={2.25}
                    key={colIndex}
                    sx={{ textAlign: "center", fontWeight: "bold", p: 1 }}
                  >
                    {titulo}
                  </Grid>
                ))}
              </Grid>

              {/* 🔹 Filas de la grilla */}
              {titulosFilas.map((fila, rowIndex) => (
                <Grid container item key={rowIndex} alignItems="center">
                  <Grid item xs={3} sx={{ fontWeight: "bold", textAlign: "center", p: 1 }}>
                    {fila}
                  </Grid>
                  {titulosColumnas.map((_, colIndex) => (
                    <Grid item xs={2.25} key={colIndex} sx={{ textAlign: "center", p: 1 }}>
                      <Checkbox
                        checked={formData.grillaPuntosLimpios[rowIndex] === titulosColumnas[colIndex]}
                        onChange={() => handleCheckboxChange(rowIndex, colIndex)}
                      />
                    </Grid>
                  ))}
                </Grid>
              ))}
            </Grid>
          </Paper>

          {/* 🔹 Observaciones generales */}
          <Typography variant="h6" sx={{ mt: 2 }}>
            Observaciones Generales
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={formData.puntoLimpioObservaciones}
            onChange={handleObservationChange}
          />
        </>
      )}
    </Box>
  );
};

export default Page3;
