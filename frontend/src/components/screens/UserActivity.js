import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import '../styles/UserActivity.css'
import { RxCounterClockwiseClock } from "react-icons/rx";
import { PiArrowElbowRightUp } from "react-icons/pi";
import { RxCross1 } from "react-icons/rx";
import Alert from 'react-bootstrap/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { updateKeyword } from '../../slices/basicDataSlice';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../reusable/FormatPrice';
import { toast } from 'react-toastify';

const UserActivity = () => {
  const UserActivity = useSelector((state) => state.basicData.viewAt);
  const [selectedTab, setSelectedTab] = useState(UserActivity);
  const [searchedItems, setSearchedItems] = useState([]);
  const [viewItems, setViewItems] = useState([]);
  const [favItems, setFavItems] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

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

  const formatDate = (timestamp) => {
    const currentDate = new Date();
    const entryDate = new Date(timestamp);

    // Check if it's today
    if (
      entryDate.getDate() === currentDate.getDate() &&
      entryDate.getMonth() === currentDate.getMonth() &&
      entryDate.getFullYear() === currentDate.getFullYear()
    ) {
      return `Today - ${currentDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`;
    }

    // Check if it's yesterday
    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1);
    if (
      entryDate.getDate() === yesterday.getDate() &&
      entryDate.getMonth() === yesterday.getMonth() &&
      entryDate.getFullYear() === yesterday.getFullYear()
    ) {
      return `Yesterday - ${yesterday.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`;
    }

    // For any other date
    return entryDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const removeFromFavourite = (id) => {
    const itemsAfterRemoving = favItems && favItems.filter(item => item._id !== id);
    toast.success('Property removed');
    localStorage.setItem('favourite', JSON.stringify(itemsAfterRemoving));
    setFavItems(itemsAfterRemoving);
  }
  const removeFromViewed = (id) => {
    const itemsAfterRemoving = viewItems && viewItems?.filter(item => item?._id !== id);
    toast.success('Property removed');
    localStorage.setItem('view', JSON.stringify(itemsAfterRemoving));
    setViewItems(itemsAfterRemoving);
  }
  const searchThis = (term) => {
    dispatch(updateKeyword(term));
    navigate(`/search`);
  }
  function houseClicked(id) {
    navigate(`/single-house-data/${id}`);
  }
  return (
    <Container>
      <div className='d-flex justify-content-center' style={{ margin: '1rem 15vw' }}>
        <p
          onClick={() => handleTabClick('recent')}
          className={selectedTab === 'recent' ? 'blueUnderline UAlist' : 'UAlist'}
        >
          Recent Searches ({searchedItems && searchedItems?.length})
        </p>
        <p
          onClick={() => handleTabClick('viewed')}
          className={selectedTab === 'viewed' ? 'blueUnderline UAlist' : 'UAlist'}
        >
          Viewed ({viewItems && viewItems?.length})
        </p>
        <p
          onClick={() => handleTabClick('favorites')}
          className={selectedTab === 'favorites' ? 'blueUnderline UAlist' : 'UAlist'}
        >
          My Favourites ({favItems && favItems.length})
        </p>
      </div>
      <div>
        {selectedTab === 'recent' &&
          searchedItems?.length ?
          [...searchedItems]?.reverse()?.map((item, index, reversedArray) => (
            <div key={index}>
              {index === 0 || formatDate(item?.timestamp) !== formatDate(reversedArray[index - 1]?.timestamp) ? (
                <div className="mb-2 mx-auto fs-3" style={{ width: '60vw' }}>
                  {formatDate(item?.timestamp)}
                </div>
              ) : null}

              <Card className='UAcard px-2 py-3 rounded-3 my-4 mx-auto shadow-sm' onClick={() => searchThis(item?.term)}>
                <div className='d-flex justify-content-between align-items-center'>
                  <div>
                    <RxCounterClockwiseClock size={20} className='me-3 ms-1' />
                    <span className=''>{item?.term}</span>
                  </div>
                  <PiArrowElbowRightUp size={22} className='me-1' />
                </div>
              </Card>
            </div>
          ))
          :
          selectedTab === 'recent' && searchedItems?.length === 0 ? (
            <Alert key='info' variant='info' className='d-flex justify-content-center'>
              You haven't searched anything yet!
            </Alert>
          ) : null
        }

        {selectedTab === 'viewed' &&
          <Row>
            {viewItems?.length ? viewItems?.map((item) => (
              <Col md={3}>
                <Card key={item?._id} className='UAview'>
                  <div className="popover-container">
                    <RxCross1 className="popover-button" size={20} onClick={() => removeFromViewed(item?._id)} />
                    <div className="popover-content">
                      Remove
                    </div>
                  </div>
                  <Card.Img className='UAviewImg' src={item?.images[0]?.url} onClick={() => houseClicked(item?._id)} />
                  <Card.Body className=''>
                    <Card.Title>{item?.title?.slice(0, 15)}{item?.title?.length > 15 && '...'}</Card.Title>
                    <p className='UAviewText'>{item?.bhk} {item?.catgory}</p>
                    <p className='UAviewText'>In {item?.location.slice(0, 20)}{item?.location?.length > 20 && '...'}</p>
                    <p className='UAviewText'>For {formatPrice(item?.price)} <span className='hdpFrom'>{item?.opProperty?.toLowerCase() === 'rent' ? '/month' : ''}</span></p>
                  </Card.Body>
                </Card>
              </Col>
            )) :
              <Alert key='info' variant='info' className='d-flex justify-content-center'>
                You haven't viewed anything yet!
              </Alert>
            }
          </Row>
        }
        {selectedTab === 'favorites' &&
          <Row>
            {favItems?.length ? favItems?.map((item) => (
              <Col md={3}>
                <Card key={item?._id} className='UAview'>
                  <div className="popover-container">
                    <RxCross1 className="popover-button" size={20} onClick={() => removeFromFavourite(item?._id)} />
                    <div className="popover-content">
                      Remove
                    </div>
                  </div>
                  <Card.Img className='UAviewImg' src={item?.images[0]?.url} onClick={() => houseClicked(item?._id)} />
                  <Card.Body className=''>
                    <Card.Title>{item?.title?.slice(0, 15)}{item?.title?.length > 15 && '...'}</Card.Title>
                    <p className='UAviewText'>{item?.bhk} {item?.category}</p>
                    <p className='UAviewText'>In {item?.location?.slice(0, 20)}{item?.location?.length > 20 && '...'}</p>
                    <div className='d-flex justify-content-between'>
                      <p className='UAviewText'>For {formatPrice(item?.price)} <span className='hdpFrom'>{item?.opProperty?.toLowerCase() === 'rent' ? '/month' : ''}</span></p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
              :
              <Alert key='info' variant='info' className='d-flex justify-content-center'>
                You haven't selected anything favorite yet!
              </Alert>
            }
          </Row>
        }
      </div>
    </Container>
  );
};

export default UserActivity;