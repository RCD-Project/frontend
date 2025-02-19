import React, { useState } from "react";
import { Button, Box } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useFormStore } from "../pages/context/FormContext";
import { useNavigate } from "react-router-dom";

const pages = import.meta.glob("../pages/forms/*.jsx", { eager: true });

const pageComponents = Object.entries(pages)
  .sort(([a], [b]) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || "0", 10);
    const numB = parseInt(b.match(/\d+/)?.[0] || "0", 10);
    return numA - numB;
  })
  .map(([, module]) => module.default);

const Formularios = () => {
  const { data, updateData } = useFormStore();
  const [pageIndex, setPageIndex] = useState(data.pageIndex || 0);
  const navigate = useNavigate();

  const CurrentPage = pageComponents[pageIndex];

  if (!CurrentPage) return <div>No se encontró la página</div>;

  const handleNext = (values) => {
    // Guarda los datos de la página actual en el estado global
    updateData(pageIndex, values);

    // Si no estamos en la última página, avanzamos normalmente
    if (pageIndex < pageComponents.length - 1) {
      setPageIndex(pageIndex + 1);
    } else {
      // En la última página, mostramos todos los datos globales.
      // Usamos getState para asegurarnos de obtener el estado actualizado.
      const allData = useFormStore.getState().data;
      console.log("Datos globales:", allData);
      alert(JSON.stringify(allData, null, 2));

      // Opcional: puedes redirigir a una página de resumen o reiniciar el formulario
      // navigate("/resumen");
    }
  };

  const handlePrev = () => {
    if (pageIndex === 0) {
      navigate("/obraslist");
    } else {
      setPageIndex(pageIndex - 1);
    }
  };

  return (
    <Box sx={{ width: "100%", textAlign: "center", mt: 4 }}>
      <CurrentPage defaultValues={data[pageIndex] || {}} saveData={handleNext} />

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button
          variant="contained"
          color="success"
          startIcon={<ArrowBack />}
          onClick={handlePrev}
        >
          Anterior
        </Button>

        <Button
          variant="contained"
          color="success"
          endIcon={<ArrowForward />}
          onClick={() => handleNext({})}
        >
          {pageIndex === pageComponents.length - 1 ? "Mostrar Datos" : "Siguiente"}
        </Button>
      </Box>
    </Box>
  );
};

export default Formularios;
