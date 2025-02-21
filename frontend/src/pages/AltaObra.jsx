import React, { useState } from 'react';
import {
  Container, TextField, Button, Grid, Typography, Stepper, Step, StepLabel,
  Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, ToggleButton,
  ToggleButtonGroup, Card, CardContent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// Íconos minimalistas para cada material
import BuildIcon from '@mui/icons-material/Build';
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import EcoIcon from '@mui/icons-material/Forest';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import WarningIcon from '@mui/icons-material/Warning';

const steps = ['Información General', 'Detalles de la Obra', 'Equipo Responsable'];

const materialOptions = [
  { label: "Escombro Limpio", icon: <BuildIcon />, value: "escombro_limpio" },
  { label: "Plástico", icon: <CategoryIcon />, value: "plastico" },
  { label: "Papel y Cartón", icon: <DescriptionIcon />, value: "papel_carton" },
  { label: "Metales", icon: <PrecisionManufacturingIcon />, value: "metales" },
  { label: "Madera", icon: <EcoIcon />, value: "madera" },
  { label: "Mezclados", icon: <ShuffleIcon />, value: "mezclados" },
  { label: "Peligrosos", icon: <WarningIcon />, value: "peligrosos" },
];

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
  const [puntosLimpios, setPuntosLimpios] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [nuevoPunto, setNuevoPunto] = useState({
    accesibilidad: '', cantidad: '', metrosCuadrados: '', estructura: '',
    tipoContenedor: '', senaletica: '', observaciones: ''
  });
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  const navigate = useNavigate();

  const handleNext = () => setActiveStep(prev => prev + 1);
  const handleBack = () => setActiveStep(prev => prev - 1);
  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const handleNuevoPuntoChange = (e) => {
    const { name, value } = e.target;
    setNuevoPunto(prev => ({ ...prev, [name]: value }));
  };
  const handleMaterialSelection = (event, newSelectedMaterials) =>
    setSelectedMaterials(newSelectedMaterials);

  const handleAgregarPunto = () => {
    if (
      !nuevoPunto.accesibilidad ||
      !nuevoPunto.cantidad ||
      !nuevoPunto.metrosCuadrados ||
      !nuevoPunto.estructura ||
      !nuevoPunto.tipoContenedor ||
      !nuevoPunto.senaletica ||
      !nuevoPunto.observaciones
    ) {
      alert("Por favor complete todos los campos del Punto Limpio.");
      return;
    }
    const puntoConMateriales = { ...nuevoPunto, materiales: selectedMaterials };
    setPuntosLimpios(prev => [...prev, puntoConMateriales]);
    setNuevoPunto({
      accesibilidad: '', cantidad: '', metrosCuadrados: '', estructura: '',
      tipoContenedor: '', senaletica: '', observaciones: ''
    });
    setSelectedMaterials([]);
    setOpenDialog(false);
  };

  const handleCancelarPunto = (index) => {
    setPuntosLimpios(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
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
      puntos_limpios: puntosLimpios.map(punto => {
        const puntoData = {
          accesibilidad: punto.accesibilidad,
          ubicacion: "No especificado",
          metros_cuadrados: punto.metrosCuadrados,
          estructura: punto.estructura,
          tipo_contenedor: punto.tipoContenedor,
          señaletica: punto.senaletica === "Existe",
          observaciones: punto.observaciones,
          puntaje: 0,
          clasificacion: "no_aplica",
          materiales: punto.materiales,
        };
        // Si se selecciona "Peligrosos", se envía ventilacion: "Necesario"
        if (punto.materiales.includes("peligrosos")) {
          puntoData.ventilacion = "Necesario";
        }
        return puntoData;
      }),
    };

    console.log("Datos enviados:", obraData);

    fetch("http://127.0.0.1:8000/api/obras/registro/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obraData),
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
        console.log("Obra creada:", data);
        navigate("/listadeobras", { state: { successMessage: data.mensaje } });
      })
      .catch((err) => {
        console.error("Error al dar de alta la obra:", err);
        alert("Error al dar de alta la obra:\n" + err.message);
      });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom sx={{ marginTop: 2 }}>
        Registro de Obra
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
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
                      setFormData(prev => ({ ...prev, inicioObra: newValue }))
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
              <Grid item xs={12} align="center">
                <Button variant="contained" onClick={handleOpenDialog}>
                  Añadir Punto Limpio ({puntosLimpios.length})
                </Button>
              </Grid>
              {puntosLimpios.length > 0 && (
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="h6">Puntos Limpios Agregados</Typography>
                  {puntosLimpios.map((punto, index) => (
                    <Card key={index} variant="outlined" sx={{ mb: 1 }}>
                      <CardContent>
                        <Typography variant="subtitle1">Punto Limpio {index + 1}</Typography>
                        <Typography variant="body2">Accesibilidad: {punto.accesibilidad}</Typography>
                        <Typography variant="body2">Cantidad: {punto.cantidad}</Typography>
                        <Typography variant="body2">Metros Cuadrados: {punto.metrosCuadrados}</Typography>
                        <Typography variant="body2">Estructura: {punto.estructura}</Typography>
                        <Typography variant="body2">Tipo de Contenedor: {punto.tipoContenedor}</Typography>
                        <Typography variant="body2">Señalética: {punto.senaletica}</Typography>
                        <Typography variant="body2">Materiales: {punto.materiales && punto.materiales.join(', ')}</Typography>
                        <Typography variant="body2">Observaciones: {punto.observaciones}</Typography>
                        <Button variant="outlined" color="error" size="small" sx={{ mt: 1 }} onClick={() => handleCancelarPunto(index)}>
                          Quitar punto limpio
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </Grid>
              )}
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth PaperProps={{ sx: { width: '750px' } }}>
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
                required
              >
                <MenuItem value="Planta Baja">Planta Baja</MenuItem>
                <MenuItem value="Pisos">Pisos</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Cantidad"
                fullWidth
                name="cantidad"
                type="number"
                value={nuevoPunto.cantidad}
                onChange={handleNuevoPuntoChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Metros Cuadrados"
                fullWidth
                name="metrosCuadrados"
                type="number"
                value={nuevoPunto.metrosCuadrados}
                onChange={handleNuevoPuntoChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Estructura"
                fullWidth
                name="estructura"
                value={nuevoPunto.estructura}
                onChange={handleNuevoPuntoChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Tipo de Contenedor"
                fullWidth
                name="tipoContenedor"
                value={nuevoPunto.tipoContenedor}
                onChange={handleNuevoPuntoChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                label="Señalética"
                fullWidth
                name="senaletica"
                value={nuevoPunto.senaletica}
                onChange={handleNuevoPuntoChange}
                required
              >
                <MenuItem value="Existe">Existe</MenuItem>
                <MenuItem value="No Existe">No Existe</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Observaciones"
                fullWidth
                multiline
                rows={3}
                name="observaciones"
                value={nuevoPunto.observaciones}
                onChange={handleNuevoPuntoChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" align="center">Selecciona Materiales</Typography>
              <ToggleButtonGroup
                value={selectedMaterials}
                onChange={handleMaterialSelection}
                aria-label="materiales"
                sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
              >
                {materialOptions.map((option) => (
                  <ToggleButton
                    key={option.value}
                    value={option.value}
                    aria-label={option.label}
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '30%',
                      margin: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {option.icon}
                    <Typography variant="caption">{option.label}</Typography>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Grid>
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
