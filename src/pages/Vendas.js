import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Alert } from 'react-bootstrap';


const API_URL = 'http://localhost:5000/api/venda';
const PRODUTO_URL = 'http://localhost:5000/api/produto'; // Usado para buscar nomes

const Vendas = () => {
  const [vendas, setEstoques] = useState([]);
  const [produtosMap, setProdutosMap] = useState({}); // Mapa para traduzir produtoId em Nome
  const [showModal, setShowModal] = useState(false);
  const [vendaParaEditar, setVendaParaEditar] = useState(null); // Item que será editado
  const CLIENTE_URL = 'http://localhost:5000/api/clientes ';
  const [clientesMap, setClientesMap] = useState({});
  useEffect(() => {
    // Carrega os dados dos Vendas E dos Produtos da API
    fetchProdutosAndVendas();
  }, []);

  
  const fetchProdutosAndVendas = async () => {
  try {
    // Busca Produtos e Clientes simultaneamente
    const [produtosResponse, clientesResponse, vendasResponse] = await Promise.all([
      axios.get(PRODUTO_URL),
      axios.get(CLIENTE_URL),
      axios.get(API_URL)
    ]);

    // Mapeia IDs de Produtos para Nomes
    const pMap = {};
produtosResponse.data.forEach(p => { 
  // Garanta que p.id e p.nome existam exatamente com esses nomes no JSON
  pMap[p.id] = p.nome; 
});
setProdutosMap(pMap);

    // Mapeia IDs de Clientes para Nomes
    const cMap = {};
    clientesResponse.data.forEach(c => { cMap[c.id] = c.nome; }); // Assume que o campo no banco é 'nome'
    setClientesMap(cMap);

    // Atualiza a lista de vendas
    setEstoques(vendasResponse.data);
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
  }
};
  const handleOpenModal = (venda = null) => {
    setVendaParaEditar(venda); // Define o item para edição (ou null para novo)
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setVendaParaEditar(null);
  };
  
  // Função que é chamada após Adicionar ou Editar com sucesso
  const handleSaveSuccess = () => {
      fetchProdutosAndVendas(); 
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este item do venda?')) {
        return;
    }
    try {
      await axios.delete(`${API_URL}/${id}`);
      handleSaveSuccess(); // Atualiza a lista após a exclusão
    } catch (error) {
      console.error('Erro ao excluir venda:', error);
      alert('Erro ao excluir. Verifique se o item não está referenciado em pedidos.');
    }
  };

  return (
    <div className="p-5">
      <h2><b>Venda</b></h2>  
      {/* Botão Novo Venda */}
      <Button variant="success" className="mb-3" onClick={() => handleOpenModal(null)}>
        Novo Venda
      </Button>
      
      {vendas.length === 0 && (
          <Alert variant="info">Nenhum item em venda encontrado.</Alert>
      )}

      <Table striped bordered hover>
        <thead>
          <tr>
             <th>Pedido</th>
             <th>Preço Unitário</th>
            <th>Quantidade</th>
            <th>Produto</th> 
            <th>Cliente</th> 
             <th>Status</th> 
             <th>Data de Venda</th>              
            
          </tr>
        </thead>
        <tbody>
          {vendas.map(venda => (
            <tr key={venda.id}>
      <td>{venda.pedidoId}</td>    
      <td>{venda.precoUnitario}</td>          
      <td>{venda.quantidade}</td>     
      {/* 1. Busca o nome no mapa de produtos usando o ID correto */}
      <td>{produtosMap[venda.produtoId] || (produtosMap.nome )}</td>             
      <td>{clientesMap[venda.clienteId] || "Carregando..."}</td>
      {/* 2. Lógica para converter o Status de número para texto */}
      <td>{venda.status === 1 ? "Finalizado" : venda.status}</td>             
      <td>{new Date(venda.dataVenda).toLocaleString('pt-BR')}</td>    
    </tr>
          ))}
        </tbody>
      </Table>
      
      {/* Componente Modal de Adição/Edição */}
      
    </div>
  );
};

export default Vendas;