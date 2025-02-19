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

// Definimos las columnas y filas
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

const Page5 = () => {
  const { data, updateData } = useFormStore();

  // Valor por defecto: la grilla es un objeto donde cada clave es el nombre de la fila
  const defaultPage5 = {
    grilla: titulosFilas.reduce((acc, fila) => {
      acc[fila] = "";
      return acc;
    }, {}),
    acopioContenedores: "",
    observaciones: "",
  };

  // Si no existe, usamos el valor por defecto
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

  // Actualiza la grilla: para la fila indicada (clave) se guarda el string de la columna seleccionada.
  const handleCheckboxChange = (fila, colIndex) => {
    updateData("page5", {
      ...data.page5,
      grilla: {
        ...page5Data.grilla,
        [fila]: titulosColumnas[colIndex],
      },
    });
  };

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
        {titulosFilas.map((fila) => (
          <Grid container item key={fila} alignItems="center">
            <Grid item xs={3} sx={{ fontWeight: "bold", textAlign: "center", p: 1 }}>
              {fila}
            </Grid>
            {titulosColumnas.map((_, colIndex) => (
              <Grid item xs={2.25} key={colIndex} sx={{ textAlign: "center", p: 1 }}>
                <Checkbox
                  checked={page5Data.grilla[fila] === titulosColumnas[colIndex]}
                  onChange={() => handleCheckboxChange(fila, colIndex)}
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
