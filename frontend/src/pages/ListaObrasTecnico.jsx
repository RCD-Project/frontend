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
    // obras aprobadas
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

      obra: obra.nombre_obra,
      obraId: obra.id,
      direccion: obra.direccion,
      obrasDisponibles: obras,
    });
  
    updateData("pageIndex", 0);
  
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
                        backgroundColor: '#abbf9d',
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
