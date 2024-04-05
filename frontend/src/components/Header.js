import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { CiSearch } from 'react-icons/ci';
import Search from './reusable/search'
import { useDispatch, useSelector } from 'react-redux';
import { updateToggleSearch, updateViewAt } from '../slices/basicDataSlice';
import { LinkContainer } from 'react-router-bootstrap'
import { logout } from '../slices/AuthenticationSlice';
import { toast } from 'react-toastify';
import { useLogoutUserMutation } from '../slices/UserSlice';
import { useNavigate } from 'react-router-dom';
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import './styles/header.css'
import OffCanvas from './SideBar';
import logo from '../images/logo.png'
import GetDominantColor from './reusable/GetDominantColor';

const Header = () => {
  const dispatch = useDispatch();
  const [isLessThan1000, setIsLessThan1000] = useState(window.innerWidth <= 1000);
  const [isLessThan780, setIsLessThan780] = useState(window.innerWidth <= 780);
  const toggle = useSelector((state) => state.basicData.toggleSearch)
  const toggleSearch = () => {
    dispatch(updateToggleSearch());
  };
  const { userInfo } = useSelector((state) => state.authSlice);
  const [loggingOut] = useLogoutUserMutation();
  const navigate = useNavigate();
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
  const userImageInfoStyle = {
    display: 'none',
    height: 'auto',
  }
  useEffect(() => {
    const handleResize = () => {
      setIsLessThan1000(window.innerWidth <= 1000);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsLessThan780(window.innerWidth <= 780);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
    {!isLessThan1000 ? 
      <header className="navbar navbar-expand-lg bd-navbar sticky-top top-0 py-0">
        <Navbar expand="lg" className="w-100 navbar-expanded">
          <Container >
            <LinkContainer to='/'>
              <Navbar.Brand className='Navbar-Brand '>RentUP</Navbar.Brand>
            </LinkContainer>
            <div className="navbarcollapse">
              <Nav className="ms-auto">
                <span
                  type="button"
                  className="border border-light border-1 rounded-1 nav-search"
                  onClick={toggleSearch}
                >
                  <div className='d-flex align-items-center mt-2 justify-content-between'>
                    <div className='d-flex align-items-center'><FaLocationDot size={22} className='mx-2' />
                      <span className="">Enter Locality / Landmark / City</span></div>
                    <CiSearch color='' size={28} className="me-3 ms-3 border-start" />
                  </div>
                </span>
              </Nav>
              <Nav className="ms-auto">
                <>
                  <div className='col'>
                    <div className='user-info-container'>
                      <div className='user-image-div d-flex'>
                        <GetDominantColor imageUrl={userInfo?.avatar?.url || logo}>
                          {(backgroundColor) => (
                            <img
                              className='user-image'
                              src={userInfo?.avatar?.url || logo}
                              style={{ backgroundColor: backgroundColor }}
                              alt='ui'
                            />
                          )}
                        </GetDominantColor>
                        <MdKeyboardArrowDown className='mt-2' color='white' />
                      </div>


                      <div className='user-image-info position-fixed rounded-2' style={{ display: 'none' }}>
                        <div className='user-image-infoinner rounded-2 z-0 p-2' style={userImageInfoStyle}>
                          {userInfo ? <h5>{userInfo?.name}</h5> :

                            <LinkContainer to='/login-user'>
                              <Nav.Link className=''>Login / Register</Nav.Link>
                            </LinkContainer>
                          }

                          {userInfo?.role === "admin" &&
                            <>
                              <p className='pt-2'>Admin</p>
                              <LinkContainer to='/admin/get-all-users'>
                                <Nav.Link className='linkContainer'>All User Data</Nav.Link>
                              </LinkContainer>
                              <LinkContainer to='/admin/all-listings'>
                                <Nav.Link className='linkContainer'>All House Listings</Nav.Link>
                              </LinkContainer>
                              <LinkContainer className='mb-2' to='/admin/all-bookings'>
                                <Nav.Link className='linkContainer'>All House Bookings</Nav.Link>
                              </LinkContainer>
                            </>
                          }

                          <LinkContainer to='/my-activity'>
                            <p>My Activity</p>
                          </LinkContainer>
                          <LinkContainer to='/my-activity'>
                            <Nav.Link className='linkContainer' onClick={() => { dispatch(updateViewAt('recent')) }}>Recently Searched</Nav.Link>
                          </LinkContainer>
                          <LinkContainer to='/my-activity'>
                            <Nav.Link className='linkContainer' onClick={() => { dispatch(updateViewAt('viewed')) }}>Recently Viewed</Nav.Link>
                          </LinkContainer>
                          <LinkContainer to='/my-activity'>
                            <Nav.Link className='linkContainer' onClick={() => { dispatch(updateViewAt('favorites')) }}>My Favourites</Nav.Link>
                          </LinkContainer>
                          {userInfo &&
                            <>
                              <p className='pt-2'>My RentUP</p>
                              <LinkContainer to='/my-information'>
                                <Nav.Link className='linkContainer'>Modify Profile</Nav.Link>
                              </LinkContainer>
                              <LinkContainer to='/dwell-deck'>
                                <Nav.Link className='linkContainer'>My Dwell Deck</Nav.Link>
                              </LinkContainer>
                              <LinkContainer to='/my-bookings'>
                                <Nav.Link className='linkContainer'>Manage My Bookings</Nav.Link>
                              </LinkContainer>
                              <LinkContainer to='/my-listings'>
                                <Nav.Link className='linkContainer'>Manage My Listings</Nav.Link>
                              </LinkContainer>
                              <LinkContainer to='/my-information'>
                                <Nav.Link className='linkContainer'>Change Password</Nav.Link>
                              </LinkContainer>
                              <span className='linkContainer ms-2' onClick={handleLogout}>Logout</span>
                              <div style={{ marginBottom: '1.5rem' }}></div>
                            </>
                          }
                        </div>
                      </div>
                    </div>
                  </div>

                  <OffCanvas userInfo={userInfo} />

                </>
              </Nav>
            </div>
          </Container>
        </Navbar>

      </header>:
      <header className="navbar navbar-expand-lg bd-navbar sticky-top top-0 py-0">
      <Navbar expand="lg" className="w-100 navbar-expanded">
          <div className='navbar-expan-sm'>
            <LinkContainer to='/'>
              <Navbar.Brand className='Navbar-Brand'>RentUP</Navbar.Brand>
            </LinkContainer>
            <div className="navbarcollapse" style={{display:'contents'}}>
              <Nav className="ms-auto">
                <span
                  type="button"
                  className="border border-light border-1 rounded-1 nav-search"
                  onClick={toggleSearch}
                >
                  <div className='d-flex align-items-center mt-2 justify-content-between text-black'>
                    {!isLessThan780 ? 
                    <>
                    <div className='d-flex align-items-center'><FaLocationDot size={22} className='mx-2' />
                      <span className="">Enter Landmark / City</span></div>
                      <CiSearch color='' size={26} className="me-2 ms-1 border-start" />
                    </>
                      :
                      <div className='d-flex align-items-center'>
                        <FaLocationDot size={22} className='mx-2 mb-2' />
                      <span style={{height:'2rem', overflow:'hidden', margin:'2px 0 0 0'}}>Search...</span></div>
                      
                    }  
                    
                  </div>
                </span>
              </Nav>
              <Nav className="ms-auto">
                  <OffCanvas userInfo={userInfo} />
              </Nav>
            </div>
          </div>
        </Navbar>
      </header>
}
      {toggle && (
        <Search />
      )}
    </>
  );
};

export default Header;