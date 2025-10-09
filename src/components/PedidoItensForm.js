import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Row, Col, Alert } from 'react-bootstrap';

// PedidoItensForm agora gerencia Adição, Edição e Exclusão
const PedidoItensForm = ({ pedidoId, initialItens, onItemUpdated }) => { 
    const [itens, setItens] = useState(initialItens || []); 
    const [produtos, setProdutos] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    const [novoItem, setNovoItem] = useState({
        produtoId: '',
        quantidade: '',
        precoUnitario: ''
    });

    // Efeitos
    useEffect(() => {
        fetchProdutos();
    }, []);
    
    useEffect(() => {
        console.log("Itens recebidos na prop initialItens:", initialItens);        
        setItens(initialItens || []);
    }, [initialItens]);

    // Busca de Produtos
    const fetchProdutos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/Produto');
            setProdutos(response.data);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        }
    };

    // --- Lógica de Adição (Mantida) ---
    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            const itemParaAdicionar = {
                ...novoItem,
                pedidoId: pedidoId,
                quantidade: parseInt(novoItem.quantidade),
                precoUnitario: parseFloat(novoItem.precoUnitario)
            };
            
            await axios.post('http://localhost:5000/api/PedidoItens/', itemParaAdicionar);
            onItemUpdated();
            if (onItemUpdated) {
                onItemUpdated(); // Atualiza a lista de pedidos no componente pai
            }
            
            setNovoItem({ produtoId: '', quantidade: '', precoUnitario: '' });
        } catch (error) {
            console.error('Erro ao adicionar item:', error);
        }
    };

    // --- Lógica de Exclusão (NOVA) ---
    const handleDeleteItem = async (itemId) => {
        if (window.confirm('Tem certeza que deseja excluir este item?')) {
            try {
                // Endpoint DELETE /api/PedidoItens/{id}
                await axios.delete(`http://localhost:5000/api/PedidoItens/${itemId}`);
                onItemUpdated();
                if (onItemUpdated) {
                    onItemUpdated(); // Atualiza a lista de pedidos no componente pai
                }
            } catch (error) {
                console.error('Erro ao excluir item:', error);
            }
        }
    };

    // --- Lógica de Edição (NOVA) ---
    const handleStartEdit = (item) => {
        setEditingId(item.id);
        setEditData({ 
            quantidade: item.quantidade.toString(),
            precoUnitario: item.precoUnitario.toFixed(2).toString(),
            produtoId: item.produtoId // Mantém o produto para envio
        });
    };

    const handleChangeEdit = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveEdit = async (itemId) => {
        try {
            const itemOriginal = itens.find(i => i.id === itemId);

            const itemParaSalvar = {
                // Inclui todas as propriedades necessárias do item original
                ...itemOriginal, 
                // Atualiza as propriedades editáveis
                quantidade: parseInt(editData.quantidade),
                precoUnitario: parseFloat(editData.precoUnitario),
                
                // Garante que o PedidoId seja enviado, caso seu PUT exija
                pedidoId: pedidoId 
            };

            // Endpoint PUT /api/PedidoItens/{id}
            await axios.put(`http://localhost:5000/api/PedidoItens/${itemId}`, itemParaSalvar);
             onItemUpdated();
            if (onItemUpdated) {
                onItemUpdated(); // Atualiza a lista de pedidos no componente pai
            }

            setEditingId(null); // Sai do modo de edição
            setEditData({});

        } catch (error) {
            console.error('Erro ao salvar item:', error);
        }
    };
    
    // --- Funções Auxiliares ---
    const getProdutoNome = (produtoId) => {
        const produto = produtos.find(p => p.id === produtoId);
        return produto ? produto.nome : 'Produto não encontrado';
    };

    if (!pedidoId) {
        return <Alert variant="warning">Selecione um pedido para gerenciar os itens.</Alert>;
    }
    
    return (
        <div>
            <h4>Itens do Pedido</h4>

            {itens.length > 0 ? (
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th style={{ width: '15%' }}>Quantidade</th>
                            <th style={{ width: '15%' }}>Preço Unitário</th>
                            <th style={{ width: '15%' }}>Total</th>
                            <th style={{ width: '20%' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itens.map(item => (
                            <tr key={item.id}>
                                <td>{getProdutoNome(item.produtoId)}</td>
                                {/* Coluna Quantidade (Editável) */}
                                <td>
                                    {editingId === item.id ? (
                                        <Form.Control 
                                            type="number" 
                                            name="quantidade"
                                            value={editData.quantidade} 
                                            onChange={handleChangeEdit}
                                            min="1"
                                        />
                                    ) : (
                                        item.quantidade
                                    )}
                                </td>
                                {/* Coluna Preço Unitário (Editável) */}
                                <td>
                                    {editingId === item.id ? (
                                        <Form.Control 
                                            type="number" 
                                            name="precoUnitario"
                                            step="0.01" 
                                            value={editData.precoUnitario} 
                                            onChange={handleChangeEdit}
                                            min="0.01"
                                        />
                                    ) : (
                                        `R$ ${item.precoUnitario.toFixed(2)}`
                                    )}
                                </td>
                                
                                <td>R$ {(item.quantidade * item.precoUnitario).toFixed(2)}</td>
                                
                                {/* Coluna Ações (Edição e Exclusão) */}
                                <td>
                                    {editingId === item.id ? (
                                        <Button variant="success" size="sm" onClick={() => handleSaveEdit(item.id)} className="me-2">
                                            Salvar
                                        </Button>
                                    ) : (
                                        <Button variant="warning" size="sm" onClick={() => handleStartEdit(item)} className="me-2">
                                            Editar
                                        </Button>
                                    )}
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteItem(item.id)}>
                                        Excluir
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <Alert variant="info">Nenhum item adicionado a este pedido.</Alert>
            )}

            <hr />
            {/* Formulário de Adição (Mantido) */}
            <h5>Adicionar Novo Item</h5>
            <Form onSubmit={handleAddItem}>
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Produto</Form.Label>
                            <Form.Control as="select" value={novoItem.produtoId} onChange={(e) => setNovoItem({ ...novoItem, produtoId: e.target.value })}>
                                <option value="">Selecione um produto</option>
                                {produtos.map(p => (
                                    <option key={p.id} value={p.id}>{p.nome}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Quantidade</Form.Label>
                            <Form.Control type="number" value={novoItem.quantidade} onChange={(e) => setNovoItem({ ...novoItem, quantidade: e.target.value })} min="1" />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Preço Unitário</Form.Label>
                            <Form.Control type="number" step="0.01" value={novoItem.precoUnitario} onChange={(e) => setNovoItem({ ...novoItem, precoUnitario: e.target.value })} min="0.01" />
                        </Form.Group>
                    </Col>
                    <Col className="d-flex align-items-end">
                        <Button variant="primary" type="submit">Adicionar</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default PedidoItensForm;