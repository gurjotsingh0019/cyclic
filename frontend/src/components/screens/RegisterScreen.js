import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRegisterUserMutation } from '../../slices/UserSlice';
import logo from '../../images/logo.png'
import '../../App.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import Loader from '../Loader';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState(logo);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, { isLoading, error }] = useRegisterUserMutation();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.warning('Enter all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.warning('Password does not match');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('image', image);

    try {
      const res = await data(formData).unwrap();
      toast.success('User Registered Successfully');
      navigate('/login-user');
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  const updateProfileDataChange = (e) => {
    if (e.target.name === "image") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImage(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <>
      {error && <Alert key='danger' variant='primary' className='d-flex justify-content-center'>
        Error while Registering User
      </Alert>}
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <h2 className="mb-4 text-center" style={{ fontFamily: 'cursive', fontSize: '4rem' }}>RentUP</h2>
            <Form encType="multipart/form-data">
              <div class="form-floating mb-4">
                <input
                  type="text"
                  placeholder="Enter your name"
                  class="form-control inputRightShadow"
                  id="floatingInputPrice"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <label for="floatingInputPrice">Enter your name</label>
              </div>
              <div class="form-floating mb-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  class="form-control inputRightShadow"
                  id="floatingInputPrice"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label for="floatingInputPrice">Enter your email</label>
              </div>
              <div className='d-flex '>
                <div class="form-floating mb-4" style={password.length > 0 ? { width: '90%' } : { width: '100%' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    class="form-control inputRightShadow"
                    id="floatingInputPrice"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={password.length > 0 ? { borderRight: '0px', borderTopRightRadius: '0', borderBottomRightRadius: '0' } : {}}
                  />

                  <label for="floatingInputPrice">Enter your password <span style={{ fontSize: '12px' }}>(min. 8 characters)</span></label>

                </div>
                {password.length > 0 &&
                  <div className="d-flex align-items-center justify-content-center passwordRightShadow" onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer', width: '10%', height: '58px', border: '1px solid rgba(13,110,253,.5)', borderTopRightRadius: '5px', borderBottomRightRadius: '5px', borderLeft: '0px' }}>
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </div>
                }
              </div>

              <div className='d-flex '>
                <div class="form-floating mb-4" style={confirmPassword.length > 0 ? { width: '90%' } : { width: '100%' }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    class="form-control inputRightShadow"
                    id="floatingInputPrice"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={confirmPassword.length > 0 ? { borderRight: '0px', borderTopRightRadius: '0', borderBottomRightRadius: '0' } : {}}
                  />

                  <label for="floatingInputPrice">Confirm your password</label>

                </div>
                {confirmPassword.length > 0 &&
                  <div className="d-flex align-items-center justify-content-center passwordRightShadow" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ cursor: 'pointer', width: '10%', height: '58px', border: '1px solid rgba(13,110,253,.5)', borderTopRightRadius: '5px', borderBottomRightRadius: '5px', borderLeft: '0px' }}>
                    {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                  </div>
                }
              </div>
              <div class="form-floating mb-4">
                <input
                  type="file"
                  class="form-control inputRightShadow"
                  id="floatingInputImages"
                  name="image"
                  accept="image/*"
                  required
                  onChange={updateProfileDataChange}
                />
                <label for="floatingInputImages">Upload your profile</label>
              </div>
              <Button variant="primary" disabled={isLoading} onClick={handleRegister} className="mb-3 w-100 d-flex justify-content-center align-items-center rounded-5 posButton" block>
                <div className='d-flex align-items-center'>
                {isLoading ? <Loader width={'26px'} height={'26px'} border= {'3px solid #0d6efd'} borderColor={'white transparent transparent transparent'}/> : 'Register'}
                </div>
              </Button>
              <Row className="justify-content-center">
                <Col className="text-center">
                  <p>Already have an account? <Link to="/login-user" className="text-primary">Login</Link></p>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default RegisterScreen;