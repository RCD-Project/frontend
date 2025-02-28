import React, { useState, useContext } from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Alert,
  MenuItem,
  Box,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../pages/context/AuthContext";

const theme = createTheme({
  palette: {
    primary: {
      main: "#a8c948",
    },
  },
});

const AltaUsuario = () => {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Enviando formulario:", formData);

    fetch("http://127.0.0.1:8000/api/usuarios/super-admin-crear-usuario/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`, // Se utiliza el token extraído del AuthContext
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((errorText) => {
            console.error("Respuesta de error:", errorText);
            throw new Error(errorText);
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log("Usuario registrado:", data);
        setSuccessMessage("Usuario registrado con éxito.");
        navigate("/", {
          state: { successMessage: "Usuario registrado con éxito." },
        });
      })
      .catch((err) => {
        console.error("Error al registrar el usuario:", err);
        alert("Error al registrar el usuario:\n" + err.message);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="sm"
        sx={{
          minHeight: "calc(100vh - var(--header-height))",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Paper elevation={3} sx={{ padding: 6, borderRadius: 3 }}>
            <Typography variant="h3" gutterBottom sx={{ mb: 4 }}>
              Alta Usuario
            </Typography>

            {successMessage && (
              <Alert severity="success" sx={{ mb: 4 }}>
                {successMessage}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <TextField
                    label="Nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Contraseña"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Rol"
                    name="rol"
                    value={formData.rol}
                    onChange={handleChange}
                    fullWidth
                    required
                  >
                    <MenuItem value="coordinador">Coordinador</MenuItem>
                    <MenuItem value="coordinadorlogistico">
                      Coordinador Logístico
                    </MenuItem>
                    <MenuItem value="tecnico">Técnico</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mt: 4 }}>
                <Grid item xs={12} sx={{ textAlign: "right" }}>
                  <Button type="submit" variant="contained" color="primary">
                    Registrar
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default AltaUsuario;
