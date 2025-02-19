import React, { useState } from 'react';
import { Container, TextField, Button, Grid, Typography, MenuItem } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useNavigate } from 'react-router-dom';

const FormularioCoordinaciones = () => {
  const [formData, setFormData] = useState({
    descripcion: '',
    observacion: '',
    estado: '',
    fechaSolicitud: null,
    fechaRetiro: null,
    pesaje: '',
    comentarios: '',
    tipoMaterial: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (name, newValue) => {
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Enviando solicitud de coordinación:', formData);
    navigate('/');
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Solicitud de Coordinación</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}><TextField label="Descripción" fullWidth name="descripcion" value={formData.descripcion} onChange={handleChange} required/></Grid>
          <Grid item xs={12}><TextField label="Observación" fullWidth name="observacion" value={formData.observacion} onChange={handleChange} required/></Grid>
          <Grid item xs={12}><TextField label="Estado" fullWidth name="estado" value={formData.estado} onChange={handleChange} required/></Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha de Solicitud"
                value={formData.fechaSolicitud}
                onChange={(newValue) => handleDateChange('fechaSolicitud', newValue)}
                renderInput={(params) => <TextField {...params} fullWidth required />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha de Retiro"
                value={formData.fechaRetiro}
                onChange={(newValue) => handleDateChange('fechaRetiro', newValue)}
                renderInput={(params) => <TextField {...params} fullWidth required />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}><TextField label="Pesaje" fullWidth name="pesaje" value={formData.pesaje} onChange={handleChange} required/></Grid>
          <Grid item xs={12}><TextField label="Comentarios" fullWidth multiline rows={4} name="comentarios" value={formData.comentarios} onChange={handleChange}/></Grid>
          <Grid item xs={12}>
            <TextField
              select
              label="Tipo de Material"
              fullWidth
              name="tipoMaterial"
              value={formData.tipoMaterial}
              onChange={handleChange}
              required
            >
              <MenuItem value="Escombro limpio">Escombro limpio</MenuItem>
              <MenuItem value="Plástico">Plástico</MenuItem>
              <MenuItem value="Papel y cartón">Papel y cartón</MenuItem>
              <MenuItem value="Metales">Metales</MenuItem>
              <MenuItem value="Madera">Madera</MenuItem>
              <MenuItem value="Mezclados">Mezclados</MenuItem>
              <MenuItem value="Peligrosos">Peligrosos</MenuItem>
            </TextField>
          </Grid>
        </Grid>
        <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
          <Button type="submit" variant="contained" color="primary">Enviar Coordinación</Button>
        </Grid>
      </form>
    </Container>
  );
};

export default FormularioCoordinaciones;
