import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';
// Importa o componente de formulário que contém a lógica de POST
import FornecedorForm from '../components/FornecedorForm'; 

const Fornecedor = () => {
  const [fornecedor, setFornecedor] = useState([]);
  const [showModal, setShowModal] = useState(false); // 1. Estado para controlar a visibilidade do Modal
  const [fornecedorParaEditar, setFornecedorParaEditar] = useState(null); // 2. Estado para Edição (null = Adição)

  useEffect(() => {
    fetchFornecedor();
  }, []);

  
  const fetchFornecedor= async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/Fornecedor'); 
      setFornecedor(response.data);
    } catch (error) {
      console.error('Erro ao buscar fornecedor:', error);
    }
  };

  // 3. Função para abrir o modal (no modo Adição, fornecedor = null)
  const handleOpenModal = (fornecedor = null) => {
      setFornecedorParaEditar(fornecedor); // Se null, é Novo Fonecedor
      setShowModal(true);
  };

  // 4. Função para fechar o modal
  const handleCloseModal = () => {
      setShowModal(false);
      setFornecedorParaEditar(null); // Limpa o estado de edição
  };

  // 5. Callback para ser chamado após o cadastro/edição ser bem-sucedido
  const handleSaveSuccess = () => {
      fetchFornecedor(); // Recarrega a lista
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este fornecedor?')) {
        return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/fornecedor/${id}`);
      fetchFornecedor(); // Atualiza a lista após a exclusão
    } catch (error) {
      console.error('Erro ao excluir fornecedor:', error);
      alert('Não foi possível excluir o fornecedor. Verifique se ele não tem dados associados.');
    }
  };

  
  return (
    <div className="p-5" > 
      <h2><b>Fornecedores</b></h2>
      {/* 6. Adiciona o evento onClick para abrir o modal no modo Adição */}
      <Button 
          variant="success" 
          className="mb-3" 
          onClick={() => handleOpenModal(null)}>
          Novo Fornecedor
      </Button>
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>CNPJ</th>
            <th>Email</th>
            <th>Endereço</th>
            <th>Telefone</th>    
            <th>Ações</th>          

          </tr>
        </thead>
        <tbody>
          {fornecedor.map(fornecedor => (
            <tr key={fornecedor.id}>
              <td>{fornecedor.nome}</td>
              <td>{fornecedor.cnpj}</td>
              <td>{fornecedor.email}</td>
              <td>{fornecedor.endereco}</td>
              <td>{fornecedor.telefone}</td>             

              
              <td>
                {/* O botão Editar agora abre o modal no modo Edição */}
                <Button 
                    variant="info" 
                    className="me-2" 
                    onClick={() => handleOpenModal(fornecedor)}>
                    Editar
                </Button>
                <Button 
                    variant="danger" 
                    onClick={() => handleDelete(fornecedor.id)}>
                    Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      {/* 7. Renderiza o Modal/Formulário */}
      <FornecedorForm 
          show={showModal} 
          handleClose={handleCloseModal} 
          fornecedorParaEditar={fornecedorParaEditar} // Passa null para Adição
          onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
};

export default Fornecedor;