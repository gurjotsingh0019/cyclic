import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginUserMutation } from '../../slices/UserSlice';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../slices/AuthenticationSlice';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import Loader from '../Loader';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [data, { isLoading }] = useLoginUserMutation();
  const dispatch = useDispatch();
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await data({ email, password }).unwrap();
      toast.success('User Logged Successfully');
      dispatch(setUserInfo(response));
      navigate('/');
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <>
      <Container className="mt-5">
        <Row className="justify-content-center ">
          <Col md={6}>
          <h2 className="mb-4 text-center" style={{ fontFamily: 'cursive', fontSize:'4rem'}}>RentUP</h2>

            <Form>
              <div class="form-floating mb-4">
                <input
                  type="email"
                  placeholder="Enter email"
                  class="form-control inputRightShadow"
                  id="floatingInputPrice"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label for="floatingInputPrice">Enter your email</label>
              </div>
              <div className='d-flex '>
              <div class="form-floating mb-4" style={password.length > 0 ? {width:'90%'} : {width:'100%'}}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  class="form-control inputRightShadow"
                  id="floatingInputPrice"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  style={password.length > 0 ? {borderRight:'0px', borderTopRightRadius: '0', borderBottomRightRadius: '0'} : {}}
                />
                
                <label for="floatingInputPrice">Enter your password</label>
                
              </div>
              {password.length > 0 &&
              <div className="d-flex align-items-center justify-content-center passwordRightShadow"  onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer', width:'10%', height:'58px',  border:'1px solid rgba(13,110,253,.5)', borderTopRightRadius: '5px', borderBottomRightRadius: '5px', borderLeft:'0px'}}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </div>
              }
              </div>

              <Button variant="primary" disabled={isLoading} onClick={handleLogin} className="mb-3 w-100 d-flex justify-content-center align-items-center rounded-5 posButton" block>
                <div className='d-flex align-items-center'>
                {isLoading ? <Loader width={'26px'} height={'26px'} border= {'3px solid #0d6efd'} borderColor={'white transparent transparent transparent'}/> : 'Login'}
                </div>
              </Button>
              {/* borderColor={'red transparent transparent transparent !important'} */}
              <Row className="justify-content-center">
                <Col className="text-center">
                  <p>Don't have an account? <span className="text-primary" style={{ cursor: 'pointer' }}>
                    <Link to='/register-user'>Register</Link></span></p>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default LoginScreen