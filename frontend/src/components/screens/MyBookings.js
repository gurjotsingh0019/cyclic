import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Table, Button, Container, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { formatPrice } from '../reusable/FormatPrice';
import { useGetAllBookingBySingleUserQuery, useDeleteSingleBookingUserMutation } from '../../slices/BookingSlice';
import { formatDate } from '../reusable/FormatDate';
import '../styles/Booking.css';
import '../styles/PlaceOrderScreen.css';
import { ImBin } from 'react-icons/im';
import ConfirmationDialog from '../ConfirmationDialog'; // Import ConfirmationDialog
import { toast } from 'react-toastify';
import { IoEyeSharp, IoLogoGooglePlaystore } from 'react-icons/io5';
import bookingShimmer from '../Shimmer/bookingShimmer'

const MyBookings = () => {
    const [bookingToDelete, setBookingToDelete] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteSingleBooking] = useDeleteSingleBookingUserMutation();
    const { userInfo } = useSelector((state) => state.authSlice);
    const { data, isLoading, error, refetch } = useGetAllBookingBySingleUserQuery(userInfo?._id);

    const isMyBooking = window.location.href.includes('my-bookings');
    const handleDelete = (id) => {
        setBookingToDelete( id );
        setShowDeleteConfirmation(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteSingleBooking(bookingToDelete);
            toast.success('Booking Successfully Deleted');
            refetch();
            setShowDeleteConfirmation(false);
        } catch (error) {
            toast.error('Error while deleting booking. ' + error?.message);
            setShowDeleteConfirmation(false);
        }
    };

    return (
        <Container fluid>
            {isLoading && bookingShimmer()}
            {error &&
                <div>
                    <h4 className='bh1 d-flex justify-content-center fs-1 mt-3 animationDownToUp'>My Bookings</h4>
                    <Alert key='danger' variant='danger' className='d-flex justify-content-center'>
                        No Bookings Found
                    </Alert>
                </div>
            }
            {data && data?.houses?.length > 0 && (
                <Row className='placeorder-screen mt-4'>
                    <Col md={12}>
                        <h4 className='bh1 d-flex justify-content-center fs-1 animationDownToUp'>My Bookings</h4>

                        <Table striped hover responsive bordered className='table-lg'>

                            <thead>
                                <tr>
                                    <th className='cartHeading'>{isMyBooking ? "Index" : "No."}</th>
                                    <th className='posSpan1'>Check In</th>
                                    <th className='posSpan1'>Check Out</th>
                                    {isMyBooking && <th className='posSpan1'>Booking Type</th>}
                                    {isMyBooking && <th className='posSpan1'>Total Guests</th>}
                                    <th className='posSpan1'>Paid On</th>
                                    <th className='posSpan1'>Total Price</th>
                                    {isMyBooking && <th className='posSpan1'>Created On</th>}
                                    <th className='posSpan1'>Phone Number</th>
                                    <th className='posSpan1'>View</th>
                                    {!isMyBooking && <th className='listHeading'>Listed</th>}
                                    {isMyBooking && <th className='listHeading'>Delete</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {data?.houses?.map((booking, index) => (
                                    <tr key={index}>
                                        <td className='text-center cartText'>{index + 1}.</td>
                                        <td className='posSpan2'>{booking?.checkInDate?.slice(0, 10)}</td>
                                        <td className='posSpan2'>{booking?.checkOutDate ? booking?.checkOutDate?.slice(0, 10) : 'N.A.'}</td>
                                        {isMyBooking && <td className='posSpan2'>{booking?.purchasingType === 'rental' ? 'Renting' : 'Purchasing'}</td>}
                                        {isMyBooking && <td className='posSpan2'>{booking?.guests ? booking?.guests : 'N.A.'}</td>}
                                        <td className='posSpan2'>{booking?.paymentStatus.status !== 'completed' ? <span style={{ fontWeight: '500', color: 'red' }}>Not Paid</span> : <span style={{ fontWeight: '500', color: '#32d100' }}>{formatDate(booking?.paidAt).slice(0, formatDate(booking?.paidAt).length - 6)}</span>}</td>
                                        <td className='posSpan2'>{formatPrice(booking?.totalPrice)}</td>
                                        {isMyBooking && <td className='posSpan2'>{formatDate(booking?.createdAt)}</td>}
                                        <td className='posSpan2'>{booking?.phoneNumber}</td>
                                        <td className='posSpan2 text-center'>
                                            <Link to={`/booking/${booking?._id}`}>
                                                <Button variant="light" className="action-button" >
                                                    <IoEyeSharp size={20} />
                                                </Button>
                                            </Link>
                                        </td>
                                        {!isMyBooking && <td className='text-center listText'>
                                            <Link to='/my-bookings'>
                                                <Button variant="light" className="action-button">
                                                    <IoLogoGooglePlaystore size={20} />
                                                </Button>
                                            </Link>
                                        </td>}
                                        {isMyBooking && (
                                            <td className='text-center listText'>
                                                <Button
                                                    variant="light"
                                                    className="action-button"
                                                    onClick={() => handleDelete(booking?._id)}
                                                >
                                                    <ImBin size={20} />
                                                </Button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            )}
            {data && data?.houses?.length === 0 && (
                <div>
                    <h4 className='bh1 d-flex justify-content-center fs-1 mt-3 animationDownToUp'>My Bookings</h4>
                    <Alert key='primary' variant='primary' className='d-flex justify-content-center'>
                        No Bookings Found
                    </Alert>
                </div>
            )}
            <ConfirmationDialog
                show={showDeleteConfirmation}
                onClose={() => setShowDeleteConfirmation(false)}
                onConfirm={confirmDelete}
                title='Delete Booking'
                message='Are you sure you want to delete this booking?'
            />
        </Container>
    );
}

export default MyBookings;