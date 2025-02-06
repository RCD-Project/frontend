import { useState } from 'react';
import { Table } from 'evergreen-ui';
import { useNavigate } from 'react-router-dom';
import { IconButton } from 'evergreen-ui';
import { EditIcon } from 'evergreen-ui';
import { Link } from 'react-router-dom';
import '../styles/Tabla.css';

const perfiles = [
  { id: 1, nombre: 'Pedro', ultimaActividad: '2022-12-01', cantidadObras: 50 },
  { id: 2, nombre: 'Juan', ultimaActividad: '2022-11-25', cantidadObras: 80 },
  { id: 3, nombre: 'Maria', ultimaActividad: '2022-11-10', cantidadObras: 30 },
  { id: 4, nombre: 'Luis', ultimaActividad: '2022-10-25', cantidadObras: 75 },
  { id: 5, nombre: 'Sofia', ultimaActividad: '2022-10-10', cantidadObras: 60 },
];

const Tabla = () => {
  const [filtro, setFiltro] = useState('');
  const perfilesFiltrados = perfiles.filter((perfil) =>
    perfil.nombre.toLowerCase().includes(filtro.toLowerCase())
  );
const navigate = useNavigate();

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
        {perfilesFiltrados.map((perfil) => (
          <Table.Row key={perfil.id} isSelectable>
            <Table.TextCell>
              <Link 
                to={`/detallescliente?id=${perfil.id}`} 
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {perfil.nombre}
              </Link>
            </Table.TextCell>
            <Table.TextCell>{perfil.ultimaActividad}</Table.TextCell>
            <Table.TextCell isNumber>{perfil.cantidadObras}</Table.TextCell>
            
            <Table.TextCell className="edit-cell">
              <IconButton
                icon={EditIcon} 
                appearance="minimal"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/editarcliente?id=${perfil.id}`);
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
