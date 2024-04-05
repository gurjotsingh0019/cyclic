import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const currentYear = new Date().getFullYear();

const Footer = () => {

  return (
    <footer className="mt-5">
      <Container fluid>
        <Row>
          <Col className="text-center d-flex justify-content-center align-items-baseline">
            <h2 className="mb-4 text-center me-2" style={{ fontFamily: 'cursive', fontSize:'2rem'}}>&copy; RentUP</h2> <h2 style={{fontWeight:'400', fontStyle: 'italic', fontSize:'20px'}}>{currentYear}</h2>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer