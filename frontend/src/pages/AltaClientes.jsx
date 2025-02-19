import React, { useState } from "react";
import { Container, TextField, Button, Grid, Typography, Stepper, Step, StepLabel, Paper } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const steps = ["Información General", "Detalles Fiscales", "Contacto"];

const AltaCliente = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    contacto: "",
    nombreContacto: "",
    mail: "",
    fechaIngreso: null,
    razonSocial: "",
    direccionFiscal: "",
    rut: "",
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
    setFormData({ ...formData, fechaIngreso: newValue });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Enviando formulario:", formData);
    navigate("/");
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 6, marginTop: 6, borderRadius: 3 }}>
        <Typography variant="h3" gutterBottom>Alta Cliente</Typography>
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
                <Grid item xs={12}><TextField label="Nombre" fullWidth name="nombre" value={formData.nombre} onChange={handleChange} required/></Grid>
                <Grid item xs={12}><TextField label="Dirección" fullWidth name="direccion" value={formData.direccion} onChange={handleChange} required/></Grid>
                <Grid item xs={12}><TextField label="Contacto" fullWidth name="contacto" value={formData.contacto} onChange={handleChange} required/></Grid>
                <Grid item xs={12}><TextField label="Nombre de Contacto" fullWidth name="nombreContacto" value={formData.nombreContacto} onChange={handleChange} required/></Grid>
              </>
            )}
            {activeStep === 1 && (
              <>
                <Grid item xs={12}><TextField label="Razón Social" fullWidth name="razonSocial" value={formData.razonSocial} onChange={handleChange} required/></Grid>
                <Grid item xs={12}><TextField label="Dirección Fiscal" fullWidth name="direccionFiscal" value={formData.direccionFiscal} onChange={handleChange} required/></Grid>
                <Grid item xs={12}><TextField label="RUT" fullWidth name="rut" value={formData.rut} onChange={handleChange} required/></Grid>
              </>
            )}
            {activeStep === 2 && (
              <>
                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Fecha de Ingreso"
                      value={formData.fechaIngreso || null}
                      onChange={handleDateChange}
                      renderInput={(params) => <TextField {...params} fullWidth required />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}><TextField label="Email" type="email" fullWidth name="mail" value={formData.mail} onChange={handleChange} required/></Grid>
              </>
            )}
          </Grid>
          <Grid container spacing={3} justifyContent="space-between" style={{ marginTop: '30px' }}>
            {activeStep !== 0 && (<Button onClick={handleBack} size="large">Atrás</Button>)}
            {activeStep < steps.length - 1 && (<Button onClick={handleNext} size="large">Siguiente</Button>)}
            {activeStep === steps.length - 1 && (<Button type="submit" variant="contained" color="primary" size="large">Finalizar</Button>)}
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AltaCliente;
