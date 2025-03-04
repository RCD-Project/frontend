import React, { useState, useContext } from 'react';
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  Paper,
  Box,
} from '@mui/material';
import { AuthContext } from './context/AuthContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const steps = ['Información General', 'Detalles de Transporte'];

const AltaTransportistas = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    nombre: '',
    contacto: '',
    email: '',
    tipoVehiculo: '',
    tipoMaterial: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateStep = () => {
    let newErrors = {};
    if (activeStep === 0) {
      if (!formData.nombre.trim()) {
        newErrors.nombre = "El nombre es obligatorio.";
      }
      if (!/^\d{9}$/.test(formData.contacto)) {
        newErrors.contacto = "El contacto debe tener exactamente 9 dígitos numéricos.";
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Correo electrónico inválido.";
      }
    } else if (activeStep === 1) {
      if (!formData.tipoVehiculo.trim()) {
        newErrors.tipoVehiculo = "El tipo de vehículo es obligatorio.";
      }
      if (!formData.tipoMaterial) {
        newErrors.tipoMaterial = "Debe seleccionar un tipo de material.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      nombre: formData.nombre,
      contacto: formData.contacto,
      email: formData.email,
      tipo_vehiculo: formData.tipoVehiculo,
      tipo_material: formData.tipoMaterial,
      estado: 'activo', 
    };
  
    if (!validate()) {
      setLoading(false);
      return;
    }

    if (!token) {
      setErrorMessage('No estás autenticado. Por favor, inicia sesión.');
      setLoading(false);
      return;
    }

    try {
      
      const response = await fetch('http://127.0.0.1:8000/api/transportistas/registro/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar la empresa gestora');
      }

      setSuccessMessage("Empresa gestora registrada con éxito.");
      setTimeout(() => {
        navigate('/empresasgestoras');
      }, 2000);
  
      } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
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
      <Container
        maxWidth="md"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Paper elevation={3} sx={{ padding: 6, borderRadius: 3 }}>
          <Typography variant="h3" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
            Alta Transportista
          </Typography>

          {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}
            {successMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {successMessage}
              </Alert>
            )}


            <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
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
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mt: 4 }} justifyContent="flex-end">
                <Grid item>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={20} color="inherit" />}
                  >
                    {loading ? 'Registrando...' : 'Finalizar'}
                  </Button>
                  </Grid>
              </Grid>
            </form>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default AltaTransportistas;
