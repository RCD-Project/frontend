import React, { useState } from 'react';
import { 
  Container, 
  TextField, 
  Button, 
  Grid, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel, 
  MenuItem 
} from '@mui/material';
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
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
    // Limpia mensaje de error si se pasa a otro step
    setErrorMessage('');
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setErrorMessage('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Si se cambia el email, limpiamos el error
    if (e.target.name === 'email') {
      setErrorMessage('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Mapeamos los nombres de campo para que coincidan con el modelo de Django
    const payload = {
      nombre: formData.nombre,
      contacto: formData.contacto,
      email: formData.email,
      tipo_vehiculo: formData.tipoVehiculo,
      tipo_material: formData.tipoMaterial,
      estado: 'activo', // Se asigna por defecto como activo
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/transportistas/registro/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        // Intentamos extraer un mensaje de error
        const errorData = await response.json();
        // Supongamos que el error relacionado al email viene en errorData.email (como un arreglo)
        const mensaje = errorData.email ? errorData.email[0] : response.statusText;
        throw new Error(mensaje);
      }
      
      const data = await response.json();
      console.log('Transportista creado:', data);
      // Redirige a /transportistas al finalizar
      navigate('/transportistas');
    } catch (error) {
      console.error('Error al crear el transportista:', error);
      setErrorMessage(error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Alta Transportista
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
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
              <Grid item xs={12}>
                <TextField 
                  label="Email" 
                  type="email" 
                  fullWidth 
                  name="email" 
                  value={formData.email} 
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
                  label="Tipo de Vehículo" 
                  fullWidth 
                  name="tipoVehiculo" 
                  value={formData.tipoVehiculo} 
                  onChange={handleChange} 
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Tipo de Material"
                  fullWidth
                  name="tipoMaterial"
                  value={formData.tipoMaterial}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="escombro_limpio">Escombro Limpio</MenuItem>
                  <MenuItem value="plastico">Plástico</MenuItem>
                  <MenuItem value="papel_carton">Papel y Cartón</MenuItem>
                  <MenuItem value="metales">Metales</MenuItem>
                  <MenuItem value="madera">Madera</MenuItem>
                  <MenuItem value="mezclados">Mezclados</MenuItem>
                  <MenuItem value="peligrosos">Peligrosos</MenuItem>
                </TextField>
              </Grid>
            </>
          )}
        </Grid>
        {errorMessage && (
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Typography>
        )}
        <Grid container spacing={2} justifyContent="space-between" style={{ marginTop: '20px' }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack}>
              Atrás
            </Button>
          )}
          {activeStep < steps.length - 1 && (
            <Button onClick={handleNext}>
              Siguiente
            </Button>
          )}
          {activeStep === steps.length - 1 && (
            <Button type="submit" variant="contained" color="primary">
              Finalizar
            </Button>
          )}
        </Grid>
      </form>
    </Container>
  );
};

export default AltaTransportistas;
