import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Row, Col, Alert } from 'react-bootstrap';

const CompraItensForm = ({ compraId, initialItens, onItemUpdated }) => { 
    const [itens, setItens] = useState(initialItens || []); 
    const [produtos, setProdutos] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    const [novoItem, setNovoItem] = useState({
        produtoId: '',
        quantidade: '',
        descricao: '',
        precoUnitario: '',
        status: 0
    });

    useEffect(() => {
        fetchProdutos();
    }, []);
    
    const handleFinalizarItem = async (itemId) => {
    try {
        // Envia para o backend para registrar status = 1
        await axios.post(`http://localhost:5000/api/CompraItens/${itemId}/finalizar`);
        
        // Atualiza a lista local para refletir a mudança visualmente
        await fetchItens(compraId);
        
        if (onItemUpdated) onItemUpdated();
        alert('Item finalizado com sucesso!');
    } catch (error) {
        console.error('Erro ao finalizar item:', error);
        alert('Falha ao finalizar item.');
    }
};
    useEffect(() => {
        if (compraId) {
            fetchItens(compraId);
        }
    }, [compraId]);

    const fetchItens = async (id) => {
        try {
            // Note que aqui usamos o endpoint de CompraItens que você configurou no backend
            const response = await axios.get(`http://localhost:5000/api/CompraItens/${id}`);
            setItens(response.data);
        } catch (error) {
            console.error('Erro ao buscar itens da compra:', error);
        }
    };

    const fetchProdutos = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/Produto');
            setProdutos(response.data);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            const itemParaAdicionar = {
                ...novoItem,
                compraId: compraId, // Chave estrangeira para Compra
                quantidade: parseInt(novoItem.quantidade),    
                precoUnitario: parseFloat(novoItem.precoUnitario),
                status: 0
            };
            
            await axios.post('http://localhost:5000/api/CompraItens/', itemParaAdicionar);
            await fetchItens(compraId);
            setNovoItem({ produtoId: '', quantidade: '', descricao: '', precoUnitario: '', status: 0 });
            
            if (onItemUpdated) onItemUpdated(); 
        } catch (error) {
            console.error('Erro ao adicionar item de compra:', error);
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (window.confirm('Deseja excluir este item da compra?')) {
            try {
                await axios.delete(`http://localhost:5000/api/CompraItens/${itemId}`);
                setItens(prev => prev.filter(item => item.id !== itemId));
                if (onItemUpdated) onItemUpdated();
            } catch (error) {
                console.error('Erro ao excluir item:', error);
            }
        }
    };

    const handleStartEdit = (item) => {
        setEditingId(item.id);
        setEditData({ 
            quantidade: item.quantidade,
            descricao: item.descricao,
            precoUnitario: item.precoUnitario.toString(),
            produtoId: item.produtoId,
            status: item.status
        });
    };

    const handleSaveEdit = async (itemId) => {
        try {
            const itemOriginal = itens.find(i => i.id === itemId);
            const itemParaSalvar = {
                ...itemOriginal,
                quantidade: parseInt(editData.quantidade),
                descricao: editData.descricao,
                precoUnitario: parseFloat(editData.precoUnitario),
                compraId: compraId
            };

            await axios.put(`http://localhost:5000/api/CompraItens/${itemId}`, itemParaSalvar);
            
            setItens(prev => prev.map(item => item.id === itemId ? itemParaSalvar : item));
            if (onItemUpdated) onItemUpdated();

            setEditingId(null);
        } catch (error) {
            console.error('Erro ao salvar item:', error);
        }
    };

    const getProdutoNome = (produtoId) => {
        const produto = produtos.find(p => p.id === parseInt(produtoId));
        return produto ? produto.nome : 'Produto não encontrado';
    };

    if (!compraId) {
        return <Alert variant="warning">Selecione uma compra para gerenciar os itens.</Alert>;
    }

    return (
        <div className="mt-4">
            <h5>Itens da Compra (ID: {compraId})</h5>
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Qtd</th>
                        <th>Descrição</th>
                        <th>Preço Unit.</th>
                        <th>Subtotal</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
    {itens.map(item => (
        <tr key={item.id}>
            <td>{getProdutoNome(item.produtoId)}</td>
            <td>
                {editingId === item.id ? (
                    <Form.Control 
                        type="number" 
                        name="quantidade" 
                        value={editData.quantidade} 
                        onChange={(e) => setEditData({...editData, quantidade: e.target.value})} 
                    />
                ) : item.quantidade}
            </td>
            <td>
                {editingId === item.id ? (
                    <Form.Control 
                        type="text" 
                        name="descricao" 
                        value={editData.descricao} 
                        onChange={(e) => setEditData({...editData, descricao: e.target.value})} 
                    />
                ) : item.descricao}
            </td>
            <td>
                {editingId === item.id ? (
                    <Form.Control 
                        type="number" 
                        step="0.01" 
                        name="precoUnitario" 
                        value={editData.precoUnitario} 
                        onChange={(e) => setEditData({...editData, precoUnitario: e.target.value})} 
                    />
                ) : `R$ ${item.precoUnitario.toFixed(2)}`}
            </td>
            <td>R$ {(item.quantidade * item.precoUnitario).toFixed(2)}</td>
            <td>
                {editingId === item.id ? (
                    <Button variant="success" size="sm" onClick={() => handleSaveEdit(item.id)} className="me-2">
                        Salvar
                    </Button>
                ) : (
                    <>
                        {/* Botão de Finalizar Item (Status 1) */}
                        {item.status !== 1 ? (
                            <Button 
                                variant="success" 
                                size="sm" 
                                onClick={() => handleFinalizarItem(item.id)} 
                                className="me-2"
                            >
                                Finalizar
                            </Button>
                        ) : (
                            <span className="badge bg-secondary me-2">Concluído</span>
                        )}

                        <Button 
                            variant="warning" 
                            size="sm" 
                            onClick={() => handleStartEdit(item)} 
                            className="me-2"
                            disabled={item.status === 1} // Impede editar se finalizado
                        >
                            Editar
                        </Button>
                    </>
                )}
                
                <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => handleDeleteItem(item.id)}
                    disabled={item.status === 1} // Impede excluir se finalizado
                >
                    Excluir
                </Button> 
            </td>
        </tr>
    ))}
</tbody>
            </Table>

            <hr />
            <h6>Adicionar Item à Compra</h6>
            <Form onSubmit={handleAddItem}>
                <Row>
                    <Col md={3}>
                        <Form.Control as="select" value={novoItem.produtoId} onChange={(e) => setNovoItem({ ...novoItem, produtoId: e.target.value })} required>
                            <option value="">Produto...</option>
                            {produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                        </Form.Control>
                    </Col>
                    <Col md={2}>
                        <Form.Control type="number" placeholder="Qtd" value={novoItem.quantidade} onChange={(e) => setNovoItem({ ...novoItem, quantidade: e.target.value })} required />
                    </Col>
                    <Col md={3}>
                        <Form.Control type="text" placeholder="Obs/Descrição" value={novoItem.descricao} onChange={(e) => setNovoItem({ ...novoItem, descricao: e.target.value })} />
                    </Col>
                    <Col md={2}>
                        <Form.Control type="number" step="0.01" placeholder="Preço" value={novoItem.precoUnitario} onChange={(e) => setNovoItem({ ...novoItem, precoUnitario: e.target.value })} required />
                    </Col>
                    <Col md={2}>
                        <Button variant="primary" type="submit" className="w-100">Adicionar</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default CompraItensForm;