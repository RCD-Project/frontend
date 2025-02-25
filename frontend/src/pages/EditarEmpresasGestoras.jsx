import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Grid, Typography, Stepper, Step, StepLabel, Paper } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const steps = ["Información General", "Detalles del Contacto", "Ubicación"];

const EditarEmpresaGestora = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    nombre: "",
    ubicacion: "",
    contacto: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  useEffect(() => {
    if (id) {
      // Realiza la petición para obtener los datos de la empresa gestora
      fetch(`http://localhost:8000/api/empresas-gestoras/${id}/`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al obtener los datos de la empresa gestora");
          }
          return response.json();
        })
        .then((data) => {
          // Actualiza el estado formData con los datos obtenidos
          setFormData({
            nombre: data.nombre,
            ubicacion: data.ubicacion,
            contacto: data.contacto,
          });
        })
        .catch((error) => console.error("Error:", error));
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...formData,
      };

      const response = await fetch(`http://localhost:8000/api/empresas-gestoras/${id}/actualizar/`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    
      if (response.ok) {
        const data = await response.json();
        console.log("Empresa Gestora actualizada:", data);
        navigate("/empresas-gestoras");
      } else {
        console.error("Error al actualizar la empresa gestora. Código de error:", response.status);
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
          <Typography variant="h3" gutterBottom>Editar Empresa Gestora</Typography>
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
                    />
                  </Grid>
                </>
              )}
              {activeStep === 1 && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      label="Contacto"
                      fullWidth
                      name="contacto"
                      value={formData.contacto}
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
                      label="Ubicación"
                      fullWidth
                      name="ubicacion"
                      value={formData.ubicacion}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                </>
              )}
            </Grid>
            <Grid container spacing={3} justifyContent="space-between" sx={{ marginTop: 3 }}>
              {activeStep !== 0 && (<Button onClick={handleBack} size="large">Atrás</Button>)}
              {activeStep < steps.length - 1 && (<Button onClick={handleNext} size="large">Siguiente</Button>)}
              {activeStep === steps.length - 1 && (<Button type="submit" variant="contained" color="primary" size="large">Guardar Cambios</Button>)}
            </Grid>
          </form>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default EditarEmpresaGestora;
