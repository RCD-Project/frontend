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
    username: "",
    email: "",
    password: "",
    rol: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    let newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es obligatorio.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Correo electrónico inválido.";
    }
    if (!/(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(formData.password)) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres, con una letra y un número.";
    }
    if (!formData.rol) {
      newErrors.rol = "Debe seleccionar un rol.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Enviando formulario:", formData);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/usuarios/crear-usuario/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Respuesta de error:", errorText);
        throw new Error(errorText);
      }
      const data = await response.json();
      console.log("Usuario registrado:", data);
      setSuccessMessage("Usuario registrado con éxito.");
      navigate("/", { state: { successMessage: "Usuario registrado con éxito." } });
    } catch (err) {
      console.error("Error al registrar el usuario:", err);
      setErrorMessage("Error al registrar el usuario: " + err.message);
    }
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
          <Typography variant="h3" gutterBottom sx={{ textAlign: 'center' }}>
              Alta Usuario
            </Typography>

            {successMessage && (
              <Alert severity="success" sx={{ mb: 4 }}>
                {successMessage}
              </Alert>
            )}

            {errorMessage && (
              <Alert severity="error" sx={{ mb: 4 }}>
                {errorMessage}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <TextField
                    label="Nombre"
                    name="username"
                    value={formData.username}
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
                    <MenuItem value="tecnico">Técnico</MenuItem>
                    <MenuItem value="coordinador">Coordinador</MenuItem>
                    <MenuItem value="coordinadorlogistico">
                      Coordinador Logístico
                    </MenuItem>
                    <MenuItem value="supervisor">Supervisor</MenuItem>
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
