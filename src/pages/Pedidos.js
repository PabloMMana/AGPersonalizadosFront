import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    // Carrega os dados dos produtos da API
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/pedido'); // URL da sua API de pedido
      setPedidos(response.data);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/pedido/${id}`);
      fetchPedidos(); // Atualiza a lista após a exclusão
    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
    }
  };

  return (
    <div>
      <h2>Pedidos</h2>
      <Button variant="success" className="mb-3">Novo Pedido</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Data do Pedido</th>
            <th>Nome do Produto</th>
            <th>Detalhes</th>
            <th>Quantidade</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map(pedido => (
            <tr key={pedido.id}>
              <td>{pedido.datapedido}</td>
              <td>{pedido.NomeProduto}</td>
              <td>{pedido.Detalhes}</td>
              <td>{pedido.Quamtidade}</td>
              
              <td>
                <Button variant="info" className="me-2">Editar</Button>
                <Button variant="danger" onClick={() => handleDelete(pedido.id)}>Excluir</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Pedidos;