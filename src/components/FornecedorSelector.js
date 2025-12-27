import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Form, Button, InputGroup, Spinner } from 'react-bootstrap';

const FornecedorSelector = ({ onSelectFornecedor }) => {
    const [fornecedores, setFornecedores] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchFornecedores = async () => {
        setLoading(true);
        try {
            // URL baseada no seu teste de Swagger de sucesso
            const response = await axios.get('http://localhost:5000/api/Fornecedor');
            setFornecedores(response.data);
        } catch (error) {
            console.error('Erro ao buscar fornecedores:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFornecedores();
    }, []);

    const fornecedoresFiltrados = fornecedores.filter(f =>
        f.nome && f.nome.toLowerCase().includes(filtro.toLowerCase())
    );

    // O RETURN DEVE ESTAR AQUI, DENTRO DA FUNÇÃO
    return (
        <div>
            <InputGroup className="mb-3">
                <Form.Control
                    placeholder="Pesquisar fornecedor..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                />
            </InputGroup>
            
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {loading ? (
                    <div className="text-center"><Spinner animation="border" size="sm" /></div>
                ) : (
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fornecedoresFiltrados.map(f => (
                                <tr key={f.id}>
                                    <td>{f.nome}</td>
                                    <td>
                                        <Button size="sm" onClick={() => onSelectFornecedor(f)}>
                                            Selecionar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </div>
        </div>
    );
};

export default FornecedorSelector;