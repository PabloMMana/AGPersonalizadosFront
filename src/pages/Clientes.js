import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    // Carrega os dados dos clientes da API
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/clientes'); // URL da sua API de clientes
      setClientes(response.data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/clientes/${id}`);
      fetchClientes(); // Atualiza a lista após a exclusão
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
    }
  };

  return (
    <div>
      <h2>Clientes</h2>
      <Button variant="success" className="mb-3">Novo Cliente</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(cliente => (
            <tr key={cliente.id}>
              <td>{cliente.nome}</td>
              <td>{cliente.email}</td>
              <td>
                <Button variant="info" className="me-2">Editar</Button>
                <Button variant="danger" onClick={() => handleDelete(cliente.id)}>Excluir</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Clientes;