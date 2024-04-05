import React, { useState } from 'react';
import { Button, Table, Spinner, Alert, Modal, Container } from 'react-bootstrap';
import { useGetAllBookingQuery, useDeleteBookingMutation, useUpdatePaymentStatusMutation } from '../../slices/AdminSlice';
import ConfirmationDialog from '../ConfirmationDialog';
import Loader from '../Loader';
import { toast } from 'react-toastify';
import { formatDate } from '../reusable/FormatDate';
import { formatPrice } from '../reusable/FormatPrice';
import { ImBin } from 'react-icons/im';
import { Link, useNavigate } from 'react-router-dom';
import { GrDocumentStore } from 'react-icons/gr';
import { RiUserSharedLine } from "react-icons/ri";
import LoaderRipple from '../reusable/LoaderRipple';

const GetAllBookings = () => {
    const { data, isLoading, error, refetch } = useGetAllBookingQuery();
    const [showUpdateConfirmation, setShowUpdateConfirmation] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleting] = useDeleteBookingMutation();
    const [houseToDelete, setHouseToDelete] = useState(null);
    const [updateStatusOfPayment] = useUpdatePaymentStatusMutation();
    const [userToUpdate, setUserToUpdate] = useState(null);
    const [loadingReviews, setLoadingReviews] = useState({});

    const navigate = useNavigate();
    
    const handleDelete = async (bookingId) => {
        setHouseToDelete(bookingId);
        setShowDeleteConfirmation(true);
    };
    let loadingToastId;
    const confirmDelete = async () => {
        try {
            setLoadingReviews((prevState) => ({
                ...prevState,
                [houseToDelete]: true,
              }));
            loadingToastId = toast.loading("Deleting booking. Please wait");
            await deleting(houseToDelete).unwrap();
            toast.dismiss(loadingToastId);
            setShowDeleteConfirmation(false);
            toast.success('Booking Successfully Deleted');
            refetch();
        } catch (error) {
            toast.dismiss(loadingToastId);
            setShowDeleteConfirmation(false);
            toast.error('Error deleting booking:', error);
        }
        finally {
            toast.dismiss(loadingToastId);
            setLoadingReviews((prevState) => ({
              ...prevState,
              [houseToDelete]: false,
            }));
        }
    };

    const confirmUpdate = async () => {
        await updateStatusOfPayment(userToUpdate).unwrap();
        toast.success('Payment Status Updated')
        refetch();
    }

    function handleUserProfileDetail(id) {
        navigate(`/admin/user-details/${id}`);
    }
    return (
        <Container fluid>
            <h4 className='bh1 d-flex justify-content-center fs-1 mt-4 animationDownToUp'>All User's Bookings</h4>
            {isLoading && <LoaderRipple />}
            {error && <Alert variant="danger">Error while loading bookings</Alert>}
            {data?.bookings?.length > 0 ? (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th className="align-middle posSpan1">Index</th>
                            <th className='posSpan1'>Check In</th>
                            <th className='posSpan1'>Check Out</th>
                            <th className='posSpan1'>Booking Type</th>
                            <th className='posSpan1'>Total Guests</th>
                            <th className='posSpan1'>Paid On</th>
                            <th className='posSpan1'>Total Price</th>
                            <th className='posSpan1'>Created On</th>
                            <th className='posSpan1'>Phone Number</th>
                            <th className='posSpan1'>User Details</th>
                            <th className='posSpan1'>View</th>
                            <th className='posSpan1'>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data?.bookings?.map((booking, index) => (
                            <tr key={booking?._id}>
                                <td className='text-center cartText'>{index + 1}.</td>
                                <td className='posSpan2'>{booking?.checkInDate.slice(0, 10)}</td>
                                <td className='posSpan2'>{booking?.checkOutDate ? booking?.checkOutDate?.slice(0, 10) : 'N.A.'}</td>
                                <td className='posSpan2'>{booking?.purchasingType === 'rental' ? 'Renting' : 'Purchasing'}</td>
                                <td className='posSpan2'>{booking?.guests ? booking?.guests : 'N.A.'}</td>
                                <td className='posSpan2'>{booking?.paymentStatus?.status !== 'completed' ? <span style={{ fontWeight: '500', color: 'red' }}>Not Paid</span> : <span style={{ fontWeight: '500', color: '#32d100' }}>{formatDate(booking?.paidAt)?.slice(0, formatDate(booking?.paidAt)?.length - 6)}</span>}</td>
                                <td className='posSpan2'>{formatPrice(booking?.totalPrice)}</td>
                                <td className='posSpan2'>{formatDate(booking?.createdAt)}</td>
                                <td className='posSpan2'>{booking?.phoneNumber}</td>
                                <td className="align-middle  text-center posSpan2">
                                    <Button variant="light" onClick={() => handleUserProfileDetail(booking?.user)}>
                                        <RiUserSharedLine color='red' size={20} />
                                    </Button>
                                </td>
                                <td className='posSpan2 text-center'>
                                    <Link to={`/booking/${booking?._id}`}>
                                        <Button variant="light" className="action-button" >
                                            <GrDocumentStore color='red' size={20} />
                                        </Button>
                                    </Link>
                                </td>
                                <td className='text-center listText'>
                                    <Button
                                        variant="danger"
                                        className="action-button"
                                        onClick={() => handleDelete(booking?._id)}
                                        disabled={loadingReviews[booking?._id]}
                                    >
                                        {!loadingReviews[booking?._id] ? <ImBin size={20} /> : <div className='deleteButtonDangerLoader'><Loader width={'26px'} height={'26px'} border= {'2.4px solid #dc3545'} borderColor={'white transparent transparent transparent'}/></div> }
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ): (
                !isLoading &&
                <Alert variant="primary text-center">
                  No Bookings found.
                </Alert>
              )}
            <ConfirmationDialog
                show={showDeleteConfirmation}
                onClose={() => setShowDeleteConfirmation(false)}
                onConfirm={confirmDelete}
                title="Delete Booking"
                message="Are you sure you want to delete this Booking?"
            />
            <ConfirmationDialog
                show={showUpdateConfirmation}
                onClose={() => setShowUpdateConfirmation(false)}
                onConfirm={confirmUpdate}
                title="Update Booking"
                message="Are you sure you want to update this Booking?"
            />
        </Container>
    );
};

export default GetAllBookings;