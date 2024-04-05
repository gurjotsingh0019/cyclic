import React from 'react';
import { Card } from 'react-bootstrap';
import '../styles/HouseDashboard.css';

const HouseDashShimmer = () => {
  const shimmerElements = [];
  
  for (let i = 0; i < 8; i++) {
    shimmerElements.push(
      <div key={i} className="d-flex my-2 p-1 houseCard placeholder">
        <Card className='ratio ratio-4x3 my-auto ms-1 cardImage placeholder col-12 rounded-0' />
        <Card.Body className='p-1 px-2 my-auto cardBody placeholder-glow'>
          <div className="placeholder col-8"></div>
          <div className="placeholder col-9"></div>
          <div className="placeholder col-11"></div>
          <div className="placeholder col-8"></div>
          <div className="placeholder col-12"></div>
          <div className="placeholder col-10"></div>
          <div className="placeholder col-8"></div>
          <div className="placeholder col-5"></div>
        </Card.Body>
      </div>
    );
  }

  return <>{shimmerElements}</>;
};

export default HouseDashShimmer;