import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  Alert,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../pages/context/AuthContext";

const materialOptions = [
  { value: "escombro_limpio", label: "Escombro limpio" },
  { value: "plastico", label: "Plástico" },
  { value: "papel_carton", label: "Papel y cartón" },
  { value: "metales", label: "Metales" },
  { value: "madera", label: "Madera" },
  { value: "mezclados", label: "Mezclados" },
  { value: "peligrosos", label: "Peligrosos" },
];

const initialFormState = {
  obra: "",
  descripcion: "",
  observacion: "",
  estado: "",
  fechaSolicitud: null,
  fechaRetiro: null,
  pesaje: "",
  comentarios: "",
  tipoMaterial: "",
  transportista: "",
  empresa_tratamiento: "",
};

const FormularioCoordinaciones = () => {
  const { role, user, token } = useContext(AuthContext);
  const [obras, setObras] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [transportistas, setTransportistas] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Obtener listado de obras aprobadas y filtrar según el email del cliente
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/obras/aprobadas/", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Obras recibidas:", data);
        let obrasArray = [];
        if (Array.isArray(data)) {
          obrasArray = data;
        } else if (data.results && Array.isArray(data.results)) {
          obrasArray = data.results;
        }
        // Filtrado similar al utilizado en AltaObra:
        if (role === "cliente" && user) {
          obrasArray = obrasArray.filter((obra) => {
            const emailCliente = obra.email_cliente?.trim().toLowerCase();
            return emailCliente === user.email.trim().toLowerCase();
          });
        }
        setObras(obrasArray);
      })
      .catch((err) => {
        console.error("Error al obtener obras:", err);
        setErrorMessage("Error al obtener obras. Intenta nuevamente.");
      });
  }, [role, user, token]);

  // Obtener listado de transportistas
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/transportistas/lista/", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Transportistas recibidos:", data);
        let transportistasArray = [];
        if (Array.isArray(data)) {
          transportistasArray = data;
        } else if (data.results && Array.isArray(data.results)) {
          transportistasArray = data.results;
        }
        setTransportistas(transportistasArray);
      })
      .catch((err) =>
        console.error("Error al obtener transportistas:", err)
      );
  }, [token]);

  // Obtener listado de empresas de tratamiento
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/empresas/lista/", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Empresas de tratamiento recibidas:", data);
        let empresasArray = [];
        if (Array.isArray(data)) {
          empresasArray = data;
        } else if (data.results && Array.isArray(data.results)) {
          empresasArray = data.results;
        }
        setEmpresas(empresasArray);
      })
      .catch((err) =>
        console.error("Error al obtener empresas:", err)
      );
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (name, newValue) => {
    setFormData({ ...formData, [name]: newValue });
  };

  // Filtrar opciones de material según el transportista seleccionado
  const filteredMaterialOptions = formData.transportista
    ? materialOptions.filter((option) => {
        const selectedTransportista = transportistas.find(
          (t) => t.id === formData.transportista
        );
        return selectedTransportista
          ? selectedTransportista.tipo_material === option.value
          : true;
      })
    : materialOptions;

  // Filtrar transportistas según el material seleccionado
  const filteredTransportistas = formData.tipoMaterial
    ? transportistas.filter(
        (t) => t.tipo_material === formData.tipoMaterial
      )
    : transportistas;

  // Sincronizar transportista y tipoMaterial
  useEffect(() => {
    if (formData.transportista) {
      const selectedTransportista = transportistas.find(
        (t) => t.id === formData.transportista
      );
      if (
        selectedTransportista &&
        formData.tipoMaterial !== selectedTransportista.tipo_material
      ) {
        setFormData((prev) => ({
          ...prev,
          tipoMaterial: selectedTransportista.tipo_material,
        }));
      }
    }
  }, [formData.transportista, transportistas]);

  useEffect(() => {
    if (formData.tipoMaterial && formData.transportista) {
      const selectedTransportista = transportistas.find(
        (t) => t.id === formData.transportista
      );
      if (
        selectedTransportista &&
        selectedTransportista.tipo_material !== formData.tipoMaterial
      ) {
        setFormData((prev) => ({
          ...prev,
          transportista: "",
        }));
      }
    }
  }, [formData.tipoMaterial, formData.transportista, transportistas]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Enviando solicitud de coordinación:", formData);

    const payload = {
      obra: formData.obra,
      descripcion: formData.descripcion,
      observaciones: formData.observacion,
      fecha_retiro: formData.fechaRetiro
        ? formData.fechaRetiro.format("YYYY-MM-DD")
        : null,
      pesaje: formData.pesaje,
      comentarios: formData.comentarios,
      tipo_material: formData.tipoMaterial,
      transportista: formData.transportista,
      empresa_tratamiento: formData.empresa_tratamiento,
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/coordinacionretiro/registro/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Solicitud de coordinación creada:", data);
        navigate("/", { state: { successMessage: "Solicitud enviada con éxito." } });
      } else {
        let errorData;
        try {
          errorData = await response.json();
        } catch (err) {
          errorData = { detail: await response.text() };
        }
        console.error("Error específico:", errorData);
        setErrorMessage("Error al enviar la solicitud: " + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      setErrorMessage("Error de red. Intenta nuevamente.");
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
        Solicitud de Coordinación
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Dropdown para seleccionar la obra */}
          <Grid item xs={12}>
            <TextField
              select
              label="Obra"
              fullWidth
              name="obra"
              value={formData.obra}
              onChange={handleChange}
              required
            >
              {obras.map((obra) => (
                <MenuItem key={obra.id} value={obra.id}>
                  {obra.nombre_obra || obra.nombre || "Sin nombre"}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Dropdown para seleccionar el transportista */}
          <Grid item xs={12}>
            <TextField
              select
              label="Transportista"
              fullWidth
              name="transportista"
              value={formData.transportista}
              onChange={handleChange}
              required
            >
              {filteredTransportistas.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.nombre || "Sin nombre"}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Dropdown para seleccionar la empresa de tratamiento */}
          <Grid item xs={12}>
            <TextField
              select
              label="Empresa de Tratamiento"
              fullWidth
              name="empresa_tratamiento"
              value={formData.empresa_tratamiento}
              onChange={handleChange}
              required
            >
              {empresas.length > 0 ? (
                empresas.map((e) => (
                  <MenuItem key={e.id} value={e.id}>
                    {e.nombre || "Sin nombre"}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No hay empresas</MenuItem>
              )}
            </TextField>
          </Grid>

          {/* Dropdown para seleccionar el tipo de material */}
          <Grid item xs={12}>
            <TextField
              select
              label="Tipo de Material"
              fullWidth
              name="tipoMaterial"
              value={formData.tipoMaterial}
              onChange={handleChange}
              required
            >
              {filteredMaterialOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Campo de texto para la descripción */}
          <Grid item xs={12}>
            <TextField
              label="Descripción"
              fullWidth
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Campo de texto para la observación */}
          <Grid item xs={12}>
            <TextField
              label="Observación"
              fullWidth
              name="observacion"
              value={formData.observacion}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Campo de texto para el estado */}
          <Grid item xs={12}>
            <TextField
              label="Estado"
              fullWidth
              name="estado"
              value={formData.estado}
              onChange={handleChange}
            />
          </Grid>

          {/* DatePicker para la fecha de solicitud */}
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha de Solicitud"
                value={formData.fechaSolicitud}
                onChange={(newValue) =>
                  handleDateChange("fechaSolicitud", newValue)
                }
                renderInput={(params) => (
                  <TextField {...params} fullWidth required />
                )}
              />
            </LocalizationProvider>
          </Grid>

          {/* DatePicker para la fecha de retiro */}
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha de Retiro"
                value={formData.fechaRetiro}
                onChange={(newValue) =>
                  handleDateChange("fechaRetiro", newValue)
                }
                renderInput={(params) => (
                  <TextField {...params} fullWidth required />
                )}
              />
            </LocalizationProvider>
          </Grid>

          {/* Campo para el pesaje */}
          <Grid item xs={12}>
            <TextField
              label="Pesaje"
              fullWidth
              name="pesaje"
              value={formData.pesaje}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Campo para comentarios */}
          <Grid item xs={12}>
            <TextField
              label="Comentarios"
              fullWidth
              multiline
              rows={4}
              name="comentarios"
              value={formData.comentarios}
              onChange={handleChange}
            />
          </Grid>

          {/* Botones de envío y reseteo */}
          <Grid container spacing={2} justifyContent="center" sx={{ marginTop: "20px" }}>
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  marginTop: "20px",
                  backgroundColor: "#abbf9d",
                  "&:hover": { backgroundColor: "#d1e063" },
                }}
              >
                Enviar Coordinación
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                sx={{
                  marginTop: "20px",
                  borderColor: "#abbf9d",
                  color: "#abbf9d",
                  "&:hover": { borderColor: "#d1e063", color: "#d1e063" },
                }}
                onClick={handleReset}
              >
                Limpiar Formulario
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default FormularioCoordinaciones;
