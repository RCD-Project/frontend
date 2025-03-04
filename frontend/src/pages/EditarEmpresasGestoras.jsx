import React, { useState, useEffect, useContext } from "react";
import { Container, TextField, Button, Grid, Typography, Stepper, Step, StepLabel, Paper, MenuItem } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from "../pages/context/AuthContext";

const steps = ["Información General", "Detalles del Contacto", "Ubicación"];

const EditarEmpresaGestora = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    contacto: "",
    ubicacion: "",
  });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  // Obtenemos el token del contexto de autenticación
  const { token } = useContext(AuthContext);

  // Cargar datos actuales de la empresa gestora
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8000/api/empresas/${id}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al obtener los datos de la empresa gestora");
          }
          return response.json();
        })
        .then((data) => {
          setFormData({
            nombre: data.nombre || "",
            email: data.email || "",
            contacto: data.contacto || "",
            ubicacion: data.ubicacion || "",
          });
        })
        .catch((error) => {
          console.error("Error:", error);
          setErrorMessage("No se pudo cargar la información de la empresa gestora.");
        });
    }
  }, [id, token]);

  const validate = () => {
    let newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio.";
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Correo electrónico inválido.";
    }
    if (!/^\d{9}$/.test(formData.contacto)) {
      newErrors.contacto = "El contacto debe tener exactamente 9 dígitos numéricos.";
    }
    if (!formData.ubicacion.trim()) {
      newErrors.ubicacion = "La ubicación es obligatoria.";
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      nombre: formData.nombre,
      email: formData.email,
      contacto: formData.contacto,
      ubicacion: formData.ubicacion,
    };

    try {
      const response = await fetch(`http://localhost:8000/api/empresas/modificar/${id}/`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });
    
      if (response.ok) {
        const data = await response.json();
        console.log("Empresa Gestora actualizada:", data);
        navigate("/empresasgestoras");
      } else {
        console.error("Error al actualizar la empresa gestora. Código de error:", response.status);
        setErrorMessage("Error al actualizar la empresa gestora.");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      setErrorMessage("Ocurrió un error. Intenta nuevamente.");
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
          <Typography variant="h3" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
            Editar Empresa Gestora
          </Typography>

          {errorMessage && (
            <Typography variant="body1" color="error" align="center" sx={{ mb: 3 }}>
              {errorMessage}
            </Typography>
          )}

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
                      label="Nombre"
                      fullWidth
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      error={!!errors.nombre}
                      helperText={errors.nombre}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      fullWidth
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      error={!!errors.email}
                      helperText={errors.email}
                    />
                  </Grid>
                </>
              )}

              {activeStep === 1 && (
                <Grid item xs={12}>
                  <TextField
                    label="Contacto"
                    fullWidth
                    name="contacto"
                    value={formData.contacto}
                    onChange={handleChange}
                    required
                    error={!!errors.contacto}
                    helperText={errors.contacto}
                  />
                </Grid>
              )}

              {activeStep === 2 && (
                <Grid item xs={12}>
                  <TextField
                    label="Ubicación"
                    fullWidth
                    name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleChange}
                    required
                    error={!!errors.ubicacion}
                    helperText={errors.ubicacion}
                  />
                </Grid>
              )}
            </Grid>

            <Grid container spacing={2} justifyContent="space-between" sx={{ marginTop: 3 }}>
              {activeStep !== 0 && (
                <Grid item xs={6}>
                  <Button onClick={handleBack} size="large">Atrás</Button>
                </Grid>
              )}
              {activeStep < steps.length - 1 && (
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Button onClick={handleNext} size="large">Siguiente</Button>
                </Grid>
              )}
              {activeStep === steps.length - 1 && (
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Button type="submit" variant="contained" color="primary" size="large">
                    Guardar Cambios
                  </Button>
                </Grid>
              )}
            </Grid>
          </form>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default EditarEmpresaGestora;
