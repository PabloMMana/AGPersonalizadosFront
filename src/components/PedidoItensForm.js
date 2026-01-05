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
        descricao:'',
        precoUnitario: '',
        status: 0
    });

    // Efeitos
    useEffect(() => {
        fetchProdutos();
    }, []);
    
    useEffect(() => {
    if (pedidoId) {
        fetchItens(pedidoId); // Usa a nova função de busca
    }
}, [pedidoId]); // Dispara sempre que o ID do pedido muda

    //buscar itens
    const fetchItens = async (id) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/PedidoItens/${id}`);
        setItens(response.data); // Atualiza o estado 'itens' com a nova lista
    } catch (error) {
        console.error('Erro ao buscar itens do pedido:', error);
    }
};

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
            descricao: novoItem.descricao,   
            precoUnitario: parseFloat(novoItem.precoUnitario),
            Status: 0
        };
        
        // 1. Envia o novo item para o backend
        await axios.post('http://localhost:5000/api/PedidoItens/', itemParaAdicionar);
        
        // 2. PASSO CRUCIAL: Recarrega a lista completa de itens
        await fetchItens(pedidoId);
        
        // 3. Limpa o formulário de adição
        setNovoItem({ produtoId: '', quantidade: '',descricao:'', precoUnitario: '' });
        
        // 4. Opcional: Notifica o pai (se o pai precisar atualizar, por exemplo, o Valor Total)
        if (onItemUpdated) {
            onItemUpdated(); 
        }

        // Remova a chamada 'onItemUpdated()' duplicada
        
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
            
            setItens(prevItens => prevItens.filter(item => item.id !== itemId));
            
            if (onItemUpdated) {
                onItemUpdated();
            }
            
            

        } catch (error) {
            console.error('Erro ao excluir item:', error);
            // Opcional: Mostrar uma mensagem de erro para o usuário
        }
    }
};

// --- Lógica de finalizar (NOVA) ---
  const handleFinalizarItem = async (itemId) => {
    if (window.confirm('Tem certeza que deseja Finalizar este item? Isso dará baixa no estoque.')) {
        try {
            // 1. CHAMA A API PARA FINALIZAR/DAR BAIXA NO ESTOQUE (POST /api/pedido-itens/{id}/finalizar)
            // Assumindo o endpoint POST /api/pedido-itens/{id}/finalizar
            await axios.post(`http://localhost:5000/api/pedidoitens/${itemId}/finalizar`);
            
            // 2. ATUALIZA O ESTADO LOCAL (NÃO EXCLUI, APENAS MUDA O STATUS)
            setItens(prevItens => 
                // Usa .map para iterar sobre o array e encontrar o item correto
                prevItens.map(item => 
                    item.id === itemId 
                    ? { ...item, status: 1 } // 🛑 Se o ID coincide, cria um NOVO objeto com status: 1 (Finalizado)
                    : item                     // Se o ID não coincide, retorna o item original
                )
            );
            
            // 3. Notifica o componente pai para recarregar totais, se necessário
            if (onItemUpdated) {
                onItemUpdated();
            }

        } catch (error) {
            console.error('Erro ao finalizar item:', error);
            // Mensagem de erro mais útil (ex: estoque insuficiente, se for o caso)
            alert(`Falha ao finalizar. Verifique o estoque ou o servidor. Erro: ${error.response?.data || error.message}`);
        }
    }
};

    // --- Lógica de Edição (NOVA) ---
    const handleStartEdit = (item) => {
        setEditingId(item.id);
        setEditData({ 
            quantidade: item.quantidade,
            descricao: item.descricao,
            precoUnitario: item.precoUnitario.toFixed(2).toString(),
            produtoId: item.produtoId, // Mantém o produto para envio
            status: item.status
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
            descricao: editData.descricao,
            precoUnitario: parseFloat(editData.precoUnitario),
            
            // Garante que o PedidoId seja enviado, caso seu PUT exija
            pedidoId: pedidoId ,
            status: 0
        };

        // Endpoint PUT /api/PedidoItens/{id}
        await axios.put(`http://localhost:5000/api/PedidoItens/${itemId}`, itemParaSalvar);
        
        // PASSO CRUCIAL: Atualiza o estado 'itens' localmente.
        // Isso mapeia o array e substitui APENAS o item editado.
        setItens(prevItens => 
            prevItens.map(item => 
                item.id === itemId ? itemParaSalvar : item
            )
        );
        
        // Remove a chamada duplicada e mantém apenas uma:
        if (onItemUpdated) {
            onItemUpdated(); // Notifica o componente pai para atualizar o Valor Total.
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
                            <th style={{ width: '10%' }}>Quantidade</th>
                            <th style={{ width: '10%' }}>Descrição</th>
                            <th style={{ width: '15%' }}>Preço Unitário</th>
                            <th style={{ width: '25%' }}>Total</th>
                            <th style={{ width: '10%' }}>Status</th>
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
                                {/* Coluna Descrição (Editável) */}
                                <td>
                                    {editingId === item.id ? (
                                        <Form.Control 
                                            type="text" 
                                            name="descricao"
                                            value={editData.descricao} 
                                            onChange={handleChangeEdit}
                                            min="1"
                                        />
                                    ) : (
                                        item.descricao
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
                                    
                                <td>{item.status === 1 ? 'Finalizado' : 'Aberto'}</td>
                                
                                {/* Coluna Ações (Edição e Exclusãoe e status) */}
                                <td>
    {/* 1. Botão EDITAR / SALVAR (Condicional) */}
    {editingId === item.id ? (
        <Button 
        variant="success" 
        size="sm" 
        onClick={() => handleSaveEdit(item.id)} 
        className="me-2"
        disabled={item.status === 1}        
        >
            Salvar
        </Button>
    ) : (
        <Button variant="warning" size="sm" onClick={() => handleStartEdit(item)} className="me-2" disabled={item.status === 1}>
            Editar
        </Button>
    )}
    
    {/* 2. Botão EXCLUIR (Sempre visível) */}
    <Button 
        variant="danger" 
        size="sm" 
        onClick={() => handleDeleteItem(item.id)} 
        className="me-2" // Adiciona espaço após o Excluir, se necessário
        disabled={item.status === 1}
    >
        Excluir
    </Button>
    
    {/* 3. Botão FINALIZAR (Sempre visível, mas desabilitado se já finalizado) */}
    <Button 
        variant="primary" 
        size="sm" 
        onClick={() => handleFinalizarItem(item.id)}
        disabled={item.status === 1} // 🛑 Desabilita se for Finalizado
    >
        {item.status === 1 ? 'Item Finalizado' : 'Finalizar o Item !'}
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
                            <Form.Label>Descrição</Form.Label>
                            <Form.Control type="text" value={novoItem.descricao} onChange={(e) => setNovoItem({ ...novoItem, descricao: e.target.value })} min="1" />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>V. Unitário</Form.Label>
                            <Form.Control type="number" step="0.01" value={novoItem.precoUnitario} onChange={(e) => setNovoItem({ ...novoItem, precoUnitario: e.target.value })} min="0.01" />
                        </Form.Group>
                    </Col>

                     <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Finalizado</Form.Label>
                            <Form.Control type="number" step="0.01" value={novoItem.status} onChange={(e) => setNovoItem({ ...novoItem, status: e.target.value })} min="0" disabled/>
                        
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