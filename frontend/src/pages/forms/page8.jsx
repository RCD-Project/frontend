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

const opcionesPlastico = [
  "Vacio (no se ha clasificado o no se está generando)",
  "Lleno (cambiar contenedor, trasladar a punto de acopio, coordinar retiro)",
  "Contiene plásticos no reciclables",
  "Contiene residuos que no corresponden",
  "Sucio y/o contaminado",
  "Poca compactación",
  "Poco accesible",
  "No está implementada la fracción",
  "Otro",
];

const Page8 = () => {
  const { data, updateData } = useFormStore();
  const pageIndex = "page8";

  const storedData = data[pageIndex] || {};
  const formData = {
    plastico: storedData.plastico ?? "",
    plasticoOpciones: storedData.plasticoOpciones ?? [],
    plasticoObservaciones: storedData.plasticoObservaciones ?? "",
  };

  const handleChange = (field, value) => {
    updateData(pageIndex, { ...formData, [field]: value });
  };

  const handleCheckboxChange = (option) => {
    const newOpciones = formData.plasticoOpciones.includes(option)
      ? formData.plasticoOpciones.filter((item) => item !== option)
      : [...formData.plasticoOpciones, option];
    handleChange("plasticoOpciones", newOpciones);
  };

  return (
    <Box sx={{ width: "90%", margin: "auto", mt: 4 }}>
      <h2>Formulario Técnico - Página 8</h2>
      
      <Typography variant="h6" sx={{ mb: 2 }}>Plástico</Typography>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Seleccionar</InputLabel>
        <Select
          value={formData.plastico}
          onChange={(e) => handleChange("plastico", e.target.value)}
        >
          <MenuItem value="Aplica">Aplica</MenuItem>
          <MenuItem value="No aplica">No aplica</MenuItem>
        </Select>
      </FormControl>

      {/* Mostrar checkboxes solo si se selecciona "Aplica" */}
      {formData.plastico === "Aplica" && (
        <Box sx={{ mb: 3, display: "flex", flexDirection: "column" }}>
          {opcionesPlastico.map((option, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={formData.plasticoOpciones.includes(option)}
                  onChange={() => handleCheckboxChange(option)}
                />
              }
              label={option}
            />
          ))}
          {formData.plasticoOpciones.includes("Otro") && (
            <TextField
              label="Especificar Otro"
              fullWidth
              sx={{ mt: 2 }}
              value={formData.plasticoOtro}
              onChange={(e) => handleChange("plasticoOtro", e.target.value)}
            />
          )}
        </Box>
      )}

      <Typography variant="h6" sx={{ mb: 2 }}>
        Plástico - Otras observaciones / Sugerencias / Acciones a tomar
      </Typography>
      <TextField
        label="Observaciones"
        fullWidth
        multiline
        rows={4}
        value={formData.plasticoObservaciones}
        onChange={(e) => handleChange("plasticoObservaciones", e.target.value)}
      />
    </Box>
  );
};

export default Page8;
