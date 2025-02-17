import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { useFormStore } from "../context/FormContext";

const opcionesMadera = [
  "A granel",
  "Mala organizacion (desorden)",
  "Mucha cantidad (solicitar retiro)",
  "Se está reutilizando en obra",
  "Contaminado con aceite/pintura/pegamento/etc",
  "Otro",
];

const Page11 = () => {
  const { data, updateData } = useFormStore();
  const pageIndex = "page11";

  const storedData = data[pageIndex] || {};
  const formData = {
    madera: storedData.madera ?? "",
    maderaOpciones: storedData.maderaOpciones ?? [],
    maderaOtro: storedData.maderaOtro ?? "",
    maderaObservaciones: storedData.maderaObservaciones ?? "",
  };

  const handleChange = (field, value) => {
    updateData(pageIndex, { ...formData, [field]: value });
  };

  const handleCheckboxChange = (option) => {
    const newOpciones = formData.maderaOpciones.includes(option)
      ? formData.maderaOpciones.filter((item) => item !== option)
      : [...formData.maderaOpciones, option];
    handleChange("maderaOpciones", newOpciones);
  };

  return (
    <Box sx={{ width: "90%", margin: "auto", mt: 4 }}>
      {/* Título y Dropdown para Madera */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Madera
      </Typography>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Seleccionar</InputLabel>
        <Select
          value={formData.madera}
          onChange={(e) => handleChange("madera", e.target.value)}
        >
          <MenuItem value="Aplica">Aplica</MenuItem>
          <MenuItem value="No aplica">No aplica</MenuItem>
        </Select>
      </FormControl>

      {/* Lista de Checkboxes solo si se selecciona "Aplica" */}
      {formData.madera === "Aplica" && (
        <Box sx={{ mb: 3, display: "flex", flexDirection: "column" }}>
          {opcionesMadera.map((option, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={formData.maderaOpciones.includes(option)}
                  onChange={() => handleCheckboxChange(option)}
                />
              }
              label={option}
            />
          ))}
          {formData.maderaOpciones.includes("Otro") && (
            <TextField
              label="Especificar Otro"
              fullWidth
              sx={{ mt: 2 }}
              value={formData.maderaOtro}
              onChange={(e) => handleChange("maderaOtro", e.target.value)}
            />
          )}
        </Box>
      )}

      {/* Observaciones generales (label se mantiene como "Metales" según el requerimiento) */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Metales - Otras observaciones / Sugerencias / Acciones a tomar
      </Typography>
      <TextField
        label="Observaciones"
        fullWidth
        multiline
        rows={4}
        value={formData.maderaObservaciones}
        onChange={(e) => handleChange("maderaObservaciones", e.target.value)}
      />
    </Box>
  );
};

export default Page11;
