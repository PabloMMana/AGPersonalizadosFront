import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // Você criará este componente depois
import Clientes from './pages/Clientes';
import Pedidos from './pages/Pedidos';
import Estoques from './pages/Estoques';
import Produtos from './pages/Produtos';
import ForgotPassword from './components/ForgotPassword'; // <-- Adicione esta linha (assumindo que está em components)
import ResetPassword from './components/ResetPassword';
import Register from './components/Register';



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
        <Route path="/esquecisenha" element={<ForgotPassword />} />
        <Route path="/novo-usuario" element={<Register />} /> 
        <Route path="/reset-password" element={<ResetPassword />} />
       

        {/* Rotas protegidas (só acessíveis se o usuário estiver logado) */}
        <Route path="/dashboard" element={<Dashboard />}>
          {/* Rotas aninhadas que serão renderizadas dentro do <Outlet /> do Dashboard */}
          <Route path="clientes" element={<Clientes />} />  
          <Route path="pedidos" element={<Pedidos />} /> 
          <Route path="estoques" element={<Estoques />} />    
          <Route path="produtos" element={<Produtos />} />                   
        </Route>

        {/* Redireciona a raiz para o login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;