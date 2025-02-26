import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Alert,
  Box,
  MenuItem,
  IconButton,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate, useLocation } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FaRecycle, FaBoxOpen, FaTrashAlt, FaCogs, FaDrum, FaBuilding } from 'react-icons/fa';

const steps = ["Información General", "Detalles del Material", "Clasificación y Observaciones"];

const EditarPuntoLimpio = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    obra: "",
    ubicacion: "",
    accesibilidad: "en_planta_baja",
    cantidad: "",
    metros_cuadrados: "",
    estructura: "",
    tipo_contenedor: "",
    puntaje: "",
    senaletica: true,
    observaciones: "",
    clasificacion: "correcta",
    tipo_material: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  useEffect(() => {
    if (id) {
      fetch(`http://127.0.0.1:8000/api/puntos-limpios/${id}/`)
        .then((response) => response.json())
        .then((data) => {
          setFormData({
            obra: data.obra,
            ubicacion: data.ubicacion,
            accesibilidad: data.accesibilidad,
            cantidad: data.cantidad,
            metros_cuadrados: data.metros_cuadrados,
            estructura: data.estructura,
            tipo_contenedor: data.tipo_contenedor,
            puntaje: data.puntaje,
            senaletica: data.señaletica,
            observaciones: data.observaciones,
            clasificacion: data.clasificacion,
            tipo_material: data.tipo_material,
          });
        })
        .catch((error) => console.error("Error al obtener datos del punto limpio:", error));
    }
  }, [id]);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (newValue) => {
    setFormData({ ...formData, fecha_ingreso: newValue });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...formData,
        fecha_ingreso: formData.fecha_ingreso
          ? formData.fecha_ingreso.format("YYYY-MM-DD")
          : null,
      };

      const response = await fetch(`http://127.0.0.1:8000/api/puntos-limpios/${id}/actualizar/`, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Punto Limpio actualizado:", data);
        setSuccessMessage("Punto Limpio actualizado con éxito.");
        navigate("/listapuntolimpio");
      } else {
        console.error("Error al actualizar el Punto Limpio. Código de error:", response.status);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: '#a8c948',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ padding: 6, marginTop: 6, borderRadius: 3 }}>
          <Typography variant="h3" gutterBottom>Editar Punto Limpio</Typography>

          {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {activeStep === 0 && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      label="Nombre de la Obra"
                      fullWidth
                      name="obra"
                      value={formData.obra}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Ubicación"
                      fullWidth
                      name="ubicacion"
                      value={formData.ubicacion}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Cantidad"
                      fullWidth
                      name="cantidad"
                      type="number"
                      value={formData.cantidad}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Metros Cuadrados"
                      fullWidth
                      name="metros_cuadrados"
                      type="number"
                      value={formData.metros_cuadrados}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                </>
              )}
              {activeStep === 1 && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      label="Estructura"
                      fullWidth
                      name="estructura"
                      value={formData.estructura}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Tipo de Contenedor"
                      fullWidth
                      name="tipo_contenedor"
                      value={formData.tipo_contenedor}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Puntaje"
                      fullWidth
                      name="puntaje"
                      type="number"
                      value={formData.puntaje}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                </>
              )}
              {activeStep === 2 && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      select
                      label="Tipo de Material"
                      fullWidth
                      name="tipo_material"
                      value={formData.tipo_material}
                      onChange={handleChange}
                    >
                      <MenuItem value="escombro_limpio">
                        <IconButton><FaRecycle /></IconButton> Escombro Limpio
                      </MenuItem>
                      <MenuItem value="plastico">
                        <IconButton><FaBoxOpen /></IconButton> Plástico
                      </MenuItem>
                      <MenuItem value="metales">
                        <IconButton><FaTrashAlt /></IconButton> Metales
                      </MenuItem>
                      <MenuItem value="madera">
                        <IconButton><FaCogs /></IconButton> Madera
                      </MenuItem>
                      <MenuItem value="mezclados">
                        <IconButton><FaDrum /></IconButton> Mezclados
                      </MenuItem>
                      <MenuItem value="peligrosos">
                        <IconButton><FaBuilding /></IconButton> Peligrosos
                      </MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      select
                      label="Clasificación"
                      fullWidth
                      name="clasificacion"
                      value={formData.clasificacion}
                      onChange={handleChange}
                    >
                      <MenuItem value="correcta">Correcta</MenuItem>
                      <MenuItem value="a_mejorar">A Mejorar</MenuItem>
                      <MenuItem value="incorrecta">Incorrecta</MenuItem>
                      <MenuItem value="no_aplica">No Aplica</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Observaciones"
                      fullWidth
                      name="observaciones"
                      value={formData.observaciones}
                      onChange={handleChange}
                      multiline
                      rows={4}
                    />
                  </Grid>
                </>
              )}
            </Grid>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {activeStep !== 0 && (
                <Grid item xs={6}>
                  <Button onClick={handleBack}>Atrás</Button>
                </Grid>
              )}
              {activeStep === 0 && (
                <Grid item xs={12} sx={{ textAlign: "right" }}>
                  <Button onClick={handleNext}>Siguiente</Button>
                </Grid>
              )}
              {activeStep !== 0 && activeStep < steps.length - 1 && (
                <Grid item xs={6} sx={{ textAlign: "right" }}>
                  <Button onClick={handleNext}>Siguiente</Button>
                </Grid>
              )}
              {activeStep === steps.length - 1 && (
                <Grid item xs={6} sx={{ textAlign: "right" }}>
                  <Button type="submit" variant="contained" color="primary">Guardar Cambios</Button>
                </Grid>
              )}
            </Grid>
          </form>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default EditarPuntoLimpio;
