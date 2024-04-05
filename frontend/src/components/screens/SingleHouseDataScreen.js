import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useGetSingleHouseDetailQuery, useCreatingReviewMutation, useDeleteReviewMutation } from '../../slices/HouseSlice';
import { Container, Row, Col, ListGroup, Button, Card, Alert, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../slices/CartSlice';
import '../styles/singleHouseData.css'
import Carousels from '../reusable/Carousel';
import { MdLocationOn } from "react-icons/md";
import { MdLibraryBooks } from "react-icons/md";
import { BsBank2 } from "react-icons/bs";
import { IoIosBed } from "react-icons/io";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { BsFillSignpostFill } from "react-icons/bs";
import { MdEventAvailable } from "react-icons/md";
import { TbHeartPlus } from "react-icons/tb";
import { FaHeartCirclePlus } from "react-icons/fa6";
import { formatPrice } from '../reusable/FormatPrice';
import { formatDate, formatReviewTime } from '../reusable/FormatDate';
import Loader from '../Loader';
import ReactStars from 'react-stars'
import { toast } from 'react-toastify';
import { ImBin } from "react-icons/im";
import { GoCodeReview } from "react-icons/go";
import emma from '../../images/emma.png';

const SingleHouseDataScreen = () => {
  //Add about if already present
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.authSlice);
  const cartItems = useSelector((state) => state.cartSlice.cartItems);

  const navigate = useNavigate();

  function addHouseToCart(houseData) {
    if (cartItems && cartItems?.some(item => item?._id === houseData?._id)) {
      toast.dark('Property already present in your Dwell Deck');
      return;
    }
    toast.success('Property added to dwell deck');
    dispatch(addToCart(houseData));
    navigate('/dwell-deck');
  }

  const { id } = useParams();
  const { data, isLoading: SingleHouseLoader, error: SingleHouseError, refetch } = useGetSingleHouseDetailQuery({ houseId: id });
  const { title, category, description, bhk, location, price, pincode, area, amenities, images, constructionStatus, postedBy, opProperty, available, created_at, updated_at, reviews, rating: ratingOfHouse } = data?.house || {
    images: [emma]
  };

  const [isHovered, setIsHovered] = useState(false);
  const [displayImage, setDisplayImage] = useState(emma);
  const [displayCarousel, setDisplayCarousel] = useState(false);

  function closeCarousel() {
    setDisplayCarousel(false);
  }

  useEffect(() => {
    setDisplayImage(images[0]?.url || emma);
  }, [data?.house?.images]);

  const addToFavourite = (house) => {
    // const houses = JSON.parse(localStorage.getItem('favourite')) || [];
    // const isPresentIndex = houses.findIndex((item) => item?._id === house._id);

    // if (isPresentIndex !== -1) {
    //   houses[isPresentIndex] = house;
    // } else {
    //   houses.push(house);
    // }
    // localStorage.setItem('favourite', JSON.stringify(houses));
    const items = JSON.parse(localStorage.getItem('favourite')) || [];

    if (Array.isArray(items)) {
      const isPresent = items.some((item) => item?._id === house?._id);

      if (!isPresent) {
        localStorage.setItem('favourite', JSON.stringify([...items, house]));
        toast.success('Property added to favorites');
      } else {
        toast.dark('Property is already present in your favourites');
      }
    } else {
      localStorage.setItem('favourite', JSON.stringify([house]));
      toast.success('Property added to favorites');
    }
  };

  const [creatingReview, { isLoading: loadingHouseReview, error: reviewError }] = useCreatingReviewMutation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitCount, setSubmitCount] = useState(0);
  const [submitDisabled, setSubmitDisabled] = useState(false);

  useEffect(() => {
    const storedCount = localStorage.getItem('reviewSubmitCount');
    if (storedCount) {
      setSubmitCount(parseInt(storedCount));
    }
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!rating || !comment) {
      toast.warning('Enter both the fields');
      return;
    }
    if (submitCount >= 5) {
      toast.warning('Too many requests. Please wait for a minute before submitting.');
      return;
    }

    try {
      await creatingReview({
        id,
        rating,
        comment,
      }).unwrap();

      refetch();
      setComment('');
      setRating(0);
      setShowSubmitButton(false);
      toast.success('Property reviewed successfully');

      const newSubmitCount = submitCount + 1;
      localStorage.setItem('reviewSubmitCount', newSubmitCount.toString());
      setSubmitCount(newSubmitCount);
      setSubmitDisabled(true);

      const setTime = setTimeout(() => {
        localStorage.removeItem('reviewSubmitCount');
        setSubmitCount(0);
        setSubmitDisabled(false);
      }, 60000);

      // Return a cleanup function to clear the timeout
      return () => clearTimeout(setTime);
    } catch (err) {
      toast.error('Error while reviewing property');
    }
  };
  const [deleteReviewAPI, { isLoading: loadingDeleteReview, error: reviewDeleteError }] = useDeleteReviewMutation();
  const [loadingReviews, setLoadingReviews] = useState({});
  const [showSubmitButton, setShowSubmitButton] = useState(false);

  const handleDeleteReview = async (houseId, reviewId) => {
    try {
      setLoadingReviews(prevState => ({
        ...prevState,
        [reviewId]: true
      }));

      // Display confirmation dialog
      const confirmation = window.confirm("Are you sure you want to delete this review?");
      if (!confirmation) {
        setLoadingReviews(prevState => ({
          ...prevState,
          [reviewId]: false
        }));
        return;
      }

      const response = await deleteReviewAPI({ houseId, reviewId }).unwrap();
      refetch();
      toast.success('Review deleted successfully');
    } catch (error) {
      toast.error('Error while deleting review');
    } finally {
      setLoadingReviews(prevState => ({
        ...prevState,
        [reviewId]: false
      }));
    }
  };

  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const [expandedReviews, setExpandedReviews] = useState([]);

  const toggleReview = (reviewId) => {
    setExpandedReviews((prevExpandedReviews) =>
      prevExpandedReviews?.includes(reviewId)
        ? prevExpandedReviews?.filter((id) => id !== reviewId)
        : [...prevExpandedReviews, reviewId]
    );
  };

  const isReviewExpanded = (reviewId) => expandedReviews?.includes(reviewId);

  return (
    <>
      {SingleHouseLoader && <Loader width="120px" height="120px" styleHeight="80vh" />}
      {SingleHouseError && <Alert key='danger' variant='primary' className='d-flex justify-content-center'>
        Error while loading house data
      </Alert>}
      {!SingleHouseLoader &&
        <>
          {displayCarousel ? <Carousels images={images} setDisplayCarousel={closeCarousel} /> :
            <>
              <Container className='row mx-auto mt-4'>
                <div className='col-md-8' onClick={() => setDisplayCarousel(true)}>
                  <div>
                    <img
                      className="d-block w-100 shdCarousel"
                      src={displayImage}
                      alt={`Slide ${images[0]?._id}`}
                    />
                  </div>
                  <div className='d-flex border shdCards'>
                    {images && images?.map((image, index) => (
                      <div className='border' key={index} style={{ opacity: displayImage === image?.url ? 1 : 0.5, display: index > 3 ? 'none' : 'block', maxHeight: '7.3rem' }}>
                        <img
                          className="w-100 shdImages"
                          src={image?.url}
                          alt={`Slide ${image?._id}`}
                          onMouseEnter={() => setDisplayImage(image?.url)}
                          style={{ maxHeight: '7.3rem', height: '-webkit-fill-available' }}
                        />
                      </div>
                    ))}
                    <div className='shdImages d-flex align-items-center' style={{ backgroundImage: images?.length >= 5 ? `url(${images[5]?.url})` : 'none', opacity: '0.5' }}>
                      <span className='ms-2 me-1'>View</span>
                      <span className='mx-1'>all</span>
                      <span className='ms-1 me-2'>photos+</span>
                    </div>
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className='shdCard'>
                    <Card className='rounded-0 shadow'>
                      <Card.Body>
                        <div className='d-flex justify-content-between'>
                          <Card.Title className='shdCardTitle'><span className='shdCardSpan'>In </span>{title}</Card.Title>
                          <Card.Title className='shdCardTitlePrice'><span className='shdCardSpan'>From</span>{formatPrice(price)}<span className='hdpFrom'>{opProperty?.toLowerCase() === 'rent' ? '/month' : ''}</span></Card.Title>
                        </div>
                        <hr className='shdCardSpan' />
                        <div
                          className='d-flex justify-content-between'
                        >
                          <Card.Text className="shdCardText">➢ {category}</Card.Text>
                          <div
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onClick={() => addToFavourite(data?.house)}
                          >
                            {isHovered ? (
                              <FaHeartCirclePlus size={22} color='red' className='heart' />
                            ) : (
                              <TbHeartPlus size={22} color='red' className='heart' />
                            )}
                          </div>
                        </div>
                        <Card.Text className="shdCardText">➢ {area}<span className='shdCardSpan'> Sq. ft area</span></Card.Text>
                        <Card.Text className="shdCardText"><span className='shdCardSpan'>Construction Status</span> ➢ {constructionStatus}</Card.Text>
                        <Card.Text className="shdCardText"><span className='shdCardSpan'>Pincode</span> ➢ {pincode}</Card.Text>
                        <Button className='w-100 rounded-0 text-white' variant="warning" onClick={() => addHouseToCart(data?.house)}>Add to Dwell Deck</Button>
                      </Card.Body>
                    </Card>
                  </div>
                </div>

              </Container>
              <Container>
                <div className='mx-2 my-5' style={{ width: '53rem' }}>
                  <h2 className='mb-4 bh1'>Property Details</h2>
                  <Card.Body>
                    <Card.Text><MdLocationOn size={24} /><span className='shdBcard'>Address  ➢ </span> <span className='shdBcardItems'>{location}</span></Card.Text>
                    <Card.Text>
                      <MdLibraryBooks size={22} />
                      <span className='shdBcard'>Description ➢ </span>
                      <span className='shdBcardItems' style={{ overflow: 'hidden' }}>
                        {showFullDescription ? (
                          <span>{description}</span>
                        ) : (
                          <span>
                            {description?.length > 400 ? `${description?.slice(0, 400)}` : description}
                          </span>
                        )}
                        {description?.length > 400 && (
                          <span style={{ cursor: 'pointer', marginLeft: '5px', color: 'grey' }} onClick={toggleDescription}>
                            {showFullDescription ? 'show less...' : 'show more.....'}
                          </span>
                        )}
                      </span>
                    </Card.Text>
                    <Card.Text><BsBank2 size={20} /> <span className='shdBcard'>Amenities  ➢ </span> <span className='shdBcardItems'> {amenities && amenities?.join(', ')}</span></Card.Text>
                    <Card.Text><IoIosBed size={22} /> <span className='shdBcard'>BHK  ➢ </span> <span className='shdBcardItems'> {bhk}</span></Card.Text>
                    <Card.Text><BsFillSignpostFill size={22} /> <span className='shdBcard'>Posted By  ➢ </span> <span className='shdBcardItems'> {postedBy}</span></Card.Text>
                    <Card.Text><MdEventAvailable size={22} /> <span className='shdBcard'>Available  ➢ </span> <span className='shdBcardItems'> {available}</span></Card.Text>
                    <Card.Text className='hdReviews d-flex align-items-center pt-0 mb-3'>
                      <span className='hdFw300'><GoCodeReview size={22} /></span>
                      <span className='shdBcard ms-1'>Rating ➢ </span>
                      <ReactStars
                        className='ms-2'
                        count={5}
                        value={ratingOfHouse}
                        size={20}
                        color2={'#ff5900'}
                        edit={false}
                        color1={'#c6c6c6'}
                      />
                    </Card.Text>
                    <div className='d-flex justify-content-between'>
                      <Card.Text><BsFillCalendarDateFill size={22} /> <span className='shdBcard'>Created At  ➢ </span> <span className='shdBcardItems'> {formatDate(created_at)}</span></Card.Text>
                      <Card.Text><BsFillCalendarDateFill size={22} /> <span className='shdBcard'>Updated At ➢ </span><span className='shdBcardItems'> {formatDate(updated_at)}</span></Card.Text>
                    </div>
                  </Card.Body>
                </div>
                <hr />
              </Container>
              <Container>
                <Row className='review mt-5'>
                  <Col xs={12} md={8}>
                    <ListGroup.Item>
                      <h5 className="">
                        {reviews?.length > 0 && reviews?.length} {reviews?.length > 1 ? 'Reviews for this property' : reviews?.length === 0 ? 'No Reviews Currently' : 'Review for this property'}
                      </h5>

                      {loadingHouseReview && <div style={{margin: '2rem'}}><Loader width={'50px'} height={'50px'} border= {'3px solid white'} borderColor={'black transparent transparent transparent'}/></div>}

                      {userInfo ? (
                        <Form>

                          <div class="form-floating my-3">
                            <input
                              type="text"
                              class="form-control removeOutline"
                              id="floatingInputPrice"
                              placeholder="Enter Comments"
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              onFocus={() => setShowSubmitButton(true)}
                            />
                            <label for="floatingInputPrice">Add a comment...</label>
                          </div>
                          <div className='d-flex justify-content-between'>
                            <div class="form-floating w-50" style={{ display: showSubmitButton ? 'block' : 'none' }}>
                              <select
                                class="form-select removeOutline"
                                id="floatingSelectAvailable"
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                                onFocus={() => setShowSubmitButton(true)}
                              >
                                <option value="">Select Rating</option>
                                <option value='1'>1 - Poor</option>
                                <option value='2'>2 - Fair</option>
                                <option value='3'>3 - Good</option>
                                <option value='4'>4 - Very Good</option>
                                <option value='5'>5 - Excellent</option>
                              </select>
                              <label for="floatingSelectAvailable"></label>
                            </div>

                            <div style={{ display: showSubmitButton ? 'block' : 'none' }}>
                              <Button
                                type='submit'
                                className='submitReviewButton'
                                variant='light'
                                onClick={(e) => { e.preventDefault(); setComment(''); setRating(0); setShowSubmitButton(false); }}
                              >
                                Cancel
                              </Button>
                              <Button
                                disabled={loadingHouseReview}
                                type='submit'
                                variant={comment?.length > 0 || rating != 0 ? 'primary' : 'light'}
                                className='submitReviewButton'
                                onClick={(e) => submitHandler(e)}
                              >
                                Submit
                              </Button>
                            </div>
                          </div>
                        </Form>
                      ) : (
                        <Alert variant='primary'>
                          Please <Link to='/login'>sign in</Link> to write a review
                        </Alert>
                      )}
                    </ListGroup.Item>
                  </Col>
                  <Col xs={12} md={8}>
                    {reviews?.length === 0 &&
                      <Alert variant='info' className='text-center my-5'>
                        No Reviews Yet
                      </Alert>
                    }
                    <ListGroup variant='flush'>
                      {reviews &&
                        reviews?.map((review) => (
                          <Alert className='mt-3 border-0 border-bottom rounded-0' variant='light' key={review?._id}>
                            <div className="d-flex justify-content-between">
                              <div>
                                <div className='d-flex align-items-baseline'>
                                  <span className='commentName me-2'>{review?.name}</span>
                                  {review?.createdAt === review?.updatedAt ? (
                                    <span className='commentDate'>{formatReviewTime(review?.createdAt)}</span>
                                  ) : (
                                    <>
                                      <span className='commentDate'>{`(edited) `}</span>
                                      <span className='commentDate ms-1'>{formatReviewTime(review?.updatedAt)}</span>
                                    </>
                                  )}
                                </div>
                                <div className='d-flex align-items-center'>
                                  <span className='commentName'>Rating </span>
                                  <ReactStars
                                    className='ms-2'
                                    count={5}
                                    value={review?.rating}
                                    size={20}
                                    color2={'#ff5900'}
                                    edit={false}
                                    color1={'#c6c6c6'}
                                  />
                                </div>
                                <div className='commentComment mt-2'>
                                  {isReviewExpanded(review?._id) ? review?.comment : `${review?.comment?.slice(0, 100)}`}
                                  {review?.comment?.length > 100 && (
                                    <Button
                                      variant="link"
                                      size="sm"
                                      onClick={() => toggleReview(review?._id)}
                                      className="p-0 ms-1"
                                      style={{cursor: 'pointer'}}
                                    >
                                      {isReviewExpanded(review?._id) ? ' less' : ' more....'}
                                    </Button>
                                  )}
                                </div>
                              </div>

                              {userInfo?.role === 'admin' && (
                                <Button
                                  variant="light"
                                  size="sm"
                                  style={{ height: '3rem', width: '3rem' }}
                                  onClick={() => handleDeleteReview(id, review?._id)}
                                  disabled={loadingReviews[review?._id]}
                                >
                                  {!loadingReviews[review?._id] ? <ImBin size={20} /> : <Loader width={'26px'} height={'26px'} border= {'2.4px solid #f8f9fa'} borderColor={'black transparent transparent transparent'}/>}
                                </Button>
                              )}

                            </div>
                          </Alert>
                        ))}
                    </ListGroup>
                  </Col>
                </Row>
              </Container>
            </>
          }
        </>
      }
    </>
  )
}

export default SingleHouseDataScreen;