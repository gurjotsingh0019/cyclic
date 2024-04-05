import React, { useEffect, useState } from 'react';
import { Container, Row, Card, Button } from 'react-bootstrap';
import { useGetAllHousesQuery } from '../slices/HouseSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Pagenation from './Pagenation';
import './styles/HouseDashboard.css'
import ReactStars from 'react-stars'
import { LinkContainer } from 'react-router-bootstrap'
import {Nav} from 'react-bootstrap';
import PropertyTypes from './reusable/searchFilters/PropertyTypes';
import { updateBhk, updateCategory, updateConstructionStatus, updateMaxPrice, updateMinPrice, updatePostedBy } from '../slices/basicDataSlice';
import Budget from './reusable/searchFilters/Budget';
import BHK from './reusable/searchFilters/BHK';
import { BsPlusLg } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import ConstructionStatus from './reusable/searchFilters/ConstructionStatus';
import PostedBY from './reusable/searchFilters/PostedBY';
import HouseDashShimmer from './Shimmer/HouseDashShimmer';
import { toast } from 'react-toastify';
import { CgMenuLeft } from "react-icons/cg";

const HouseDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getState = JSON.parse(sessionStorage.getItem("initialState"));
  const [propertytyppe, setPropertytyppe] = useState(JSON.parse(localStorage.getItem("propertyType")) || []);
  const [minPrice, setMinPrice] = useState(getState?.minPrice || 0);
  const [maxPrice, setMaxPrice] = useState(getState?.maxPrice || 100000000);
  const [constructionTypes, setConstructionTypes] = useState(getState?.construction || []);
  const [bhkTypes, setBhkTypes] = useState(getState?.bathroom || []);
  const [postedby, setPostedBy] = useState(getState?.posted || []);
  const [dataComing, setDataComing] = useState(false);
  const [isLessThan1200, setIsLessThan1200] = useState(window.innerWidth < 1200);
  const [isLessThan800, setIsLessThan800] = useState(window.innerWidth < 800);
  const { keyword, price_gte, price_lte, page, category, bhk, postedBy, constructionStatus } = useSelector((state) => state.basicData);
  const { data, isLoading, error, refetch } = useGetAllHousesQuery({ keyword, price_gte, price_lte, page, category, bhk, postedBy, constructionStatus});
  // const debounce = (func, delay) => {
  //   let timeout;
  //   return function(...args){
  //     clearTimeout(timeout);
  //     timeout= setTimeout(() => {
  //       func.apply(this, args);
  //     }, delay);
  //   };
  // };
  // const debouncedSetMaxPrice = debounce((value) => setMaxPrice(value), 2000);
  // const debouncedSetMinPrice = debounce((value) => setMinPrice(value), 2000);
  const initialState = {
    minPrice,
    maxPrice,
    bathroom:bhkTypes,
    construction:constructionTypes,
    posted:postedby,
  }
  useEffect(() => {
    sessionStorage.setItem('initialState', JSON.stringify(initialState));
    dispatch(updateMaxPrice(maxPrice));
    dispatch(updateMinPrice(minPrice));
    dispatch(updateBhk(bhkTypes));
    dispatch(updateConstructionStatus(constructionTypes));
    dispatch(updatePostedBy(postedby));
  }, [minPrice, maxPrice, bhkTypes, constructionTypes, postedby]);

  useEffect(() => {
    localStorage.setItem("propertyType", JSON.stringify(propertytyppe));
    dispatch(updateCategory(propertytyppe));
    //add
  }, [propertytyppe]);

  useEffect(() => {
  setShowShimmer(true);
  const timeoutId = setTimeout(() => {
    setShowShimmer(false);
  }, 1500);
  const fetchData = async () => {
    setDataComing(true);
    await refetch();
    setDataComing(false)
  };
  fetchData();
  return () => {
    clearTimeout(timeoutId);
  };
}, [propertytyppe, PropertyTypes, category, bhkTypes, constructionTypes, postedby]);


  useEffect(() => {
    setShowShimmer(true);
    const timeout = setTimeout(() => {
      refetch();
      setShowShimmer(false);
    }, 1500);
    return () => clearTimeout(timeout);
  },[minPrice, maxPrice]);

  const [showShimmer, setShowShimmer] = useState(false);
  
  const toggleCheckBox = (propertyType) => {
    if (propertytyppe?.includes(propertyType)) {
      setPropertytyppe((prevSelected) =>
        prevSelected?.filter((type) => type !== propertyType)
      );
    } else {
      setPropertytyppe((prevSelected) => [...prevSelected, propertyType]);
    }
  };
  const formatPrice = (price) => {
    if (price < 10000) {
      return `₹${price}`;
    } else if (price < 100000) {
      return `₹${(price / 1000).toFixed(2)}K`;
    } else if (price < 10000000) {
      return `₹${(price / 100000).toFixed(2)} Lakh`;
    } else {
      return `₹${(price / 10000000).toFixed(2)} Crore`;
    }
  };
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
    return formattedDate;
  };

  const handleMaxChange = (event) => {
    const newMax = parseInt(event.target.value, 10);
    setMaxPrice(newMax);
    if (newMax < minPrice) {
      setMinPrice(newMax);
    }
  };
  const handleMinChange = (event) => {
    const newMin = parseInt(event.target.value, 10);
    setMinPrice(newMin);
    if (newMin > maxPrice) {
      setMaxPrice(newMin);
    }
  };
  function addToBhkTypes(bhkType) {
    if (bhkTypes?.includes(bhkType)) {
      setBhkTypes((prevSelected) => prevSelected?.filter((type) => type !== bhkType));
    }
    else {
      setBhkTypes((prevSelected) => [...prevSelected, bhkType]);
    }
  }
  function addToconstructionTypes(cType) {
    if (constructionTypes?.includes(cType)) {
      setConstructionTypes((prevSelected) => prevSelected?.filter((type) => type !== cType));
    }
    else {
      setConstructionTypes((prevSelected) => [...prevSelected, cType]);
    }
  }
  function addToPosted(pType) {
    if (postedby?.includes(pType)) {
      setPostedBy((prevSelected) => prevSelected?.filter((type) => type !== pType));
    }
    else {
      setPostedBy((prevSelected) => [...prevSelected, pType]);
    }
  }
  function houseClicked(house){
    const items = JSON.parse(localStorage.getItem('view'));
    const isPresent = items && items?.some(item => item?._id === house?._id);
    if(!isPresent){
      if(items){
        localStorage.setItem('view',JSON.stringify([...items, house]));
      }
      else{
        localStorage.setItem('view',JSON.stringify([house]));
      }
    }
    navigate(`/single-house-data/${house?._id}`); 
  }

  useEffect(() => {
    const handleResize = () => {
      setIsLessThan1200(window.innerWidth < 1200);
      setIsLessThan800(window.innerWidth < 800);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  return (
    // ececec
    <div className='hdBackground'>
    <div className={`${isLessThan1200 ? 'container-fluid' : 'container'}`}>
      <div className={`d-flex pt-2 ${isLessThan1200 < 1200 ? 'container-fluid' : 'container'}`}>
          {isLessThan800 ? 
          <>
          {!showFilters && <CgMenuLeft style={{position:'fixed', cursor:'pointer'}} onClick={toggleFilters} size={32}/>}
          {showFilters && 
            <div className='shadow-sm me-2 mt-2' style={{ position: 'fixed', overflowY: 'scroll', zIndex: '1000', backgroundColor: 'white', maxHeight: '88%', width: '90%'}}>
            <div className='border' style={{position:'sticky', top:'0rem',  overflowY:'scroll'}}>
              <div className='p-3'>
                <div className='mb-2'>
                  <div className='d-flex justify-content-between'>
                <p>Select Property Types</p><RxCross1  size={26}onClick={toggleFilters} style={{cursor:'pointer'}} />
                </div>
                <PropertyTypes toggleCheckbox={toggleCheckBox} ptClassname={"col-lg-6 col-md-12"}/>
                </div>
                <div className='mt-5'>
                <p>Select Prices</p>
                <Budget minPrice={minPrice} maxPrice={maxPrice} handleMinChange={handleMinChange} handleMaxChange={handleMaxChange} />
                </div>
                <div className='mt-5'>
                <BHK Button={Button} RxCross1={RxCross1} BsPlusLg={BsPlusLg} addToBhkTypes={addToBhkTypes} bhkTypes={bhkTypes} />
                </div>
                <div className='mt-5'>
                <ConstructionStatus addToconstructionTypes={addToconstructionTypes} constructionTypes={constructionTypes} Button={Button} RxCross1={RxCross1} BsPlusLg={BsPlusLg} />
                </div>
                <div className='mt-5'>
                <PostedBY addToPosted={addToPosted} Button={Button} postedBy={postedby} RxCross1={RxCross1} BsPlusLg={BsPlusLg} />
                </div>
              </div>
            </div>
      </div>
             
          }</> 
          :
          
          <div className='shadow-sm me-2 mt-2'>
                <div className='border hdSticky'>
                  <div className='p-3'>
                    <div className='mb-2'>
                    <p>Select Property Types</p>
                    <PropertyTypes toggleCheckbox={toggleCheckBox} ptClassname={"col-lg-6 col-md-12"}/>
                    </div>
                    <div className='mt-5'>
                    <p>Select Prices</p>
                    <Budget minPrice={minPrice} maxPrice={maxPrice} handleMinChange={handleMinChange} handleMaxChange={handleMaxChange} />
                    </div>
                    <div className='mt-5'>
                    <BHK Button={Button} RxCross1={RxCross1} BsPlusLg={BsPlusLg} addToBhkTypes={addToBhkTypes} bhkTypes={bhkTypes} />
                    </div>
                    <div className='mt-5'>
                    <ConstructionStatus addToconstructionTypes={addToconstructionTypes} constructionTypes={constructionTypes} Button={Button} RxCross1={RxCross1} BsPlusLg={BsPlusLg} />
                    </div>
                    <div className='mt-5'>
                    <PostedBY addToPosted={addToPosted} Button={Button} postedBy={postedby} RxCross1={RxCross1} BsPlusLg={BsPlusLg} />
                    </div>
                  </div>
                </div>
          </div>}
          <Row className='ms-2'>
            {isLoading || dataComing && <HouseDashShimmer/>}
            {error && toast?.error(error?.message)}
            {showShimmer ? <HouseDashShimmer />:
            data && 
              data?.houses?.map((house) => (
                <div key={house?._id} className="d-flex my-2 p-1 houseCard" onClick={() => houseClicked(house)}>
                    <Card.Img className='ratio ratio-4x3 my-auto cardImage' src={house?.images[0]?.url}/>
                    <Card.Body className='p-1 px-2 my-auto cardBody'>
                      <div className='d-flex justify-content-between'>
                        <p className='hdLocation'><span>{house?.location?.length > 20 ? `${house?.location?.slice(0, 20)} ...` : house?.location}</span></p>
                        <p className='hdPrice'><span className='hdpFrom'>From</span> {formatPrice(house?.price)} <span className='hdpFrom'>{house?.opProperty?.toLowerCase() === 'rent' ? '/month' : ''}</span></p>
                      </div>
                      <div className='hdAvailable'>
                      <span className='hdFw300'>Location:</span> {house?.title?.length > 50 ? `${house?.title?.slice(0, 50)} ...` : house?.title}
                      </div>
                      <div>
                      <span className='hdBhk'>{house?.bhk} </span>
                      <span className='hdCategory'>{house?.category}</span>
                      <span className='hdIn'> in </span>
                      <span className='hdLocationSpan'>{house?.location?.length > 35 ? `${house?.location?.slice(0, 35)}....` : house?.location}</span>
                      </div>
                      
                      <div className='hdAmenity'>
                      <span className='hdFw300'>Amenities:</span> {house?.amenities?.flat()?.slice(0, 3)?.join(' , ')}
                      {house?.amenities?.flat().length > 3 && <span className='hdAmenitySpan'> and more...</span>}  
                      </div>
                      <div className='hdArea'>
                      {house?.area} Sq. ft <span className='hdFw300'>area</span>
                      </div>
                      <div className='hdAvailable'>
                      <span className='hdFw300'>Last Updated:</span> {formatDate(house?.updated_at)}
                      </div>
                      <div className='d-flex justify-content-between'>
                       <div className='hdReviews d-flex align-items-center pt-0'>
                          <span className='hdFw300'>Rating:</span>
                          <ReactStars
                          className='ms-2'
                            count={5}
                            value={house?.rating}
                            size={20}
                            color2={'#ff5900'}
                            edit={false}
                            color1={'#c6c6c6'}
                          />
                        </div>
                        {!isLessThan1200 && <Button className='btn btn-warning text-white rounded-0 me-0'>
                            View rooms
                        </Button>}
                      </div>
                    </Card.Body>
                </div>
              ))
            }
            {
              !isLoading && data?.houses?.length === 0 &&
              <>
            <Button className='btn btn-warning col-md-6 mt-2' style={{height:'4rem', width:'15rem'}}>
              <LinkContainer to='/'>
                 <Nav.Link className='linkContainer text-warning-emphasis'><span className='text-danger'>No Data Found...</span> <span className='text-light'>Go Back</span> </Nav.Link>
              </LinkContainer>
            </Button>
            </>
            }
          </Row>
        </div>
          <div className='d-flex justify-content-center'>
          <Pagenation houseCount={data?.houseCount} resultPerPage={data?.resultPerPage} filterHouses={data?.filterHousesLength}/>
          </div>
    </div>
    </div>
  );
};

export default HouseDashboard;