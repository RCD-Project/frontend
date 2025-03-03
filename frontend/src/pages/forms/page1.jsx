import React, { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const motivos = [
  "Capacitación Inicial",
  "Capacitación Intermedia",
  "Recorrido y Control de centro de acopio y PL",
  "Relevamiento Fotográfico",
  "Reunión",
];

const Page1 = ({ nextStep }) => {
  const { data, updateData } = useFormStore();
  const [tecnicoList, setTecnicoList] = useState([]);
  const [selectedTecnico, setSelectedTecnico] = useState("");
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const loggedEmail = userData?.email || "";
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTecnicos = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/tecnicos/lista/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });

        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

        const techs = await res.json();
        if (!Array.isArray(techs)) throw new Error("Formato de respuesta inválido");

        const filteredTecnicos = techs.filter((tecnico) => {
          const emailCandidate = tecnico?.usuario?.email || tecnico.email;
          return emailCandidate?.toLowerCase() === loggedEmail.toLowerCase();
        });

        setTecnicoList(filteredTecnicos);
        if (filteredTecnicos.length > 0) {
          const firstId = String(filteredTecnicos[0].id);
          setSelectedTecnico(firstId);
          updateData("page1", { ...data.page1, tecnico: firstId });
        }
      } catch (error) {
        console.error("❌ Error al obtener técnicos:", error);
      }
    };

    if (token && loggedEmail) {
      fetchTecnicos();
    }
  }, [loggedEmail, token, updateData]);

  const safeFormData = {
    obra: data?.page1?.obraId || "",
    fecha: data?.page1?.fecha || null,
    motivos: Array.isArray(data?.page1?.motivos) ? data.page1.motivos : [],
    otroMotivo: data?.page1?.otroMotivo || "",
  };

  const obraDisplay =
    safeFormData.obra && data?.page1?.direccion
      ? `${data?.page1?.obra} - ${data.page1.direccion}`
      : safeFormData.obra;

  const handleFieldChange = (field, value) => {
    updateData("page1", { ...data.page1, [field]: value });
  };

  const handleMotivoChange = (motivo) => {
    const nuevosMotivos = (safeFormData.motivos || []).includes(motivo)
      ? safeFormData.motivos.filter((m) => m !== motivo)
      : [...safeFormData.motivos, motivo];
  
    updateData("page1", { ...data.page1, motivos: nuevosMotivos });
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTecnico || !safeFormData.obra || !safeFormData.fecha) {
      alert("⚠ Todos los campos obligatorios deben completarse");
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
            value={selectedTecnico}
            onChange={(e) => {
              const newValue = e.target.value;
              setSelectedTecnico(newValue);
              updateData("page1", { ...data.page1, tecnico: newValue });
            }}
          >
            {tecnicoList.length > 0 ? (
              tecnicoList.map((tecnico) => (
                <MenuItem key={tecnico.id} value={String(tecnico.id)}>
                  {tecnico.nombre}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="">
                {loggedEmail ? "No se encontró técnico registrado" : "Usuario no autenticado"}
              </MenuItem>
            )}
          </Select>
        </FormControl>

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
            value={safeFormData.fecha ? dayjs(safeFormData.fecha) : null}
            onChange={(newValue) => handleFieldChange("fecha", newValue)}
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
