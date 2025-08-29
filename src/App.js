import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // Você criará este componente depois
import Clientes from './pages/Clientes';



function App() {
  // Função para verificar se o usuário está autenticado
  const isAuthenticated = () => {
    // Retorna true se houver um token, caso contrário, retorna false.
    const token = localStorage.getItem('userToken');
    return !!token; // !! converte o valor para booleano (true ou false)
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/esqueci-senha" element={<h1>Esqueci a Senha</h1>} />
        <Route path="/novo-usuario" element={<h1>Novo Usuário</h1>} /> 
        

        {/* Rotas protegidas (só acessíveis se o usuário estiver logado) */}
        <Route path="/dashboard" element={<Dashboard />}>
          {/* Rotas aninhadas que serão renderizadas dentro do <Outlet /> do Dashboard */}
          <Route path="clientes" element={<Clientes />} />                 
        </Route>

        {/* Redireciona a raiz para o login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;