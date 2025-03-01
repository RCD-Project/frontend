import React from "react";
import { Container, Typography, Button, Grid, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; // Importa la imagen logo
import section4 from "../assets/section6.jpg"; // Importa la imagen de fondo

const Landing = () => {
  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1000,
        backgroundImage: `url(${section4})`, // Imagen de fondo
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflowY: "hidden",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: "40px", // Un poco más de padding
          backgroundColor: "rgba(0, 0, 0, 0.7)", // Fondo negro como el login
          backdropFilter: "blur(6px)", // Efecto de desenfoque más suave
          maxWidth: "600px", // Cuadro más estrecho, con tamaño máximo restaurado
          width: "100%",
          textAlign: "center",
          borderRadius: "8px", // Bordes redondeados
        }}
      >
        {/* Logo más pequeño */}
        <img
          src={logo}
          alt="Logo"
          style={{ maxWidth: "70%", height: "auto", marginBottom: "20px" }}
        />

        {/* Texto debajo del logo más conciso */}
        <Typography variant="h5" sx={{ color: "#fff", mb: 4 }}>
          Inicie sesión o regístrese como cliente para continuar.
        </Typography>

        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <Button
              variant="contained"
              component={Link}
              to="/login"
              aria-label="Iniciar sesión"
              sx={{
                backgroundColor: "#abbf9d",
                color: "#fff",
                padding: "8px 16px", // Botón más pequeño
                fontSize: "16px", // Aumentar el tamaño de fuente
                borderRadius: "20px", // Bordes redondeados
                "&:hover": {
                  backgroundColor: "#d1e063",
                },
              }}
              fullWidth
            >
              Iniciar Sesión
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              component={Link}
              to="/altacliente"
              aria-label="Registrarse"
              sx={{
                backgroundColor: "#abbf9d",
                color: "#fff",
                padding: "8px 16px", // Botón más pequeño
                fontSize: "16px", // Aumentar el tamaño de fuente
                borderRadius: "20px", // Bordes redondeados
                "&:hover": {
                  backgroundColor: "#d1e063",
                },
              }}
              fullWidth
            >
              Registrarse
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Landing;
