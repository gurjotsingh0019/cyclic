import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDeleteBookingMutation, useGetSingleUserDetailQuery } from '../../slices/AdminSlice';
import { Table, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { ImBin } from 'react-icons/im';
import { IoEyeSharp } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ConfirmationDialog from '../ConfirmationDialog';
import { formatDate } from '../reusable/FormatDate';
import { formatPrice } from '../reusable/FormatPrice';
import listingShimmer from '../Shimmer/listingShimmer';
import bookingShimmer from '../Shimmer/bookingShimmer';
import Loader from '../Loader';
import { useDeleteSingleHouseAdminMutation } from '../../slices/HouseSlice';
import LoaderRipple from '../reusable/LoaderRipple';

const SingleUserDetail = () => {
    const { id } = useParams();
    const { data, isLoading, error, refetch } = useGetSingleUserDetailQuery(id);
    const [deleteSingleHouse] = useDeleteSingleHouseAdminMutation();
    const [deleteBooking] = useDeleteBookingMutation();
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [houseToDelete, setHouseToDelete] = useState(null);
    const [bookingToDelete, setBookingToDelete] = useState(null);
    const [confirmationDialogTitle, setConfirmationDialogTitle] = useState('');
    const [confirmationDialogMessage, setConfirmationDialogMessage] = useState('');
    const { userInfo } = useSelector((state) => state.authSlice);
    const [loadingReviews, setLoadingReviews] = useState({});
    let loadingToastId;
    const confirmDelete = async () => {
        try {
            loadingToastId = toast.loading("Deleting property. Please wait.");
            setLoadingReviews((prevState) => ({
                ...prevState,
                [houseToDelete?.id]: true,
            }));
            await deleteSingleHouse(houseToDelete?.id).unwrap();
            toast.dismiss(loadingToastId);
            toast.success('Property Successfully Deleted');
            refetch();
        } catch (error) {
            toast.dismiss(loadingToastId);
            toast.error('Error while deleting property.');
        }
        finally {
            toast.dismiss(loadingToastId);
            setLoadingReviews((prevState) => ({
                ...prevState,
                [houseToDelete?.id]: false,
            }));
        }
    };

    const confirmDeleteBooking = async () => {
        try {
            loadingToastId = toast.loading("Deleting booking. Please wait.");
            setLoadingReviews((prevState) => ({
                ...prevState,
                [bookingToDelete]: true,
            }));
            await deleteBooking(bookingToDelete).unwrap();
            toast.dismiss(loadingToastId);
            toast.success('Booking Successfully Deleted');
            refetch();
        } catch (error) {
            toast.dismiss(loadingToastId);
            toast.error('Error while deleting booking.');
        }
        finally {
            toast.dismiss(loadingToastId);
            setLoadingReviews((prevState) => ({
                ...prevState,
                [bookingToDelete]: false,
            }));
        }
    };

    const handleDelete = (id, userId) => {
        if (userInfo?.role === 'user' && userInfo?._id !== userId) {
            toast.warning('Warning!! unauthorized attempt');
            return;
        }

        setHouseToDelete({ id, userId });
        setConfirmationDialogTitle('Delete Listing');
        setConfirmationDialogMessage('Are you sure you want to delete this listing?');
        setShowDeleteConfirmation(true);
    };

    const handleDeleteBooking = (bookingId) => {
        setBookingToDelete(bookingId);
        setConfirmationDialogTitle('Delete Booking');
        setConfirmationDialogMessage('Are you sure you want to delete this booking?');
        setShowDeleteConfirmation(true);
    };

    const handleConfirmationDelete = () => {
        if (confirmationDialogTitle === 'Delete Listing') {
            confirmDelete();
        } else if (confirmationDialogTitle === 'Delete Booking') {
            confirmDeleteBooking();
        }
        setShowDeleteConfirmation(false);
    };

    return (
        <Container fluid className="mt-5">
            {isLoading ? (
                <LoaderRipple />
            ) : error ? (
                <Alert key='danger' variant='danger' className='d-flex justify-content-center'>
                    Opps!! No User Found for this id
                </Alert>
            ) : (
                <Row>
                    <Col md={3}>
                        <div style={{ position: 'sticky', top: '4rem' }}>
                            <h2 className='listingH1 fs-1'>{data?.user?.name.slice(0, 10)}'s Details</h2>
                            <Table striped bordered hover responsive>
                                <tbody>
                                    <tr></tr>
                                    <tr>
                                        <td className='listHeading'>Name</td>
                                        <td className='listText'>{data?.user?.name}</td>
                                    </tr>
                                    <tr>
                                        <td className='listHeading'>Email</td>
                                        <td className='listText'>{data?.user?.email}</td>
                                    </tr>
                                    <tr>
                                        <td className='listHeading'>Role</td>
                                        <td className='listText'>{data?.user?.role === 'admin' ? 'Admin' : 'User'}</td>
                                    </tr>
                                    <tr>
                                        <td className='listHeading'>Profile</td>
                                        <td className='listText'><img style={{ borderRadius: '10px', width: '4rem' }} src={data?.user?.avatar?.url} alt='user' /></td>
                                    </tr>
                                    <tr>
                                        <td className='listHeading'>Joined On</td>
                                        <td className='listText'>{formatDate(data?.user?.createdAt)}</td>
                                    </tr>
                                    <tr>
                                        <td className='listHeading'>Number Of Listings</td>
                                        <td className='listText'>{data?.listings?.length}</td>
                                    </tr>
                                    <tr>
                                        <td className='listHeading'>Number Of Bookings</td>
                                        <td className='listText'>{data?.bookings?.length}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                    <Col md={9}>
                        <div>
                            <Container fluid className=''>
                                {isLoading && listingShimmer()}
                                {error &&
                                    <div>
                                        <h4 className='listingH1 d-flex justify-content-center fs-1 mt-3'>Listings</h4>
                                        <Alert key='danger' variant='danger' className='d-flex justify-content-center'>
                                            No Listings Found for {data?.user?.name}.
                                        </Alert>
                                    </div>
                                }
                                {!isLoading && <h1 className='listingH1'>Listings</h1>}
                                <div className="my-listings-container">
                                    {data && data?.listings?.length > 0 && (
                                        <Table striped bordered hover responsive className=''>
                                            <thead>
                                                <tr>
                                                    <th className='listHeading'>Location</th>
                                                    <th className='listHeading'>Category</th>
                                                    <th className='listHeading'>Status</th>
                                                    <th className='listHeading'>Created</th>
                                                    <th className='listHeading'>Availability</th>
                                                    <th className='listHeading'>View</th>
                                                    <th className='listHeading'>Delete</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data && data?.listings?.map((house) => (
                                                    <tr key={house?._id}>
                                                        <td className='listText'>{house?.title?.length > 16 ? `${house?.title?.slice(0, 16)}...` : house?.title}</td>
                                                        <td className='listText'>{house?.category}</td>
                                                        <td className='listText'>{house?.constructionStatus}</td>
                                                        <td className='listText'>{formatDate(house?.created_at?.slice(0, 10))}</td>
                                                        <td className='listText'>{house?.available}</td>
                                                        <td className='text-center listText'>
                                                            <Link to={`/single-house-data/${house?._id}`}>
                                                                <Button variant="light" className="action-button">
                                                                    <IoEyeSharp size={20} />
                                                                </Button>
                                                            </Link>
                                                        </td>
                                                        <td className='text-center listText'>
                                                            <Button
                                                                variant="light"
                                                                className="action-button"
                                                                onClick={() => handleDelete(house?._id, house?.user)}
                                                                disabled={loadingReviews[house?._id]}
                                                            >
                                                                {!loadingReviews[house?._id] ? <ImBin size={20} /> : <div className='deleteButtonDangerLoader'><Loader width={'26px'} height={'26px'} border= {'2.4px solid #f8f9fa'} borderColor={'black transparent transparent transparent'}/></div>}
                                                            </Button>
                                                        </td>

                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    )}
                                    {data && data?.listings?.length === 0 && (
                                        <div>
                                            <Alert key='primary' variant='primary' className='d-flex justify-content-center'>
                                                No Listings Found for {data?.user?.name}.
                                            </Alert>
                                        </div>
                                    )}
                                </div>
                                <ConfirmationDialog
                                    show={showDeleteConfirmation}
                                    onClose={() => setShowDeleteConfirmation(false)}
                                    onConfirm={confirmDelete}
                                    title='Delete Listing'
                                    message='Are you sure you want to delete this listing?'
                                />
                            </Container>

                        </div>
                        <div>
                            <Container fluid>
                                {isLoading && bookingShimmer()}
                                {error &&
                                    <div>
                                        <h4 className='bh1 d-flex justify-content-center fs-1 mt-3'>Bookings</h4>
                                        <Alert key='danger' variant='danger' className='d-flex justify-content-center'>
                                            No Bookings Found for {data?.user?.name}.
                                        </Alert>
                                    </div>
                                }
                                {data && data?.bookings.length > 0 && (
                                    <Row className='placeorder-screen mt-4'>
                                        <Col md={12}>
                                            <h4 className='bh1 d-flex justify-content-center fs-1'>Bookings</h4>

                                            <Table striped hover responsive bordered className='table-lg'>

                                                <thead>
                                                    <tr>
                                                        <th className='posSpan1'>Check In</th>
                                                        <th className='posSpan1'>Paid On</th>
                                                        <th className='posSpan1'>Total Price</th>
                                                        <th className='posSpan1'>Created On</th>
                                                        <th className='posSpan1'>Phone Number</th>
                                                        <th className='posSpan1'>View</th>
                                                        <th className='listHeading'>Delete</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data && data?.bookings?.map((booking, index) => (
                                                        <tr key={index}>
                                                            <td className='posSpan2'>{booking?.checkInDate?.slice(0, 10)}</td>
                                                            <td className='posSpan2'>{booking?.paymentStatus?.status !== 'completed' ? <span style={{ fontWeight: '500', color: 'red' }}>Not Paid</span> : <span style={{ fontWeight: '500', color: '#32d100' }}>{formatDate(booking?.paidAt)?.slice(0, formatDate(booking?.paidAt)?.length - 6)}</span>}</td>
                                                            <td className='posSpan2'>{formatPrice(booking?.totalPrice)}</td>
                                                            <td className='posSpan2'>{formatDate(booking?.createdAt)}</td>

                                                            <td className='posSpan2'>{booking?.phoneNumber}</td>

                                                            <td className='posSpan2 text-center'>
                                                                <Link to={`/booking/${booking?._id}`}>
                                                                    <Button variant="light" className="action-button" >
                                                                        <IoEyeSharp size={20} />
                                                                    </Button>
                                                                </Link>
                                                            </td>


                                                            <td className='text-center listText'>
                                                                <Button
                                                                    variant="light"
                                                                    className="action-button"
                                                                    onClick={() => handleDeleteBooking(booking?._id)}
                                                                    disabled={loadingReviews[booking?._id]}
                                                                >
                                                                    {!loadingReviews[booking?._id] ? <ImBin size={20} /> : <div className='deleteButtonDangerLoader'><Loader width={'26px'} height={'26px'} border= {'2.4px solid #f8f9fa'} borderColor={'black transparent transparent transparent'}/></div>}
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </Col>
                                    </Row>
                                )}
                                {data && data?.bookings?.length === 0 && (
                                    <div>
                                        <h4 className='bh1 d-flex justify-content-center fs-1 mt-3'>Bookings</h4>
                                        <Alert key='primary' variant='primary' className='d-flex justify-content-center'>
                                            No Bookings Found for {data?.user?.name}.
                                        </Alert>
                                    </div>
                                )}
                                <ConfirmationDialog
                                    show={showDeleteConfirmation}
                                    onClose={() => setShowDeleteConfirmation(false)}
                                    onConfirm={handleConfirmationDelete}
                                    title={confirmationDialogTitle}
                                    message={confirmationDialogMessage}
                                />
                            </Container>
                        </div>
                    </Col>
                </Row>
            )}
        </Container>
    );
};

export default SingleUserDetail;