import React, { useState } from 'react';
import { Container, TextField, Button, Grid, Typography, Stepper, Step, StepLabel, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from '@mui/material';
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
    inicioObra: null,
    duracionObra: '',
    etapaObra: '',
    estado: '',
    jefeObra: '',
    emailJefe: '',
    telefonoJefe: '',
    capataz: '',
    emailCapataz: '',
    telefonoCapataz: '',
    encargado: '',
    emailEncargado: '',
    telefonoEncargado: '',
    visitasMes: '',
    imagen: null,
  });

  const [puntosLimpios, setPuntosLimpios] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [nuevoPunto, setNuevoPunto] = useState({
    accesibilidad: '', cantidad: '', metrosCuadrados: '', estructura: '',
    tipoContenedor: '', puntaje: '', senaletica: '', observaciones: '', clasificacion: ''
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

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleNuevoPuntoChange = (e) => {
    const { name, value } = e.target;
    setNuevoPunto((prev) => ({ ...prev, [name]: value }));
  };

  const handleAgregarPunto = () => {
    setPuntosLimpios([...puntosLimpios, { ...nuevoPunto }]);
    setNuevoPunto({
      accesibilidad: '', cantidad: '', metrosCuadrados: '', estructura: '',
      tipoContenedor: '', puntaje: '', senaletica: '', observaciones: '', clasificacion: ''
    });
    setOpenDialog(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Enviando formulario:', formData, puntosLimpios);
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
              <Grid item xs={6}><TextField label="Localidad" fullWidth name="localidad" value={formData.localidad} onChange={handleChange} required/></Grid>
              <Grid item xs={6}><TextField label="Barrio" fullWidth name="barrio" value={formData.barrio} onChange={handleChange} required/></Grid>
              <Grid item xs={12}><TextField label="Dirección" fullWidth name="direccion" value={formData.direccion} onChange={handleChange} required/></Grid>
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
              <Grid item xs={12} align="center">
                <Button variant="contained" onClick={handleOpenDialog}>
                  Añadir Punto Limpio ({puntosLimpios.length})
                </Button>
              </Grid>
            </>
          )}
          {activeStep === 2 && (
            <>
              <Grid item xs={12}><TextField label="Jefe de Obra" fullWidth name="jefeObra" value={formData.jefeObra} onChange={handleChange} required/></Grid>
              <Grid item xs={6}><TextField label="Email del Jefe" fullWidth name="emailJefe" type="email" value={formData.emailJefe} onChange={handleChange} required/></Grid>
              <Grid item xs={6}><TextField label="Teléfono del Jefe" fullWidth name="telefonoJefe" type="tel" value={formData.telefonoJefe} onChange={handleChange} required/></Grid>
              
              <Grid item xs={12}><TextField label="Capataz" fullWidth name="capataz" value={formData.capataz} onChange={handleChange} required/></Grid>
              <Grid item xs={6}><TextField label="Email del Capataz" fullWidth name="emailCapataz" type="email" value={formData.emailCapataz} onChange={handleChange} required/></Grid>
              <Grid item xs={6}><TextField label="Teléfono del Capataz" fullWidth name="telefonoCapataz" type="tel" value={formData.telefonoCapataz} onChange={handleChange} required/></Grid>
              
              <Grid item xs={12}><TextField label="Encargado" fullWidth name="encargado" value={formData.encargado} onChange={handleChange} required/></Grid>
              <Grid item xs={6}><TextField label="Email del Encargado" fullWidth name="emailEncargado" type="email" value={formData.emailEncargado} onChange={handleChange} required/></Grid>
              <Grid item xs={6}><TextField label="Teléfono del Encargado" fullWidth name="telefonoEncargado" type="tel" value={formData.telefonoEncargado} onChange={handleChange} required/></Grid>
            </>
          )}
        </Grid>
        <Grid container spacing={2} justifyContent="space-between" style={{ marginTop: '20px' }}>
          {activeStep !== 0 && (<Button onClick={handleBack}>Atrás</Button>)}
          {activeStep < steps.length - 1 && (<Button onClick={handleNext}>Siguiente</Button>)}
          {activeStep === steps.length - 1 && (<Button type="submit" variant="contained" color="primary">Finalizar</Button>)}
        </Grid>
      </form>

      {/* Dialog para agregar Punto Limpio */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Registrar Punto Limpio</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                select
                label="Accesibilidad"
                fullWidth
                name="accesibilidad"
                value={nuevoPunto.accesibilidad}
                onChange={handleNuevoPuntoChange}
              >
                <MenuItem value="Planta Baja">Planta Baja</MenuItem>
                <MenuItem value="Pisos">Pisos</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}><TextField label="Cantidad" fullWidth name="cantidad" type="number" value={nuevoPunto.cantidad} onChange={handleNuevoPuntoChange} /></Grid>
            <Grid item xs={6}><TextField label="Metros Cuadrados" fullWidth name="metrosCuadrados" type="number" value={nuevoPunto.metrosCuadrados} onChange={handleNuevoPuntoChange} /></Grid>
            <Grid item xs={6}><TextField label="Estructura" fullWidth name="estructura" value={nuevoPunto.estructura} onChange={handleNuevoPuntoChange} /></Grid>
            <Grid item xs={6}><TextField label="Tipo de Contenedor" fullWidth name="tipoContenedor" value={nuevoPunto.tipoContenedor} onChange={handleNuevoPuntoChange} /></Grid>
            <Grid item xs={6}><TextField label="Puntaje" fullWidth name="puntaje" type="number" value={nuevoPunto.puntaje} onChange={handleNuevoPuntoChange} /></Grid>
            <Grid item xs={6}>
              <TextField
                select
                label="Señalética"
                fullWidth
                name="senaletica"
                value={nuevoPunto.senaletica}
                onChange={handleNuevoPuntoChange}
              >
                <MenuItem value="Existe">Existe</MenuItem>
                <MenuItem value="No Existe">No Existe</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}><TextField label="Clasificación" fullWidth name="clasificacion" value={nuevoPunto.clasificacion} onChange={handleNuevoPuntoChange} /></Grid>
            <Grid item xs={12}><TextField label="Observaciones" fullWidth multiline rows={3} name="observaciones" value={nuevoPunto.observaciones} onChange={handleNuevoPuntoChange} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAgregarPunto} variant="contained" color="primary">Agregar</Button>
          <Button onClick={handleCloseDialog} variant="outlined">Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AltaObra;
