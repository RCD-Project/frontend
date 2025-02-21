import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Alert,
} from "@mui/material";
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
    nombre_contacto: "",
    mail: "",
    fecha_ingreso: null,
    razon_social: "",
    direccion_fiscal: "",
    rut: "",
    cronograma: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
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
    setFormData({ ...formData, fecha_ingreso: newValue });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Convertir la fecha a formato "YYYY-MM-DD" si existe
    const clientData = {
      ...formData,
      fecha_ingreso: formData.fecha_ingreso
        ? formData.fecha_ingreso.toISOString().split("T")[0]
        : null,
    };

    console.log("Enviando formulario:", clientData);

    fetch("http://127.0.0.1:8000/api/clientes/registro/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clientData),
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((errorText) => {
            console.error("Respuesta de error:", errorText);
            throw new Error(errorText);
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log("Cliente registrado:", data);
        setSuccessMessage("Cliente registrado con éxito.");
        // Redirigir a la lista de clientes y pasar un mensaje de éxito
        navigate("/listadeclientes", {
          state: { successMessage: "Cliente registrado con éxito." },
        });
      })
      .catch((err) => {
        console.error("Error al dar de alta el cliente:", err);
        alert("Error al dar de alta el cliente:\n" + err.message);
      });
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 6, marginTop: 6, borderRadius: 3 }}>
        <Typography variant="h3" gutterBottom>
          Alta Cliente
        </Typography>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
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
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Dirección"
                    fullWidth
                    name="direccion"
                    value={formData.direccion}
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
                    label="Nombre de Contacto"
                    fullWidth
                    name="nombre_contacto"
                    value={formData.nombre_contacto}
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
                    label="Razón Social"
                    fullWidth
                    name="razon_social"
                    value={formData.razon_social}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Dirección Fiscal"
                    fullWidth
                    name="direccion_fiscal"
                    value={formData.direccion_fiscal}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="RUT"
                    fullWidth
                    name="rut"
                    value={formData.rut}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Cronograma"
                    fullWidth
                    name="cronograma"
                    value={formData.cronograma}
                    onChange={handleChange}
                  />
                </Grid>
              </>
            )}
            {activeStep === 2 && (
              <>
                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Fecha de Ingreso"
                      value={formData.fecha_ingreso || null}
                      onChange={handleDateChange}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth required />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    name="mail"
                    value={formData.mail}
                    onChange={handleChange}
                    required
                  />
                </Grid>
              </>
            )}
          </Grid>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {activeStep !== 0 && (
              <Grid item xs={6}>
                <Button onClick={handleBack}>Atrás</Button>
              </Grid>
            )}
  
            {activeStep === 0 && (
              <Grid item xs={12} sx={{ textAlign: 'right' }}>
                <Button onClick={handleNext}>Siguiente</Button>
              </Grid>
            )}
  
            {activeStep !== 0 && activeStep < steps.length - 1 && (
              <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Button onClick={handleNext}>Siguiente</Button>
              </Grid>
            )}
  
            {activeStep === steps.length - 1 && (
              <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Button type="submit" variant="contained" color="primary">Finalizar</Button>
              </Grid>
            )}
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AltaCliente;
