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
  Paper,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const steps = ['Información General', 'Detalles de la Obra', 'Equipo Responsable'];

const AltaObra = () => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();


  const validate = () => {
    let newErrors = {};

    if (!formData.nombreObra.trim()) {
      newErrors.nombreObra = "El nombre de la obra es obligatorio.";
    }
    if (!formData.localidad.trim()) {
      newErrors.localidad = "La localidad es obligatoria.";
    }
    if (!formData.barrio.trim()) {
      newErrors.barrio = "El barrio es obligatorio.";
    }
    if (!formData.direccion.trim()) {
      newErrors.direccion = "La dirección es obligatoria.";
    }
    if (!/^[0-9]+$/.test(formData.visitasMes)) {
      newErrors.visitasMes = "Debe ser un número válido.";
    }
    if (!formData.inicioObra || isNaN(new Date(formData.inicioObra).getTime())) {
      newErrors.inicioObra = "Fecha de inicio no válida.";
    }
    if (!formData.duracionObra.trim()) {
      newErrors.duracionObra = "La duración de la obra es obligatoria.";
    }
    if (!formData.etapaObra.trim()) {
      newErrors.etapaObra = "La etapa de la obra es obligatoria.";
    }
    if (!formData.jefeObra.trim()) {
      newErrors.jefeObra = "El nombre del jefe de obra es obligatorio.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailJefe)) {
      newErrors.emailJefe = "Correo electrónico inválido.";
    }
    if (!/^\d{9}$/.test(formData.telefonoJefe)) {
      newErrors.telefonoJefe = "El teléfono debe tener exactamente 9 dígitos.";
    }
    if (!formData.capataz.trim()) {
      newErrors.capataz = "El nombre del capataz es obligatorio.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailCapataz)) {
      newErrors.emailCapataz = "Correo electrónico inválido.";
    }
    if (!/^\d{9}$/.test(formData.telefonoCapataz)) {
      newErrors.telefonoCapataz = "El teléfono debe tener exactamente 9 dígitos.";
    }
    if (!formData.encargado.trim()) {
      newErrors.encargado = "El nombre del encargado es obligatorio.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailEncargado)) {
      newErrors.emailEncargado = "Correo electrónico inválido.";
    }
    if (!/^\d{9}$/.test(formData.telefonoEncargado)) {
      newErrors.telefonoEncargado = "El teléfono debe tener exactamente 9 dígitos.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const obraData = {
      cliente: 1,
      nombre_obra: formData.nombreObra,
      localidad: formData.localidad,
      barrio: formData.barrio,
      direccion: formData.direccion,
      inicio_obra: formData.inicioObra
        ? formData.inicioObra.toISOString().split('T')[0]
        : null,
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
      cronograma: 'Sin cronograma',
      pedido: formData.pedido || 'No especificado',
    };

    console.log('Datos enviados:', obraData);

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado. El usuario debe iniciar sesión.');
      setErrorMessage('Por favor, inicie sesión para registrar la obra.');
      setIsLoading(false);
      navigate('/login');
      return;
    }

    fetch('http://127.0.0.1:8000/api/obras/registro/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(obraData),
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((errorText) => {
            console.error('Respuesta de error:', errorText);
            throw new Error(errorText);
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log('Obra creada:', data);
        navigate('/listadeobras', { state: { successMessage: data.mensaje } });
      })
      .catch((err) => {
        console.error('Error al dar de alta la obra:', err);
        // Personalizar mensaje de error según lo sucedido
        if (err.message.toLowerCase().includes("email")) {
          setErrorMessage("El email proporcionado ya está registrado. Por favor, utiliza otro email.");
        } else {
          setErrorMessage("Error al dar de alta la obra. Intenta nuevamente.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
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
      <Container
        maxWidth="md"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Paper elevation={3} sx={{ padding: 6, borderRadius: 3 }}>
            <Typography variant="h3" gutterBottom sx={{ textAlign: 'center' }}>
              Registro de Obra
            </Typography>

            {/* Stepper para los pasos */}
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {/* Mostrar error con Alert */}
            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}

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
                          onChange={(newValue) =>
                            setFormData((prev) => ({ ...prev, inicioObra: newValue }))
                          }
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
              <Grid container spacing={2} sx={{ mt: 4 }}>
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
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isLoading}
                      startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
                    >
                      {isLoading ? "Procesando..." : "Finalizar"}
                    </Button>
                  </Grid>
                )}
              </Grid>
            </form>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default AltaObra;
