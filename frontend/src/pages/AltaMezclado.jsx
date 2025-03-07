import React, { useState, useContext } from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Alert,
  Box,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../pages/context/AuthContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";

const RegistroMezclado = () => {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    pesaje: "",
    observaciones: "",
    imagenes: [],
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Validaciones
  const validateForm = () => {
    let newErrors = {};

    if (!formData.pesaje || isNaN(formData.pesaje) || parseFloat(formData.pesaje) <= 0) {
      newErrors.pesaje = "El pesaje debe ser un número mayor a 0.";
    }

    if (formData.imagenes.length === 0) {
      newErrors.imagenes = "Debe subir al menos una imagen.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejo de cambios en inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejo de subida de imágenes
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, imagenes: [...formData.imagenes, ...files] });
  };

  // Eliminar imagen seleccionada antes de enviar
  const handleRemoveImage = (index) => {
    const updatedImages = [...formData.imagenes];
    updatedImages.splice(index, 1);
    setFormData({ ...formData, imagenes: updatedImages });
  };

  // Enviar datos al backend
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("pesaje", formData.pesaje);
    formDataToSend.append("observaciones", formData.observaciones);

    formData.imagenes.forEach((image) => {
      formDataToSend.append("imagenes", image);
    });

    try {
      const response = await fetch("http://127.0.0.1:8000/api/mezclados/registrar/", {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        setSuccessMessage("Mezclado registrado con éxito.");
        setErrorMessage("");
        setIsLoading(false);
        navigate("/", { state: { successMessage: "Mezclado registrado con éxito." } });
      } else {
        const errorData = await response.json();
        setErrorMessage("Error al registrar el mezclado: " + JSON.stringify(errorData));
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      setErrorMessage("Error de red. Intenta nuevamente.");
      setIsLoading(false);
    }
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#a8c948",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="md"
        sx={{
          minHeight: "calc(100vh - var(--header-height))",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          className="inner-content"
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper elevation={3} sx={{ padding: 6, borderRadius: 3 }}>
            <Typography variant="h3" gutterBottom sx={{ mb: 4, textAlign: "center" }}>
              Registrar Mezclado
            </Typography>

            {successMessage && <Alert severity="success" sx={{ mb: 4 }}>{successMessage}</Alert>}
            {errorMessage && <Alert severity="error" sx={{ mb: 4 }}>{errorMessage}</Alert>}

            <form onSubmit={handleSubmit}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <TextField
                    label="Pesaje (kg)"
                    fullWidth
                    name="pesaje"
                    type="number"
                    value={formData.pesaje}
                    onChange={handleChange}
                    error={!!errors.pesaje}
                    helperText={errors.pesaje}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Observaciones"
                    fullWidth
                    name="observaciones"
                    multiline
                    rows={4}
                    value={formData.observaciones}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button variant="contained" component="label">
                    Subir Imágenes
                    <input
                      type="file"
                      hidden
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                  {errors.imagenes && <Alert severity="error" sx={{ mt: 2 }}>{errors.imagenes}</Alert>}
                </Grid>

                {/* Vista previa de imágenes seleccionadas */}
                <Grid item xs={12}>
                  {formData.imagenes.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography>Imágenes seleccionadas:</Typography>
                      <Grid container spacing={2}>
                        {formData.imagenes.map((image, index) => (
                          <Grid item key={index}>
                            <Box
                              sx={{
                                position: "relative",
                                display: "inline-block",
                                width: 100,
                                height: 100,
                              }}
                            >
                              <img
                                src={URL.createObjectURL(image)}
                                alt={`imagen-${index}`}
                                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
                              />
                              <IconButton
                                size="small"
                                sx={{
                                  position: "absolute",
                                  top: 0,
                                  right: 0,
                                  backgroundColor: "rgba(0,0,0,0.5)",
                                  color: "white",
                                }}
                                onClick={() => handleRemoveImage(index)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mt: 4 }}>
                <Grid item xs={12} sx={{ textAlign: "right" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isLoading}
                    startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
                  >
                    {isLoading ? "Procesando..." : "Registrar Mezclado"}
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

export default RegistroMezclado;
