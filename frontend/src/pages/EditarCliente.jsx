import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Grid, Typography, Stepper, Step, StepLabel, Paper } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";

const steps = ["Información General", "Detalles Fiscales", "Contacto"];

const EditarCliente = () => {
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
  });

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  useEffect(() => {
    if (id) {
      // Realiza la petición para obtener los datos del cliente
      fetch(`http://localhost:8000/api/clientes/${id}/`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al obtener los datos del cliente");
          }
          return response.json();
        })
        .then((data) => {
          // Actualiza el estado formData con los datos obtenidos usando snake_case
          setFormData({
            nombre: data.nombre,
            direccion: data.direccion,
            contacto: data.contacto,
            nombre_contacto: data.nombre_contacto,
            mail: data.mail,
            fecha_ingreso: dayjs(data.fecha_ingreso),
            razon_social: data.razon_social,
            direccion_fiscal: data.direccion_fiscal,
            rut: data.rut,
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

  const handleDateChange = (newValue) => {
    setFormData({ ...formData, fecha_ingreso: newValue });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Convierte el objeto dayjs a una cadena en formato "YYYY-MM-DD"
      const payload = {
        ...formData,
        fecha_ingreso: formData.fecha_ingreso 
          ? formData.fecha_ingreso.format("YYYY-MM-DD") 
          : null,
      };
  
      const response = await fetch(`http://localhost:8000/api/clientes/${id}/actualizar/`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    
      if (response.ok) {
        const data = await response.json();
        console.log("Cliente actualizado:", data);
        navigate("/clientes");
      } else {
        console.error("Error al actualizar el cliente. Código de error:", response.status);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };
  

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 6, marginTop: 6, borderRadius: 3 }}>
        <Typography variant="h3" gutterBottom>Editar Cliente</Typography>
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
                      renderInput={(params) => <TextField {...params} fullWidth required />}
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
          <Grid container spacing={3} justifyContent="space-between" sx={{ marginTop: 3 }}>
            {activeStep !== 0 && (<Button onClick={handleBack} size="large">Atrás</Button>)}
            {activeStep < steps.length - 1 && (<Button onClick={handleNext} size="large">Siguiente</Button>)}
            {activeStep === steps.length - 1 && (<Button type="submit" variant="contained" color="primary" size="large">Guardar Cambios</Button>)}
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default EditarCliente;
