import React from "react";
import {
  Container,
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

  // Cargar datos desde el estado global
  const safeFormData = {
    tecnico: data?.page1?.tecnico || "",
    obraId: data?.page1?.obraId || "", // Se usa el ID de la obra seleccionada
    fecha: data?.page1?.fecha || null,
    motivos: data?.page1?.motivos || [],
    otroMotivo: data?.page1?.otroMotivo || "",
  };

  // Obtener las obras aprobadas desde el estado global (evita lista estática)
  const obrasDisponibles = data?.page1?.obrasDisponibles || [];

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
    if (!safeFormData.tecnico || !safeFormData.obraId || !safeFormData.fecha) {
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

        <FormControl fullWidth margin="normal" required>
          <InputLabel>Obra / Dirección</InputLabel>
          <Select
            value={safeFormData.obraId}
            onChange={(e) => handleChange("obraId", e.target.value)}
          >
            {obrasDisponibles.map((obra) => (
              <MenuItem key={obra.id} value={obra.id}>
                {" "}
                {/* Cambié `obras` por `obra` */}
                {`${obra.nombre_obra} - ${obra.direccion}`}
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
      </form>
    </Container>
  );
};

export default Page1;
