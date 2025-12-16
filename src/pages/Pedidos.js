import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import ClienteSelector from '../components/ClienteSelector'; // Importe o componente
import PedidoItensForm from '../components/PedidoItensForm';

const getTodayFormatted = () => {
    const today = new Date();
    // Formato YYYY-MM-DD é exigido pelo input type="date"
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Mês começa em 0
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`; 
};

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
        dataPedido: getTodayFormatted(),
        nomeProduto: '',
        detalhes: '',
        quantidade: '1',
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

   
    const handleShowItemManagementModal = async (pedido) => { // Tornar assíncrona
    console.log("Objeto Pedido Recebido (Antes de buscar itens):", pedido);
    
    try {
        // NOVO PASSO: BUSCAR A LISTA DE ITENS DO ENDPOINT DEDICADO QUE FUNCIONA
        const itensResponse = await axios.get(`http://localhost:5000/api/PedidoItens/${pedido.id}`); 
        const itensDoPedido = itensResponse.data;
        
        // Criar um objeto de Pedido com a lista de itens para passar ao PedidoItensForm
        const pedidoComItens = {
            ...pedido,
            pedidoItens: itensDoPedido // Adicionar a lista de itens na propriedade correta
        };

        setManagingPedido(pedidoComItens);
        setShowItemManagementModal(true);
        
    } catch (error) {
        console.error('Erro ao buscar itens do pedido:', error);
        alert('Erro ao carregar itens. Verifique o console.');
    }
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
        setNewPedido({ clienteId: null, dataPedido: getTodayFormatted(), nomeProduto: '', detalhes: '', quantidade: 1 });
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
   
    const API_URL = 'http://localhost:5000/api/Pedido'; 

// ... (Outras funções: fetchData, handleShowItemManagementModal, handleDelete, etc.)

const handleFinalizarPedido = async (pedidoId) => {
    // 1. Confirmação
    if (!window.confirm(`Confirma a finalização e o registro da venda do Pedido #${pedidoId}?`)) {
        return;
    }

    try {
        // 2. Chamada ao endpoint do Backend (PedidosController)
        await axios.post(`${API_URL}/${pedidoId}/finalizar`);

        alert(`SUCESSO: Pedido #${pedidoId} finalizado e venda registrada.`);
        
        // 3. Atualiza a lista principal para exibir o novo status
        fetchData(); 

    } catch (error) {
        console.error('Erro ao finalizar o pedido:', error);
        
        // Captura a mensagem de erro do backend (ex: "Não é possível finalizar... há itens pendentes")
        const errorMessage = error.response?.data?.message || 'Erro de comunicação com o servidor. Verifique o console.';
        
        // 🛑 Aqui o erro de validação (itens pendentes) é exibido
        alert(`FALHA na Finalização: ${errorMessage}`);
    }
};

    return (
        <div className="p-5">
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

                            {pedido.status === 1 ? (
                                                <Button variant="secondary" size="sm" className="me-2" disabled>
                                                   Itens do Pedido
                                                </Button>
                                            ) : (
                                                <Button 
                                                    variant="info" 
                                                    size="2"
                                                    className="me-2" 
                                                    onClick={() => handleShowEditModal(pedido)}
                                                >
                                                    Editar
                                                </Button>
                                            )}                             

                            {pedido.status === 1 ? (
                                                <Button variant="secondary" size="sm" className="me-2" disabled>
                                                   Itens do Pedido
                                                </Button>
                                            ) : (
                                                <Button 
                                                    variant="info" 
                                                    size="2"
                                                    className="me-2" 
                                                    onClick={() => handleShowItemManagementModal(pedido)}
                                                >
                                                    Itens do Pedido
                                                </Button>
                                            )}                             


                                 {pedido.status === 1 ? (
                                                <Button variant="secondary" size="sm" className="me-2" disabled>
                                                    FINALIZADO
                                                </Button>
                                            ) : (
                                                <Button 
                                                    variant="success" 
                                                    size="2"
                                                    className="me-2" 
                                                    onClick={() => handleFinalizarPedido(pedido.id)}
                                                >
                                                    Finalizar Pedido
                                                </Button>
                                            )}

                                {pedido.status === 1 ? (
                                                <Button variant="secondary" size="sm" className="me-2" disabled>
                                                    Excluir
                                                </Button>
                                            ) : (
                                                <Button 
                                                    variant="danger" 
                                                    size="2"
                                                    className="me-2" 
                                                    onClick={() => handleDelete(pedido.id)}
                                                >
                                                    Excluir
                                                </Button>
                                            )}                                                 
                                
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
                                    disabled
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
                                    value={1}
                                    onChange={(e) => setCurrentPedido({ ...currentPedido, quantidade: parseInt(e.target.value) })}
                                    disa
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
                            <Form.Label>Cliente   -</Form.Label>
                            {newPedido.clienteId ? (
                                <Alert variant="info" className="d-flex justify-content-between align-items-center">
                                    Cliente Selecionado: **{getClienteNome(newPedido.clienteId)}**
                                    <Button size="sm" variant="outline-secondary" onClick={handleShowClienteSelector}>Mudar</Button>
                                </Alert>
                            ) : (
                                <Button variant="danger" onClick={handleShowClienteSelector}>
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
                                disabled
                            />
                           
                        </Form.Group>
                        <Form.Group className="mb-3" >
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
                                value={1}
                                onChange={(e) => setNewPedido({ ...newPedido, quantidade: parseInt(e.target.value) })}
                                disabled
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