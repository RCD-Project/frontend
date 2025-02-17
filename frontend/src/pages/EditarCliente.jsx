import React, { useState } from 'react';
import { Container, TextField, Button, Grid, Typography } from '@mui/material';

const AltaCliente = () => {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [contacto, setContacto] = useState('');
  const [nombreContacto, setNombreContacto] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [direccionFiscal, setDireccionFiscal] = useState('');
  const [rut, setRut] = useState('');
  const [mail, setMail] = useState('');
  const [cronograma, setCronograma] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Construimos el objeto que se enviará al backend
    const data = {
      nombre,
      direccion,
      contacto,
      nombre_contacto: nombreContacto,
      // Asegúrate que el formato de la fecha sea el esperado por el backend (ej. "YYYY-MM-DD")
      fecha_ingreso: fechaIngreso,
      razon_social: razonSocial,
      direccion_fiscal: direccionFiscal,
      rut,
      mail,
      cronograma,
    };

    try {
      const response = await fetch('http://localhost:8000/api/clientes/registro/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log('Cliente creado exitosamente');
        // Aquí puedes limpiar el formulario o redirigir al usuario
      } else {
        console.error('Error al crear el cliente');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Alta Cliente
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Nombre */}
          <Grid item xs={12}>
            <TextField
              label="Nombre"
              fullWidth
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </Grid>

          {/* Dirección */}
          <Grid item xs={12}>
            <TextField
              label="Dirección"
              fullWidth
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              required
            />
          </Grid>

          {/* Contacto */}
          <Grid item xs={12}>
            <TextField
              label="Contacto"
              fullWidth
              value={contacto}
              onChange={(e) => setContacto(e.target.value)}
              required
            />
          </Grid>

          {/* Nombre de Contacto */}
          <Grid item xs={12}>
            <TextField
              label="Nombre de Contacto"
              fullWidth
              value={nombreContacto}
              onChange={(e) => setNombreContacto(e.target.value)}
              required
            />
          </Grid>

          {/* Fecha de Ingreso */}
          <Grid item xs={12}>
            <TextField
              label="Fecha de Ingreso"
              type="date"
              fullWidth
              value={fechaIngreso}
              onChange={(e) => setFechaIngreso(e.target.value)}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          {/* Razón Social */}
          <Grid item xs={12}>
            <TextField
              label="Razón Social"
              fullWidth
              value={razonSocial}
              onChange={(e) => setRazonSocial(e.target.value)}
              required
            />
          </Grid>

          {/* Dirección Fiscal */}
          <Grid item xs={12}>
            <TextField
              label="Dirección Fiscal"
              fullWidth
              value={direccionFiscal}
              onChange={(e) => setDireccionFiscal(e.target.value)}
              required
            />
          </Grid>

          {/* RUT */}
          <Grid item xs={12}>
            <TextField
              label="RUT"
              fullWidth
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              required
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              required
            />
          </Grid>

          {/* Cronograma */}
          <Grid item xs={12}>
            <TextField
              label="Cronograma"
              fullWidth
              multiline
              rows={4}
              value={cronograma}
              onChange={(e) => setCronograma(e.target.value)}
            />
          </Grid>

          {/* Botón de envío */}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Crear Cliente
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default AltaCliente;
