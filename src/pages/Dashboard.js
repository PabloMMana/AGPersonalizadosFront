import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link, Outlet } from 'react-router-dom';
import SideNav from '../components/SideNav'; // Crie este componente

const Dashboard = () => {
  return (
    <Container fluid>
      <Row>
        <Col md={2} className="p-0">
          <SideNav />
        </Col>
        <Col md={10}>
          <div className="mt-4">
            {/* Aqui os componentes de CRUD serão exibidos */}           
            <Outlet /> 
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;