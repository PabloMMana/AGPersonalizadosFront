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
              <Card.Title className="text-center mb-4">
  {/* Parte superior: "Login" em Arial */}
  <div style={{ 
    fontFamily: 'Arial, sans-serif', 
    color: '#003366', // Azul escuro
    fontSize: '1.3rem',
    fontWeight: 'bold',
    textTransform: 'uppercase'
  }}>
    Login
  </div>

  {/* Parte inferior: "AG Personalizados" com a fonte cursiva */}
  <div style={{ 
    fontFamily: "'Dancing Script', cursive", // Certifique-se de que esta fonte está importada
    color: '#fa0505', // Azul escuro
    fontSize: '3rem',
    marginTop: '-5px'
  }}>
    AG Personalizados
  </div>

  {/* Linha divisória */}
  <hr style={{ 
    borderTop: '2px solid #003366', 
    width: '60%', 
    margin: '15px auto 10px auto',
    opacity: 0.5 
  }} />
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
                <Link to="/esquecisenha">Esqueci minha senha</Link> |   --   | <Link to="/novo-usuario">Novo</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;