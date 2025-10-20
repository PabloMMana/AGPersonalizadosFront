import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Modal, Alert } from 'react-bootstrap';

const API_URL = 'http://localhost:5000/api/estoque';
const PRODUTO_URL = 'http://localhost:5000/api/produto';

const EstoqueForm = ({ show, handleClose, estoqueParaEditar, onSaveSuccess }) => {
    const isEditing = !!estoqueParaEditar;
    
    // Estado para o formulário
    const [formData, setFormData] = useState({
        quantidade: '',
        produtoId: ''
    });
    const [produtos, setProdutos] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Efeito para carregar produtos (dropdown)
    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const response = await axios.get(PRODUTO_URL);
                setProdutos(response.data);
            } catch (err) {
                console.error("Erro ao carregar produtos:", err);
            }
        };
        fetchProdutos();
    }, []);

    // Efeito para preencher o formulário se estiver em modo de edição
    useEffect(() => {
        if (isEditing && estoqueParaEditar) {
            setFormData({
                quantidade: estoqueParaEditar.quantidade,
                produtoId: estoqueParaEditar.produtoId
            });
        } else {
            // Limpa o formulário para adição
            setFormData({ quantidade: '', produtoId: '' });
        }
    }, [isEditing, estoqueParaEditar]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        // Verifica se a quantidade e produto foram selecionados
        if (!formData.quantidade || !formData.produtoId) {
            setError("Por favor, preencha todos os campos.");
            setLoading(false);
            return;
        }

        try {
            const dataToSend = {
                quantidade: parseInt(formData.quantidade),
                produtoId: parseInt(formData.produtoId)
                // Se houver ID na entidade Estoque para POST (Adição), inclua aqui
            };

            if (isEditing) {
                // Requisição PUT para Edição
                await axios.put(`${API_URL}/${estoqueParaEditar.id}`, dataToSend);
            } else {
                // Requisição POST para Adição
                await axios.post(API_URL, dataToSend);
            }
            
            onSaveSuccess(); // Notifica o componente pai para recarregar a lista
            handleClose(); // Fecha o modal
            
        } catch (err) {
            console.error('Erro ao salvar estoque:', err);
            setError('Erro ao salvar o estoque. Verifique os dados e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{isEditing ? 'Editar Estoque' : 'Adicionar Novo Estoque'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Produto</Form.Label>
                        <Form.Control 
                            as="select" 
                            name="produtoId" 
                            value={formData.produtoId} 
                            onChange={handleChange}
                            required
                            disabled={isEditing} // Geralmente não se troca o Produto em uma edição de Estoque
                        >
                            <option value="">Selecione o Produto</option>
                            {produtos.map(p => (
                                <option key={p.id} value={p.id}>{p.nome}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Quantidade</Form.Label>
                        <Form.Control 
                            type="number" 
                            name="quantidade" 
                            value={formData.quantidade} 
                            onChange={handleChange}
                            required
                            min="0"
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

export default EstoqueForm;