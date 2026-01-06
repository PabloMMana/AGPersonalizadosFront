import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import FornecedorSelector from '../components/FornecedorSelector'; // Certifique-se de ter este componente
import CompraItensForm from '../components/CompraItensForm';

const getTodayFormatted = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`; 
};

const Compras = () => {
    const API_URL = 'http://localhost:5000/api/Compra';
    
    const [compras, setCompras] = useState([]);
    const [fornecedor, setFornecedores] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showItemManagementModal, setShowItemManagementModal] = useState(false);
    const [showFornecedorSelector, setShowFornecedorSelector] = useState(false);
    
    const [currentCompra, setCurrentCompra] = useState(null);
    const [managingCompra, setManagingCompra] = useState(null);
    const [newCompra, setNewCompra] = useState({
        fornecedorId: null,
        dataCompra: getTodayFormatted(),
        descricao: '',
        status: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const comprasResponse = await axios.get(API_URL);
            // Se você tiver uma API de fornecedores, carregue aqui
            const fornecedorResponse = await axios.get('http://localhost:5000/api/Fornecedor');
            setCompras(comprasResponse.data);
            setFornecedores(fornecedorResponse.data);
        } catch (error) {
            console.error('Erro ao buscar dados de compras:', error);
        }
    };

    // --- Gerenciamento de Itens ---
    const handleShowItemManagementModal = async (compra) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/CompraItens/${compra.id}`);
            setManagingCompra({ ...compra, compraItens: response.data });
            setShowItemManagementModal(true);
        } catch (error) {
            console.error('Erro ao buscar itens da compra:', error);
            alert('Erro ao carregar itens.');
        }
    };

    const handleCloseItemManagementModal = () => {
        setShowItemManagementModal(false);
        fetchData();
        setManagingCompra(null);
    };

    // --- CRUD Compra ---
    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newCompra.fornecedorId) {
            alert('Por favor, selecione um fornecedor.');
            return;
        }
        try {
            await axios.post(API_URL, newCompra);
            fetchData();
            setShowCreateModal(false);
        } catch (error) {
            console.error('Erro ao criar compra:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Excluir esta compra permanentemente?')) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                fetchData();
            } catch (error) {
                console.error('Erro ao excluir compra:', error);
            }
        }
    };

    const handleFinalizarCompra = async (compraId) => {
        if (!window.confirm(`Finalizar Compra #${compraId}`)) return;
        try {
            await axios.post(`${API_URL}/${compraId}/finalizar`);
            alert('Compra finalizada com sucesso!');
            fetchData();
        } catch (error) {
            const msg = error.response?.data?.message || 'Erro ao finalizar.';
            alert(`Falha: ${msg}`);
        }
    };

    // --- Auxiliares ---
    const getFornecedorNome = (id) => {
        const f = fornecedor.find(forn => forn.id === id);
        return f ? f.nome : 'N/A';
    };

    return (
        <div className="p-5">
            <h2>Gestão de Compras (Entrada de Estoque)</h2>
           
            <Button 
        variant="primary" 
        onClick={() => setShowCreateModal(true)} 
        className="mb-3 px-4" 
        style={{ width: 'fit-content' }} 
>
                Nova Compra
            </Button>
            

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Data</th>
                        <th>Fornecedor</th>
                        <th>Descrição</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {compras.map(compra => (
                        <tr key={compra.id}>
                            <td>{compra.id}</td>
                            <td>{new Date(compra.dataCompra).toLocaleDateString()}</td>
                            <td>{getFornecedorNome(compra.fornecedorId)}</td>
                            <td>{compra.descricao}</td>
                            <td>{compra.status === 1 ? <span className="text-success">Finalizada</span> : 'Aberta'}</td>
                            <td>
                                <Button 
                                    variant="info" size="sm" className="me-2"
                                    onClick={() => handleShowItemManagementModal(compra)}
                                    disabled={compra.status === 1}
                                >
                                    
                                    Itens
                                </Button>
                                
                                <Button 
                                    variant="success" size="sm" className="me-2"
                                    onClick={() => handleFinalizarCompra(compra.id)}
                                    disabled={compra.status === 1}
                                >
                                    {compra.status === 1 ? 'Concluída' : 'Finalizar'}
                                </Button>

                                <Button 
                                    variant="danger" size="sm"
                                    onClick={() => handleDelete(compra.id)}
                                    disabled={compra.status === 1}
                                >
                                    Excluir
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal de Criação */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Nova Compra</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreate}>
                        <Form.Group className="mb-3">
                            <Form.Label>Fornecedor</Form.Label>
                            <div className="d-flex gap-2">
                                <Form.Control 
                                    readOnly 
                                    placeholder="Selecione..." 
                                    value={getFornecedorNome(newCompra.fornecedorId)} 
                                />
                                <Button onClick={() => setShowFornecedorSelector(true)}>Buscar</Button>
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descrição/Observação</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={newCompra.descricao}
                                onChange={(e) => setNewCompra({...newCompra, descricao: e.target.value})}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">Iniciar Compra</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal de Itens */}
            <Modal show={showItemManagementModal} onHide={handleCloseItemManagementModal} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Itens da Compra #{managingCompra?.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {managingCompra && (
                        <CompraItensForm 
                            compraId={managingCompra.id}
                            initialItens={managingCompra.compraItens}
                            onItemUpdated={fetchData}
                        />
                    )}
                </Modal.Body>
            </Modal>

            {/* Modal Seletor de Fornecedor */}
            <Modal show={showFornecedorSelector} onHide={() => setShowFornecedorSelector(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Selecionar Fornecedor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FornecedorSelector onSelectFornecedor={(f) => {
                        setNewCompra({...newCompra, fornecedorId: f.id});
                        setShowFornecedorSelector(false);
                    }} />
                </Modal.Body>
            </Modal>
        </div>
        
    );
};

export default Compras;