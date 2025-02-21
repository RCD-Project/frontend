import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Grid, Typography, Stepper, Step, StepLabel, MenuItem } from '@mui/material';
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
  const [obras, setObras] = useState([]);

  const navigate = useNavigate();

  // Obtener las obras aprobadas desde la API
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/obras/aprobadas/')
      .then(response => response.json())
      .then(data => setObras(data))
      .catch(error => console.error('Error fetching obras:', error));
  }, []);

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
      <Typography variant="h4" gutterBottom sx={{ marginTop: 2 }}>
        Alta Capacitación
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
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Fecha"
                    value={formData.fecha}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} fullWidth required />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Motivo"
                  fullWidth
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Obra"
                  fullWidth
                  name="obra"
                  value={formData.obra}
                  onChange={handleChange}
                  required
                >
                  {obras.map((obra) => (
                    <MenuItem key={obra.id} value={obra.nombre_obra}>
                      {obra.nombre_obra}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Técnico"
                  fullWidth
                  name="tecnico"
                  value={formData.tecnico}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Comentario"
                  fullWidth
                  multiline
                  rows={4}
                  name="comentario"
                  value={formData.comentario}
                  onChange={handleChange}
                />
              </Grid>
            </>
          )}
        </Grid>
        <Grid container spacing={2} justifyContent="flex-end" style={{ marginTop: '20px' }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack}>Atrás</Button>
          )}
          {activeStep < steps.length - 1 && (
            <Button onClick={handleNext}>Siguiente</Button>
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

export default AltaCapacitaciones;
