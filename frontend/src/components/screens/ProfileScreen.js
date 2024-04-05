import React, { useState } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import '../styles/profileScreen.css';
import { useModifyNameEmailMutation, useModifyPasswordMutation } from '../../slices/UserSlice';
import { toast } from 'react-toastify';
import { setUserInfo } from '../../slices/AuthenticationSlice';
import MyListings from './MyListings';
import MyBookings from './MyBookings';
import Loader from '../Loader';

const ProfileScreen = () => {
  const { userInfo } = useSelector((state) => state.authSlice);
  const [name, setName] = useState(userInfo?.name);
  const [email, setEmail] = useState(userInfo?.email);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [userInormation] = useState(JSON.parse(localStorage.getItem('userInfo' || {})));
  const [nameEmail, { error: nameEmailError, isLoading: isNameEmailLoading }] = useModifyNameEmailMutation();
  const [updatePassword, { error: passwordError, isLoading: isPasswordLoading }] = useModifyPasswordMutation();
  const dispatch = useDispatch();

  const modifyProfile = async (e) => {
    e.preventDefault();

    if (name !== userInfo?.name || email !== userInfo?.email) {
      try {
        const response = await nameEmail({ name, email }).unwrap();
        dispatch(setUserInfo(response));
        toast.success('Information Updated Successfully');
      } catch (nameEmailError) {
        setEmail(userInormation?.email);
        if (nameEmailError?.data?.message === 'Duplicate email Entered') {
          toast.warning('User already exists.');
          return;
        }
        toast.error(nameEmailError?.data?.message);
      }
    }

    else if (oldPassword && newPassword && confirmPassword && newPassword === confirmPassword && newPassword?.length >= 8 && confirmPassword >= 8) {
      try {
        const response = await updatePassword({ oldPassword, newPassword, confirmPassword }).unwrap();
        toast.success('Password Changed Successfully');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } catch (passwordError) {
        toast.error(passwordError?.data?.message);
      }
    }

    else if (newPassword && confirmPassword && (newPassword?.length < 8 || confirmPassword?.length < 8)) {
      toast.warning('New Password should be more than 8 characters');
    }

    else {
      toast.warning('Enter Information Correctly');
    }
  };
  const newPasswordStyle = {
    color: newPassword?.length === 0 ? 'black' : (newPassword !== confirmPassword ? 'red' : 'rgb(0, 210, 0)')
  };

  const confirmPasswordStyle = {
    color: confirmPassword?.length === 0 ? 'black' : (newPassword !== confirmPassword ? 'red' : 'rgb(0, 210, 0)')
  };
  return (
    <>
      {nameEmailError && <Alert key='danger' variant='danger' className='d-flex justify-content-center'>
        Error while updating your name and email
      </Alert>}
      {passwordError && <Alert key='danger' variant='danger' className='d-flex justify-content-center'>
        Error while updating your password
      </Alert>}
      <Container className="mt-5">
        <Row className="">
          <Col md={4}>
            <div className='' style={{ position: 'sticky', top: '4rem' }}>
              <div>
                <div className='mb-4'>
                  <h1 className="profileH1">My Profile</h1>
                </div>
                <div className="mb-3">
                  <div className="form-floating mb-3">
                    <input type="text" className="form-control" id="floatingInputName" onChange={(e) => setName(e.target.value)} value={name} placeholder="Name" />
                    <label htmlFor="floatingInputName">Name</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input type="email" className="form-control" id="floatingInputEmail" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Email" />
                    <label htmlFor="floatingInputEmail">Email</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input type="password" className="form-control" id="floatingInputEmail" onChange={(e) => setOldPassword(e.target.value)} value={oldPassword} placeholder="Old Password" />
                    <label htmlFor="floatingInputEmail">Old Passoword</label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="password"
                      className="form-control"
                      id="floatingPassword"
                      onChange={(e) => setNewPassword(e.target.value)}
                      value={newPassword}
                      placeholder="New Password"
                    />
                    <label style={newPasswordStyle} htmlFor="floatingPassword">
                      New Password
                    </label>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="password"
                      className="form-control"
                      id="floatingConfirmPassword"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      value={confirmPassword}
                      placeholder="Confirm Password"
                    />
                    <label style={confirmPasswordStyle} htmlFor="floatingConfirmPassword">
                      Confirm Password
                    </label>
                  </div>
                  <Button variant='primary' className='w-100 d-flex justify-content-center align-items-center rounded-5 posButton' onClick={(e) => modifyProfile(e)}
                    disabled={
                      !(name !== userInfo?.name || email !== userInfo?.email) &&
                      !(oldPassword && newPassword && confirmPassword && newPassword === confirmPassword)
                      || isNameEmailLoading || isPasswordLoading
                    }
                  >
                    {isNameEmailLoading || isPasswordLoading ? <Loader width={'26px'} height={'26px'} border= {'3px solid #0d6efd'} borderColor={'white transparent transparent transparent'}/> : 'Modify Profile'}
                  </Button>
                </div>
              </div>
            </div>
          </Col>
          <Col>
            <div className='mb-5'>
              <MyListings />
            </div>
            <div>
              <MyBookings />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProfileScreen;