import React, { useState } from 'react';
import { Container, TextField, Button, Grid, Typography, Stepper, Step, StepLabel } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useNavigate } from 'react-router-dom';

const steps = ['Información de la Capacitación'];

const AltaCapacitaciones = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    fecha: null,
    motivo: '',
    obra: '',
    tecnico: '',
    comentario: '',
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

  const handleDateChange = (newValue) => {
    setFormData({ ...formData, fecha: newValue });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Enviando formulario:', formData);
    navigate('/');
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Alta Capacitación</Typography>
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
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Fecha"
                    value={formData.fecha}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} fullWidth required />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}><TextField label="Motivo" fullWidth name="motivo" value={formData.motivo} onChange={handleChange} required/></Grid>
              <Grid item xs={12}><TextField label="Obra" fullWidth name="obra" value={formData.obra} onChange={handleChange} required/></Grid>
              <Grid item xs={12}><TextField label="Técnico" fullWidth name="tecnico" value={formData.tecnico} onChange={handleChange} required/></Grid>
              <Grid item xs={12}><TextField label="Comentario" fullWidth multiline rows={4} name="comentario" value={formData.comentario} onChange={handleChange}/></Grid>
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

export default AltaCapacitaciones;
