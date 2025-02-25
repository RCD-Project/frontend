import React, { useState, useEffect } from 'react';
import { 
  Container, 
  TextField, 
  Button, 
  Grid, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel, 
  MenuItem, 
  Paper, 
  Box 
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
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
  const [tecnicos, setTecnicos] = useState([]);

  const navigate = useNavigate();

  // Obtener las obras aprobadas desde la API
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/obras/aprobadas/')
      .then(response => response.json())
      .then(data => setObras(data))
      .catch(error => console.error('Error fetching obras:', error));
  }, []);

  // Obtener los técnicos desde la API
  useEffect(() => {
    fetch('http://localhost:8000/api/tecnicos/lista/')
      .then(response => response.json())
      .then(data => setTecnicos(data))
      .catch(error => console.error('Error fetching técnicos:', error));
  }, []);

  const handleNext = () => {
    setActiveStep(prevStep => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (newValue) => {
    setFormData({ ...formData, fecha: newValue });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const payload = {
      ...formData,
      fecha: formData.fecha ? formData.fecha.format('YYYY-MM-DD') : null,
    };

    fetch('http://localhost:8000/api/capacitaciones/registro/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => {
            console.error('Error en la respuesta:', err);
            throw new Error('Error en la respuesta de la red');
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('Capacitación registrada exitosamente:', data);
        navigate('/');
      })
      .catch(error => {
        console.error('Error al registrar la capacitación:', error);
      });
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: '#a8c948', // Color personalizado igual que en AltaCliente
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="md"
        sx={{
          minHeight: '100vh', // El contenedor ocupa toda la altura de la ventana
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Paper elevation={3} sx={{ padding: 6, borderRadius: 3 }}>
            <Typography variant="h3" gutterBottom sx={{ mb: 4 }}>
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
              <Grid container spacing={3}>
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
                          <MenuItem key={obra.id} value={obra.id}>
                            {obra.nombre_obra}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        select
                        label="Técnico"
                        fullWidth
                        name="tecnico"
                        value={formData.tecnico}
                        onChange={handleChange}
                        required
                      >
                        {tecnicos.map((tecnico) => (
                          <MenuItem key={tecnico.id} value={tecnico.id}>
                            {tecnico.nombre}
                          </MenuItem>
                        ))}
                      </TextField>
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
              <Grid container spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                {activeStep !== 0 && <Button onClick={handleBack}>Atrás</Button>}
                {activeStep < steps.length - 1 && <Button onClick={handleNext}>Siguiente</Button>}
                {activeStep === steps.length - 1 && (
                  <Button type="submit" variant="contained" color="primary">
                    Finalizar
                  </Button>
                )}
              </Grid>
            </form>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default AltaCapacitaciones;
