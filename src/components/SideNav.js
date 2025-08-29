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
      
      
    </Nav>
  );
};

export default SideNav;