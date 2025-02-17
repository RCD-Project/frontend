import React, { useState } from "react";
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
    <div>
      <CurrentPage 
        defaultValues={data[pageIndex] || {}} 
        saveData={handleNext} 
      />
      <button onClick={handlePrev} disabled={pageIndex === 0}>Anterior</button>
      <button onClick={() => handleNext({})} disabled={pageIndex === pageComponents.length - 1}>
        Siguiente
      </button>
    </div>
  );
};

export default Formularios;
