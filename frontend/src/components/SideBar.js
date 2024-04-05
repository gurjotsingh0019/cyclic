import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { HiBars3CenterLeft } from "react-icons/hi2";
import Collapse from 'react-bootstrap/Collapse';
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { LinkContainer } from 'react-router-bootstrap';
import { Nav } from 'react-bootstrap';
import './styles/SideBar.css'
import { useLogoutUserMutation } from '../slices/UserSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../slices/AuthenticationSlice';
import GetDominantColor from './reusable/GetDominantColor';
import logo from '../images/logo.png'

function OffCanvas({ userInfo }) {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [loggingOut] = useLogoutUserMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const {userInfo} = useSelector((state) => state.authSlice);
  const handleLogout = async () => {
    try {
      await loggingOut().unwrap();
      toast.success('User Logged Out');
      dispatch(logout());
      navigate('/');
    }
    catch (error) {
      toast.error(error?.data?.message);
    }
  }
  return (
    <div className='cursor'>
      <HiBars3CenterLeft size={26} onClick={handleShow} color='white' className="mt-1 ms-2" />
      <Offcanvas show={show} onHide={handleClose} placement='end'>
        <Offcanvas.Header closeButton className='canvas-header'>
          {!userInfo ?
            <LinkContainer to='/login-user'>
              <Nav.Link className='ps-2' onClick={() => setShow(false)}>Login / Register</Nav.Link>
            </LinkContainer>
            :
            <div className='d-flex'>
              <div className='me-2'>
              <GetDominantColor imageUrl={userInfo?.avatar?.url || logo}>
                {(backgroundColor) => (
                  <img
                    className='user-imagi'
                    src={userInfo?.avatar?.url || logo}
                    style={{ backgroundColor: backgroundColor }}
                    alt='ui'
                  />
                )}
              </GetDominantColor>
              </div>
              <span
                onClick={() => setOpen(!open)}
                aria-controls="example-collapse-text"
                aria-expanded={open}
                className='d-flex align-items-center fs-5'
              >
                {<span className='fs-6 cp'>{userInfo && userInfo?.name}</span>}{open ? <IoIosArrowUp className='ms-1 cursor' /> : <IoIosArrowDown className='ms-1 cursor' />}
              </span>
            </div>
          }
        </Offcanvas.Header>
        <Offcanvas.Body>

          <Collapse in={open} className='sidelinkContainerHeads'>
            <div id="example-collapse-text" className=''>
              <div className='mb-1'>
                <LinkContainer to='/my-activity'>
                  <Nav.Link className=''><span className='sidelinkSpan'>Your Activity</span></Nav.Link>
                </LinkContainer>
              </div>
              <div className='mb-1'>
                <LinkContainer to='/my-information'>
                  <Nav.Link className=''><span className='sidelinkSpan'>Modify Profile</span></Nav.Link>
                </LinkContainer>
              </div>
              <div className='mb-1'>
                <LinkContainer to='/my-information'>
                  <Nav.Link className=''><span className='sidelinkSpan'>Change Password</span></Nav.Link>
                </LinkContainer>
              </div>
              <div className='mb-1'>
                <div onClick={handleLogout}>
                  <div className='pb-4'><span className='sidelinkSpan'>Logout</span></div>
                </div>
              </div>
            </div>
          </Collapse>
          <div className='pt-2'>
            <LinkContainer to='/create-house'>
              <div className='canvasBody border-bottom'>
                <span className='cp'>Post Property
                  <Button className='btn-success ppb rounded-1 shinyButton'>Free</Button>
                </span>
              </div>
            </LinkContainer>
            <div className='canvasBody border-bottom'>
              <LinkContainer className='cp' to='/my-listings'>
                <Nav.Link className='cbnavlink'>Manage My Listings</Nav.Link>
              </LinkContainer>
            </div>
            <div className='canvasBody border-bottom'>
              <LinkContainer className='cp' to='/my-bookings'>
                <Nav.Link className='cbnavlink'>Manage My Bookings</Nav.Link>
              </LinkContainer>
            </div>
            <div className='canvasBody border-bottom'>
              <LinkContainer className='cp' to='/dwell-deck'>
                <Nav.Link className='cbnavlink'>My Dwell Deck</Nav.Link>
              </LinkContainer>
            </div>
            {userInfo?.role === "user" && 
              <div className='canvasBody border-bottom'>
                <span className='cbnavlink' onClick={handleLogout}>Logout</span>
            </div>
            }
            {userInfo?.role === "admin" &&
              <>
                <div className='canvasBody border-bottom'>
                  <LinkContainer className='cp' to='/admin/get-all-users'>
                    <Nav.Link className='linkContainer'>All User Data</Nav.Link>
                  </LinkContainer>
                </div>
                <div className='canvasBody border-bottom'>
                  <LinkContainer className='cp' to='/admin/all-listings'>
                    <Nav.Link className='linkContainer'>All House Listings</Nav.Link>
                  </LinkContainer>
                </div>
                <div className='canvasBody border-bottom'>
                  <LinkContainer className='cp' to='/admin/all-bookings'>
                    <Nav.Link className='linkContainer'>All House Bookings</Nav.Link>
                  </LinkContainer>
                </div>
                <div className='canvasBody border-bottom'>
                  <span className='cbnavlink' onClick={handleLogout}>Logout</span>
                </div>
              </>
            }
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default OffCanvas;