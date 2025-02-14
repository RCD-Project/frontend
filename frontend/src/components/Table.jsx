import { useState } from 'react';
import { Table, IconButton, EyeOpenIcon, EditIcon, DeleteIcon, toaster } from 'evergreen-ui';
import { useNavigate } from 'react-router-dom';
import '../styles/Table.css';

const Tabla = ({ datos = [], columnas = [], onEliminar, filtroPlaceholder }) => {
  const [filtro, setFiltro] = useState("");
  const navigate = useNavigate();

  // Filtrar los datos según el valor del filtro
  const datosFiltrados = datos.filter((dato) =>
    dato[filtroPlaceholder]?.toLowerCase().includes(filtro.toLowerCase())
  );
  

  return (
    <div className="table-container">
      <Table className="fullscreen-table">
        <Table.Head>
          {columnas.map((columna, index) => (
            <Table.TextHeaderCell key={index}>{columna.titulo}</Table.TextHeaderCell>
          ))}
          <Table.SearchHeaderCell
            onChange={(e) => setFiltro(e.target.value)}
            placeholder={`Filtrar por ${filtroPlaceholder}...`}
          />
        </Table.Head>
        <Table.Body height={240}>
          {datosFiltrados.map((dato) => (
            <Table.Row key={dato.id} isSelectable>
              {columnas.map((columna, index) => (
                <Table.TextCell key={index}>{dato[columna.clave]}</Table.TextCell>
              ))}
              <Table.TextCell className="view-cell">
                <IconButton
                  icon={EyeOpenIcon}
                  appearance="minimal"
                  onClick={() => navigate(`/detallescliente?id=${dato.id}`)}
                />
              </Table.TextCell>
              <Table.TextCell className="edit-cell">
                <IconButton
                  icon={EditIcon}
                  appearance="minimal"
                  onClick={() => navigate(`/editarcliente?id=${dato.id}`)}
                />
              </Table.TextCell>
              <Table.TextCell className="delete-cell">
                <IconButton
                  icon={DeleteIcon}
                  appearance="minimal"
                  onClick={() => onEliminar(dato.id)} // Usamos onEliminar desde el componente padre
                />
              </Table.TextCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default Tabla;
