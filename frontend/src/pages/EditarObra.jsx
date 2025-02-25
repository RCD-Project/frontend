import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Grid, Typography, Stepper, Step, StepLabel, Paper } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const steps = ['Información General', 'Detalles de la Obra', 'Equipo Responsable'];

const EditarObra = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    nombreObra: '',
    localidad: '',
    barrio: '',
    direccion: '',
    visitasMes: '',
    inicioObra: null,
    duracionObra: '',
    etapaObra: '',
    jefeObra: '',
    emailJefe: '',
    telefonoJefe: '',
    capataz: '',
    emailCapataz: '',
    telefonoCapataz: '',
    encargado: '',
    emailEncargado: '',
    telefonoEncargado: '',
    imagen: null,
    pedido: '',
  });

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  // Cargamos los datos actuales de la obra para editar
  useEffect(() => {
    if (id) {
      fetch(`http://127.0.0.1:8000/api/obras/${id}/`)
        .then(response => {
          if (!response.ok) {
            throw new Error("Error al obtener datos de la obra");
          }
          return response.json();
        })
        .then(data => {
          // Convertimos los nombres de propiedad (suponiendo que el backend utiliza snake_case)
          setFormData({
            nombreObra: data.nombre_obra || '',
            localidad: data.localidad || '',
            barrio: data.barrio || '',
            direccion: data.direccion || '',
            visitasMes: data.cant_visitas_mes || '',
            inicioObra: data.inicio_obra ? dayjs(data.inicio_obra) : null,
            duracionObra: data.duracion_obra || '',
            etapaObra: data.etapa_obra || '',
            jefeObra: data.nombre_jefe_obra || '',
            emailJefe: data.mail_jefe_obra || '',
            telefonoJefe: data.telefono_jefe_obra || '',
            capataz: data.nombre_capataz || '',
            emailCapataz: data.mail_capataz || '',
            telefonoCapataz: data.telefono_capataz || '',
            encargado: data.nombre_encargado_supervisor || '',
            emailEncargado: data.mail_encargado_supervisor || '',
            telefonoEncargado: data.telefono_encargado_supervisor || '',
            imagen: data.imagenes || null,
            pedido: data.pedido || '',
          });
        })
        .catch(error => console.error("Error:", error));
    }
  }, [id]);

  const handleNext = () => setActiveStep(prev => prev + 1);
  const handleBack = () => setActiveStep(prev => prev - 1);
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleDateChange = (newValue) => {
    setFormData(prev => ({ ...prev, inicioObra: newValue }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Convertimos los datos para enviar a la API (por ejemplo, formateamos la fecha)
    const obraData = {
      cliente: 1,
      nombre_obra: formData.nombreObra,
      localidad: formData.localidad,
      barrio: formData.barrio,
      direccion: formData.direccion,
      inicio_obra: formData.inicioObra ? formData.inicioObra.toISOString().split('T')[0] : null,
      duracion_obra: formData.duracionObra,
      etapa_obra: formData.etapaObra,
      nombre_jefe_obra: formData.jefeObra,
      mail_jefe_obra: formData.emailJefe,
      telefono_jefe_obra: formData.telefonoJefe,
      nombre_capataz: formData.capataz,
      mail_capataz: formData.emailCapataz,
      telefono_capataz: formData.telefonoCapataz,
      nombre_encargado_supervisor: formData.encargado,
      mail_encargado_supervisor: formData.emailEncargado,
      telefono_encargado_supervisor: formData.telefonoEncargado,
      cant_visitas_mes: formData.visitasMes,
      imagenes: formData.imagen,
      cronograma: "Sin cronograma",
      pedido: formData.pedido || "No especificado",
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/obras/${id}/actualizar/`, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obraData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Obra actualizada:", data);
        navigate("/listadeobras", { state: { successMessage: "Obra actualizada correctamente" } });
      } else {
        console.error("Error al actualizar la obra. Código de error:", response.status);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
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
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ padding: 6, marginTop: 6, borderRadius: 3 }}>
          <Typography variant="h3" gutterBottom>Editar Obra</Typography>
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
                      label="Nombre de la Obra"
                      fullWidth
                      name="nombreObra"
                      value={formData.nombreObra}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Localidad"
                      fullWidth
                      name="localidad"
                      value={formData.localidad}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Barrio"
                      fullWidth
                      name="barrio"
                      value={formData.barrio}
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
                      label="Cantidad de Visitas al Mes"
                      fullWidth
                      name="visitasMes"
                      type="number"
                      value={formData.visitasMes}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                </>
              )}
              {activeStep === 1 && (
                <>
                  <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Inicio de Obra"
                        value={formData.inicioObra}
                        onChange={handleDateChange}
                        renderInput={(params) => <TextField {...params} fullWidth required />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Duración de Obra"
                      fullWidth
                      name="duracionObra"
                      value={formData.duracionObra}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Etapa de Obra"
                      fullWidth
                      name="etapaObra"
                      value={formData.etapaObra}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                </>
              )}
              {activeStep === 2 && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      label="Jefe de Obra"
                      fullWidth
                      name="jefeObra"
                      value={formData.jefeObra}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Email del Jefe"
                      fullWidth
                      name="emailJefe"
                      type="email"
                      value={formData.emailJefe}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Teléfono del Jefe"
                      fullWidth
                      name="telefonoJefe"
                      type="tel"
                      value={formData.telefonoJefe}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Capataz"
                      fullWidth
                      name="capataz"
                      value={formData.capataz}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Email del Capataz"
                      fullWidth
                      name="emailCapataz"
                      type="email"
                      value={formData.emailCapataz}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Teléfono del Capataz"
                      fullWidth
                      name="telefonoCapataz"
                      type="tel"
                      value={formData.telefonoCapataz}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Encargado"
                      fullWidth
                      name="encargado"
                      value={formData.encargado}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Email del Encargado"
                      fullWidth
                      name="emailEncargado"
                      type="email"
                      value={formData.emailEncargado}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Teléfono del Encargado"
                      fullWidth
                      name="telefonoEncargado"
                      type="tel"
                      value={formData.telefonoEncargado}
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
    </ThemeProvider>
  );
};

export default EditarObra;
