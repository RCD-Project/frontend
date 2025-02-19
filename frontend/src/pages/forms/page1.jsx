import React from "react";
import {
  Container,
  FormControl,
  TextField,
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
import { useFormStore } from "../context/FormContext";

const tecnicos = ["Técnico 1", "Técnico 2", "Técnico 3"];
const motivos = [
  "Capacitación Inicial",
  "Capacitación Intermedia",
  "Recorrido y Control de centro de acopio y PL",
  "Relevamiento Fotográfico",
  "Reunión",
];

const Page1 = ({ nextStep }) => {
  const { data, updateData } = useFormStore();

  // Se cargan los datos guardados en el estado global
  const safeFormData = {
    tecnico: data?.page1?.tecnico || "",
    obra: data?.page1?.obra || "", // Nombre de la obra
    fecha: data?.page1?.fecha || null,
    motivos: data?.page1?.motivos || [],
    otroMotivo: data?.page1?.otroMotivo || "",
  };

  // Calcula el string a mostrar combinando nombre y dirección
  const obraDisplay =
    safeFormData.obra && data?.page1?.direccion
      ? `${safeFormData.obra} - ${data.page1.direccion}`
      : safeFormData.obra;

  const handleChange = (field, value) => {
    updateData("page1", { ...safeFormData, [field]: value });
  };

  const handleMotivoChange = (motivo) => {
    const nuevosMotivos = safeFormData.motivos.includes(motivo)
      ? safeFormData.motivos.filter((m) => m !== motivo)
      : [...safeFormData.motivos, motivo];

    updateData("page1", { ...safeFormData, motivos: nuevosMotivos });
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
      <h2>Observaciones generales en Obra</h2>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Técnico</InputLabel>
          <Select
            value={safeFormData.tecnico}
            onChange={(e) => handleChange("tecnico", e.target.value)}
          >
            {tecnicos.map((tecnico) => (
              <MenuItem key={tecnico} value={tecnico}>
                {tecnico}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Se muestra el nombre y la dirección de la obra de forma no editable */}
        <TextField
          label="Obra / Dirección"
          value={obraDisplay}
          fullWidth
          margin="normal"
          disabled
          required
        />

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
      </form>
    </Container>
  );
};

export default Page1;
