import { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const shippingAddress = useSelector((state) => state?.orderSlice);

  useEffect(() => {
    if (!shippingAddress?.checkInDate) {
      navigate('/shipping');
    }
  }, [navigate, setPaymentMethod]);

  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const submitHandler = (e) => {
    e.preventDefault();
    navigate('/place-my-bookings');
  };

  return (
    <Container>
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>


        <Button type='submit' variant='primary'>
          Continue
        </Button>
      </Form>
    </Container>
  );
};

export default PaymentScreen;