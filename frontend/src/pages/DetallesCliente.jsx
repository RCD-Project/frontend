import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const capacitaciones = [
  {
    id: 1,
    fecha: '2022-12-01',
    motivo: 'Capacitación técnica',
    obra: 'Obra A',
    tecnico: 'Juan Pérez',
    comentario: 'Este es un comentario sobre la capacitación.'
  },
  {
    id: 2,
    fecha: '2022-12-05',
    motivo: 'Capacitación de seguridad',
    obra: 'Obra B',
    tecnico: 'Ana García',
    comentario: 'Este es otro comentario sobre una capacitación.'
  }
];

const DetallesCapacitacion = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
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
            {[ 
              { label: "Fecha", value: capacitacion.fecha },
              { label: "Motivo", value: capacitacion.motivo },
              { label: "Obra", value: capacitacion.obra },
              { label: "Técnico", value: capacitacion.tecnico },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Paper sx={{ padding: 2, backgroundColor: '#f4f4f4' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{item.label}</Typography>
                  <Typography variant="body2">{item.value}</Typography>
                </Paper>
              </Grid>
            ))}
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
