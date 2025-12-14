import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Modal, Alert } from 'react-bootstrap';

const API_URL = 'http://localhost:5000/api/fornecedor';

const FornecedorForm = ({ show, handleClose, fornecedorParaEditar, onSaveSuccess }) => {
    // Determina se o formulário está em modo de edição (se houver um objeto para editar)
    const isEditing = !!fornecedorParaEditar;
    
    const [formData, setFormData] = useState({
        nome: '',
        cnpj: '',
        email: '',
        endereco: '',
        telefone: '',      
    });
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Efeito para carregar dados de edição ou limpar para adição
    // Este efeito é ativado quando o modal é aberto ou quando o fornecedorParaEditar muda
    useEffect(() => {
        if (show) {
            setError('');
            if (isEditing && fornecedorParaEditar) {
                // Modo Edição: Preenche o formulário com os dados do fornecedor
                setFormData({
                    id: fornecedorParaEditar.id,
                    nome: fornecedorParaEditar.nome,
                    cnpj: fornecedorParaEditar.cnpj,
                    email: fornecedorParaEditar.email,
                    endereco: fornecedorParaEditar.endereco || '', 
                    telefone: fornecedorParaEditar.telefone || '',
                    
                });
            } else {
                // Modo Adição: Limpa o formulário
                setFormData({ nome: '', cnpj: '', email: '', endereco: '', telefone: ''});
            }
        }
    }, [show, isEditing, fornecedorParaEditar]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(''); // Limpa o erro ao digitar
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        // Validação básica
        if (!formData.nome || !formData.email) {
            setError("Os campos Nome e Email são obrigatórios.");
            setLoading(false);
            return;
        }

        try {
            if (isEditing) {
                // Requisição PUT para Edição
                const url = `${API_URL}/${fornecedorParaEditar.id}`;
                await axios.put(url, formData);
            } else {
                // Requisição POST para Adição
                await axios.post(API_URL, formData);
            }
            
            onSaveSuccess(); // Notifica o componente pai (Clientes.js) para recarregar a lista
            handleClose(); // Fecha o modal
            
        } catch (err) {
            console.error('Erro ao salvar fornecedor:', err.response || err);
            // Tenta exibir a mensagem de erro do backend se disponível
            const serverMessage = err.response?.data?.message || 'Erro ao salvar o fornecedor. Tente novamente.';
            setError(serverMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{isEditing ? 'Editar Fornecedor' : 'Novo Fornecedor'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    

                     {/* Campo Id */}


                    <Form.Group className="mb-3" controlId="formid">
                        <Form.Label>Id</Form.Label>
                        <Form.Control type="text" name="id" value={formData.id} onChange={handleChange} readOnly disabled/>
                    </Form.Group>
                    
                    {/* Campo Nome */}

                    <Form.Group className="mb-3" controlId="formNome">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control type="text" name="nome" value={formData.nome} onChange={handleChange} required />
                    </Form.Group>

                    {/* Campo CNPJ */}
                    <Form.Group className="mb-3" controlId="formCNPJ">
                        <Form.Label>CNPJ</Form.Label>
                        <Form.Control type="cpnj" name="cnpj" value={formData.cnpj} onChange={handleChange} required />
                    </Form.Group>
                    
                    {/* Campo Email */}
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </Form.Group>

                    {/* Campo Endereço */}
                    <Form.Group className="mb-3" controlId="formEndereco">
                        <Form.Label>Endereço</Form.Label>
                        <Form.Control type="text" name="endereco" value={formData.endereco} onChange={handleChange} />
                    </Form.Group>
                    
                    {/* Campo Telefone */}
                    <Form.Group className="mb-3" controlId="formTelefone">
                        <Form.Label>Telefone</Form.Label>
                        <Form.Control type="text" name="telefone" value={formData.telefone} onChange={handleChange} />
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

export default FornecedorForm;