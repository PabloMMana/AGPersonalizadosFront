import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Alert } from 'react-bootstrap';
import EstoqueForm from '../components/EstoqueForm'; // Importa o novo componente

const API_URL = 'http://localhost:5000/api/estoque';
const PRODUTO_URL = 'http://localhost:5000/api/produto'; // Usado para buscar nomes

const Estoques = () => {
  const [estoques, setEstoques] = useState([]);
  const [produtosMap, setProdutosMap] = useState({}); // Mapa para traduzir produtoId em Nome
  const [showModal, setShowModal] = useState(false);
  const [estoqueParaEditar, setEstoqueParaEditar] = useState(null); // Item que será editado

  useEffect(() => {
    // Carrega os dados dos Estoques E dos Produtos da API
    fetchProdutosAndEstoques();
  }, []);

  const fetchProdutosAndEstoques = async () => {
    try {
      // 1. Buscar Produtos (para traduzir IDs)
      const produtosResponse = await axios.get(PRODUTO_URL);
      const map = {};
      produtosResponse.data.forEach(p => {
        map[p.id] = p.nome;
      });
      setProdutosMap(map);

      // 2. Buscar Estoques
      const estoquesResponse = await axios.get(API_URL);
      setEstoques(estoquesResponse.data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  const handleOpenModal = (estoque = null) => {
    setEstoqueParaEditar(estoque); // Define o item para edição (ou null para novo)
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEstoqueParaEditar(null);
  };
  
  // Função que é chamada após Adicionar ou Editar com sucesso
  const handleSaveSuccess = () => {
      fetchProdutosAndEstoques(); 
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este item do estoque?')) {
        return;
    }
    try {
      await axios.delete(`${API_URL}/${id}`);
      handleSaveSuccess(); // Atualiza a lista após a exclusão
    } catch (error) {
      console.error('Erro ao excluir estoque:', error);
      alert('Erro ao excluir. Verifique se o item não está referenciado em pedidos.');
    }
  };

  return (
    <div>
      <h2>Estoque</h2>
      {/* Botão Novo Estoque */}
      <Button variant="success" className="mb-3" onClick={() => handleOpenModal(null)}>
        Novo Estoque
      </Button>
      
      {estoques.length === 0 && (
          <Alert variant="info">Nenhum item em estoque encontrado.</Alert>
      )}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Quantidade</th>
            <th>Produto</th>            
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {estoques.map(estoque => (
            <tr key={estoque.id}>
              <td>{estoque.quantidade}</td>
              {/* Traduz o produtoId para o Nome do Produto */}
              <td>{produtosMap[estoque.produtoId] || estoque.produtoId}</td>
              
              <td>
                {/* Botão Editar: passa o item completo para edição */}
                <Button variant="info" className="me-2" onClick={() => handleOpenModal(estoque)}>
                    Editar
                </Button>
                <Button variant="danger" onClick={() => handleDelete(estoque.id)}>
                    Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      {/* Componente Modal de Adição/Edição */}
      <EstoqueForm 
          show={showModal} 
          handleClose={handleCloseModal} 
          estoqueParaEditar={estoqueParaEditar}
          onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
};

export default Estoques;