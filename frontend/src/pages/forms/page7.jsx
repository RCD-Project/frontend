import React, { useState } from "react";
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

const opcionesEscombro = ["Aplica", "No Aplica"];
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

const Page7 = () => {
  const [escombro, setEscombro] = useState("");
  const [checks, setChecks] = useState({});
  const [otroTexto, setOtroTexto] = useState("");

  const handleEscombroChange = (event) => {
    const value = event.target.value;
    setEscombro(value);
    if (value === "No Aplica") {
      setChecks({});
      setOtroTexto("");
    }
  };

  const handleCheckboxChange = (option) => {
    setChecks((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  return (
    <Box sx={{ width: "90%", margin: "auto", mt: 4 }}>
      {/* Dropdown de Escombro */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Escombro Limpio
      </Typography>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Seleccione una opción</InputLabel>
        <Select value={escombro} onChange={handleEscombroChange}>
          {opcionesEscombro.map((op, index) => (
            <MenuItem key={index} value={op}>
              {op}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Lista de checkboxes si "Aplica" está seleccionado */}
      {escombro === "Aplica" && (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Estado del escombro
          </Typography>
          <FormGroup>
            {opcionesCheck.map((op, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={!!checks[op]}
                    onChange={() => handleCheckboxChange(op)}
                  />
                }
                label={op}
              />
            ))}
          </FormGroup>

          {/* Campo de texto para "Otro" */}
          {checks["Otro"] && (
            <TextField
              label="Especificar otro"
              fullWidth
              sx={{ mt: 2 }}
              value={otroTexto}
              onChange={(e) => setOtroTexto(e.target.value)}
            />
          )}
        </>
      )}

      {/* Observaciones */}
      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        Escombro - Otras observaciones / Sugerencias / Acciones a tomar
      </Typography>
      <TextField label="Observaciones" fullWidth multiline rows={4} />
    </Box>
  );
};

export default Page7;
