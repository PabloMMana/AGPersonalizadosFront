import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [SenhaHash, setSenha] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
     try {
    const response = await axios.post('http://localhost:5000/api/login/autenticar', { email, SenhaHash });
    console.log('Login bem-sucedido:', response.data);

    // Salve o token de autenticação no localStorage
    // A sua API deve retornar um objeto como { token: 'seu-token-aqui' }
    if (response.data && response.data.token) {
        localStorage.setItem('userToken', response.data.token);
    }
    
    // Redirecione o usuário para a página principal (Dashboard)
    navigate('/dashboard');

  } catch (error) {
    console.error('Erro ao fazer login:', error);
    alert('Credenciais inválidas. Tente novamente.');
  }
};

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2>Login</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                placeholder="Seu email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Senha</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Sua senha" 
                value={SenhaHash}
                onChange={(e) => setSenha(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Entrar
            </Button>
          </Form>
          <div className="text-center mt-3">
            <Link to="/esqueci-senha">Esqueci a senha</Link> | <Link to="/novo-usuario">Novo</Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;