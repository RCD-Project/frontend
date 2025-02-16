import React from "react";
import {
  Container,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Button,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useFormStore } from "../context/FormContext"; // Hook de Zustand

const tecnicos = ["Técnico 1", "Técnico 2", "Técnico 3"];
const obras = ["Obra 1", "Obra 2", "Obra 3"];
const motivos = [
  "Capacitación Inicial",
  "Capacitación Intermedia",
  "Recorrido y Control de centro de acopio y PL",
  "Relevamiento Fotográfico",
  "Reunión",
];

const Page1 = ({ nextStep }) => {
  const { formData, setFormData } = useFormStore();

  // Inicialización segura
  const safeFormData = {
    tecnico: formData?.tecnico || "",
    obra: formData?.obra || "",
    fecha: formData?.fecha || null,
    motivos: formData?.motivos || [],
    otroMotivo: formData?.otroMotivo || "",
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  

  const handleMotivoChange = (motivo) => {
    setFormData({
      ...safeFormData,
      motivos: safeFormData.motivos.includes(motivo)
        ? safeFormData.motivos.filter((m) => m !== motivo)
        : [...safeFormData.motivos, motivo],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!safeFormData.tecnico || !safeFormData.obra || !safeFormData.fecha) {
      alert("Todos los campos obligatorios deben completarse");
      return;
    }
    nextStep();
  };

  return (
    <Container maxWidth="sm">
      <h2>Formulario Técnico</h2>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Técnico</InputLabel>
          <Select
            value={safeFormData?.tecnico || ""}
            onChange={(e) => handleChange("tecnico", e.target.value)}
          >
            {tecnicos.map((tecnico) => (
              <MenuItem key={tecnico} value={tecnico}>
                {tecnico}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" required>
          <InputLabel>Obra / Dirección</InputLabel>
          <Select
            value={safeFormData.obra}
            onChange={(e) => handleChange("obra", e.target.value)}
          >
            {obras.map((obra) => (
              <MenuItem key={obra} value={obra}>
                {obra}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Fecha"
            value={safeFormData.fecha}
            onChange={(newValue) => handleChange("fecha", newValue)}
            slotProps={{
              textField: { fullWidth: true, required: true, margin: "normal" },
            }}
          />
        </LocalizationProvider>

        <FormGroup>
          <p>Motivo de Visita</p>
          {motivos.map((motivo) => (
            <FormControlLabel
              key={motivo}
              control={
                <Checkbox
                  checked={safeFormData.motivos.includes(motivo)}
                  onChange={() => handleMotivoChange(motivo)}
                />
              }
              label={motivo}
            />
          ))}
        </FormGroup>

        <TextField
          fullWidth
          label="Motivo de Visita - Otro"
          margin="normal"
          value={safeFormData.otroMotivo}
          onChange={(e) => handleChange("otroMotivo", e.target.value)}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Siguiente
        </Button>
      </form>
    </Container>
  );
};

export default Page1;
