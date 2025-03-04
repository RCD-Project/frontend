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
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Anvil,
  TreeDeciduous,
  CupSoda,
  TriangleAlert,
  TrendingUpDown,
  Recycle,
  FileText,
} from "lucide-react";
import { AuthContext } from "../pages/context/AuthContext";
import { CircularProgress } from "@mui/material";
import dayjs from "dayjs";

const steps = ["Información General", "Detalles de Material", "Fecha"];

const AltaPuntoLimpio = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [obras, setObras] = useState([]);
  const [transportistas, setTransportistas] = useState([]);
  const [errors, setErrors] = useState({});
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
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  // Cargar las obras aprobadas
  useEffect(() => {
    if (!token) return;
    fetch("http://127.0.0.1:8000/api/obras/aprobadas/", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
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

  // Cargar la lista de transportistas
  useEffect(() => {
    if (!token) return;
    fetch("http://127.0.0.1:8000/api/transportistas/lista/", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setTransportistas(data))
      .catch((err) => console.error("Error al cargar transportistas:", err));
  }, [token]);

  // Validación básica de campos obligatorios
  const validateStep = (step) => {
    let newErrors = {};
    
    if (step === 0) {
      if (!formData.obra) newErrors.obra = "Debe seleccionar una obra.";
      if (!formData.ubicacion.trim()) newErrors.ubicacion = "La ubicación es obligatoria.";
      if (!formData.cantidad || isNaN(formData.cantidad) || formData.cantidad <= 0) {
        newErrors.cantidad = "Debe ingresar una cantidad válida.";
      }
      if (!formData.metros_cuadrados || isNaN(formData.metros_cuadrados) || formData.metros_cuadrados <= 0) {
        newErrors.metros_cuadrados = "Debe ingresar un valor válido en metros cuadrados.";
      }
    } else if (step === 1) {
      if (!formData.tipo_contenedor.trim()) newErrors.tipo_contenedor = "El tipo de contenedor es obligatorio.";
    } else if (step === 2) {
      if (!formData.fecha_ingreso) {
        newErrors.fecha_ingreso = "La fecha de ingreso es obligatoria.";
      } else if (!dayjs(formData.fecha_ingreso).isValid()) {
        newErrors.fecha_ingreso = "La fecha de ingreso no es válida.";
      }
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  

  const handleNext = () => {
    if (validateStep(activeStep)) setActiveStep((prev) => prev + 1);
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

  // Actualiza la cantidad ingresada para cada tipo de material
  const handleMaterialQuantityChange = (materialType, quantity) => {
    setFormData((prevState) => ({
      ...prevState,
      materiales: {
        ...prevState.materiales,
        [materialType]: quantity,
      },
    }));
  };

  // Función para crear primero el Punto Limpio y luego los Materiales
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!token) {
      setErrorMessage("No estás autenticado. Por favor, inicia sesión.");
      return;
    }
    if (!validateStep(2)) return;

    setIsLoading(true); // Indica que la solicitud está en curso
  
    // Extraer y preparar datos para el Punto Limpio
    const { materiales, ...puntoData } = formData;
    const dataPuntoLimpio = {
      ...puntoData,
      fecha_ingreso: formData.fecha_ingreso
        ? dayjs(formData.fecha_ingreso).format("YYYY-MM-DD")
        : null,
    };
  
    try {
      // Crear el Punto Limpio
      const responsePunto = await fetch(
        "http://127.0.0.1:8000/api/puntolimpio/registro/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(dataPuntoLimpio),
        }
      );
  
      if (!responsePunto.ok) {
        const errorText = await responsePunto.text();
        throw new Error(errorText);
      }
  
      const puntoDataResponse = await responsePunto.json();
  
      // Preparar el arreglo de materiales
      const materialesArray = Object.entries(materiales)
        .filter(([type, qty]) => parseInt(qty) > 0)
        .map(([type, qty]) => {
          const transporte = transportistas.find(
            (t) => t.tipo_material === type && t.estado.toLowerCase() === "activo"
          );
  
          if (!transporte) {
            console.error(`No se encontró transportista activo para el tipo: ${type}`);
            return null;
          }
  
          return {
            tipo_material: type,
            cantidad: parseInt(qty),
            transportista: transporte.id,
            descripcion: "Sin descripción",
            proteccion: "Sin protección",
            tipo_contenedor: formData.tipo_contenedor,
            estado_del_contenedor: "No especificado",
            ventilacion: type === "peligrosos" ? "necesario" : "",
            obra: formData.obra,
            punto_limpio: puntoDataResponse.id,
          };
        })
        .filter((item) => item !== null);
  
      if (materialesArray.length === 0) {
        setErrorMessage("Debe asignarse al menos un material con transportista válido.");
        return;
      }
  
      // Crear cada material de forma individual
      for (const material of materialesArray) {
        const responseMaterial = await fetch(
          "http://127.0.0.1:8000/api/materiales/registro/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify(material),
          }
        );
  
        if (!responseMaterial.ok) {
          const errorText = await responseMaterial.text();
          throw new Error(errorText);
        }
      }
  
      setSuccessMessage("Punto Limpio registrado con éxito.");
      setErrorMessage("");
      navigate("/puntolimpio", {
        state: { successMessage: "Punto Limpio registrado con éxito." },
      });
  
    } catch (err) {
      console.error("Error al dar de alta el Punto Limpio:", err);
      setErrorMessage("Ocurrió un error al registrar el Punto Limpio. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };
  

  // Definición de los tipos de material disponibles
  const materialTypes = [
    { value: "escombro_limpio", label: "Escombro Limpio", icon: <Recycle /> },
    { value: "plastico", label: "Plástico", icon: <CupSoda /> },
    { value: "papel_carton", label: "Papel y Cartón", icon: <FileText /> },
    { value: "metales", label: "Metales", icon: <Anvil /> },
    { value: "madera", label: "Madera", icon: <TreeDeciduous /> },
    { value: "mezclados", label: "Mezclados", icon: <TrendingUpDown /> },
    { value: "peligrosos", label: "Peligrosos", icon: <TriangleAlert /> },
  ];

  const theme = createTheme({ palette: { primary: { main: "#a8c948" } } });


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
        <Box
          className="inner-content"
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper elevation={3} sx={{ padding: 6, borderRadius: 3 }}>
            <Typography
              variant="h3"
              align="center"
              gutterBottom
              sx={{ mb: 4 }}
            >
              Alta Punto Limpio
            </Typography>

            {successMessage && <Alert severity="success">{successMessage}</Alert>}



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
                        error={!!errors.obra}
                        helperText={errors.obra}
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
                        error={!!errors.ubicacion}
                        helperText={errors.ubicacion}
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
                        error={!!errors.cantidad}
                        helperText={errors.cantidad}
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
                        error={!!errors.metros_cuadrados}
                        helperText={errors.metros_cuadrados}
                      />
                    </Grid>
                  </>
                )}
                {activeStep === 1 && (
                  <Grid item xs={12}>
                    <TextField
                      label="Tipo de Contenedor"
                      fullWidth
                      name="tipo_contenedor"
                      value={formData.tipo_contenedor}
                      onChange={handleChange}
                      error={!!errors.tipo_contenedor}
                      helperText={errors.tipo_contenedor}
                    />
                  </Grid>
                )}
                {activeStep === 2 && (
                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Fecha de Ingreso"
                        value={formData.fecha_ingreso || null}
                        onChange={handleDateChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            error={!!errors.fecha_ingreso}
                            helperText={errors.fecha_ingreso}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
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
                    <Button type="submit" variant="contained" disabled={isLoading}>
                      {isLoading ? <CircularProgress size={20} /> : "Finalizar"}
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
