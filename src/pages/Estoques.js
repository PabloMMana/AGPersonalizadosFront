import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';

const Estoques = () => {
  const [estoques, setEstoques] = useState([]);

  useEffect(() => {
    // Carrega os dados dos Estoques da API
    fetchEstoques();
  }, []);

  const fetchEstoques = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/estoque'); // URL da sua API de Estoque
      setEstoques(response.data);
    } catch (error) {
      console.error('Erro ao buscar estoque:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/estoque/${id}`);
      fetchEstoques(); // Atualiza a lista após a exclusão
    } catch (error) {
      console.error('Erro ao excluir estoque:', error);
    }
  };

  return (
    <div>
      <h2>Estoque</h2>
      <Button variant="success" className="mb-3">Novo Estoque</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Quantidade</th>
            <th>Produto</th>            
          </tr>
        </thead>
        <tbody>
          {estoques.map(estoque => (
            <tr key={estoque.id}>
              <td>{estoque.quantidade}</td>
               <td>{estoque.produtoId}</td>
              
              
              <td>
                <Button variant="info" className="me-2">Editar</Button>
                <Button variant="danger" onClick={() => handleDelete(estoque.id)}>Excluir</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Estoques;