import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Row, Col, Card, Table, Alert } from 'react-bootstrap';
import { useGetCurrentBookingDetailsQuery } from '../../slices/BookingSlice';
import '../styles/Booking.css';
import '../styles/PlaceOrderScreen.css';
import { formatPrice } from '../reusable/FormatPrice';
import { GrDocumentUpdate } from "react-icons/gr";
import { usePayOrderMutation } from '../../slices/BookingSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import LoaderRipple from '../reusable/LoaderRipple';

const Bookings = () => {
    const paypal = useRef();

    const { id } = useParams();
    const { data, isLoading: getDetailLoading, error: getDetailError, refetch } = useGetCurrentBookingDetailsQuery(id);

    const [ updateBooking ] = usePayOrderMutation();

    const navigateToUrl = window.location.href.includes('booking');
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.authSlice);

    useEffect(() => {
        if (userInfo && data && userInfo?.role === 'user' && userInfo?._id !== data?.Booking?.user) {
            if (navigateToUrl) {
                navigate('/my-bookings');
            }
            else {
                navigate('/');
            }
        }
    }, [userInfo, data]);
    
    const updateMyBooking = async() => {
        await updateBooking(id);
        await refetch();
        toast.success('Payment Successfull');
    }
    useEffect(() => {
        if (!data?.Booking) return;
        if (!window.paypal) return;

        window.paypal.Buttons({
            createOrder: (data, actions, err) => {
                return actions.order.create({
                  intent: 'CAPTURE',
                  purchase_units: [
                    {
                      description: 'Booking Table',
                      amount: {
                        currency_code: 'USD',
                        value: '1000',
                      },
                    },
                  ],
                });
              },

            onApprove: async (data, actions) => {
                
                try {
                    updateMyBooking();
                  const order = await actions.order.capture();
                } catch (error) {
                  console.error('Error capturing order:', error);
                }
            },
            onError: (err) => {
                console.error('PayPal error:');
            },
        }).render(paypal.current);
        
        return () => {
            window.onload = function() {
                what();
                function what(){
                    paypal.current.innerHTML = '';
                };
            }
        };

    }, [data, refetch]);

    return (
        <>
            {getDetailError && <Alert variant="danger">Error: {getDetailError?.message}</Alert>}
            {getDetailLoading &&  <LoaderRipple />}
            {data && data?.Booking && (
                <Row className='placeorder-screen mt-4'>
                    <Col md={8}>
                        <h1 className='bh1 ps-3'>Booking ID: <span>{data?.Booking?._id}</span></h1>
                        <Card className='mb-4 border-0 posCard1'>
                            <Card.Body>
                                <Card.Text><span className='bSpan1'>Name: </span><span className='bSpan2'>{data?.User?.name}</span></Card.Text>
                                <Card.Text><span className='bSpan1'>Email: </span><span className='bSpan2'>{data?.User?.email}</span></Card.Text>
                            </Card.Body>
                        </Card>
                        <hr />
                        <Card className='mb-4 border-0'>
                            <Card.Body>
                                <h4 className='bh1'>Payment Status</h4>
                                <span className='bSpan1'>Method: </span> <span className='bSpan2'>{data?.Booking?.paymentMethod}</span>
                                {data?.Booking?.paymentStatus?.status === 'pending' ? (
                                    <Alert variant='warning mt-4 text-center'>Payment Pending</Alert>
                                ) : (
                                    <Alert variant='success mt-4 text-center'>Payment Completed</Alert>
                                )}
                            </Card.Body>
                        </Card>
                        <hr />
                        <Card className='mb-4 border-0'>
                            <Card.Body>
                                <h4 className='bh1'>Houses Booked</h4>
                                <Table striped hover responsive className='table-sm'>
                                    <thead>
                                        <tr>
                                            <th className='posSpan1'>Location</th>
                                            <th className='posSpan1'>Category</th>
                                            <th className='posSpan1'>Address</th>
                                            <th className='posSpan1'>Price</th>
                                            <th className='posSpan1'>View</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data?.Booking?.housesIds?.map((houseId, index) => {
                                            const house = data?.Houses?.find(h => h?._id === houseId);
                                            return (
                                                <tr key={index}>
                                                    <td className='posSpan2'>{house?.title.length > 10 ? `${house?.title.slice(0, 10)}...` : house?.title}</td>
                                                    <td className='posSpan2'>{house?.category}</td>
                                                    <td className='posSpan2'>{house?.location?.length > 10 ? `${house?.location?.slice(0, 10)}...` : house?.location}</td>
                                                    <td className='posSpan2'>{formatPrice(house?.price)}</td>
                                                    <td className='posSpan2'>
                                                        <Link to={`/single-house-data/${house?._id}`}>
                                                            <Button variant="light" className="action-button">
                                                                <GrDocumentUpdate size={20} />
                                                            </Button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className='mb-4 bCard2'>
                            <Card.Body>
                                <h4 className='bh1'>Booking Summary</h4>
                                <hr />
                                <Row>
                                    <Col>Houses Price</Col>
                                    <Col>{formatPrice(data?.Booking?.housePrice)}</Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col>Tax</Col>
                                    <Col>{formatPrice(data?.Booking?.taxPrice)}</Col>
                                </Row>
                                <hr />
                                <Row>
                                    <Col>Total Price</Col>
                                    <Col>{formatPrice(data?.Booking?.totalPrice)}</Col>
                                </Row>
                                <hr />
                                <Col className='mt-5'>
                                    {data?.Booking?.paymentStatus?.status !== 'completed' && (
                                        <div ref={paypal}></div>
                                    )}
                                </Col>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
        </>
    );
};

export default Bookings;
