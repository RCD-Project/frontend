import React, { useState } from 'react';
import { Container, TextField, Button, Grid, Typography, Stepper, Step, StepLabel, MenuItem } from '@mui/material';
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

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Enviando formulario:', formData);
    navigate('/');
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Alta Transportista</Typography>
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
              <Grid item xs={12}><TextField label="Nombre" fullWidth name="nombre" value={formData.nombre} onChange={handleChange} required/></Grid>
              <Grid item xs={12}><TextField label="Contacto" fullWidth name="contacto" value={formData.contacto} onChange={handleChange} required/></Grid>
              <Grid item xs={12}><TextField label="Email" type="email" fullWidth name="email" value={formData.email} onChange={handleChange} required/></Grid>
            </>
          )}

          {activeStep === 1 && (
            <>
              <Grid item xs={12}><TextField label="Tipo de Vehículo" fullWidth name="tipoVehiculo" value={formData.tipoVehiculo} onChange={handleChange} required/></Grid>
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
                  <MenuItem value="Escombro limpio">Escombro limpio</MenuItem>
                  <MenuItem value="Plástico">Plástico</MenuItem>
                  <MenuItem value="Papel y cartón">Papel y cartón</MenuItem>
                  <MenuItem value="Metales">Metales</MenuItem>
                  <MenuItem value="Madera">Madera</MenuItem>
                  <MenuItem value="Mezclados">Mezclados</MenuItem>
                  <MenuItem value="Peligrosos">Peligrosos</MenuItem>
                </TextField>
              </Grid>
            </>
          )}
        </Grid>
        <Grid container spacing={2} justifyContent="space-between" style={{ marginTop: '20px' }}>
          {activeStep !== 0 && (<Button onClick={handleBack}>Atrás</Button>)}
          {activeStep < steps.length - 1 && (<Button onClick={handleNext}>Siguiente</Button>)}
          {activeStep === steps.length - 1 && (<Button type="submit" variant="contained" color="primary">Finalizar</Button>)}
        </Grid>
      </form>
    </Container>
  );
};

export default AltaTransportistas;