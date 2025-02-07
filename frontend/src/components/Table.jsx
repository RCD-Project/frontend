import { useState } from 'react';
import { Table, IconButton, EyeOpenIcon, EditIcon, DeleteIcon } from 'evergreen-ui';
import { useNavigate } from 'react-router-dom';
import '../styles/Tabla.css';

const Tabla = ({ clientes = [] }) => {
  const [filtro, setFiltro] = useState("");
  const navigate = useNavigate();

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  const eliminarCliente = (id) => {
    const confirmacion = window.confirm("¿Seguro que deseas eliminar este cliente?");
    if (confirmacion) {
      setClientes(clientes.filter((cliente) => cliente.id !== id));
      toaster.success("Cliente eliminado con éxito");
    }
  };


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
            <Table.TextCell>{cliente.ultimaActividad}</Table.TextCell>
            <Table.TextCell isNumber>{cliente.cantidadObras}</Table.TextCell>
            
            <Table.TextCell className="view-cell">
              <IconButton
                icon={EyeOpenIcon} 
                appearance="minimal"
                onClick={navigate(`/detallescliente?id=${cliente.id}`)}
              />
            </Table.TextCell>
            <Table.TextCell className="edit-cell">
              <IconButton
                icon={EditIcon} 
                appearance="minimal"
                onClick={navigate(`/editarcliente?id=${cliente.id}`)} 
              />
            </Table.TextCell>
            <Table.TextCell className="delete-cell">
              <IconButton
                icon={DeleteIcon} 
                appearance="minimal"
                onClick={eliminarCliente(cliente.id)}
              />
            </Table.TextCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );  
};

export default Tabla;
