import React, { useState } from "react";
import { useCreateHouseMutation } from "../../slices/HouseSlice";
import { Button, Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import AmenitiesComponent from "../AmenitiesComponent";
import '../styles/createHouseScreen.css'
import Loader from "../Loader";
import { useNavigate } from "react-router-dom";

// AIzaSyCaYZKK9s97DTpL4ywj1yzg3-ag83pHLm8
const CreateHouseScreen = () => {
  const [createHouse, { isLoading, error }] = useCreateHouseMutation();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState();
  const [description, setDescription] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [bhk, setBHK] = useState('');
  const [constructionStatus, setConstructionStatus] = useState('');
  const [postedBy, setPostedBy] = useState('');
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [available, setAvailable] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pincode, setPinCode] = useState("");
  const [area, setArea] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [opProperty, setOpProperty] = useState('');

  let Amenities = [
    "Pet-friendly",
    "Gym",
    "Fire Pit",
    "Fireplace",
    "Wi-Fi",
    "Security System",
    "Swimming pool",
    "Parking",
    "Laundry Facilities",
    "Balcony",
    "Air Conditioning",
    "Elevator",
    "Outdoor Space",
    "Dishwasher",
  ];

  const propertyTypes = [
    'Flat/Apartment',
    'Independent/Builder Floor',
    'Independent House/Villa',
    'Residential Land',
    '1 RK/Studio Apartment',
    'Farm House',
    'Serviced Apartments',
    'Condo',
    'Basement',
    'Others'
  ];

  const postedByOption = [
    "1 RK/1 BHK", "2 BHK", "3 BHK", "4 BHK", "more than 4 BHK's"
  ]
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  function handleSetAmenities(value) {
    if (Array.isArray(value)) {
      setAmenities(value);
    } else {
      setAmenities([...amenities, value]);
    }
  }

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setSubmitting(true);

    const formData = {
      title,
      category,
      location,
      price,
      postedBy,
      bhk,
      description,
      constructionStatus,
      amenities,
      images,
      available,
      area,
      pincode,
      opProperty
    };

    if (!title ||
      !category ||
      !location ||
      !price ||
      !postedBy ||
      !bhk ||
      !description ||
      !constructionStatus ||
      !amenities ||
      !available ||
      !area ||
      !opProperty ||
      !pincode || !images.length) {
      toast.warning('Please enter all fields');
      setSubmitting(false);
      return;
    }
    let loadingToastId;
    try {
      loadingToastId = toast.loading("Don't leave this page till submission.");

      const response = await createHouse(formData).unwrap();

      toast.dismiss(loadingToastId);

      toast.success("Property registered successfully!");
      navigate(`/single-house-data/${response?.house?._id}`);
    } catch (error) {
      toast.dismiss(loadingToastId);

      toast.error('Error while submitting property.');
    }

    setSubmitting(false);
  };
  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 20) {
      toast.warning("Only 20 images are permitted");
      return;
    }
    setImages([]);
    setImagesPreview([]);

    files?.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const [wordCount, setWordCount] = useState(0);
  const maxWords = 1000;

  const handleDescriptionChange = (e) => {
    const text = e.target.value; // Don't trim here to allow leading/trailing whitespace for input cursor positioning
    const trimmedText = text.trim(); // For word count, remove leading and trailing whitespace
    const words = trimmedText === '' ? [] : trimmedText.split(/\s+/); // Split text by whitespace and remove empty elements
    setDescription(text);
    setWordCount(words.length);
  };

  const handlePriceChange = (e) => {
    let newValue = parseInt(e.target.value);
    if (isNaN(newValue) || newValue < 0) {
      newValue = ''; // Clear the input if it's not a valid number
    } else if (newValue > 100000000) {
      newValue = 100000000; // If the value exceeds 10 crore, set it to 10 crore
    }
    setPrice(newValue);
  };

  const handleAreaChange = (e) => {
    const inputValue = e.target.value;

    // Validate if the input is a number and within 10 digits
    if (/^\d{0,10}$/.test(inputValue)) {
      setArea(inputValue); // Update state if input is valid
    }
  };

  const handlePincodeChange = (e) => {
    const inputValue = e.target.value;

    // Validate if the input is a number and within 6 digits
    if (/^\d{0,6}$/.test(inputValue)) {
      setPinCode(inputValue); // Update state if input is valid
    }
  };

  return (
    <div className="">
      <div className="w-50 bg-white mx-auto">
        <h1 className="my-5 createHouseH1">Create New Entry</h1>
        <div className="">
          <Row className="">
            {currentPage === 1 && (
              <>
                <Col xxl={12} className="mb-5 rounded-full">
                  <div class="form-floating">
                    <input required name="title" type="email" value={title} onChange={(e) => setTitle(e.target.value)} class="form-control" id="floatingInput" placeholder="Enter the City" />
                    <label for="floatingInput">Enter the City</label>
                  </div>
                </Col>
                <Col xxl={12} className="mb-5">
                  <div class="form-floating">
                    <input required name="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} class="form-control" id="floatingInput" placeholder="Enter Street Address" />
                    <label for="floatingInput">Enter Street Address</label>
                  </div>
                </Col>
                <Col xxl={12} className="mb-5">
                  <div class="form-floating">
                    <select class="form-select" type="text" name="type" value={category} onChange={(e) => setCategory(e.target.value)} id="floatingSelect" aria-label="Floating label select example">
                      <option selected>Choose a Property Type</option>
                      {propertyTypes?.map((type, index) => (
                        <option key={index} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <label for="floatingSelect">Select Property Type</label>
                  </div>
                </Col>
                <Col xxl={6} className="mb-5">
                  <div class="form-floating">
                    <select
                      class="form-select"
                      id="floatingSelectAvailable"
                      value={postedBy}
                      onChange={(e) => setPostedBy(e.target.value)}
                    >
                      <option value="">Select a Desigination</option>
                      <option value="Owner">Owner</option>
                      <option value="Builder">Builder</option>
                      <option value="Dealer">Dealer</option>
                    </select>
                    <label for="floatingSelectAvailable">Who are you?</label>
                  </div>
                </Col>
                <Col xxl={6} className="mb-5">
                  <div class="form-floating">
                    <select
                      class="form-select"
                      id="floatingSelectAvailable"
                      value={opProperty}
                      onChange={(e) => setOpProperty(e.target.value)}
                    >
                      <option value="">Select an opeartion</option>
                      <option value="Rent">For Rent</option>
                      <option value="Sale">For Sale</option>
                    </select>
                    <label for="floatingSelectAvailable">For rent or sale</label>
                  </div>
                </Col>
              </>
            )}
            {currentPage === 2 && (
              <>
                <Col xxl={6} className="mb-5">
                  <div class="form-floating">
                    <input
                      type="text"  // Change type to "text" to handle numbers and limit length
                      class="form-control"
                      id="floatingInputPinCode"
                      placeholder="Enter Pin Code"
                      value={pincode}
                      onChange={handlePincodeChange}
                      maxLength={6}  // Limit maximum length to 6 characters
                    />
                    <label for="floatingInputPinCode">Pin Code</label>
                  </div>

                </Col>
                <Col xxl={6} className="mb-5">
                  <div class="form-floating">
                    <input
                      type="text"  // Change type to "text" to handle numbers and limit length
                      class="form-control"
                      id="floatingInputArea"
                      placeholder="Area in Sq. ft"
                      value={area}
                      onChange={handleAreaChange}
                      maxLength={10}  // Limit maximum length to 10 characters
                    />
                    <label for="floatingInputArea">Area in Sq. ft</label>
                  </div>

                </Col>
                <Col xxl={6} className="mb-5">
                  <div className="form-floating">
                    <input
                      type="number"
                      className="form-control"
                      id="floatingInputPrice"
                      placeholder="Enter Price"
                      value={price}
                      onChange={handlePriceChange}
                      max={100000000}
                    />
                    <label htmlFor="floatingInputPrice">Enter Price (Up to 10 Crore INR)</label>
                  </div>
                </Col>
                <Col xxl={6} className="mb-5">
                  <div class="form-floating">
                    <select
                      class="form-select"
                      id="floatingSelectAvailable"
                      value={available}
                      onChange={(e) => setAvailable(e.target.value)}
                    >
                      <option value="">Property Available</option>
                      <option value="True">True</option>
                      <option value="False">False</option>
                    </select>
                    <label for="floatingSelectAvailable">Property Available ?</label>
                  </div>
                </Col>

                <Col xxl={6} className="mb-5">
                  <div class="form-floating">
                    <select class="form-select" type="text" value={bhk} onChange={(e) => setBHK(e.target.value)} id="floatingSelect" aria-label="Floating label select example">
                      <option selected>Select BHK's</option>
                      {postedByOption?.map((type, index) => (
                        <option key={index} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <label for="floatingSelect">Select Bedrooms and Bathrooms number</label>
                  </div>
                </Col>
                <Col xxl={6} className="mb-5">
                  <div class="form-floating">
                    <select
                      class="form-select"
                      id="floatingSelectAvailable"
                      value={constructionStatus}
                      onChange={(e) => setConstructionStatus(e.target.value)}
                    >
                      <option value="">Select Construction Status</option>
                      <option value="New Launch">New Launch</option>
                      <option value="Resale">Resale</option>
                      <option value="Under Construction">Under Construction</option>
                      <option value="Ready to move">Ready to move</option>
                    </select>
                    <label for="floatingSelectAvailable">Property's construction status</label>
                  </div>
                </Col>
              </>
            )}
            {currentPage === 3 && (
              <>
                <AmenitiesComponent amenities={amenities} setAmenities={handleSetAmenities} Amenities={Amenities} />
              </>
            )}
            {currentPage === 4 && (
              <>
                <div className="d-flex align-items-baseline justify-content-between">
                  <h4 className="createHouseH1">Description</h4>
                  {wordCount <= maxWords ? (
                    <p className="word-count text-secondary">{wordCount} {wordCount === 1 ? 'Word' : 'Words'}</p>
                  ) : (
                    <p className="word-count text-danger">{maxWords}/{wordCount} Words</p>
                  )}
                </div>
                <Col xxl={12} className="mb-5 mt-1">
                  <div className="form-floating">
                    <textarea
                      className={`form-control ${wordCount > maxWords ? 'is-invalid' : ''}`}
                      id="floatingInputDescription"
                      placeholder="Enter Description Here....."
                      value={description}
                      style={{ height: "30vh" }}
                      onChange={handleDescriptionChange}
                    ></textarea>
                    <label htmlFor="floatingInputDescription">Enter property description here....</label>
                    {wordCount > maxWords && (
                      <div className="invalid-feedback">Exceeded maximum word limit</div>
                    )}
                  </div>
                </Col>

                <h4 className="createHouseH1">Add Images</h4>
                <Col xxl={12} className="my-3">
                  <div class="form-floating mb-3">
                    <input
                      type="file"
                      class="form-control"
                      id="floatingInputImages"
                      name="images"
                      accept="image/*"
                      multiple
                      onChange={(e) => createProductImagesChange(e)}
                    />
                    <div class="img-preview-container">
                      {imagesPreview?.map((image, index) => (
                        <img key={index} src={image} alt={`Product Preview ${index + 1}`} class="img-preview" />
                      ))}
                    </div>
                    <label for="floatingInputImages">Choose your property images</label>
                  </div>
                </Col>
                <Col xxl={12} className="my-3">
                  <Button disabled={submitting} className="btn btn-primary w-100 d-flex justify-content-center align-items-center rounded-2 posButton" onClick={handleSubmit}>
                    {isLoading ?  <div className='deleteButtonDangerLoader'><Loader width={'26px'} height={'26px'} border= {'2.4px solid #dc3545'} borderColor={'white transparent transparent transparent'}/></div> : 'Submit Your House Data'}
                  </Button>
                </Col>
              </>
            )}
          </Row>
        </div>
        <div className="mt-3 d-flex justify-content-between">
          <Button
            className="btn btn-light mr-auto posButton"
            disabled={currentPage === 1 || submitting}
            onClick={prevPage}
          >
            Back
          </Button>
          <Button
            className="btn btn-primary ml-auto posButton"
            disabled={currentPage === 4}
            onClick={nextPage}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateHouseScreen;