import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Paper, Divider } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../pages/context/AuthContext';

const DetallesPuntoLimpio = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const [puntoLimpio, setPuntoLimpio] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (!id || !token) return;
    fetch(`http://localhost:8000/api/puntolimpio/detalle/?id=${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setPuntoLimpio(data))
      .catch(error => console.error('Error al obtener los detalles del Punto Limpio:', error));
  }, [id, token]);

  const theme = createTheme({
    palette: {
      primary: {
        main: '#a8c948',
      },
    },
  });

  if (!puntoLimpio) {
    return <Typography variant="h6" align="center">Cargando detalles...</Typography>;
  }

  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ maxWidth: 800, margin: '0 auto', padding: 4 }}>
        <CardContent>
          <Typography variant="h3" align="center" sx={{ mb: 4 }}>
            {puntoLimpio.nombre_obra}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {[
              { label: "Ubicación", value: puntoLimpio.ubicacion },
              { label: "Accesibilidad", value: puntoLimpio.accesibilidad },
              { label: "Metros Cuadrados", value: puntoLimpio.metros_cuadrados },
              { label: "Tipo de Contenedor", value: puntoLimpio.tipo_contenedor },
              { label: "Fecha de Ingreso", value: puntoLimpio.fecha_ingreso },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Paper sx={{ padding: 2, backgroundColor: '#f4f4f4' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {item.label}
                  </Typography>
                  <Typography variant="body2">{item.value}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default DetallesPuntoLimpio;
