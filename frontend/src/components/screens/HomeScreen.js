import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HouseDashboard from '../HouseDashboard';
import '../styles/homescreen.css';
import { Button, Card, Carousel, Col, Container, Placeholder, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import logo from '../../images/logo.png';
import { IoIosArrowRoundDown } from "react-icons/io";
import { useGetNewly6PropertiesQuery } from '../../slices/HouseSlice';
import { formatDate } from '../reusable/FormatDate';
import GetDominantColor from '../reusable/GetDominantColor';
import { SiActivitypub } from "react-icons/si";
import { RxCross1 } from "react-icons/rx";

const houseItems = [
  { title: 'Furnished', imageSrc: 'https://res.cloudinary.com/dza9mvxzu/image/upload/v1712256279/houses/nglpwfi0kfkznebefyvd.webp' },
  { title: 'Semifurnished', imageSrc: 'https://res.cloudinary.com/dza9mvxzu/image/upload/v1712256277/houses/pgcq7qeryyhgjfuxw1ka.webp' },
  { title: 'Unfurnished', imageSrc: 'https://res.cloudinary.com/dza9mvxzu/image/upload/v1712256278/houses/wuwf1hjlfrogkwwlzpkv.webp' },
];

const HomeScreen = () => {
  const [userInfo] = useSelector((state) => [state.authSlice.userInfo]);
  const search = window.location.href;
  const isSearchPresent = search.includes('search');
  const [scrollAmount, setScrollAmount] = useState(0);
  const [searchedItems, setSearchedItems] = useState([]);
  const [viewItems, setViewItems] = useState([]);
  const [favItems, setFavItems] = useState([]);
  const navigate = useNavigate();
  const [chunkSize, setChunkSize] = useState(3); // Default chunk size for laptop
  const [showUserInfo, setShowUserInfo] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 992) {
        setChunkSize(3); // for laptop
      } else if (width >= 768) {
        setChunkSize(2); // for tablet
      } else {
        setChunkSize(1); // for phones
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [window.innerWidth]);

  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array?.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };


  const { data, isLoading, error } = useGetNewly6PropertiesQuery();

  const handleScroll = () => {
    const scrollPixels = window.scrollY;
    setScrollAmount((scrollPixels) / 2.4);
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    const searchedData = localStorage.getItem("searchItems")
      ? JSON.parse(localStorage.getItem("searchItems"))
      : [];
    setSearchedItems(searchedData);

    const viewData = localStorage.getItem("view") ?
      JSON.parse(localStorage.getItem("view")) : [];
    setViewItems(viewData);

    const FavouriteData = localStorage.getItem("favourite") ?
      JSON.parse(localStorage.getItem("favourite")) : [];
    setFavItems(FavouriteData);
  }, []);

  const toggleUserInfo = () => {
    setShowUserInfo(!showUserInfo);
  };
  return (
    <>
      {!isSearchPresent ? (
        <>
          <div className='homescreenimage d-flex text-white' style={{ backgroundPosition: `50% -${scrollAmount}px` }}>
            <div className='d-flex align-items-center w-50 text-center mx-auto pb-5 animationDownToUp'>
              <Col className='borderHeading'>
                {/* <h1 className='hsHeading'>The Simplest Way to Find Property</h1>
                <p className='hsPara'>Let us be your reliable guide as you go out on this thrilling journey to find your ideal home. We'll walk you through each step of this process with our all inclusive tools and professional guidance.</p> */}
                {/* <div className='d-flex justify-content-center mt-3 hsParaButtonDiv' onClick={() => { navigate('/search') }}><h1 className='my-auto me-3 hsParaButton'>Start Exploring Now</h1><BsBoxArrowRight size={50} color='black'/></div> */}
              </Col>
            </div>
          </div>
          <div class="mouse">
            <a href="#post-property" class="mouse-icon">
              <div class="mouse-wheel"><IoIosArrowRoundDown color='white' className='mouseUpDown' size={24} /></div>
            </a>
          </div>
          <Container fluid className='d-flex justify-content-center row mt-5'>
            <div className='col-sm-9'>
              <Container className="mb-2">
                <div className='text-center animationLeftToRight'>
                  <span className='hsheading4'>
                    Recently Posted Properties
                  </span>
                  <h1 className='hsHeading2'>Elite Property Collection</h1>
                </div>
                {isLoading || data?.houses?.images ?
                  <Row>
                    {chunkSize >= 1 && <Col lg={4}>
                      <Card className='hscard'>
                        <Placeholder className='rounded-1' variant="top" style={{ width: 'auto', height: '200px' }} />
                        <Card.Body>
                          <Placeholder as={Card.Title} animation="glow">
                            <Placeholder xs={6} />
                          </Placeholder>
                          <Placeholder as={Card.Text} animation="glow">
                            <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
                            <Placeholder xs={6} /> <Placeholder xs={8} />
                          </Placeholder>
                          <Placeholder.Button variant="primary" xs={6} />
                        </Card.Body>
                      </Card>
                    </Col>}

                    {chunkSize >= 2 && <Col lg={4}>
                      <Card className='hscard'>
                        <Placeholder className='rounded-1' variant="top" style={{ width: 'auto', height: '200px' }} />
                        <Card.Body>
                          <Placeholder as={Card.Title} animation="glow">
                            <Placeholder xs={6} />
                          </Placeholder>
                          <Placeholder as={Card.Text} animation="glow">
                            <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
                            <Placeholder xs={6} /> <Placeholder xs={8} />
                          </Placeholder>
                          <Placeholder.Button variant="primary" xs={6} />
                        </Card.Body>
                      </Card>
                    </Col>}
                    {chunkSize >= 3 && <Col lg={4}>
                      <Card className='hscard'>
                        <Placeholder className='rounded-1' variant="top" style={{ width: 'auto', height: '200px' }} />
                        <Card.Body>
                          <Placeholder as={Card.Title} animation="glow">
                            <Placeholder xs={6} />
                          </Placeholder>
                          <Placeholder as={Card.Text} animation="glow">
                            <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
                            <Placeholder xs={6} /> <Placeholder xs={8} />
                          </Placeholder>
                          <Placeholder.Button variant="primary" xs={6} />
                        </Card.Body>
                      </Card>
                    </Col>}
                  </Row>
                  :
                  <Carousel>
                    {chunkArray(data && data?.houses, chunkSize)?.map((chunk, index) => (
                      <Carousel.Item key={index}>
                        <Row>
                          {data && chunk?.map((item) => (
                            <Col lg={4} md={6} sm={12} key={item?._id}>
                              <Card className='hscard'>
                                <Card.Img className='' variant="top" src={item?.images[0]?.url} style={{ width: 'auto', height: '200px' }} />
                                <Card.Body className='hsCardBody'>
                                  <Card.Title>{item?.title?.length > 30 ? item?.title?.slice(0, 30) : item?.title}</Card.Title>
                                  <div className='hs6button'>
                                    <Card.Text style={{ fontSize: '13px' }}>Created On: {formatDate(item?.updated_at)}</Card.Text>
                                    <Button className='hsButton w-100' variant="primary" onClick={() => { navigate(`/single-house-data/${item?._id}`) }}>See Property</Button>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                }
              </Container>
              <Container className=''>
                <div className='text-center animationLeftToRight'>
                  <span className='hsheading4'>
                    Premium Property Showcase
                  </span>
                  <h1 className='hsHeading2'>Property Types</h1>
                </div>
                <Row>
                  {houseItems?.map((item, itemIndex) => (
                    <Col lg={4} key={itemIndex}>
                      <Card className='mb-4'>
                        <Card.Img variant="top" src={item?.imageSrc} />
                        <Card.Body>
                          <Card.Title>{item?.title}</Card.Title>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Container>
            </div>


            {chunkSize > 2 && <div className='col-md-3'>
              <div className='shdCard'>
                <Card className='rounded-0 shadow border-0'>
                  <Card.Body>
                    <div className='d-flex align-items-center'>
                      <GetDominantColor imageUrl={userInfo?.avatar?.url || logo}>
                        {(backgroundColor) => (
                          <img
                            className='user-image mx-2'
                            src={userInfo?.avatar?.url || logo}
                            style={{ backgroundColor: backgroundColor }}
                            alt='User Avatar'
                          />
                        )}
                      </GetDominantColor>
                      {/* <img className='user-image mx-2' src={userInfo?.avatar?.url || logo} alt="User Avatar" /> */}
                      {userInfo && userInfo?.name}
                    </div>
                    <hr className='shdCardSpan' />
                    <Card.Text className="shdCardText shdCardTextSize"><span>{searchedItems?.length}</span> <span className=' fs-6'> ➢ Searched Properties</span></Card.Text>
                    <Card.Text className="shdCardText shdCardTextSize"><span>{viewItems?.length}</span> <span className=' fs-6'> ➢ Viewed Properties</span></Card.Text>
                    <Card.Text className="shdCardText shdCardTextSize"><span>{favItems?.length}</span> <span className=' fs-6'> ➢ Favourites Properties</span></Card.Text>
                    <Button className='w-75 rounded-2 text-white posButton shinyButton mt-3' style={{ backgroundColor: '#004f90', borderColor: 'white' }} onClick={() => { navigate('/my-activity') }}>See My Activity</Button>
                  </Card.Body>
                </Card>
              </div>
            </div>}
          </Container>
          <Container className="d-flex justify-content-between sell-property-card my-5 picture" id='post-property'>
            <div>
              <div className="subdued-caption">SELL OR RENT YOUR PROPERTY</div>
              <div className="large-title">Register to post your property for</div>
              <div className="free-nudge">
                <div className="shimmer">
                  <div className="free-label mb-2">FREE</div>
                </div>
              </div>
              <div className="large-body mb-2">Post your residential / commercial property</div>
              <div className="spacer32"></div>
              <Button variant="primary" className="posButton large-button shinyButton" onClick={() => { navigate('/create-house') }} data-sstheme="_BUTTON_TOP_LEVEL">
                Post your property for FREE
              </Button>

            </div>
            <div className=''>
              <picture>
                <img
                  src="https://images.pexels.com/photos/5428994/pexels-photo-5428994.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="rentup"
                  className='hsLastImage'
                />
              </picture>
            </div>
          </Container>
          {chunkSize <= 2 &&
            <>
              <Button
                className='rounded-5 text-white posButton shinyButton mt-3'
                style={{ backgroundColor: '#004f90', borderColor: 'white', right: '0', bottom: '0', position: 'fixed', margin: '0 5px 5px 0' }}
                onClick={toggleUserInfo}
              >
                <SiActivitypub size={22} />
              </Button>

              {showUserInfo && (
                <div className='' style={{ position: 'fixed', right: '0', bottom: '0', position: 'fixed', margin: '0 5px 4rem 0', zIndex:'1000' }}>
                  <Card className='rounded-0 shadow border-0'>
                    <Card.Body>
                      <div className='d-flex align-items-center justify-content-between'>
                        <span>
                        <img
                          className='user-image mx-2'
                          src={userInfo?.avatar?.url || logo}
                          alt='User Avatar'
                        />
                        {userInfo && userInfo?.name}
                        </span>
                        <span className='close-btn' style={{cursor:'pointer'}} onClick={toggleUserInfo}><RxCross1 /></span>
                      </div>
                      <hr className='shdCardSpan' />
                      <Card.Text className="shdCardText shdCardTextSize"><span>{searchedItems?.length}</span> <span className=' fs-6'> ➢ Searched Properties</span></Card.Text>
                      <Card.Text className="shdCardText shdCardTextSize"><span>{viewItems?.length}</span> <span className=' fs-6'> ➢ Viewed Properties</span></Card.Text>
                      <Card.Text className="shdCardText shdCardTextSize"><span>{favItems?.length}</span> <span className=' fs-6'> ➢ Favourites Properties</span></Card.Text>
                      <Button className='w-75 rounded-2 text-white posButton shinyButton mt-3' style={{ backgroundColor: '#004f90', borderColor: 'white' }} onClick={() => { navigate('/my-activity') }}>See My Activity</Button>
                    </Card.Body>
                  </Card>
                </div>
              )}
            </>
          }
        </>
      ) : (
        <HouseDashboard />
      )}
    </>
  );
};
export default HomeScreen;