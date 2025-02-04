import { useState } from "react";
import { Table } from "evergreen-ui";
import { Link } from "react-router-dom";
import "../styles/DetallesCliente.css";

const Tabla = ({ clientes }) => {
  console.log("Clientes recibidos en Tabla:", clientes);
  const [filtro, setFiltro] = useState("");

  // Filtrar clientes por nombre
  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Table>
      <Table.Head>
        <Table.SearchHeaderCell 
          onChange={(valor) => setFiltro(valor)} 
          placeholder="Filtrar por nombre..."
        />
        <Table.TextHeaderCell>Fecha de ingreso</Table.TextHeaderCell>
        <Table.TextHeaderCell>Razón Social</Table.TextHeaderCell>
        <Table.TextHeaderCell>RUT</Table.TextHeaderCell>
      </Table.Head>
      <Table.Body height={240}>
        {clientesFiltrados.map((cliente) => (
          <Table.Row key={cliente.id} isSelectable>
            <Table.TextCell>
              <Link to={`/detallescliente?id=${cliente.id}`} style={{ textDecoration: "none", color: "blue" }}>
                {cliente.nombre}
              </Link>
            </Table.TextCell>
            <Table.TextCell>{cliente.fecha_ingreso}</Table.TextCell>
            <Table.TextCell>{cliente.razon_social}</Table.TextCell>
            <Table.TextCell>{cliente.rut}</Table.TextCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default Tabla;
