import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link, Outlet } from 'react-router-dom';
import SideNav from '../components/SideNav'; // Crie este componente

const Dashboard = () => {
  return (
    <Container fluid>
      <div className="background-login"></div>
      <Row>
        <Col md={1} className="p-30">
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