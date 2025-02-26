import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { GoAlert } from "react-icons/go";
import { GiMetalBar, GiFruitTree, GiGlassBottle } from "react-icons/gi";
import { HiArrowPath } from "react-icons/hi2";

const steps = ["Información General", "Detalles de Material", "Clasificación y Observaciones"];

const AltaPuntoLimpio = () => {
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

  const handleMaterialChange = (material) => {
    setFormData({ ...formData, tipo_material: material });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

  
    fetch("http://127.0.0.1:8000/api/puntos-limpios/registro/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((errorText) => {
            console.error("Respuesta de error:", errorText);
            throw new Error(errorText);
          });
        }
        return res.json();
      })
      .then((data) => {
        setSuccessMessage("Punto Limpio registrado con éxito.");
        navigate("/listapuntolimpio", {
          state: { successMessage: "Punto Limpio registrado con éxito." },
        });
      })
      .catch((err) => {
        console.error("Error al dar de alta el Punto Limpio:", err);
        alert("Error al dar de alta el Punto Limpio:\n" + err.message);
      });
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#a8c948",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="md"
        sx={{
          minHeight: "calc(100vh - var(--header-height))",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box className="inner-content" sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Paper elevation={3} sx={{ padding: 6, borderRadius: 3 }}>
            <Typography variant="h3" gutterBottom sx={{ mb: 4 }}>
              Alta Punto Limpio
            </Typography>

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
                    <Grid item xs={12}>
                      <TextField
                        label="Observaciones"
                        fullWidth
                        multiline
                        rows={4}
                        name="observaciones"
                        value={formData.observaciones}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        select
                        label="Tipo de Material"
                        fullWidth
                        name="tipo_material"
                        value={formData.tipo_material}
                        onChange={handleChange}
                      >
                        <Box sx={{ display: "flex", justifyContent: "space-evenly", flexWrap: "wrap", gap: 2 }}>
                          <MenuItem value="escombro_limpio" onClick={() => handleMaterialChange("escombro_limpio")}>
                            <IconButton><GoAlert /></IconButton> Escombro Limpio
                          </MenuItem>
                          <MenuItem value="plastico" onClick={() => handleMaterialChange("plastico")}>
                            <IconButton><GiGlassBottle /></IconButton> Plástico
                          </MenuItem>
                          <MenuItem value="metales" onClick={() => handleMaterialChange("metales")}>
                            <IconButton><GiMetalBar /></IconButton> Metales
                          </MenuItem>
                          <MenuItem value="madera" onClick={() => handleMaterialChange("madera")}>
                            <IconButton><GiFruitTree /></IconButton> Madera
                          </MenuItem>
                          <MenuItem value="mezclados" onClick={() => handleMaterialChange("mezclados")}>
                            <IconButton><HiArrowPath /></IconButton> Mezclados
                          </MenuItem>
                          <MenuItem value="peligrosos" onClick={() => handleMaterialChange("peligrosos")}>
                            <IconButton><GoAlert /></IconButton> Peligrosos
                          </MenuItem>
                        </Box>
                      </TextField>
                    </Grid>
                  </>
                )}
                {activeStep === 2 && (
                  <>
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
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Fecha de Ingreso"
                          value={formData.fecha_ingreso || null}
                          onChange={handleDateChange}
                          renderInput={(params) => <TextField {...params} fullWidth required />}
                        />
                      </LocalizationProvider>
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
                    <Button type="submit" variant="contained" color="primary">Finalizar</Button>
                  </Grid>
                )}
              </Grid>
            </form>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default AltaPuntoLimpio;
