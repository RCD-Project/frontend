import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormStore } from "./context/FormContext";

const ObrasList = () => {
  const [obras, setObras] = useState([]);
  const navigate = useNavigate();
  const { data, updateData } = useFormStore();

  useEffect(() => {
    // Realizar la petición a la API de obras aprobadas
    fetch("http://localhost:8000/api/obras/aprobadas/")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setObras(data); // Guardar obras en el estado
      })
      .catch((err) => console.error("Error al obtener obras aprobadas:", err));
  }, []);

  const handleSelectObra = (obra) => {
    updateData("page1", {
      ...data.page1,
      // Guarda el nombre de la obra para mostrarlo o usarlo en otro lugar
      obra: obra.nombre_obra,
      // Guarda el ID de la obra (o la obra completa si lo prefieres)
      obraId: obra.id,
      direccion: obra.direccion,
      // Si deseas que en el formulario se pueda seleccionar otra obra,
      // guarda la lista de obras aprobadas
      obrasDisponibles: obras,
    });
  
    updateData("pageIndex", 0); // Reinicia el índice de página en el formulario
  
    // Navega a la ruta del formulario (puedes ajustar el retraso o eliminarlo si no es necesario)
    setTimeout(() => {
      navigate("../Formularios");
    }, 100);
  };
  
  

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 3 }}>
        Obras Aprobadas
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Obra</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell align="center">Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {obras.length > 0 ? (
              obras.map((obra) => (
                <TableRow key={obra.id}>
                  <TableCell>{obra.nombre_obra}</TableCell>
                  <TableCell>{obra.direccion}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#abbf9d', // Verde personalizado
                        '&:hover': {
                          backgroundColor: '#d1e063', // Color al hacer hover
                        },
                      }}
                      onClick={() => handleSelectObra(obra)
                      }
                    >
                      Seleccionar
                    </Button> 
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No hay obras aprobadas disponibles.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ObrasList;
