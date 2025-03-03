import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { useFormStore } from "../context/FormContext";

const opcionesPlastico = ["Aplica", "No Aplica"];
const opcionesCheck = [
  "Acopio a granel",
  "En volqueta",
  "En bolson azul",
  "Poco accesible",
  "Vacío",
  "Lleno (Coordinar retiro)",
  "Se está reutilizando en obra",
  "Contiene residuos que no corresponden",
  "Otro",
];

const Page8 = () => {
  const { data, updateData } = useFormStore();
  const pageIndex = "page8";

  const defaultPage8 = {
    // Fijamos el valor por defecto de forma que coincida con las opciones disponibles
    plastico: "No Aplica",
    plasticoOpciones: {}, // Siempre inicializado como objeto vacío
    plasticoOtro: "",
    plasticoObservaciones: "",
  };

  // Estado local para esta página
  const [formData, setFormData] = useState(data[pageIndex] || defaultPage8);

  // Si no existe data en el context para esta página, se inicializa
  useEffect(() => {
    if (!data[pageIndex] || Object.keys(data[pageIndex]).length === 0) {
      updateData(pageIndex, defaultPage8);
    }
  }, [data, pageIndex, updateData]);

  // Sincronizamos el estado local con el context una vez renderizado
  useEffect(() => {
    updateData(pageIndex, formData);
  }, [formData, pageIndex, updateData]);

  // Actualiza el estado local (sin llamar a updateData directamente aquí)
  const handleChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleCheckboxChange = (option) => {
    setFormData((prevData) => {
      const updatedChecks = {
        ...prevData.plasticoOpciones,
        [option]: !prevData.plasticoOpciones[option],
      };
      return { ...prevData, plasticoOpciones: updatedChecks };
    });
  };

  return (
    <Box sx={{ width: "90%", margin: "auto", mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Plástico
      </Typography>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Seleccione una opción</InputLabel>
        <Select
          value={formData.plastico}
          onChange={(e) => {
            const value = e.target.value;
            handleChange("plastico", value);
            if (value === "No Aplica") {
              handleChange("plasticoOpciones", {});
              handleChange("plasticoOtro", "");
            }
          }}
        >
          {opcionesPlastico.map((op, index) => (
            <MenuItem key={index} value={op}>
              {op}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Mostramos las opciones adicionales solo si se selecciona "Aplica" */}
      {formData.plastico === "Aplica" && (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Estado del plástico
          </Typography>
          <FormGroup>
            {opcionesCheck.map((op, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={!!formData.plasticoOpciones[op]}
                    onChange={() => handleCheckboxChange(op)}
                  />
                }
                label={op}
              />
            ))}
          </FormGroup>

          {formData.plasticoOpciones["Otro"] && (
            <TextField
              label="Especificar otro"
              fullWidth
              sx={{ mt: 2 }}
              value={formData.plasticoOtro}
              onChange={(e) => handleChange("plasticoOtro", e.target.value)}
            />
          )}
        </>
      )}

      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
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
