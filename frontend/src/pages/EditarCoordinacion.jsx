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
  CircularProgress,
  MenuItem
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const steps = ["Información General", "Fechas y Relaciones", "Comentarios"];

const EditarCoordinacion = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    descripcion: "",
    observaciones: "",
    tipo_material: "",
    pesaje: "",
    fecha_solicitud: null,
    fecha_retiro: null,
    obra: "",
    empresa_tratamiento: "",
    transportista: "",
    comentarios: "",
  });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  // Se obtiene el token desde localStorage
  const token = localStorage.getItem("token");

  // Opcional: listas para campos relacionales
  const [obras, setObras] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [transportistas, setTransportistas] = useState([]);

  // Cargar datos de la coordinación
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8000/api/coordinacionretiro/${id}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            setErrorMessage("Error al obtener los datos de la coordinación.");
          }
          return response.json();
        })
        .then((data) => {
          setFormData({
            descripcion: data.descripcion || "",
            observaciones: data.observaciones || "",
            tipo_material: data.tipo_material || "",
            pesaje: data.pesaje || "",
            fecha_solicitud: data.fecha_solicitud ? dayjs(data.fecha_solicitud) : null,
            fecha_retiro: data.fecha_retiro ? dayjs(data.fecha_retiro) : null,
            obra: data.obra || "",
            empresa_tratamiento: data.empresa_tratamiento || "",
            transportista: data.transportista || "",
            comentarios: data.comentarios || "",
          });
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [id, token]);

  // Cargar listas para select
  useEffect(() => {
    fetch("http://localhost:8000/api/obras/aprobadas/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setObras(data))
      .catch((err) => console.error("Error al obtener obras:", err));

    fetch("http://localhost:8000/api/empresas/lista/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setEmpresas(data))
      .catch((err) => console.error("Error al obtener empresas:", err));

    fetch("http://localhost:8000/api/transportistas/lista/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setTransportistas(data))
      .catch((err) => console.error("Error al obtener transportistas:", err));
  }, [token]);

  const validateStep = (step) => {
    let newErrors = {};

    if (step === 0) {
      if (!formData.descripcion.trim()) {
        newErrors.descripcion = "La descripción es obligatoria.";
      }
      if (!formData.tipo_material.trim()) {
        newErrors.tipo_material = "El tipo de material es obligatorio.";
      }
      if (!formData.pesaje.trim() || isNaN(Number(formData.pesaje))) {
        newErrors.pesaje = "El pesaje debe ser numérico.";
      }
    } else if (step === 1) {
      if (!formData.fecha_solicitud || isNaN(new Date(formData.fecha_solicitud).getTime())) {
        newErrors.fecha_solicitud = "Fecha de solicitud es obligatoria y debe ser válida.";
      }
      if (!formData.obra) {
        newErrors.obra = "Debe seleccionar una obra.";
      }
      if (!formData.empresa_tratamiento) {
        newErrors.empresa_tratamiento = "Debe seleccionar una empresa de tratamiento.";
      }
      if (!formData.transportista) {
        newErrors.transportista = "Debe seleccionar un transportista.";
      }
    }
    // Validación para comentarios si es necesaria en el paso 2

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChangeSolicitud = (newValue) => {
    setFormData({ ...formData, fecha_solicitud: newValue });
  };

  const handleDateChangeRetiro = (newValue) => {
    setFormData({ ...formData, fecha_retiro: newValue });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateStep(activeStep)) return;

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        fecha_solicitud: formData.fecha_solicitud ? formData.fecha_solicitud.format("YYYY-MM-DD") : null,
        fecha_retiro: formData.fecha_retiro ? formData.fecha_retiro.format("YYYY-MM-DD") : null,
      };

      const response = await fetch(`http://localhost:8000/api/coordinacionretiro/${id}/actualizar/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Coordinación actualizada:", data);
        navigate("/coordinaciones");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.detail || "Ocurrió un error al actualizar la coordinación.");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      setErrorMessage("Error en la petición.");
    } finally {
      setIsLoading(false);
    }
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
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ padding: 6, marginTop: 6, borderRadius: 3 }}>
          {/* Título con margen inferior */}
          <Box mb={3}>
            <Typography variant="h3" align="center">
              Editar Coordinación
            </Typography>
          </Box>

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMessage}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {successMessage}
            </Alert>
          )}

          {/* Stepper con margen inferior */}
          <Box mb={3}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Formulario con margen inferior */}
          <Box mb={3}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {activeStep === 0 && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        label="Descripción"
                        fullWidth
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        error={!!errors.descripcion}
                        helperText={errors.descripcion}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Observaciones"
                        fullWidth
                        name="observaciones"
                        value={formData.observaciones}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Tipo de Material"
                        fullWidth
                        name="tipo_material"
                        value={formData.tipo_material}
                        onChange={handleChange}
                        error={!!errors.tipo_material}
                        helperText={errors.tipo_material}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Pesaje"
                        fullWidth
                        name="pesaje"
                        value={formData.pesaje}
                        onChange={handleChange}
                        error={!!errors.pesaje}
                        helperText={errors.pesaje}
                      />
                    </Grid>
                  </>
                )}

                {activeStep === 1 && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Fecha de Solicitud"
                          value={formData.fecha_solicitud || null}
                          onChange={handleDateChangeSolicitud}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              error={!!errors.fecha_solicitud}
                              helperText={errors.fecha_solicitud}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Fecha de Retiro"
                          value={formData.fecha_retiro || null}
                          onChange={handleDateChangeRetiro}
                          renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        select
                        label="Obra"
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
                    <Grid item xs={12} sm={4}>
                      <TextField
                        select
                        label="Empresa de Tratamiento"
                        fullWidth
                        name="empresa_tratamiento"
                        value={formData.empresa_tratamiento}
                        onChange={handleChange}
                        error={!!errors.empresa_tratamiento}
                        helperText={errors.empresa_tratamiento}
                      >
                        {empresas.map((empresa) => (
                          <MenuItem key={empresa.id} value={empresa.id}>
                            {empresa.nombre}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        select
                        label="Transportista"
                        fullWidth
                        name="transportista"
                        value={formData.transportista}
                        onChange={handleChange}
                        error={!!errors.transportista}
                        helperText={errors.transportista}
                      >
                        {transportistas.map((trans) => (
                          <MenuItem key={trans.id} value={trans.id}>
                            {trans.nombre}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </>
                )}

                {activeStep === 2 && (
                  <Grid item xs={12}>
                    <TextField
                      label="Comentarios"
                      fullWidth
                      name="comentarios"
                      value={formData.comentarios}
                      onChange={handleChange}
                      multiline
                      rows={4}
                    />
                  </Grid>
                )}
              </Grid>

              <Grid container spacing={3} justifyContent="space-between" sx={{ marginTop: 3 }}>
                <Button
                  onClick={handleBack}
                  size="large"
                  disabled={activeStep === 0}
                  sx={{ visibility: activeStep === 0 ? "hidden" : "visible" }}
                >
                  Atrás
                </Button>
                {activeStep < steps.length - 1 && (
                  <Button onClick={handleNext} size="large">
                    Siguiente
                  </Button>
                )}
                {activeStep === steps.length - 1 && (
                  <Button type="submit" variant="contained" color="primary" size="large" disabled={isLoading}>
                    {isLoading ? <CircularProgress size={24} /> : "Guardar Cambios"}
                  </Button>
                )}
              </Grid>
            </form>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default EditarCoordinacion;
