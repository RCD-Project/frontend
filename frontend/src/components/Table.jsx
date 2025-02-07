import { useState } from 'react';
import { Table, IconButton, EditIcon } from 'evergreen-ui';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../styles/Tabla.css';

const Tabla = ({ clientes = [] }) => {
  const [filtro, setFiltro] = useState("");
  const navigate = useNavigate();

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Table>
      <Table.Head>
        <Table.TextHeaderCell>Nombres</Table.TextHeaderCell>
        <Table.TextHeaderCell>Fecha de ingreso</Table.TextHeaderCell>
        <Table.TextHeaderCell>Cantidad de obras</Table.TextHeaderCell>
        <Table.SearchHeaderCell 
          onChange={(valor) => setFiltro(valor)} 
          placeholder="Filtrar por nombre..."
        />
      </Table.Head>
      <Table.Body height={240}>
        {clientesFiltrados.map((cliente) => (
          <Table.Row key={cliente.id} isSelectable>
            <Table.TextCell>
              <Link 
                to={`/detallescliente?id=${cliente.id}`} 
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {cliente.nombre}
              </Link>
            </Table.TextCell>
            <Table.TextCell>{cliente.ultimaActividad}</Table.TextCell>
            <Table.TextCell isNumber>{cliente.cantidadObras}</Table.TextCell>
            
            <Table.TextCell className="edit-cell">
              <IconButton
                icon={EditIcon} 
                appearance="minimal"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/editarcliente?id=${cliente.id}`);
                }} 
              />
            </Table.TextCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );  
};

export default Tabla;
