import React, { useState } from "react";
import { Button, Box } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useFormStore } from "../pages/context/FormContext";

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

  const CurrentPage = pageComponents[pageIndex];

  if (!CurrentPage) return <div>No se encontró la página</div>;

  const handleNext = (values) => {
    updateData(pageIndex, values);
    if (pageIndex < pageComponents.length - 1) setPageIndex(pageIndex + 1);
  };

  const handlePrev = () => {
    if (pageIndex > 0) setPageIndex(pageIndex - 1);
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
          disabled={pageIndex === 0}
        >
          Anterior
        </Button>

        <Button
          variant="contained"
          color="success"
          endIcon={<ArrowForward />}
          onClick={() => handleNext({})}
          disabled={pageIndex === pageComponents.length - 1}
        >
          Siguiente
        </Button>
      </Box>
    </Box>
  );
};

export default Formularios;
