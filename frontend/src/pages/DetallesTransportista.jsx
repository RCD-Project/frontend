import { useLocation } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider } from '@mui/material';
import '../styles/DetallesTransportista.css';

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

  return (
    <Card className="transportista-card">
      <CardContent>
        <Typography variant="h4" align="center" className="transportista-nombre">
          {transportista.nombre}
        </Typography>
        <Divider className="transportista-divider" />
        <Grid container spacing={2}>
          {[ 
            { label: "Contacto", value: transportista.contacto },
            { label: "Correo Electrónico", value: transportista.email },
            { label: "Tipo de Vehículo", value: transportista.tipoVehiculo },
            { label: "Tipo de Material", value: transportista.tipoMaterial }
          ].map((item, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Paper className="transportista-info">
                <Typography className="transportista-label">{item.label}</Typography>
                <Typography className="transportista-valor">{item.value}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DetallesTransportista;
