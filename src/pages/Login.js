import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [Senha, setSenha] = useState(''); // Alterado para 'Senha' para corresponder ao campo da API
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Verifique se o nome do campo aqui corresponde ao que a API espera.
      // Se a API espera 'email' e 'SenhaHash', o código abaixo deve ser ajustado.
      // Se a API espera 'Email' e 'Senha', o código deve ser ajustado para isso.
      const response = await axios.post('http://localhost:5000/api/login/autenticar', { email: email, Senha: Senha });
      console.log('Login bem-sucedido:', response.data);

      // Salve o token de autenticação no localStorage
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
                value={Senha}
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