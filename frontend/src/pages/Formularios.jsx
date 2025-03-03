// Formularios.jsx
import React, { useState } from "react";
import { Button, Box } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useFormStore } from "../pages/context/FormContext";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

// Importa las páginas del formulario de forma dinámica
const pages = import.meta.glob("../pages/forms/*.jsx", { eager: true });

// Ordena las páginas según el número en el nombre del archivo (page1, page2, …, page13)
const pageComponents = Object.entries(pages)
  .sort(([a], [b]) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || "0", 10);
    const numB = parseInt(b.match(/\d+/)?.[0] || "0", 10);
    return numA - numB;
  })
  .map(([, module]) => module.default);

const Formularios = () => {
  const { data, updateData } = useFormStore();
  const [pageIndex, setPageIndex] = useState(0);
  const navigate = useNavigate();

  const CurrentPage = pageComponents[pageIndex];
  if (!CurrentPage) return <div>No se encontró la página</div>;

  // Convierte un objeto a uno plano (solo propiedades propias)
  const toPlainObject = (obj) => {
    if (obj === null || typeof obj !== "object") return obj;
    const plain = {};
    Object.keys(obj).forEach((key) => {
      plain[key] = obj[key];
    });
    return plain;
  };

  // Transforma la data global en el objeto final esperado por el backend.
  const transformData = (globalData) => {
    const page1Data = globalData["page1"] || {};
    const page2Data = globalData["page2"] || {};
    const page3Data = globalData["page3"] || {};
    const page4Data = globalData["page4"] || {};
    const page5Data = globalData["page5"] || {};
    const page6Data = globalData["page6"] || {};
    const page7Data = globalData["page7"] || {};
    const page8Data = globalData["page8"] || {};
    const page9Data = globalData["page9"] || {};
    const page10Data = globalData["page10"] || {};
    const page11Data = globalData["page11"] || {};
    const page12Data = globalData["page12"] || {};
    const page13Data = globalData["page13"] || {};

    return {
      // Datos de Page 1:
      tecnico: page1Data.tecnico || "",  // ✅ Asegura que no sea null
      obra: page1Data.obraId || page1Data.obra || "",  // ✅ Evita NULL
      fecha: page1Data.fecha ? dayjs(page1Data.fecha).format("YYYY-MM-DD") : "",  // ✅ Envía fecha vacía si no existe
    
      motivo_de_visita: Array.isArray(page1Data.motivos) ? page1Data.motivos.join(", ") : "No especificado",
      otro_motivo: page1Data.otroMotivo || "",  // ✅ Evita NULL
    
      // Datos de Page 2:
      logistica_de_obra: page2Data.logistica || "No especificado",
      logistica_de_obra_observaciones: page2Data.logisticaObservaciones || "",
      participante_jornal_ambiental: page2Data.participacion?.["Jornal Ambiental"] || "No especificado",
      participante_operario: page2Data.participacion?.["Operarios"] || "No especificado",
      participante_oficina_tecnica: page2Data.participacion?.["Oficina Técnica (jefe de obra, capataz, etc.)"] || "No especificado",
      participante_observaciones: page2Data.participantesObservaciones || "",
    
      limpieza_general_en_terreno: page2Data.limpieza?.["En terreno"] || "No especificado",
      limpieza_general_en_pisos: page2Data.limpieza?.["Por pisos"] || "No especificado",
      limpieza_general_observaciones: page2Data.limpiezaObservaciones || "",
    
      // Datos de Page 3:
      punto_limpio: page3Data.puntoLimpio || "no_hay",  
      punto_limpio_ubicacion: page3Data.puntoLimpioUbicacion || "No especificado",
      punto_limpio_estructura: page3Data.puntoLimpioEstructura || "No especificado",
      punto_limpio_tipo_contenedor: page3Data.puntoLimpioTipoContenedor || "No especificado",
      punto_limpio_estado_contenedor: page3Data.puntoLimpioEstadoContenedor || "No especificado",
      punto_limpio_señaletica: page3Data.puntoLimpioSeñaletica || "No especificado",
      punto_limpio_observaciones: page3Data.puntoLimpioObservaciones || "Sin observaciones",
    
      // Datos de Page 4:
      puntos_limpios_por_pisos: page4Data.puntosLimpiosEdificio || "No hay",
      grillaPuntosLimpiosPisos: page4Data.grillaPuntosLimpiosPisos || {},
    
      // Datos de Page 5:
      acopioContenedores: page5Data.acopioContenedores || "No especificado",
      grilla: page5Data.grilla || {},
      observaciones: page5Data.observaciones || "",
    
      // Datos de Page 6:
      accionesTomadas: page6Data.accionesTomadas || "",
      otrasObservaciones: page6Data.otrasObservaciones || "",
    
      // Datos de Page 7:
      escombro: page7Data.escombro || "no_aplica",
      escombroChecks: page7Data.checks || [],
      escombroOtroTexto: page7Data.otroTexto || "",
      escombroObservaciones: page7Data.observaciones || "",
    
      // Datos de Page 8:
      plastico: page8Data.plastico || "no_aplica",
      plasticoOpciones: page8Data.plasticoOpciones || [],
      plasticoOtro: page8Data.plasticoOtro || "",
      plasticoObservaciones: page8Data.plasticoObservaciones || "",
    
      // Datos de Page 9:
      papelCarton: page9Data.papelCarton || "no_aplica",
      papelCartonOpciones: page9Data.papelCartonOpciones || [],
      papelCartonOtro: page9Data.papelCartonOtro || "",
      papelCartonObservaciones: page9Data.papelCartonObservaciones || "",
    
      // Datos de Page 10:
      metales: page10Data.metales || "no_aplica",
      metalesOpciones: page10Data.metalesOpciones || [],
      metalesOtroTexto: page10Data.metalesOtroTexto || "",
      metalesObservaciones: page10Data.metalesObservaciones || "",
    
      // Datos de Page 11:
      madera: page11Data.madera || "no_aplica",
      maderaOpciones: page11Data.maderaOpciones || [],
      maderaOtro: page11Data.maderaOtro || "",
      maderaObservaciones: page11Data.maderaObservaciones || "",
    
      // Datos de Page 12:
      mezclados: page12Data.mezclados || "no_aplica",
      gridSelection: page12Data.gridSelection || null,
      mezcladosOpciones: page12Data.mezcladosOpciones || [],
      mezcladosOtro: page12Data.mezcladosOtro || "",
      mezcladosObservaciones: page12Data.mezcladosObservaciones || "",
    
      // Datos de Page 13:
      puntoAcopio: page13Data.puntoAcopio || "no_aplica",
      puntoAcopioGrid: page13Data.puntoAcopioGrid || [],
      puntoAcopioOpciones: page13Data.puntoAcopioOpciones || [],
      puntoAcopioOtro: page13Data.puntoAcopioOtro || "",
      puntoAcopioObservaciones: page13Data.puntoAcopioObservaciones || "",
    };
    
  };

  const handleNext = async (values) => {
    const currentPageKey = `page${pageIndex + 1}`;
    updateData(currentPageKey, values);

    if (pageIndex < pageComponents.length - 1) {
      setPageIndex(pageIndex + 1);
    } else {
      const allData = useFormStore.getState().data;
      const finalData = transformData(allData);
      console.log("Datos transformados a enviar:", finalData);

      const token = localStorage.getItem("token");

      if (!finalData.obra) {
        console.error("No se encontró un ID de obra en los datos.");
        alert("No se encontró una obra seleccionada.");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/api/formularios/crear/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}`
            },
            body: JSON.stringify(finalData),
        });
    
        const responseData = await response.json();
    
        if (!response.ok) {
            console.error("Error en la respuesta:", responseData);
            throw new Error("Error al guardar el formulario");
        }
    
        console.log("Registro creado:", responseData);

        useFormStore.setState({ data: {} });
        
        navigate("/resumen");
    } catch (error) {
        console.error("Error al guardar el formulario:", error);
        alert("Ocurrió un error al guardar el formulario. Revisa la consola para más detalles.");
    }
    
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
      <CurrentPage
        saveData={handleNext}
        defaultValues={data[`page${pageIndex + 1}`] || {}}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button variant="contained" color="success" startIcon={<ArrowBack />} onClick={handlePrev}>
          Anterior
        </Button>
        <Button variant="contained" color="success" endIcon={<ArrowForward />} onClick={() => handleNext({})}>
          {pageIndex === pageComponents.length - 1 ? "Guardar Formulario" : "Siguiente"}
        </Button>
      </Box>
    </Box>
  );
};

export default Formularios;
