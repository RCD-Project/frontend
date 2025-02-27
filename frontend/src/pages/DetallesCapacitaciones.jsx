import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, Typography, Divider, Paper, Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const DetallesCapacitacion = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');

  const capacitaciones = [
    {
      id: 1,
      fecha: '2022-12-01',
      motivo: 'Capacitación técnica',
      obra: 'Obra A',
      tecnico: 'Juan Pérez',
      comentario: 'Este es un comentario sobre la capacitación.',
      empresa: 'Empresa XYZ',
    },
  ];

  const capacitacion = capacitaciones.find((item) => item.id === parseInt(id));

  if (!capacitacion) {
    return <Typography variant="h6" color="error" align="center">Capacitación no encontrada</Typography>;
  }

  const theme = createTheme({
    palette: {
      primary: {
        main: '#a8c948',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ maxWidth: 800, margin: '0 auto', padding: 4 }}>
        <CardContent>
          <Typography variant="h3" align="center" sx={{ mb: 4 }}>
            Detalles de la Capacitación
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            {/* Motivo */}
            <Grid item xs={12}>
              <Paper sx={{ padding: 2, backgroundColor: '#f4f4f4' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Motivo</Typography>
                <Typography variant="body2">{capacitacion.motivo}</Typography>
              </Paper>
            </Grid>

            {/* Empresa */}
            <Grid item xs={12} sm={6}>
              <Paper sx={{ padding: 2, backgroundColor: '#f4f4f4' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Empresa</Typography>
                <Typography variant="body2">{capacitacion.empresa}</Typography>
              </Paper>
            </Grid>

            {/* Obra */}
            <Grid item xs={12} sm={6}>
              <Paper sx={{ padding: 2, backgroundColor: '#f4f4f4' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Obra</Typography>
                <Typography variant="body2">{capacitacion.obra}</Typography>
              </Paper>
            </Grid>

            {/* Fecha */}
            <Grid item xs={12} sm={6}>
              <Paper sx={{ padding: 2, backgroundColor: '#f4f4f4' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Fecha</Typography>
                <Typography variant="body2">{capacitacion.fecha}</Typography>
              </Paper>
            </Grid>

            {/* Técnico */}
            <Grid item xs={12} sm={6}>
              <Paper sx={{ padding: 2, backgroundColor: '#f4f4f4' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Técnico</Typography>
                <Typography variant="body2">{capacitacion.tecnico}</Typography>
              </Paper>
            </Grid>
          </Grid>

          <Typography variant="h5" align="center" sx={{ mt: 4, mb: 2 }}>
            Comentario
          </Typography>
          <Paper sx={{ padding: 2, backgroundColor: '#f4f4f4' }}>
            <Typography variant="body2">{capacitacion.comentario}</Typography>
          </Paper>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default DetallesCapacitacion;
