import React, { useState, useEffect, useContext } from "react";
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
  IconButton,
  MenuItem,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Anvil, TreeDeciduous, CupSoda, TriangleAlert, TrendingUpDown, Recycle } from 'lucide-react';
import { AuthContext } from "../pages/context/AuthContext";

const steps = ["Información General", "Detalles de Material", "Fecha"];

const AltaPuntoLimpio = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [obras, setObras] = useState([]); // Estado para guardar las obras de la API
  const [formData, setFormData] = useState({
    obra: "",
    ubicacion: "",
    accesibilidad: "en_planta_baja",
    cantidad: "",
    metros_cuadrados: "",
    tipo_contenedor: "",
    senaletica: true,
    observaciones: "",
    clasificacion: "correcta",
    fecha_ingreso: null,
    materiales: {},
  });

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Obtener las obras aprobadas de la API al cargar el componente
  useEffect(() => {
    if (!token) return; // No realizar la petición si no hay token

    fetch("http://127.0.0.1:8000/api/obras/aprobadas/", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setObras(data))
      .catch((err) => console.error("Error al cargar las obras:", err));
  }, [token]);

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

  // Actualiza la cantidad para cada tipo de material
  const handleMaterialQuantityChange = (materialType, quantity) => {
    setFormData(prevState => ({
      ...prevState,
      materiales: {
        ...prevState.materiales,
        [materialType]: quantity,
      },
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch("http://127.0.0.1:8000/api/puntolimpio/registro/", {
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

  // Definición de los tipos de material disponibles
  const materialTypes = [
    { value: "escombro_limpio", label: "Escombro Limpio", icon: <Recycle /> },
    { value: "plastico", label: "Plástico", icon: <CupSoda /> },
    { value: "metales", label: "Metales", icon: <Anvil /> },
    { value: "madera", label: "Madera", icon: <TreeDeciduous /> },
    { value: "mezclados", label: "Mezclados", icon: <TrendingUpDown /> },
    { value: "peligrosos", label: "Peligrosos", icon: <TriangleAlert /> },
  ];

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

            {/* Stepper para indicar el progreso */}
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
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
                        select
                        label="Nombre de la Obra"
                        fullWidth
                        name="obra"
                        value={formData.obra}
                        onChange={handleChange}
                        required
                      >
                        {obras.map((obra) => (
                          <MenuItem key={obra.id} value={obra.id}>
                            {obra.nombre_obra}
                          </MenuItem>
                        ))}
                      </TextField>
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
                        label="Tipo de Contenedor"
                        fullWidth
                        name="tipo_contenedor"
                        value={formData.tipo_contenedor}
                        onChange={handleChange}
                        required
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        Materiales y Cantidades
                      </Typography>
                      <Grid container spacing={2}>
                        {materialTypes.map((material) => (
                          <Grid item xs={12} sm={6} key={material.value}>
                            <Box display="flex" alignItems="center">
                              <IconButton>{material.icon}</IconButton>
                              <Typography sx={{ marginLeft: 1 }}>{material.label}</Typography>
                            </Box>
                            <TextField
                              label="Cantidad"
                              type="number"
                              value={formData.materiales[material.value] || ""}
                              onChange={(e) =>
                                handleMaterialQuantityChange(material.value, e.target.value)
                              }
                              fullWidth
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </>
                )}
                {activeStep === 2 && (
                  <>
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
                    <Button type="submit" variant="contained" color="primary">
                      Finalizar
                    </Button>
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
