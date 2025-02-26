import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const puntosLimpios = [
  {
    id: 1,
    obra: 'Obra A',
    ubicacion: 'Calle Principal 1000',
    accesibilidad: 'En Planta Baja',
    cantidad: 10,
    metros_cuadrados: 150.5,
    estructura: 'Estructura A',
    tipo_contenedor: 'Contenedor Tipo 1',
    puntaje: 90,
    senaletica: true,
    observaciones: 'Observación A',
    clasificacion: 'correcta',
  },
  {
    id: 22,
    obra: 'Obra B',
    ubicacion: 'Avenida Central 2000',
    accesibilidad: 'En Pisos',
    cantidad: 15,
    metros_cuadrados: 200.0,
    estructura: 'Estructura B',
    tipo_contenedor: 'Contenedor Tipo 2',
    puntaje: 80,
    senaletica: false,
    observaciones: 'Observación B',
    clasificacion: 'a_mejorar',
  },
];

const DetallesPuntoLimpio = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const puntoLimpio = puntosLimpios.find((punto) => punto.id === parseInt(id));

  if (!puntoLimpio) {
    return <Typography variant="h6" color="error" align="center">Punto Limpio no encontrado</Typography>;
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
            {puntoLimpio.obra}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            {[ 
              { label: "Ubicación", value: puntoLimpio.ubicacion },
              { label: "Accesibilidad", value: puntoLimpio.accesibilidad },
              { label: "Cantidad", value: puntoLimpio.cantidad },
              { label: "Metros Cuadrados", value: puntoLimpio.metros_cuadrados },
              { label: "Estructura", value: puntoLimpio.estructura },
              { label: "Tipo de Contenedor", value: puntoLimpio.tipo_contenedor },
              { label: "Puntaje", value: puntoLimpio.puntaje },
              { label: "Señalética", value: puntoLimpio.señaletica ? 'Sí' : 'No' },
              { label: "Clasificación", value: puntoLimpio.clasificacion },
              { label: "Observaciones", value: puntoLimpio.observaciones },
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
            Detalles Adicionales
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Nombre</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Valor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[ 
                  { label: 'Accesibilidad', value: puntoLimpio.accesibilidad },
                  { label: 'Cantidad', value: puntoLimpio.cantidad },
                  { label: 'Metros Cuadrados', value: puntoLimpio.metros_cuadrados },
                  { label: 'Estructura', value: puntoLimpio.estructura },
                  { label: 'Tipo de Contenedor', value: puntoLimpio.tipo_contenedor },
                  { label: 'Puntaje', value: puntoLimpio.puntaje },
                  { label: 'Señalética', value: puntoLimpio.señaletica ? 'Sí' : 'No' },
                  { label: 'Observaciones', value: puntoLimpio.observaciones }
                ].map((item, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{item.label}</TableCell>
                    <TableCell align="center">{item.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default DetallesPuntoLimpio;
