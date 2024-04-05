import React, { useState } from 'react';
import '../styles/MyListings.css';
import { Table, Button, Alert, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDeleteSingleHouseAdminMutation, useGetAllHousesDataAdminQuery } from '../../slices/HouseSlice';
import { ImBin } from "react-icons/im";
import { IoEyeSharp } from "react-icons/io5";
import { GrDocumentUpdate } from "react-icons/gr";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ConfirmationDialog from '../ConfirmationDialog'; // Import ConfirmationDialog
import Loader from '../Loader';
import { formatDate } from '../reusable/FormatDate';
import LoaderRipple from '../reusable/LoaderRipple';

const GetAllListings = () => {
  const { data, error, isLoading, refetch } = useGetAllHousesDataAdminQuery();
  const { userInfo } = useSelector((state) => state.authSlice);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State for delete confirmation
  const [houseToDelete, setHouseToDelete] = useState(null);
  const [deleteSingleHouseAdmin] = useDeleteSingleHouseAdminMutation();
  const [loadingReviews, setLoadingReviews] = useState({});

  const handleDelete = (id, userId) => {
    if (userInfo?.role === "admin") {
      setHouseToDelete({ id, userId });
      setShowDeleteConfirmation(true);
    }
  };
  let loadingToastId;
  const confirmDelete = async () => {
    try {
      setLoadingReviews((prevState) => ({
        ...prevState,
        [houseToDelete?.id]: true,
      }));
      loadingToastId = toast.loading("Deleting listing. Please wait");
      await deleteSingleHouseAdmin(houseToDelete?.id).unwrap();
      toast.dismiss(loadingToastId);
      toast.success('House Successfully Deleted');
      refetch();
      setShowDeleteConfirmation(false); // Close the confirmation dialog after successful delete
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error('Error while deleting house. ' + error); // Concatenate the error message
      setShowDeleteConfirmation(false); // Close the confirmation dialog on error
    } finally {
      toast.dismiss(loadingToastId);
      setLoadingReviews((prevState) => ({
        ...prevState,
        [houseToDelete?.id]: false,
      }));
    }
  };
  
  return (
    <Container fluid className='my-4'>
      <h1 className='listingH1 animationDownToUp'>All Property Listings</h1>
      {isLoading && <LoaderRipple />}
      {error && <Alert variant="danger">Error while loading listings</Alert>}
      <div className="my-listings-container">
        {data?.houses?.length ? (
          <Table striped bordered hover responsive className=''>
            <thead>
              <tr>
                <th className="align-middle posSpan1">Index</th>
                <th className='listHeading'>Construction Status</th>
                <th className='listHeading'>Location</th>
                <th className='listHeading'>Category</th>
                <th className='listHeading'>Created</th>
                <th className='listHeading'>Updated</th>
                <th className='listHeading'>Availability</th>
                <th className='listHeading'>View</th>
                <th className='listHeading'>Update</th>
                <th className='listHeading'>Delete</th>
              </tr>
            </thead>
            <tbody>
              {data && data?.houses?.map((house, index) => (
                <tr key={house?._id}>
                  <td className='text-center cartText'>{index + 1}.</td>
                  <td className='listText'>{house?.constructionStatus}</td>
                  <td className='listText'>{house?.title.length > 16 ? `${house?.title.slice(0, 16)}...` : house?.title}</td>
                  <td className='listText'>{house?.category}</td>
                  <td className='listText'>{formatDate(house?.created_at)}</td>
                  <td className='listText'>{formatDate(house?.updated_at)}</td>
                  <td className='listText'>{house?.available === 'True' ? <span style={{color:'#32d100'}}>True</span> : <span style={{color:'red'}}>False</span> }</td>
                  <td className='text-center listText'>
                    <Link to={`/single-house-data/${house?._id}`}>
                      <Button variant="light" className="action-button">
                        <IoEyeSharp size={20} />
                      </Button>
                    </Link>
                  </td>
                  <td className='text-center listText'>
                    <Link to={`/admin/update-house/${house?._id}`}>
                      <Button variant="light" className="action-button">
                        <GrDocumentUpdate size={20} />
                      </Button>
                    </Link>
                  </td>
                  <td className='text-center listText'>
                    <Button
                      variant="danger"
                      className="action-button"
                      onClick={() => handleDelete(house?._id, house?.user)}
                      disabled={loadingReviews[house?._id]}
                    >
                      {!loadingReviews[house?._id] ? <ImBin size={20} /> : <div className='deleteButtonDangerLoader'><Loader width={'26px'} height={'26px'} border= {'2.4px solid #dc3545'} borderColor={'white transparent transparent transparent'}/></div>}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Alert variant="primary text-center">
            No listings found.
          </Alert>
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
  )
}

export default GetAllListings