import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Divider,
  Box
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const transportistas = [
  {
    id: 1,
    nombre: 'Pedro',
    contacto: '1234567890',
    email: 'pedro@email.com',
    tipoVehiculo: 'Camión',
    tipoMaterial: 'Grava',
  },
  {
    id: 22,
    nombre: 'Juan',
    contacto: '9876543210',
    email: 'juan@email.com',
    tipoVehiculo: 'Camión',
    tipoMaterial: 'Cemento',
  }
];

const DetallesTransportista = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const transportista = transportistas.find((trans) => trans.id === parseInt(id));

  if (!transportista) {
    return <Typography variant="h6" color="error" align="center">Transportista no encontrado</Typography>;
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
            {transportista.nombre}
          </Typography>
          <Divider sx={{ mb: 4 }} />

          <Grid container spacing={3}>
            {[
              { label: "Contacto", value: transportista.contacto },
              { label: "Correo Electrónico", value: transportista.email },
              { label: "Tipo de Vehículo", value: transportista.tipoVehiculo },
              { label: "Tipo de Material", value: transportista.tipoMaterial }
            ].map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Paper sx={{ padding: 2, backgroundColor: '#f4f4f4' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{item.label}</Typography>
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

export default DetallesTransportista;
