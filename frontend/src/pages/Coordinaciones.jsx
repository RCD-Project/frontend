import React, { useState, useEffect, useContext } from 'react';
import { Container, TextField, Button, Grid, Typography, MenuItem } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../pages/context/AuthContext';

const FormularioCoordinaciones = () => {
  const { role, user, token } = useContext(AuthContext);
  const [obras, setObras] = useState([]);
  const [formData, setFormData] = useState({
    obra: '',
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

  // Se obtiene el listado de obras. Si el usuario es cliente, se filtran solo las obras relacionadas.
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/obras/aprobadas/", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (role === "cliente" && user) {
          // Se asume que en cada obra existe un campo "cliente" con el id del cliente
          const obrasCliente = data.filter((obra) => obra.cliente === user.id);
          setObras(obrasCliente);
        } else {
          setObras(data);
        }
      })
      .catch((err) => console.error("Error al obtener obras:", err));
  }, [role, user, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (name, newValue) => {
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Enviando solicitud de coordinación:', formData);
    // Aquí se realizaría el envío a la API y luego la redirección
    navigate('/');
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
        Solicitud de Coordinación
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Dropdown para seleccionar la obra */}
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
                  {obra.nombre_obra || obra.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Descripción"
              fullWidth
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Observación"
              fullWidth
              name="observacion"
              value={formData.observacion}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Estado"
              fullWidth
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              required
            />
          </Grid>

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

          <Grid item xs={12}>
            <TextField
              label="Pesaje"
              fullWidth
              name="pesaje"
              value={formData.pesaje}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Comentarios"
              fullWidth
              multiline
              rows={4}
              name="comentarios"
              value={formData.comentarios}
              onChange={handleChange}
            />
          </Grid>

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

        <Grid container justifyContent="center" sx={{ marginTop: '20px' }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              marginTop: '20px',
              backgroundColor: '#abbf9d',
              '&:hover': { backgroundColor: '#d1e063' },
            }}
          >
            Enviar Coordinación
          </Button>
        </Grid>
      </form>
    </Container>
  );
};

export default FormularioCoordinaciones;
