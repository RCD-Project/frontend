import React, { useState } from 'react';
import { Container, TextField, Button, Grid, Typography, Stepper, Step, StepLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const steps = ['Información General'];

const AltaEmpresasGestoras = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    nombre: '',
    ubicacion: '',
    contacto: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleNext = () => {
    setActiveStep(prevStep => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/empresas/registro/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar la empresa gestora');
      }
      const data = await response.json();
      console.log('Empresa gestora registrada:', data);
      navigate('/empresasgestoras');
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom sx={{ marginTop: 2 }}>
        Alta Empresa Gestora
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
        </Grid>
        {error && (
          <Typography color="error" style={{ marginTop: '10px' }}>
            {error}
          </Typography>
        )}
        <Grid container spacing={2} style={{ marginTop: '20px' }}>
          {activeStep !== 0 && (
            <Grid item xs={6}>
              <Button onClick={handleBack}>Atrás</Button>
            </Grid>
          )}
          
          {activeStep < steps.length - 1 && (
            <Grid item xs={6}>
              <Button onClick={handleNext}>Siguiente</Button>
            </Grid>
          )}

          {activeStep === steps.length - 1 && (
            <Grid item xs={12} sx={{ textAlign: 'right' }}>
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? 'Registrando...' : 'Finalizar'}
              </Button>
            </Grid>
          )}
        </Grid>

      </form>
    </Container>
  );
};

export default AltaEmpresasGestoras;
