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
        //quantidade:20.00,
        //EstoqueId: 1,
    });
    
    // 2. Estados de Controle
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // 3. useEffect para carregar dados ao editar
    useEffect(() => {
    if (isEditing) {
        setFormData({
           nome: produtoParaEditar.nome || '',
            descricao: produtoParaEditar.descricao || '',
            preco: produtoParaEditar.preco || 0.00, 
            quantidade: produtoParaEditar.quantidade || 10.00,
            EstoqueId: produtoParaEditar.EstoqueId || 1, // Use o ID existente ou 1
        });
    } else {
        setFormData({ nome: '', descricao: '', preco: 0.00, EstoqueId: 1 , quantidade:0.00}); 
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
    setError('');

    // 🛑 MUDANÇA CRÍTICA AQUI: Estrutura correta para um NOVO PRODUTO COM NOVO ESTOQUE
    const dataToSend = {
        // Propriedades do Produto (garantindo que preco e os outros campos estejam corretos)
        nome: formData.nome,
        descricao: formData.descricao,
        preco: parseFloat(formData.preco),
        
        // Propriedade de Navegação Estoque (em PascalCase para o C#)
        // Se for um NOVO PRODUTO, o Estoque também é NOVO (ID=0) e a Quantidade deve ser 0
        Estoque: {
            // Se o ID for 0, o EF Core entenderá que deve CRIAR um novo registro.
            id: 0, 
            quantidade: 0, // Novo produto começa com 0 em estoque
            // Não precisa enviar ProdutoId aqui, pois o EF Core o vinculará automaticamente
            // ao produto recém-criado.
        }
    };
    
    // Se estiver editando, adicione o ID do Produto
    if (isEditing) {
        dataToSend.id = produtoParaEditar.id;
        // Ao editar, o Estoque.id deve ser o ID do Estoque existente
        dataToSend.Estoque.id = produtoParaEditar.estoque.id; 
    } else {
        // Ao adicionar, o ID do Produto deve ser 0
        dataToSend.id = 0;
    }

    try {
        if (isEditing) {
            // Requisição PUT para Edição
            await axios.put(`${API_URL}/${dataToSend.id}`, dataToSend);
        } else {
            // Requisição POST para Adição
            await axios.post(API_URL, dataToSend);
        }   
        
        onSaveSuccess(); 
    } catch (err) {
        // ... (lógica de erro)
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