import React, { useEffect } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
  Checkbox,
} from "@mui/material";
import { useFormStore } from "../context/FormContext";

const Page5 = () => {
  const { data, updateData } = useFormStore();

  // Definimos un valor por defecto para page5 con grilla de 5 filas x 4 columnas.
  const defaultPage5 = {
    grilla: Array.from({ length: 5 }, () => Array(4).fill(false)),
    acopioContenedores: "",
    observaciones: "",
  };

  // Usamos page5Data para evitar leer de undefined.
  const page5Data = data.page5 || defaultPage5;

  // Inicializamos page5 en el estado global si aún no existe.
  useEffect(() => {
    if (!data.page5) {
      updateData("page5", defaultPage5);
    } else if (!data.page5.grilla) {
      updateData("page5", { ...data.page5, grilla: defaultPage5.grilla });
    }
  }, [data.page5, updateData]);

  // Maneja el cambio en el dropdown
  const handleDropdownChange = (event) => {
    updateData("page5", { ...data.page5, acopioContenedores: event.target.value });
  };

  // Maneja el cambio en las observaciones
  const handleObservationChange = (event) => {
    updateData("page5", { ...data.page5, observaciones: event.target.value });
  };

  // Maneja el cambio de checkbox para que en cada fila solo se seleccione uno
  const handleCheckboxChange = (rowIndex, colIndex) => {
    const updatedRow = page5Data.grilla[rowIndex].map((_, i) => i === colIndex);
    const updatedGrilla = page5Data.grilla.map((row, i) => (i === rowIndex ? updatedRow : row));
    updateData("page5", { ...data.page5, grilla: updatedGrilla });
  };

  const titulosColumnas = [
    "Correcta",
    "A mejorar (Con observaciones)",
    "Incorrecta",
    "No aplica",
  ];
  const titulosFilas = [
    "Ubicacion",
    "Estructura",
    "Tipo de Contenedor",
    "Estado Contenedores (bolsones, etc)",
    "Señalética",
  ];

  return (
    <div>
      {/* Dropdown: Lugar de acopio de contenedores llenos */}
      <FormControl fullWidth margin="normal">
        <InputLabel>
          Lugar de acopio de contenedores llenos para su traspaso al camión de retiro
        </InputLabel>
        <Select
          value={
            ["Si hay", "No hay"].includes(data.page5?.acopioContenedores)
              ? data.page5.acopioContenedores
              : ""
          }
          onChange={handleDropdownChange}
        >
          <MenuItem value="Si hay">Si hay</MenuItem>
          <MenuItem value="No hay">No hay</MenuItem>
        </Select>
      </FormControl>

      {/* Grilla: Estado del Punto de Acopio */}
      <Typography variant="h6" sx={{ mt: 3 }}>
        ¿Cómo se encuentra el Punto de Acopio?
      </Typography>
      <Grid container spacing={1} sx={{ mt: 2 }}>
        {/* Encabezado */}
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
        {/* Filas */}
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
                  checked={!!page5Data.grilla[rowIndex]?.[colIndex]}
                  onChange={() => handleCheckboxChange(rowIndex, colIndex)}
                  // Si se selecciona "No hay" en el dropdown, deshabilitamos los checkboxes
                  disabled={data.page5?.acopioContenedores === "No hay"}
                />
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>

      {/* TextBox: Observaciones */}
      <TextField
        label="Punto de Acopio - Observaciones / Sugerencias / Acciones a tomar"
        multiline
        rows={4}
        fullWidth
        margin="normal"
        value={data.page5?.observaciones || ""}
        onChange={handleObservationChange}
      />
    </div>
  );
};

export default Page5;
