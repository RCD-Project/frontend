import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const perfiles = [
  {
    id: 1,
    nombre: 'Pedro',
    fechaIngreso: '2022-12-01',
    cantidadObras: 50,
    direccion: 'Calle Falsa 123',
    contacto: '1234567890',
    nombreContacto: 'Juan Perez',
    razonSocial: 'Empresa 1',
    direccionFiscal: 'Calle Falsa 123',
    RUT: 'RUT1',
    email: 'pedro@email.com',
    obras: ['Obra A', 'Obra B', 'Obra C']
  },
  {
    id: 22,
    nombre: 'Juan',
    fechaIngreso: '2022-11-25',
    cantidadObras: 80,
    direccion: 'Calle Real 456',
    contacto: '9876543210',
    nombreContacto: 'Maria Garcia',
    razonSocial: 'Empresa 2',
    direccionFiscal: 'Calle Real 456',
    RUT: 'RUT2',
    email: 'juan@email.com',
    obras: ['Obra X', 'Obra Y', 'Obra Z']
  }
];

const DetallesCliente = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const cliente = perfiles.find((perfil) => perfil.id === parseInt(id));

  if (!cliente) {
    return <Typography variant="h6" color="error" align="center">Cliente no encontrado</Typography>;
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
            {cliente.nombre}
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            {[
              { label: "Fecha de Ingreso", value: cliente.fechaIngreso },
              { label: "Cantidad de Obras", value: cliente.cantidadObras },
              { label: "Dirección", value: cliente.direccion },
              { label: "Contacto", value: cliente.contacto },
              { label: "Nombre de Contacto", value: cliente.nombreContacto },
              { label: "Razón Social", value: cliente.razonSocial },
              { label: "Dirección Fiscal", value: cliente.direccionFiscal },
              { label: "RUT", value: cliente.RUT },
              { label: "Correo Electrónico", value: cliente.email }
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
            Obras Asociadas
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Nombre de la Obra</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cliente.obras.map((obra, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{obra}</TableCell>
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

export default DetallesCliente;
