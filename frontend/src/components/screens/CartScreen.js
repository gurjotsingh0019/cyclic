import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Col, Row, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getHousesToBeBooked, removeFromCart } from '../../slices/CartSlice';
import '../styles/cartScreen.css'
import { ImBin } from "react-icons/im";
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../reusable/FormatPrice';
import { toast } from 'react-toastify';

const CartComponent = () => {
  const cartItems = useSelector((state) => state.cartSlice.cartItems);
  const [totalPrice, setTotalPrice] = useState(0);
  const [checkedItems, setCheckedItems] = useState(cartItems || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    calculateTotalPrice();
  }, [cartItems, checkedItems]);

  const calculateTotalPrice = () => {
    if (!cartItems || !Array.isArray(cartItems) || checkedItems?.length === 0) {
      setTotalPrice(0);
      return;
    }

    const total = checkedItems?.reduce((acc, item) => {
      const selectedItem = cartItems?.find((cartItem) => cartItem?._id === item?._id);
      if (selectedItem) {
        acc += selectedItem?.price;
      }
      return acc;
    }, 0);

    setTotalPrice(total);
  };

  useEffect(() => {
      dispatch(getHousesToBeBooked(checkedItems));
  }, [checkedItems]);

  const handleCheckboxChange = (item) => {
    const isPresent = checkedItems?.some((house) => item?._id === house?._id)
    if(isPresent){
      const newItems = checkedItems?.filter((house) => item?._id !== house?._id)
      setCheckedItems(newItems);
    }
    else{
      setCheckedItems([...checkedItems, item])
    }
  };

  const handleProceedToPayment = () => {
    if(checkedItems?.length === 0){
      toast.error('Plese select a property');
      return ;
    }
    navigate('/shipping')
  };

  const handleDeleteItem = (item, index) => {
    const confirmDelete = window.confirm(`Are you sure you want to remove House No. ${index}  from the Dwell Deck?`);
    if (confirmDelete) {
      dispatch(removeFromCart(item));
    }
  };

  function houseClicked(id){
    navigate(`/single-house-data/${id}`); 
  }
  return (
    <Container fluid className='mt-3'>
      <h1 className='cartH1 animationDownToUp'>My Dwell's Deck</h1>
      <Row>
      <Col md={9}>
        {cartItems && cartItems?.length ? 
      <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th className='cartHeading'>House No.</th>
              <th className='cartHeading'>Checked</th>
              <th className='cartHeading'>Location</th>
              <th className='cartHeading'>Address</th>
              <th className='cartHeading'>Category</th>
              <th className='cartHeading'>Price</th>
              <th className='cartHeading'>Delete</th>
            </tr>
          </thead>
          <tbody>
            {cartItems?.map((item, index) => (
              <tr key={item?._id}>
                <td className='text-center cartText'>{index + 1}.</td>
                <td className='text-center cartText'>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={checkedItems?.includes(item)}
                    onChange={() => handleCheckboxChange(item)}
                  />
                </td>
                <td className='cartText' onClick={() => houseClicked(item?._id)}>{item?.title}</td>
                <td className='cartText'  style={{ textDecoration: 'underline' }} onClick={() => houseClicked(item?._id)}>
                  {item?.location?.length > 25 ? `${item?.location?.slice(0, 25)}...` : item?.location}
                </td>
                <td className='cartText' onClick={() => houseClicked(item?._id)}>{item?.category}</td>
                <td className='cartText'>{formatPrice(item?.price)}</td>
                <td className='text-center cartText'>
                  <Button variant="light" onClick={() => handleDeleteItem(item?._id, index + 1)}>
                    <ImBin size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>:
            <Alert key='danger' variant='primary' className='d-flex justify-content-center'>
                Your's Dwell Deck is empty!
            </Alert>
    }
      </Col>
      <Col md={3}>
      <div className='p-3 cartBox'>
        <div className="text-right">
          <div className='fs-4 mb-2'>Total ({checkedItems?.length}) Houses</div>
          <p>{formatPrice(totalPrice)}</p>
          <hr/>
          <Button disabled={checkedItems?.length === 0} className='w-100 posButton shinyButton' variant="primary" onClick={handleProceedToPayment}>
            Proceed to Payment
          </Button>
        </div>
      </div>
      </Col>
      </Row>
    </Container>
  );
};

export default CartComponent;