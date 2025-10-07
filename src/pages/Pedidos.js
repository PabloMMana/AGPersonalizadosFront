import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import ClienteSelector from '../components/ClienteSelector'; // Importe o componente
import PedidoItensForm from '../components/PedidoItensForm';

const Pedidos = () => {
    const [showItemManagementModal, setShowItemManagementModal] = useState(false);
    const [managingPedido, setManagingPedido] = useState(null); 
    const [pedidos, setPedidos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showClienteSelector, setShowClienteSelector] = useState(false); // Novo estado
    const [currentPedido, setCurrentPedido] = useState(null);
    const [showViewItemsModal, setShowViewItemsModal] = useState(false);
    const [viewingPedido, setViewingPedido] = useState(null); 
    const [newPedido, setNewPedido] = useState({
        clienteId: null, // Alterado
        dataPedido: '',
        nomeProduto: '',
        detalhes: '',
        quantidade: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const pedidosResponse = await axios.get('http://localhost:5000/api/Pedido');
            const clientesResponse = await axios.get('http://localhost:5000/api/Clientes');
            setPedidos(pedidosResponse.data);
            setClientes(clientesResponse.data);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    };

    const handleShowItemManagementModal = (pedido) => {
        console.log("Objeto Pedido Recebido:", pedido);
        setManagingPedido(pedido);
        setShowItemManagementModal(true);
    };
    const handleCloseItemManagementModal = () => {
        setShowItemManagementModal(false);
        // Garante que a lista de pedidos seja atualizada após qualquer alteração (adição, edição, exclusão)
        fetchData(); 
        setManagingPedido(null);
    };

    const handleShowViewItemsModal = (pedido) => {
        
        setViewingPedido(pedido);
        setShowViewItemsModal(true);
    };

    const handleCloseViewItemsModal = () => {
        setShowViewItemsModal(false);
        setViewingPedido(null);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/Pedido/${id}`);
            fetchData(); // Usar fetchData para atualizar clientes também
        } catch (error) {
            console.error('Erro ao excluir pedido:', error);
        }
    };

    // Funções do Modal de Edição (mantidas)
    const handleShowEditModal = (pedido) => {
        setCurrentPedido(pedido);
        setShowEditModal(true);
    };
    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setCurrentPedido(null);
    };
    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/Pedido/${currentPedido.id}`, currentPedido);
            fetchData();
            handleCloseEditModal();
        } catch (error) {
            console.error('Erro ao editar pedido:', error);
        }
    };

    // Funções do Modal de Criação (ajustadas)
    const handleShowCreateModal = () => {
        setNewPedido({ clienteId: null, dataPedido: '', nomeProduto: '', detalhes: '', quantidade: '' });
        setShowCreateModal(true);
    };
    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
    };

    // Função de criação (ajustada para usar clienteId)
    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newPedido.clienteId) {
            alert('Por favor, selecione um cliente.');
            return;
        }
        try {
            await axios.post('http://localhost:5000/api/Pedido', newPedido);
            fetchData();
            handleCloseCreateModal();
        } catch (error) {
            console.error('Erro ao criar pedido:', error);
        }
    };

    // Funções para o seletor de cliente
    const handleShowClienteSelector = () => setShowClienteSelector(true);
    const handleCloseClienteSelector = () => setShowClienteSelector(false);
    const handleSelectCliente = (cliente) => {
        setNewPedido({ ...newPedido, clienteId: cliente.id });
        handleCloseClienteSelector();
    };

    const getClienteNome = (clienteId) => {
        const cliente = clientes.find(c => c.id === clienteId);
        return cliente ? cliente.nome : 'Cliente não encontrado';
    };

    return (
        <div>
            <h2>Pedidos</h2>
            <Button variant="success" className="mb-3" onClick={handleShowCreateModal}>Novo Pedido</Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Data do Pedido</th>
                        <th>Cliente</th>
                        <th>Nome do Produto</th>
                        <th>Detalhes</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {pedidos.map(pedido => (
                        <tr key={pedido.id}>
                            <td>{pedido.dataPedido}</td>
                            <td>{getClienteNome(pedido.clienteId)}</td>
                            <td>{pedido.nomeProduto}</td>
                            <td>{pedido.detalhes}</td>
                            <td>{pedido.quantidade}</td>
                            <td>
                                <Button variant="info" className="me-2" onClick={() => handleShowEditModal(pedido)}>
                                    Editar
                                </Button>
                                <Button variant="info" className="me-2" onClick={() => handleShowItemManagementModal(pedido)}>
                                    Itens do Pedido
                                </Button>
                                <Button variant="danger" onClick={() => handleDelete(pedido.id)}>
                                    Excluir
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showItemManagementModal} onHide={handleCloseItemManagementModal} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Gerenciar Itens do Pedido #{managingPedido?.id} - Cliente: {getClienteNome(managingPedido?.clienteId)}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {managingPedido && (
                         <PedidoItensForm
                            pedidoId={managingPedido.id}
                            initialItens={managingPedido.pedidoItens}
                            // Callback para garantir que a modal de gerenciamento atualize a lista principal
                            onItemUpdated={fetchData} 
                        />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseItemManagementModal}>
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showViewItemsModal} onHide={handleCloseViewItemsModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Itens do Pedido #{viewingPedido?.id} - Cliente: {getClienteNome(viewingPedido?.clienteId)}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {viewingPedido && (
                         <PedidoItensForm
                            pedidoId={managingPedido.id}
                            initialItens={managingPedido.pedidoItens}
                            onItemUpdated={fetchData} // Não precisamos de callback de atualização
                            isReadOnly={true} // Diz para o componente exibir apenas a lista
                        />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseViewItemsModal}>
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de Edição (mantido como está) */}
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Pedido</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentPedido && (
                        <Form onSubmit={handleEdit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Data do Pedido</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentPedido.dataPedido}
                                    onChange={(e) => setCurrentPedido({ ...currentPedido, dataPedido: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Nome do Produto</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentPedido.nomeProduto}
                                    onChange={(e) => setCurrentPedido({ ...currentPedido, nomeProduto: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Detalhes</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentPedido.detalhes}
                                    onChange={(e) => setCurrentPedido({ ...currentPedido, detalhes: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Quantidade</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={currentPedido.quantidade}
                                    onChange={(e) => setCurrentPedido({ ...currentPedido, quantidade: parseInt(e.target.value) })}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Salvar Alterações
                            </Button>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>

            {/* Modal de Criação (Ajustado) */}
            <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Novo Pedido</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreate}>
                        <Form.Group className="mb-3">
                            <Form.Label>Cliente</Form.Label>
                            {newPedido.clienteId ? (
                                <Alert variant="info" className="d-flex justify-content-between align-items-center">
                                    Cliente Selecionado: **{getClienteNome(newPedido.clienteId)}**
                                    <Button size="sm" variant="outline-secondary" onClick={handleShowClienteSelector}>Mudar</Button>
                                </Alert>
                            ) : (
                                <Button variant="secondary" onClick={handleShowClienteSelector}>
                                    Selecionar Cliente
                                </Button>
                            )}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Data do Pedido</Form.Label>
                            <Form.Control
                                type="date"
                                value={newPedido.dataPedido}
                                onChange={(e) => setNewPedido({ ...newPedido, dataPedido: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome do Produto</Form.Label>
                            <Form.Control
                                type="text"
                                value={newPedido.nomeProduto}
                                onChange={(e) => setNewPedido({ ...newPedido, nomeProduto: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Detalhes</Form.Label>
                            <Form.Control
                                type="text"
                                value={newPedido.detalhes}
                                onChange={(e) => setNewPedido({ ...newPedido, detalhes: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Quantidade</Form.Label>
                            <Form.Control
                                type="number"
                                value={newPedido.quantidade}
                                onChange={(e) => setNewPedido({ ...newPedido, quantidade: parseInt(e.target.value) })}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Criar Pedido
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            
            {/* Novo Modal para o Seletor de Cliente */}
            <Modal show={showClienteSelector} onHide={handleCloseClienteSelector} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Selecione um Cliente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ClienteSelector onSelectCliente={handleSelectCliente} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Pedidos;