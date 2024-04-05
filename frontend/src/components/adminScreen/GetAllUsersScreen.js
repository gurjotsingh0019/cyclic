import React, { useState, useEffect } from 'react';
import { useDeleteSingleUserMutation, useGetAllUsersQuery, useUpdateUserRoleMutation } from '../../slices/AdminSlice';
import { Button, Table, Alert } from 'react-bootstrap';
import Loader from '../Loader';
import { toast } from 'react-toastify';
import ConfirmationDialog from '../ConfirmationDialog';
import { formatDate } from '../reusable/FormatDate';
import { ImBin } from 'react-icons/im';
import { GrDocumentStore } from "react-icons/gr";
import { useNavigate } from 'react-router-dom';
import LoaderRipple from '../reusable/LoaderRipple';

const GetAllUsersScreen = () => {
    const { data, isLoading, error, refetch } = useGetAllUsersQuery();
    const [deleting] = useDeleteSingleUserMutation();
    const [updating] = useUpdateUserRoleMutation();
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showUpdateConfirmation, setShowUpdateConfirmation] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [userToUpdate, setUserToUpdate] = useState(null);
    const [userBackgroundColors, setUserBackgroundColors] = useState({}); 
    const [loadingReviews, setLoadingReviews] = useState({});

    async function handleDelete(userId) {
        setUserToDelete(userId);
        setShowDeleteConfirmation(true);
    }

    async function handleUpdate(user) {
        setUserToUpdate(user);
        setShowUpdateConfirmation(true);
    }
    let loadingToastId;
    const confirmDelete = async () => {
        try {
            setLoadingReviews((prevState) => ({
                ...prevState,
                [userToDelete]: true,
              }));
            loadingToastId = toast.loading("Deleting User. Please wait");
            await deleting(userToDelete).unwrap();
            toast.dismiss(loadingToastId);
            setShowDeleteConfirmation(false);
            toast.success('User Successfully Deleted');
            refetch();
        } catch (error) {
            toast.dismiss(loadingToastId);
            setShowDeleteConfirmation(false);
            toast.error('Error deleting user:', error);
        }
        finally {
            toast.dismiss(loadingToastId);
            setLoadingReviews((prevState) => ({
              ...prevState,
              [userToDelete]: false,
            }));
        }
    };

    const confirmUpdate = async () => {
        const userData = {
            email: userToUpdate?.email,
            name: userToUpdate?.name,
            role: userToUpdate?.role === 'user' ? 'admin' : 'user',
            id: userToUpdate?._id,
        };
        try {
            await updating(userData).unwrap();
            toast.success('User Updated Successfully');
            refetch();
        } catch (error) {
            toast.error('Error while updating user');
        }
    };

    const navigate = useNavigate();

    function handleUserProfileDetail(id) {
        navigate(`/admin/user-details/${id}`);
    }

    // Function to extract dominant color from the image
    const getDominantColor = async (imageUrl) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = imageUrl;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, img.width, img.height);
                const pixels = imageData.data;
                const numPixels = pixels.length;
                let r = 0, g = 0, b = 0;
                for (let i = 0; i < numPixels; i += 4) {
                    r += pixels[i];
                    g += pixels[i + 1];
                    b += pixels[i + 2];
                }
                r = Math.floor(r / (numPixels / 4));
                g = Math.floor(g / (numPixels / 4));
                b = Math.floor(b / (numPixels / 4));
                resolve(`rgb(${r}, ${g}, ${b})`);
            };
            img.onerror = () => {
                reject(new Error('Image loading failed'));
            };
        });
    };

    useEffect(() => {
        if (data && data?.users) {
            data?.users?.forEach(async (user) => {
                const backgroundColor = await getDominantColor(user?.avatar?.url);
                setUserBackgroundColors(prevState => ({ ...prevState, [user?._id]: backgroundColor }));
            });
        }
    }, [data]);
    return (
        <div className="container">
            <h4 className='bh1 d-flex justify-content-center fs-1 mt-4 animationDownToUp'>All Users Data</h4>
            {isLoading && <LoaderRipple />}
            {error && <Alert variant="danger">Error while loading users</Alert>}
            {data && (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th className="align-middle posSpan1">Index</th>
                            <th className="align-middle posSpan1">Profile</th>
                            <th className="align-middle posSpan1">Name</th>
                            <th className="align-middle posSpan1">Email</th>
                            <th className="align-middle posSpan1">Role</th>
                            <th className="align-middle posSpan1">Joined On</th>
                            <th className="align-middle posSpan1">Update User Role</th>
                            <th className="align-middle posSpan1">User Details</th>
                            <th className="align-middle posSpan1">Delete User</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.users?.map((user, index) => (
                            <tr key={user?._id}>
                                <td className="align-middle text-center fs-5">{index + 1}.</td>
                                <td className="align-middle posSpan2">
                                        <img
                                            style={{ height: '3rem', width: '3rem', objectFit: 'contain', borderRadius: '50%', backgroundColor: userBackgroundColors[user?._id] }}
                                            src={user?.avatar?.url}
                                            alt='user-image'
                                        />
                                </td>
                                <td className="align-middle posSpan2">{user?.name}</td>
                                <td className="align-middle posSpan2">{user?.email}</td>
                                <td className="align-middle posSpan2">{user?.role === 'admin' ? <span style={{ fontWeight: '500', color: '#32d100' }}>Admin</span> : <span style={{ fontWeight: '500', color: 'red' }}>User</span>}</td>
                                <td className="align-middle posSpan2">{formatDate(user?.createdAt?.slice(0, 10))}</td>
                                <td className="align-middle posSpan2">
                                    <Button className='mx-1 posSpan2' variant='light' style={{ color: user?.role === 'admin' ? 'red' : '#32d100', fontWeight: '500' }}
                                        onClick={() => handleUpdate(user)}>
                                        Update Role to {user?.role === 'user' ? 'Admin' : 'User'}
                                    </Button>

                                </td>
                                <td className="align-middle  text-center posSpan2">
                                    <Button variant="light" onClick={() => handleUserProfileDetail(user?._id)}>
                                        <GrDocumentStore color='red' size={20} />
                                    </Button>

                                </td>
                                <td className="align-middle  text-center posSpan2">
                                    <Button variant="danger" onClick={() => handleDelete(user?._id)} disabled={loadingReviews[user?._id]}>
                                        {!loadingReviews[user?._id] ? <ImBin size={20} /> : <div className='deleteButtonDangerLoader'><Loader width={'26px'} height={'26px'} border= {'2.4px solid #dc3545'} borderColor={'white transparent transparent transparent'}/></div>}
                                    </Button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
            <ConfirmationDialog
                show={showDeleteConfirmation}
                onClose={() => setShowDeleteConfirmation(false)}
                onConfirm={confirmDelete}
                title="Delete User"
                message="Are you sure you want to delete this user?"
            />
            <ConfirmationDialog
                show={showUpdateConfirmation}
                onClose={() => setShowUpdateConfirmation(false)}
                onConfirm={confirmUpdate}
                title="Update User Role"
                message={`Are you sure you want to update ${userToUpdate ? userToUpdate?.name : ''}'s role?`}
            />
        </div>
    );
};

export default GetAllUsersScreen;
