import React, { useState, useEffect, useContext } from 'react';
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AuthContext } from './context/AuthContext';

const steps = ['Información General', 'Detalles de la Obra', 'Equipo Responsable'];

const AltaObra = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estado para almacenar la lista de clientes aprobados.
  const [clientesOptions, setClientesOptions] = useState([]);
  // Estado para el cliente seleccionado.
  const [selectedCliente, setSelectedCliente] = useState("");
  // Estado para bloquear el dropdown (si se encontró el cliente por email)
  const [disableDropdown, setDisableDropdown] = useState(false);

  // En caso de que el usuario sea cliente, usamos su id de inmediato.
  const initialCliente = user && user.rol === 'cliente' ? String(user.id) : "";

  const [formData, setFormData] = useState({
    cliente: initialCliente,
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

  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Al cargar, obtenemos la lista de clientes aprobados y preseleccionamos:
  useEffect(() => {
    if (token) {
      fetch('http://127.0.0.1:8000/api/clientes/aprobados/', {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Datos de clientes:", data);
          setClientesOptions(data);
          // Buscamos el cliente cuyo email coincida (ya sea de client.email o client.usuario.email)
          const clientMatch = data.find((client) => {
            const email = (client.email || (client.usuario && client.usuario.email))?.trim().toLowerCase();
            return email === user.email.trim().toLowerCase();
          });
          if (clientMatch) {
            setSelectedCliente(String(clientMatch.id));
            setDisableDropdown(true);
          } else if (data.length > 0) {
            // Si no se encuentra coincidencia, preseleccionamos el primer cliente.
            setSelectedCliente(String(data[0].id));
          }
        })
        .catch((error) => console.error("Error al obtener clientes:", error));
    }
  }, [token, user]);

  // Sincronizamos el estado del cliente seleccionado en formData.
  useEffect(() => {
    setFormData((prev) => ({ ...prev, cliente: selectedCliente }));
  }, [selectedCliente]);

  const validateStep = (step) => {
    let newErrors = {};

    if (step === 0) {
      // Si el usuario no es cliente y no se ha seleccionado ninguno, es error.
      if (!(user && user.rol === 'cliente') && !formData.cliente) {
        newErrors.cliente = "Debes seleccionar un cliente.";
      }
      if (!formData.nombreObra.trim()) newErrors.nombreObra = "El nombre de la obra es obligatorio.";
      if (!formData.localidad.trim()) newErrors.localidad = "La localidad es obligatoria.";
      if (!formData.barrio.trim()) newErrors.barrio = "El barrio es obligatorio.";
      if (!formData.direccion.trim()) newErrors.direccion = "La dirección es obligatoria.";
      if (!/^[0-9]+$/.test(formData.visitasMes)) newErrors.visitasMes = "Debe ser un número válido.";
    } else if (step === 1) {
      if (!formData.inicioObra) newErrors.inicioObra = "Fecha de inicio no válida.";
      if (!formData.duracionObra.trim()) newErrors.duracionObra = "La duración de la obra es obligatoria.";
      if (!formData.etapaObra.trim()) newErrors.etapaObra = "La etapa de la obra es obligatoria.";
    } else if (step === 2) {
      if (!formData.jefeObra.trim()) newErrors.jefeObra = "El nombre del jefe de obra es obligatorio.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailJefe)) newErrors.emailJefe = "Correo electrónico inválido.";
      if (!/^\d{9}$/.test(formData.telefonoJefe)) newErrors.telefonoJefe = "El teléfono debe tener exactamente 9 dígitos.";
      if (!formData.capataz.trim()) newErrors.capataz = "El nombre del capataz es obligatorio.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailCapataz)) newErrors.emailCapataz = "Correo electrónico inválido.";
      if (!/^\d{9}$/.test(formData.telefonoCapataz)) newErrors.telefonoCapataz = "El teléfono debe tener exactamente 9 dígitos.";
      if (!formData.encargado.trim()) newErrors.encargado = "El nombre del encargado es obligatorio.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailEncargado)) newErrors.emailEncargado = "Correo electrónico inválido.";
      if (!/^\d{9}$/.test(formData.telefonoEncargado)) newErrors.telefonoEncargado = "El teléfono debe tener exactamente 9 dígitos.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleChange = (e) => {
    setSelectedCliente(e.target.value);
  };

  const handleDateChange = (newValue) => {
    setFormData((prev) => ({ ...prev, inicioObra: newValue }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    if (!validateStep(2)) {
      setIsLoading(false);
      return;
    }

    // Convertimos el cliente a número
    const clienteId = formData.cliente ? Number(formData.cliente) : null;
    if (!clienteId) {
      setErrorMessage("No se encontró un cliente válido.");
      setIsLoading(false);
      return;
    }

    const obraData = {
      cliente: clienteId,
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
      cronograma: 'Sin cronograma',
      pedido: formData.pedido || 'No especificado',
    };

    console.log("Enviando obraData:", obraData);

    const tokenLocal = localStorage.getItem('token');
    if (!tokenLocal) {
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
        'Authorization': `Token ${tokenLocal}`,
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
        navigate('/listadeobras', { state: { successMessage: data.mensaje } });
      })
      .catch((err) => {
        console.error('Error al dar de alta la obra:', err);
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
          <Paper elevation={3} sx={{ padding: 6, marginTop: 6, borderRadius: 3 }}>
            <Typography variant="h3" gutterBottom sx={{ textAlign: 'center' }}>
              Registro de Obra
            </Typography>

            {errorMessage && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {errorMessage}
              </Alert>
            )}

            {successMessage && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {successMessage}
              </Alert>
            )}

            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
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
                      <FormControl fullWidth>
                        <InputLabel id="cliente-label">Cliente</InputLabel>
                        <Select
                          labelId="cliente-label"
                          label="Cliente"
                          name="cliente"
                          value={selectedCliente}
                          onChange={handleChange}
                          disabled={disableDropdown}
                        >
                          {clientesOptions.length > 0 ? (
                            clientesOptions.map((client) => (
                              <MenuItem key={client.id} value={String(client.id)}>
                                {client.nombre}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem value="">
                              {user.email ? "No se encontró cliente registrado" : "Usuario no autenticado"}
                            </MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Nombre de la Obra"
                        fullWidth
                        name="nombreObra"
                        value={formData.nombreObra}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, nombreObra: e.target.value }))
                        }
                        error={!!errors.nombreObra}
                        helperText={errors.nombreObra}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Localidad"
                        fullWidth
                        name="localidad"
                        value={formData.localidad}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, localidad: e.target.value }))
                        }
                        error={!!errors.localidad}
                        helperText={errors.localidad}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Barrio"
                        fullWidth
                        name="barrio"
                        value={formData.barrio}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, barrio: e.target.value }))
                        }
                        error={!!errors.barrio}
                        helperText={errors.barrio}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Dirección"
                        fullWidth
                        name="direccion"
                        value={formData.direccion}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, direccion: e.target.value }))
                        }
                        error={!!errors.direccion}
                        helperText={errors.direccion}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Cantidad de Visitas al Mes"
                        fullWidth
                        name="visitasMes"
                        type="number"
                        value={formData.visitasMes}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, visitasMes: e.target.value }))
                        }
                        error={!!errors.visitasMes}
                        helperText={errors.visitasMes}
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
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              error={!!errors.inicioObra}
                              helperText={errors.inicioObra}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Duración de Obra"
                        fullWidth
                        name="duracionObra"
                        value={formData.duracionObra}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, duracionObra: e.target.value }))
                        }
                        error={!!errors.duracionObra}
                        helperText={errors.duracionObra}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Etapa de Obra"
                        fullWidth
                        name="etapaObra"
                        value={formData.etapaObra}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, etapaObra: e.target.value }))
                        }
                        error={!!errors.etapaObra}
                        helperText={errors.etapaObra}
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
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, jefeObra: e.target.value }))
                        }
                        error={!!errors.jefeObra}
                        helperText={errors.jefeObra}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Email del Jefe"
                        fullWidth
                        name="emailJefe"
                        type="email"
                        value={formData.emailJefe}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, emailJefe: e.target.value }))
                        }
                        error={!!errors.emailJefe}
                        helperText={errors.emailJefe}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Teléfono del Jefe"
                        fullWidth
                        name="telefonoJefe"
                        type="tel"
                        value={formData.telefonoJefe}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, telefonoJefe: e.target.value }))
                        }
                        error={!!errors.telefonoJefe}
                        helperText={errors.telefonoJefe}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Capataz"
                        fullWidth
                        name="capataz"
                        value={formData.capataz}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, capataz: e.target.value }))
                        }
                        error={!!errors.capataz}
                        helperText={errors.capataz}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Email del Capataz"
                        fullWidth
                        name="emailCapataz"
                        type="email"
                        value={formData.emailCapataz}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, emailCapataz: e.target.value }))
                        }
                        error={!!errors.emailCapataz}
                        helperText={errors.emailCapataz}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Teléfono del Capataz"
                        fullWidth
                        name="telefonoCapataz"
                        type="tel"
                        value={formData.telefonoCapataz}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, telefonoCapataz: e.target.value }))
                        }
                        error={!!errors.telefonoCapataz}
                        helperText={errors.telefonoCapataz}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Encargado"
                        fullWidth
                        name="encargado"
                        value={formData.encargado}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, encargado: e.target.value }))
                        }
                        error={!!errors.encargado}
                        helperText={errors.encargado}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Email del Encargado"
                        fullWidth
                        name="emailEncargado"
                        type="email"
                        value={formData.emailEncargado}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, emailEncargado: e.target.value }))
                        }
                        error={!!errors.emailEncargado}
                        helperText={errors.emailEncargado}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Teléfono del Encargado"
                        fullWidth
                        name="telefonoEncargado"
                        type="tel"
                        value={formData.telefonoEncargado}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, telefonoEncargado: e.target.value }))
                        }
                        error={!!errors.telefonoEncargado}
                        helperText={errors.telefonoEncargado}
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
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="flex-end">
                    {activeStep < steps.length - 1 && (
                      <Button onClick={handleNext}>Siguiente</Button>
                    )}
                    {activeStep === steps.length - 1 && (
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isLoading}
                        startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
                      >
                        {isLoading ? "Procesando..." : "Finalizar"}
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default AltaObra;
