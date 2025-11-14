import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';
// Importa o componente de formulário que contém a lógica de POST
import ClienteForm from '../components/ClienteForm'; 

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [showModal, setShowModal] = useState(false); // 1. Estado para controlar a visibilidade do Modal
  const [clienteParaEditar, setClienteParaEditar] = useState(null); // 2. Estado para Edição (null = Adição)

  useEffect(() => {
    fetchClientes();
  }, []);

  
  const fetchClientes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/clientes'); 
      setClientes(response.data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  // 3. Função para abrir o modal (no modo Adição, cliente = null)
  const handleOpenModal = (cliente = null) => {
      setClienteParaEditar(cliente); // Se null, é Novo Cliente
      setShowModal(true);
  };

  // 4. Função para fechar o modal
  const handleCloseModal = () => {
      setShowModal(false);
      setClienteParaEditar(null); // Limpa o estado de edição
  };

  // 5. Callback para ser chamado após o cadastro/edição ser bem-sucedido
  const handleSaveSuccess = () => {
      fetchClientes(); // Recarrega a lista
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) {
        return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/clientes/${id}`);
      fetchClientes(); // Atualiza a lista após a exclusão
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      alert('Não foi possível excluir o cliente. Verifique se ele não tem dados associados.');
    }
  };

  
  return (
    <div>
      <h2>Clientes</h2>
      {/* 6. Adiciona o evento onClick para abrir o modal no modo Adição */}
      <Button 
          variant="success" 
          className="mb-3" 
          onClick={() => handleOpenModal(null)}>
          Novo Cliente
      </Button>
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Endereço</th>
            <th>Telefone</th>
            <th>Ações</th> 
          </tr>
        </thead>
        <tbody>
          {clientes.map(cliente => (
            <tr key={cliente.id}>
              <td>{cliente.nome}</td>
              <td>{cliente.email}</td>
              <td>{cliente.endereco}</td>
              <td>{cliente.telefone}</td>
              
              <td>
                {/* O botão Editar agora abre o modal no modo Edição */}
                <Button 
                    variant="info" 
                    className="me-2" 
                    onClick={() => handleOpenModal(cliente)}>
                    Editar
                </Button>
                <Button 
                    variant="danger" 
                    onClick={() => handleDelete(cliente.id)}>
                    Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      {/* 7. Renderiza o Modal/Formulário */}
      <ClienteForm 
          show={showModal} 
          handleClose={handleCloseModal} 
          clienteParaEditar={clienteParaEditar} // Passa null para Adição
          onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
};

export default Clientes;