import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Modal, Alert } from 'react-bootstrap';

// URL da sua API de Produtos
const API_URL = 'http://localhost:5000/api/produto'; 

const ProdutoForm = ({ show, handleClose, produtoParaEditar, onSaveSuccess }) => {
    // Determina se estamos editando (true) ou adicionando (false)
    const isEditing = !!produtoParaEditar;
    
    // 1. Estado para os dados do formulário
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        preco: 0.00,
    });
    
    // 2. Estados de Controle
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // 3. useEffect para carregar dados ao editar
    useEffect(() => {
        if (isEditing) {
            // Se estiver editando, preenche o formulário com os dados do produto
            setFormData({
                nome: produtoParaEditar.nome || '',
                descricao: produtoParaEditar.descricao || '',
                // Garante que o preço venha como número para o input type="number"
                preco: produtoParaEditar.preco || 0.00, 
            });
        } else {
            // Se estiver adicionando, limpa o formulário
            setFormData({ nome: '', descricao: '', preco: 0.00 });
        }
        setError('');
    }, [produtoParaEditar, isEditing]);

    // 4. Função para atualizar o estado conforme o usuário digita
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 5. Função para lidar com a submissão do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');''

        // Prepara os dados: garante que o preço é enviado como número
        const dataToSend = {
            ...formData,
            preco: parseFloat(formData.preco) 
        };

        try {
            if (isEditing) {
                // Requisição PUT para Edição
                // É CRÍTICO enviar o ID no corpo e na URL para que o backend saiba qual atualizar
                const dataToPut = { id: produtoParaEditar.id, ...dataToSend };
                await axios.put(`${API_URL}/${produtoParaEditar.id}`, dataToPut);
            } else {
                // Requisição POST para Adição
                await axios.post(API_URL, dataToSend);
            }
            
            onSaveSuccess(); // Sucesso: fecha o modal e recarrega a lista
        } catch (err) {
            console.error('Erro ao salvar produto:', err.response || err);
            
            // Tenta obter a mensagem de erro detalhada do backend
            const errorMsg = err.response?.data?.title || err.response?.data?.message || 'Erro ao salvar o produto. Verifique os dados.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>{isEditing ? 'Editar Produto' : 'Adicionar Novo Produto'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Exibe o erro se houver */}
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                    
                    {/* Campo Nome */}
                    <Form.Group className="mb-3">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="nome" 
                            value={formData.nome} 
                            onChange={handleChange} 
                            required
                        />
                    </Form.Group>
                    
                    {/* Campo Descrição */}
                    <Form.Group className="mb-3">
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            name="descricao" 
                            value={formData.descricao} 
                            onChange={handleChange} 
                        />
                    </Form.Group>
                    
                    {/* Campo Preço */}
                    <Form.Group className="mb-3">
                        <Form.Label>Preço Unitário (R$)</Form.Label>
                        <Form.Control 
                            type="number" 
                            name="preco" 
                            value={formData.preco} 
                            onChange={handleChange} 
                            step="0.01" // Permite decimais
                            required
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-end mt-4">
                        <Button variant="secondary" onClick={handleClose} className="me-2">
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ProdutoForm;