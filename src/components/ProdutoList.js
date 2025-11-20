import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Alert } from 'react-bootstrap';
// CORREÇÃO: Importa o componente que você já criou.
import ProdutoForm from './ProdutoForm'; 

// URL da sua API de Produtos
const API_URL = 'http://localhost:5000/api/produto'; 

const ProdutoList = () => {
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [produtoParaEditar, setProdutoParaEditar] = useState(null);
    const [error, setError] = useState('');

    // --- FUNÇÃO DE BUSCA ---
    const fetchProdutos = async () => {
        try {
            const response = await axios.get(API_URL);
            setProdutos(response.data);
            setLoading(false);
        } catch (err) {
            setError('Erro ao carregar a lista de produtos. Verifique se a API está online.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProdutos();
    }, []);

    // --- FUNÇÕES DE CONTROLE ---
    const handleCloseModal = () => {
        setShowModal(false);
        setProdutoParaEditar(null);
    };

    const handleEdit = (produto) => {
        setProdutoParaEditar(produto);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchProdutos(); // Recarrega a lista após exclusão
        } catch (err) {
            setError('Erro ao excluir o produto.');
        }
    };

    const handleSaveSuccess = () => {
        handleCloseModal();
        fetchProdutos(); // Recarrega a lista após adição/edição
    };

    if (loading) return <p>Carregando produtos...</p>;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <div className="p-4">
            <h1>Gerenciamento de Produtos</h1>
            <Button 
                variant="success" 
                onClick={() => {
                    setProdutoParaEditar(null);
                    setShowModal(true);
                }}
                className="mb-3"
            >
                Adicionar Novo Produto
            </Button>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Preço</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {produtos.map((produto) => (
                        <tr key={produto.id}>
                            <td>{produto.id}</td>
                            <td>{produto.nome}</td>
                            <td>{produto.descricao}</td>
                            <td>{`R$ ${produto.preco ? parseFloat(produto.preco).toFixed(2).replace('.', ',') : '0,00'}`}</td>
                            <td>
                                <Button variant="info" size="sm" className="me-2" onClick={() => handleEdit(produto)}>Editar</Button>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(produto.id)}>Excluir</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal de Adição/Edição */}
            <ProdutoForm 
                show={showModal}
                handleClose={handleCloseModal}
                produtoParaEditar={produtoParaEditar}
                onSaveSuccess={handleSaveSuccess}
            />
        </div>
    );
};

export default ProdutoList;