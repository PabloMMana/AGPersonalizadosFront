import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'; // Importe este componente

const SideNav = () => {
  return (
    <Nav className="flex-column bg-light vh-100 p-3">
      {/* Exemplo corrigido para Clientes */}
      <h1><LinkContainer to="/dashboard/clientes">
        <Nav.Link>Clientes</Nav.Link>
      </LinkContainer></h1>
      <h1><LinkContainer to="/dashboard/pedidos">
        <Nav.Link>Pedidos</Nav.Link>
      </LinkContainer></h1>
      <h1><LinkContainer to="/dashboard/estoques">
        <Nav.Link>Estoque</Nav.Link>
      </LinkContainer></h1>
      
      <h1><LinkContainer to="/login">
        <Nav.Link>Sair</Nav.Link>
      </LinkContainer></h1>
    </Nav>
  );
};

export default SideNav;