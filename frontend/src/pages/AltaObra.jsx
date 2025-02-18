import React, { useState } from 'react';
import { Container, TextField, Button, Grid, Typography, Stepper, Step, StepLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const steps = ['Información General', 'Detalles de la Obra', 'Equipo Responsable'];

const AltaObra = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    nombreObra: '',
    localidad: '',
    direccion: '',
    metrosCuadrados: '',
    cantidadPisos: '',
    pedido: '',
    inicioObra: null,
    duracionObra: '',
    etapaObra: '',
    estado: '',
    jefeObra: '',
    emailJefe: '',
    capataz: '',
    emailCapataz: '',
    encargado: '',
    emailEncargado: '',
    visitasMes: '',
    imagen: null,
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

  const handleImageChange = (e) => {
    setFormData({ ...formData, imagen: e.target.files[0] });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Enviando formulario:', formData);
    navigate('/listartransportistas');
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Registro de Obra</Typography>
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
              <Grid item xs={12}><TextField label="Nombre de la Obra" fullWidth name="nombreObra" value={formData.nombreObra} onChange={handleChange} required/></Grid>
              <Grid item xs={12}><TextField label="Localidad/Barrio" fullWidth name="localidad" value={formData.localidad} onChange={handleChange} required/></Grid>
              <Grid item xs={12}><TextField label="Dirección" fullWidth name="direccion" value={formData.direccion} onChange={handleChange} required/></Grid>
              <Grid item xs={6}><TextField label="Metros Cuadrados" fullWidth name="metrosCuadrados" type="number" value={formData.metrosCuadrados} onChange={handleChange} required/></Grid>
              <Grid item xs={6}><TextField label="Cantidad de Pisos" fullWidth name="cantidadPisos" type="number" value={formData.cantidadPisos} onChange={handleChange} required/></Grid>
              <Grid item xs={12}><TextField label="Pedido" fullWidth name="pedido" value={formData.pedido} onChange={handleChange} required/></Grid>
            </>
          )}

          {activeStep === 1 && (
            <>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Inicio de Obra"
                    value={formData.inicioObra}
                    onChange={(newValue) => setFormData({ ...formData, inicioObra: newValue })}
                    renderInput={(params) => <TextField {...params} fullWidth required />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6}><TextField label="Duración de Obra" fullWidth name="duracionObra" value={formData.duracionObra} onChange={handleChange} required/></Grid>
              <Grid item xs={12}><TextField label="Etapa de Obra" fullWidth name="etapaObra" value={formData.etapaObra} onChange={handleChange} required/></Grid>
              <Grid item xs={12}><TextField label="Estado" fullWidth name="estado" value={formData.estado} onChange={handleChange} required/></Grid>
            </>
          )}

          {activeStep === 2 && (
            <>
              <Grid item xs={12}><TextField label="Nombre Jefe de Obra" fullWidth name="jefeObra" value={formData.jefeObra} onChange={handleChange} required/></Grid>
              <Grid item xs={12}><TextField label="Email/Teléfono Jefe de Obra" fullWidth name="emailJefe" value={formData.emailJefe} onChange={handleChange} required/></Grid>
              <Grid item xs={12}><TextField label="Nombre Capataz" fullWidth name="capataz" value={formData.capataz} onChange={handleChange} required/></Grid>
              <Grid item xs={12}><TextField label="Email/Teléfono Capataz" fullWidth name="emailCapataz" value={formData.emailCapataz} onChange={handleChange} required/></Grid>
              <Grid item xs={12}><TextField label="Nombre Encargado/Supervisor" fullWidth name="encargado" value={formData.encargado} onChange={handleChange} required/></Grid>
              <Grid item xs={12}><TextField label="Email/Teléfono Encargado/Supervisor" fullWidth name="emailEncargado" value={formData.emailEncargado} onChange={handleChange} required/></Grid>
              <Grid item xs={6}><TextField label="Cantidad de Visitas al Mes" fullWidth name="visitasMes" type="number" value={formData.visitasMes} onChange={handleChange} required/></Grid>
              <Grid item xs={12}><input type="file" accept="image/*" onChange={handleImageChange} /></Grid>
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

export default AltaObra;
