import React, { useState } from 'react';
import { Carousel } from 'react-bootstrap';
import '../styles/singleHouseData.css';
import { BsXLg } from 'react-icons/bs';

const Carousels = ({ images, setDisplayCarousel }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleCarouselSelect = (selectedIndex) => {
    setCurrentImageIndex(selectedIndex);
  };

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <>
      <div className='fixed-top d-flex justify-content-center shda'>
        <div className='shcross 1' onClick={() => setDisplayCarousel()}>
          <BsXLg size={40} />
        </div>
        <div>
          <div className='shHeading'>
            Total Images ({images?.length})
          </div>
          <div className='shdb d-flex 2 justify-content-center'>
            <Carousel className='shdc' activeIndex={currentImageIndex} onSelect={handleCarouselSelect}>
              {images?.map((image) => (
                <Carousel.Item className='shdd' key={image?._id}>
                  <img className='shde' src={image?.url} alt={`Slide ${image?._id}`} />
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
          <div className='text-white d-flex 3 shdCards1'>
            {images?.map((image, index) => (
              <div
                key={index}
                style={{ opacity: index === currentImageIndex ? 1 : 0.5 }}
                onClick={() => handleImageClick(index)}
              >
                {/* see onMouseEnter or not */}
                <img className='w-100 shdimages' src={image?.url} alt={`Slide ${image?._id}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Carousels;