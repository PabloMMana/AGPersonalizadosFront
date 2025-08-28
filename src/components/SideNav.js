import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const SideNav = () => {
  return (
    <Nav className="flex-column bg-light vh-100 p-3">
      <Nav.Item>
        <Nav.Link as={LinkContainer} to="/dashboard/clientes">Clientes</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={LinkContainer} to="/dashboard/estoque">Estoque</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={LinkContainer} to="/dashboard/pedidos">Pedidos</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={LinkContainer} to="/dashboard/produtos">Produtos</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={LinkContainer} to="/dashboard/vendas">Vendas</Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default SideNav;