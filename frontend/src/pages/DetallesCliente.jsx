import { useLocation } from 'react-router-dom';

// Datos estáticos de ejemplo con propiedades en español
const perfiles = [
  { 
    id: 1, nombre: 'Pedro', ultimaActividad: '2022-12-01', cantidadObras: 50,
    direccion: 'Calle Falsa 123', contacto: '1234567890', nombreContacto: 'Juan Perez', 
    razonSocial: 'Empresa 1', direccionFiscal: 'Calle Falsa 123', root: 'Root1', 
    email: 'pedro@email.com', cronograma: 'Cronograma 1'
  },
  { 
    id: 2, nombre: 'Juan', ultimaActividad: '2022-11-25', cantidadObras: 80,
    direccion: 'Calle Real 456', contacto: '9876543210', nombreContacto: 'Maria Garcia',
    razonSocial: 'Empresa 2', direccionFiscal: 'Calle Real 456', root: 'Root2', 
    email: 'juan@email.com', cronograma: 'Cronograma 2'
  },
  // Puedes seguir añadiendo más clientes aquí si es necesario
];

const DetallesCliente = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id'); // Obtener el id del cliente desde la query string

  // Buscar el perfil del cliente en el array estático "perfiles"
  const cliente = perfiles.find((perfil) => perfil.id === parseInt(id));

  if (!cliente) {
    return <div>Cliente no encontrado</div>;
  }

  return (
    <section className="detalle-cliente">
      <h1>Detalles del Cliente: {cliente.nombre}</h1>
      <div className="input-group">
        <strong>Nombre:</strong> {cliente.nombre}
      </div>
      <div className="input-group">
        <strong>Fecha de Ingreso:</strong> {cliente.ultimaActividad}
      </div>
      <div className="input-group">
        <strong>Cantidad de Obras:</strong> {cliente.cantidadObras}
      </div>
      <div className="input-group">
        <strong>Dirección:</strong> {cliente.direccion}
      </div>
      <div className="input-group">
        <strong>Contacto:</strong> {cliente.contacto}
      </div>
      <div className="input-group">
        <strong>Nombre de Contacto:</strong> {cliente.nombreContacto}
      </div>
      <div className="input-group">
        <strong>Razón Social:</strong> {cliente.razonSocial}
      </div>
      <div className="input-group">
        <strong>Dirección Fiscal:</strong> {cliente.direccionFiscal}
      </div>
      <div className="input-group">
        <strong>Root:</strong> {cliente.root}
      </div>
      <div className="input-group">
        <strong>Correo Electrónico:</strong> {cliente.email}
      </div>
      <div className="input-group">
        <strong>Cronograma:</strong> {cliente.cronograma}
      </div>
    </section>
  );
};

export default DetallesCliente;
