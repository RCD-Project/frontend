import React from "react";
import { Container, Typography, Button, Grid } from "@mui/material";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Bienvenido a Nuestra Aplicación
      </Typography>
      <Typography variant="body1" gutterBottom>
        Por favor, inicia sesión o regístrate como cliente para continuar.
      </Typography>
      <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Grid item>
          <Button variant="contained" component={Link} to="/login" sx={{
                marginTop: '20px',
                backgroundColor: '#abbf9d',
                '&:hover': {
                  backgroundColor: '#d1e063',
                },
              }}>
            Iniciar Sesión
          </Button>
        </Grid>
        <Grid item>
          <Button 
          variant="contained" 
          component={Link} 
          to="/altacliente"
          sx={{
            marginTop: '20px',
            backgroundColor: '#abbf9d',
            '&:hover': {
              backgroundColor: '#d1e063',
            },
          }}>
            Registrarme como Cliente
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Landing;
