import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';

const ClienteSelector = ({ onSelectCliente }) => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/clientes'); // URL da sua API de listagem de clientes
      setClientes(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
      setError('Não foi possível carregar a lista de clientes.');
      setLoading(false);
    }
  };

  if (loading) return <p>Carregando clientes...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <h3>Selecione o Cliente</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.id}</td>
              <td>{cliente.nome}</td>
              <td>{cliente.email}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onSelectCliente(cliente)}
                >
                  Selecionar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ClienteSelector;