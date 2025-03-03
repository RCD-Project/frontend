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
  FileText
} from "lucide-react";
import { AuthContext } from "../pages/context/AuthContext";
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
    // Se guardarán las cantidades por cada tipo, por ejemplo: { escombro_limpio: "3", plastico: "2", ... }
    materiales: {},
  });

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

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
  const validate = () => {
    let newErrors = {};
    if (!formData.obra) {
      newErrors.obra = "Debe seleccionar una obra.";
    }
    if (!formData.ubicacion.trim()) {
      newErrors.ubicacion = "La ubicación es obligatoria.";
    }
    if (!/^[0-9]+$/.test(formData.metros_cuadrados)) {
      newErrors.metros_cuadrados = "Debe ser un número válido.";
    }
    if (!formData.tipo_contenedor.trim()) {
      newErrors.tipo_contenedor = "El tipo de contenedor es obligatorio.";
    }
    if (
      !formData.fecha_ingreso ||
      isNaN(new Date(formData.fecha_ingreso).getTime())
    ) {
      newErrors.fecha_ingreso = "Fecha de ingreso no válida.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!token) {
      alert("No estás autenticado. Por favor, inicia sesión.");
      return;
    }
    if (!validate()) return;

    // Convertir el objeto de materiales en un arreglo de objetos con los campos requeridos
    const materialesArray = Object.entries(formData.materiales)
      .filter(([type, qty]) => parseInt(qty) > 0)
      .map(([type, qty]) => {
        // Buscar un transportista que tenga el mismo tipo de material y esté activo
        const transporte = transportistas.find(
          (t) =>
            t.tipo_material === type &&
            t.estado.toLowerCase() === "activo"
        );
        if (!transporte) {
          // Si no se encuentra un transportista adecuado, puedes asignar un valor por defecto o manejar el error.
          console.error(
            `No se encontró transportista activo para el tipo: ${type}`
          );
          // Aquí asignamos null o podrías asignar un valor por defecto.
          return null;
        }
        return {
          tipo_material: type,
          cantidad: parseInt(qty),
          transportista: transporte.id,
          // Se asignan valores por defecto para los otros campos obligatorios
          descripcion: "Sin descripción",
          proteccion: "Sin protección",
          tipo_contenedor: formData.tipo_contenedor,
          estado_del_contenedor: "No especificado",
          ventilacion: type === "peligrosos" ? "necesario" : "", // Dejar vacío si no es peligroso
        };
      })
      .filter((item) => item !== null);

    if (materialesArray.length === 0) {
      alert("Debe asignarse al menos un material con transportista válido.");
      return;
    }

    const dataToSend = {
      ...formData,
      fecha_ingreso: formData.fecha_ingreso
        ? dayjs(formData.fecha_ingreso).format("YYYY-MM-DD")
        : null,
      materiales: materialesArray,
    };

    // Opcional: Si "cantidad" no forma parte del modelo PuntoLimpio, puedes eliminarlo:
    // delete dataToSend.cantidad;

    fetch("http://127.0.0.1:8000/api/puntolimpio/registro/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(dataToSend),
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
        console.log("Punto Limpio creado:", data);
        navigate("/puntolimpio", {
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
    { value: "papel_carton", label: "Papel y Cartón", icon: <FileText /> },
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

            {Object.keys(errors).length > 0 && (
              <Alert severity="error">
                {Object.values(errors).map((err, index) => (
                  <div key={index}>{err}</div>
                ))}
              </Alert>
            )}

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
                              <Typography sx={{ marginLeft: 1 }}>
                                {material.label}
                              </Typography>
                            </Box>
                            <TextField
                              label="Cantidad"
                              type="number"
                              value={formData.materiales[material.value] || ""}
                              onChange={(e) =>
                                handleMaterialQuantityChange(
                                  material.value,
                                  e.target.value
                                )
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
                          renderInput={(params) => (
                            <TextField {...params} fullWidth required />
                          )}
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
