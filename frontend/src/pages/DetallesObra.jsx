import React from "react";
import { useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Divider,
  Box
} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const obras = [
  {
    id: 1,
    nombreObra: 'Obra A',
    localidad: 'Montevideo',
    barrio: 'Centro',
    direccion: 'Calle Principal 1000',
    visitasMes: '15',
    inicioObra: '2022-03-01',
    duracionObra: '6 meses',
    etapaObra: 'Construcción',
    jefeObra: 'Carlos Méndez',
    emailJefe: 'carlos@email.com',
    telefonoJefe: '1234567890',
    capataz: 'José Rodríguez',
    emailCapataz: 'jose@email.com',
    telefonoCapataz: '9876543210',
    encargado: 'Ana Pérez',
    emailEncargado: 'ana@email.com',
    telefonoEncargado: '5678901234',
    imagen: 'url-imagen.jpg',
    pedido: 'Materiales de construcción',
  },
  // Puedes agregar más obras con una estructura similar
];

const DetallesObra = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const obra = obras.find((o) => o.id === parseInt(id));

  if (!obra) {
    return <Typography variant="h6" color="error" align="center">Obra no encontrada</Typography>;
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
            {obra.nombreObra}
          </Typography>
          <Divider sx={{ mb: 4 }} />
          
          <Grid container spacing={3}>
            {[
              { label: "Localidad", value: obra.localidad },
              { label: "Barrio", value: obra.barrio },
              { label: "Dirección", value: obra.direccion },
              { label: "Visitas por Mes", value: obra.visitasMes },
              { label: "Inicio de la Obra", value: obra.inicioObra },
              { label: "Duración de la Obra", value: obra.duracionObra },
              { label: "Etapa de la Obra", value: obra.etapaObra },
              { label: "Jefe de Obra", value: obra.jefeObra },
              { label: "Email del Jefe", value: obra.emailJefe },
              { label: "Teléfono del Jefe", value: obra.telefonoJefe },
              { label: "Capataz", value: obra.capataz },
              { label: "Email del Capataz", value: obra.emailCapataz },
              { label: "Teléfono del Capataz", value: obra.telefonoCapataz },
              { label: "Encargado", value: obra.encargado },
              { label: "Email del Encargado", value: obra.emailEncargado },
              { label: "Teléfono del Encargado", value: obra.telefonoEncargado },
              { label: "Pedido", value: obra.pedido },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Paper sx={{ padding: 2, backgroundColor: '#f4f4f4' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{item.label}</Typography>
                  <Typography variant="body2">{item.value}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {obra.imagen && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <img src={obra.imagen} alt={obra.nombreObra} style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
            </Box>
          )}
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default DetallesObra;
