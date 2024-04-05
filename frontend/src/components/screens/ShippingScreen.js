import React, { useState } from 'react';
import { Form, Button, Container, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../../slices/OrderSlice';
import '../styles/PlaceOrderScreen.css';

const ShippingScreen = () => {
  const [shippingAddress] = useState(JSON.parse(localStorage.getItem('order')) || {});

  const [checkInDate, setCheckInDate] = useState(shippingAddress?.checkInDate || '');
  const [checkOutDate, setCheckOutDate] = useState(shippingAddress?.checkOutDate || '');
  const [numberOfGuests, setNumberOfGuests] = useState(shippingAddress?.numberOfGuests || '');
  const [phoneNumber, setPhoneNumber] = useState(shippingAddress?.phoneNumber || '');
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const [propertyType, setPropertyType] = useState(shippingAddress?.propertyType || 'rental');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(saveShippingAddress({
      checkInDate,
      checkOutDate: propertyType === 'rental' ? checkOutDate : null,
      numberOfGuests: propertyType === 'rental' ? numberOfGuests : null,
      phoneNumber,
      paymentMethod,
      propertyType
    }));
    navigate('/place-my-bookings');
  };

  return (
    <Container>
      <h1 className="text-center mb-5 ssh1">Purchasing</h1>
      <Form className='w-50 mx-auto' onSubmit={submitHandler}>
        <Row>
          <Col md={12} className='mb-4'>
            <div className="form-floating">
              <select className="form-select" type="text" name="type" value={propertyType} onChange={(e) => setPropertyType(e.target.value)} id="floatingSelect" aria-label="Floating label select example">
                <option value="rental">Rental</option>
                <option value="purchase">Purchase</option>
              </select>
              <label htmlFor="floatingSelect">Select Property Type</label>
            </div>
          </Col>
          <Col md={propertyType === 'rental' ? '6' : '12'}>
            <Form.Group as={Col} xxl={12} className="mb-4 rounded-full">
              <div className="form-floating">
                <Form.Control
                  type="date"
                  value={checkInDate}
                  required
                  onChange={(e) => setCheckInDate(e.target.value)}
                />
                <Form.Label htmlFor="floatingInput">Check-in Date</Form.Label>
              </div>
            </Form.Group>
          </Col>
          <Col md={6}>
            {propertyType === 'rental' && (
              <Form.Group as={Col} xxl={12} className="mb-4 rounded-full">
                <div className="form-floating">
                  <Form.Control
                    type="date"
                    value={checkOutDate}
                    required
                    onChange={(e) => setCheckOutDate(e.target.value)}
                  />
                  <Form.Label htmlFor="floatingInput">Check-out Date</Form.Label>
                </div>
              </Form.Group>
            )}
          </Col>
          <Col md={propertyType === 'rental' ? '6' : '12'}>
          {propertyType === 'rental' && (
            <Form.Group as={Col} xxl={12} className="mb-4 rounded-full">
              <div className="form-floating">
                <Form.Control
                  type="number"
                  placeholder="Enter Number Of Guests"
                  value={numberOfGuests}
                  required
                  onChange={(e) => setNumberOfGuests(e.target.value)}
                />
                <Form.Label htmlFor="floatingInput">Number of Guests</Form.Label>
              </div>
            </Form.Group>
            )}
          </Col>
          <Col md={propertyType === 'rental' ? '6' : '12'}>
            <Form.Group as={Col} xxl={12} className="mb-4 rounded-full">
              <div className="form-floating">
                <Form.Control
                  type="tel"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  required
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <Form.Label htmlFor="floatingInput">Phone Number</Form.Label>
              </div>
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group as={Col} xxl={12} className="mb-3">
              <Form.Label as="legend">Select Method</Form.Label>
              <div>
                <Form.Check
                  type="radio"
                  label="PayPal or Credit Card"
                  id="PayPal"
                  name="paymentMethod"
                  checked={paymentMethod === 'PayPal'}
                  onChange={() => setPaymentMethod('PayPal')}
                />
              </div>
            </Form.Group>
          </Col>
          <Col md={12}>
            <Button type="submit" variant="primary" className="w-100">
              Continue
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default ShippingScreen;