import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'; // Importe este componente

const SideNav = () => {
  return (
    <Nav className="flex-column bg-light vh-100 p-3">
      {/* Exemplo corrigido para Clientes */}
      <LinkContainer to="/dashboard/clientes">
        <Nav.Link>Clientes</Nav.Link>
      </LinkContainer>

      {/* Exemplo corrigido para Estoque */}
      <LinkContainer to="/dashboard/estoque">
        <Nav.Link>Estoque</Nav.Link>
      </LinkContainer>

      {/* Exemplo corrigido para Pedidos */}
      <LinkContainer to="/dashboard/pedidos">
        <Nav.Link>Pedidos</Nav.Link>
      </LinkContainer>

      {/* Exemplo corrigido para Produtos */}
      <LinkContainer to="/dashboard/produtos">
        <Nav.Link>Produtos</Nav.Link>
      </LinkContainer>

      {/* Exemplo corrigido para Vendas */}
      <LinkContainer to="/dashboard/vendas">
        <Nav.Link>Vendas</Nav.Link>
      </LinkContainer>
    </Nav>
  );
};

export default SideNav;