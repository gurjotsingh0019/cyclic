import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Row, Col, ListGroup, Image, Card, Table, Alert } from 'react-bootstrap';
import { useCreateBookingMutation } from '../../slices/BookingSlice';
import '../styles/PlaceOrderScreen.css';
import { formatPrice } from '../reusable/FormatPrice';
import Loader from '../Loader';

const PlaceOrderScreen = () => {
    const navigate = useNavigate();
    const [housesToBook] = useState(JSON.parse(localStorage.getItem('HousesToBeBooked')) || []);
    const [tax, setTax] = useState(0);
    const [shippingAddress] = useState(JSON.parse(localStorage.getItem('order')) || {});
    const [totalPrice, setTotalPrice] = useState(0);

    const [createBooking, { isLoading, error }] = useCreateBookingMutation();

    useEffect(() => {
        if (!shippingAddress?.checkInDate) {
            navigate('/shipping');
        }
    }, [shippingAddress?.checkInDate, navigate]);

    useEffect(() => {
        calculateTotalPrice();
    }, []);

    const calculateTotalPrice = () => {
        if (!housesToBook || !Array.isArray(housesToBook) || housesToBook?.length === 0) {
            setTotalPrice(0);
            return;
        }

        const total = housesToBook?.reduce((acc, item) => {
            const selectedItem = housesToBook?.find((cartItem) => cartItem?._id === item?._id);
            if (selectedItem) {
                acc += selectedItem?.price;
            }
            return acc;
        }, 0);

        setTotalPrice(total);
        setTax(total / 100);
    };

    const placeOrderHandler = async () => {
        try {
            const res = await createBooking({
                checkInDate: shippingAddress?.checkInDate,
                checkOutDate: shippingAddress?.checkOutDate,
                guests: shippingAddress?.numberOfGuests,
                purchasingType: shippingAddress?.propertyType,
                phoneNumber: shippingAddress?.phoneNumber,
                paymentMethod: shippingAddress?.paymentMethod,
                housePrice: totalPrice,
                taxPrice: tax,
                totalPrice: totalPrice + tax,
                housesIds: housesToBook?.map((house) => house?._id)
            }).unwrap();
            toast.success('Booking placed. Please complete the payment.');
            navigate(`/booking/${res?.booking?._id}`)
        } catch (err) {
            // console.log(error?.data?.message);
            toast.error('Error while booking property');
            // toast.error(err);
        }
    };

    return (
        <>
            <Row className='my-4 me-0'>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <Card className='posCard'>
                            <Card.Body>
                                <Card.Title className='posh1'>Booking Information</Card.Title>
                                <Table striped hover responsive className='table-lg'>
                                    <tbody>
                                        <tr></tr>
                                        <tr>
                                            <td><span className="posSpan1">Date for checking in for the property</span></td>
                                            <td><span className="posSpan2">{shippingAddress?.checkInDate}</span></td>
                                        </tr>
                                        {shippingAddress?.checkOutDate && (
                                            <tr>
                                                <td><span className="posSpan1">Date for checking out for the property</span></td>
                                                <td><span className="posSpan2">{shippingAddress?.checkOutDate}</span></td>
                                            </tr>
                                        )}
                                        {shippingAddress?.numberOfGuests && (
                                            <tr>
                                                <td><span className="posSpan1">Number of members</span></td>
                                                <td><span className="posSpan2">{shippingAddress?.numberOfGuests}</span></td>
                                            </tr>
                                        )}
                                        <tr>
                                            <td><span className="posSpan1">Type of the property</span></td>
                                            <td>{shippingAddress?.propertyType === 'rental' ? 'Renting Property' : 'Purchasing Property'}</td>
                                        </tr>
                                        <tr>
                                            <td><span className="posSpan1">Phone number</span></td>
                                            <td><span className="posSpan2">{shippingAddress?.phoneNumber}</span></td>
                                        </tr>
                                        <tr>
                                            <td><span className="posSpan1">Payment Method</span></td>
                                            <td><span className="posSpan2">{shippingAddress?.paymentMethod}</span></td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                        <hr />

                        <ListGroup.Item>
                            <h1 className='posh1'>Property To Be Booked</h1>
                            {housesToBook?.length === 0 ? (
                                <Alert key='danger' variant='primary' className='d-flex justify-content-center'>
                                    You don't have any bookings!
                                </Alert>
                            ) : (
                                <Table striped hover responsive className='table-lg'>
                                    <thead>
                                        <tr>
                                            <th className="posSpan1">Location</th>
                                            <th className="posSpan1">Category</th>
                                            <th className="posSpan1">Address</th>
                                            <th className="posSpan1">Price</th>
                                            <th className="posSpan1">Booked Property</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {housesToBook?.map((house, index) => (
                                            <tr key={index}>
                                                <td className="posSpan2">{house?.title}</td>
                                                <td className="posSpan2">{house?.category}</td>
                                                <td className="posSpan2">{house?.location}</td>
                                                <td className="posSpan2">{formatPrice(house?.price)}</td>
                                                <td className=''>
                                                    <Link to={`/single-house-data/${house?._id}`}>
                                                        <Button variant="light" className="action-button" style={{ fontSize: '12px' }}>
                                                            View Property
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card className='posCard2'>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2 className='posh1'>Booking Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Houses Price</Col>
                                    <Col>{formatPrice(totalPrice)}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col>{formatPrice(tax)}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>{formatPrice(totalPrice + tax)}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button
                                    type='button'
                                    className='btn-block w-50 rounded-1 my-1 text-center posButton'
                                    disabled={housesToBook?.length === 0 || isLoading}
                                    onClick={placeOrderHandler}
                                    style={{ cursor: 'pointer', height: '2.9rem' }}
                                >
                                    {isLoading ? <Loader width={'26px'} height={'26px'} border= {'3px solid #0d6efd'} borderColor={'white transparent transparent transparent'}/> : <span>Place Booking</span>}
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default PlaceOrderScreen;