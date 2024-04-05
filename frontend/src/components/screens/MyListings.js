import React, { useEffect, useState } from 'react';
import '../styles/MyListings.css';
import { Table, Button, Alert, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDeleteSingleHouseUserMutation, useGetHouseListingForUserQuery } from '../../slices/HouseSlice';
import { ImBin } from "react-icons/im";
import { IoEyeSharp } from "react-icons/io5";
import { GrDocumentUpdate } from "react-icons/gr";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ConfirmationDialog from '../ConfirmationDialog'; // Import ConfirmationDialog
import { IoLogoGooglePlaystore } from "react-icons/io5";
import { formatDate } from '../reusable/FormatDate';
import listingShimmer from '../Shimmer/listingShimmer';

const MyListings = () => {
    const {userInfo} = useSelector((state) => state?.authSlice);
    let { data, error, isLoading, refetch } = useGetHouseListingForUserQuery({ userId: userInfo?._id });

    const [deleteSingleHouse] = useDeleteSingleHouseUserMutation();
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [houseToDelete, setHouseToDelete] = useState(null);

    const [isPageMyListing, setIsPageMyListing] = useState(true);

    const handleDelete = (id, userId) => {
        if (userInfo?.role === 'user' && userInfo?._id !== userId) {
            toast.warning('Warning!! unauthorized attempt');
            return;
        }

        setHouseToDelete({ id, userId });
        setShowDeleteConfirmation(true);
    };
    let loadingToastId;
    const confirmDelete = async () => {
        try {
            loadingToastId = toast.loading("Deleting listing. Please wait");
            await deleteSingleHouse(houseToDelete?.id).unwrap();
            toast.dismiss(loadingToastId);
            toast.success('Listing Successfully Deleted');
            refetch();
            setShowDeleteConfirmation(false);
        } catch (error) {
            toast.dismiss(loadingToastId);
            toast.error('Error while deleting house. ', error);
            setShowDeleteConfirmation(false);
        }
    };

    useEffect(() => {
        const url = window?.location?.href;
        setIsPageMyListing(url?.includes('my-listings') ? true : false);
    }, []);

    return (
        <Container fluid className={isPageMyListing ? 'my-4' : 'mb-4'}>
            {isLoading && listingShimmer()}
            {error && 
                <div>
                <h4 className='listingH1 d-flex justify-content-center fs-1 mt-3 animationDownToUp'>My Listings</h4>
                <Alert key='danger' variant='danger' className='d-flex justify-content-center'>
                    No Bookings Found
                </Alert>
            </div>
            }
            {!isLoading && <h1 className='listingH1 animationDownToUp'>My Listings</h1>}
            <div className="my-listings-container">
                {data && data?.houses?.length > 0 && (
                    <Table striped bordered hover responsive className=''>
                        <thead>
                            <tr>
                                <th className='cartHeading'>{isPageMyListing ? "Index":"No."}</th>
                                <th className='listHeading'>Location</th>
                                <th className='listHeading'>Category</th>
                                {isPageMyListing && <th className='listHeading'>Construction Status</th>}
                                <th className='listHeading'>Created</th>
                                <th className='listHeading'>Updated</th>
                                <th className='listHeading'>Availability</th>
                                <th className='listHeading'>View</th>
                                {isPageMyListing && <th className='listHeading'>Update</th>}
                                {!isPageMyListing && <th className='listHeading'>Listed</th>}
                                {isPageMyListing && <th className='listHeading'>Delete</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {data?.houses?.map((house, index) => (
                                <tr key={house?._id}>
                                    <td className='text-center cartText'>{index + 1}.</td>
                                    <td className='listText'>{house?.title?.length > 16 ? `${house?.title?.slice(0, 16)}...` : house?.title}</td>
                                    <td className='listText'>{house?.category}</td>
                                    {isPageMyListing && <td className='listText'>{house?.constructionStatus}</td>}
                                    <td className='listText'>{formatDate(house?.created_at?.slice(0, 10))}</td>
                                    <td className='listText'>{formatDate(house?.updated_at?.slice(0, 10))}</td>
                                    <td className='listText'>{house?.available}</td>
                                    <td className='text-center listText'>
                                        <Link to={`/single-house-data/${house?._id}`}>
                                            <Button variant="light" className="action-button">
                                                <IoEyeSharp size={20} />
                                            </Button>
                                        </Link>
                                    </td>
                                    {isPageMyListing && <td className='text-center listText'>
                                        <Link to={`/update-house/${house?._id}`}>
                                            <Button variant="light" className="action-button">
                                                <GrDocumentUpdate size={20} />
                                            </Button>
                                        </Link>
                                    </td>}
                                    {!isPageMyListing && <td className='text-center listText'>
                                        <Link to='/my-listings'>
                                            <Button variant="light" className="action-button">
                                                <IoLogoGooglePlaystore size={20} />
                                            </Button>
                                        </Link>
                                    </td>}
                                    {isPageMyListing && (
                                        <td className='text-center listText'>
                                            <Button
                                                variant="light"
                                                className="action-button"
                                                onClick={() => handleDelete(house?._id, house?.user)}
                                            >
                                                <ImBin size={20} />
                                            </Button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
                {data && data?.houses?.length === 0 && (
                    <div>
                        <Alert key='primary' variant='primary' className='d-flex justify-content-center'>
                            No Listings Found
                        </Alert>
                    </div>
                )}
            </div>
            <ConfirmationDialog
                show={showDeleteConfirmation}
                onClose={() => setShowDeleteConfirmation(false)}
                onConfirm={confirmDelete}
                title='Delete House'
                message='Are you sure you want to delete this house?'
            />
        </Container>
    );
}

export default MyListings;