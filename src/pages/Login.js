import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [SenhaHash, setSenha] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login/autenticar', { email, SenhaHash });
      console.log('Login bem-sucedido:', response.data);

      if (response.data && response.data.token) {
        localStorage.setItem('userToken', response.data.token);
      }

      navigate('/dashboard');

    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center">
      <div className="background-login"></div>
      <Row className="justify-content-center w-100">
        <Col xs={3} sm={3} md={2} lg={3}>
          <Card className="shadow-lg p-3">
            <Card.Body>
              <Card.Title className="text-center">
                <h2>Login - AG Personalizados</h2>
              </Card.Title>
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
                <Link to="/esqueci-senha">Esqueci minha senha</Link> |   --   | <Link to="/novo-usuario">Novo</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;