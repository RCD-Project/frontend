import React, { useState } from 'react';
import Tabla from '../components/Table';
import { Button, AddIcon } from 'evergreen-ui';
import { Link } from 'react-router-dom';

const Transportistas = () => {
  const [transportistas, setTransportistas] = useState([
    { id: 1, nombre: 'Carlos Díaz', contacto: '123456789', tipoMaterial: 'Madera' },
    { id: 2, nombre: 'Marta Gómez', contacto: '987654321', tipoMaterial: 'Plastico' },
  ]);

  const eliminarTransportista = (id) => {
    const confirmacion = window.confirm("¿Seguro que deseas eliminar este transportista?");
    if (confirmacion) {
      setTransportistas(transportistas.filter((transportista) => transportista.id !== id));
    }
  };

  const columnasTransportistas = [
    { titulo: 'Nombre', clave: 'nombre' },
    { titulo: 'Contacto', clave: 'contacto' },
    { titulo: 'Tipo de material', clave: 'tipoMaterial' }
  ];

  return (
    <div>
      <h1>Listado transportistas</h1>
      <Tabla
        datos={transportistas}
        columnas={columnasTransportistas}
        onEliminar={eliminarTransportista}
        filtroPlaceholder="tipoMaterial"
      />
      <Link to="/altatransportista">
        <Button marginRight={16} intent="success">
          <AddIcon />
          Añadir Transportista
        </Button>
      </Link>
    </div>
  );
};

export default Transportistas;
