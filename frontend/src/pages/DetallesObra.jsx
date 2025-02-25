import { useLocation } from "react-router-dom";
import { Card, CardContent, Typography, Grid, Paper, Divider } from "@mui/material";
import '../styles/DetallesObra.css';

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

  return (
    <Card className="obra-card">
      <CardContent>
        <Typography variant="h4" align="center" className="obra-nombre">
          {obra.nombreObra}
        </Typography>
        <Divider className="obra-divider" />
        <Grid container spacing={2}>
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
              <Paper className="obra-info">
                <Typography className="obra-label">{item.label}</Typography>
                <Typography className="obra-valor">{item.value}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {obra.imagen && (
          <div className="obra-imagen">
            <img src={obra.imagen} alt={obra.nombreObra} className="obra-img" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DetallesObra;
