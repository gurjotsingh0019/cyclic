import React, { useEffect, useState } from "react";
import { Button, Col } from "react-bootstrap";
import { HiOutlinePlus } from "react-icons/hi2";
import { LiaTimesSolid } from "react-icons/lia";
import './styles/Amenities.css'

const AmenitiesComponent = ({ amenities, setAmenities, Amenities }) => {
  const [otherClick, setOtherClick] = useState(false);
  const [otherAmeneties, setOtherAmeneties] = useState([]);
  const [customAmenity, setCustomAmenity] = useState("");

  useEffect(() => {
    setOtherAmeneties(amenities?.filter((item) => !Amenities?.includes(item)) || []);
  }, [amenities]);

  const addCustomAmenity = () => {
    if (customAmenity?.trim() !== "") {
      setOtherAmeneties([...otherAmeneties, customAmenity]);
      setAmenities(customAmenity);
      setCustomAmenity("");
    }
  };

  const removeOtherAmenety = (value) => {
    const data = amenities && amenities?.filter((element) => element !== value);
    setAmenities(data);
    setOtherAmeneties(otherAmeneties?.filter((element) => element !== value));
  };

  const toggleAmenity = (value) => {
    if (amenities?.includes(value)) {
      const data =
        amenities && amenities?.filter((element) => element !== value);
      setAmenities(data);
    } else {
      setAmenities(value);
    }
  };

  const handleCustomAmenityChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 30) {
      setCustomAmenity(inputValue); // Update state if number of characters is within limit
    }
  };

  return (
    <>
      <h4 className="createHouseH1" style={{ textDecoration: 'underline' }}>Ameneties</h4>
      <Col xxl={12}>
        <div className="my-3">
          <div className="pt-1 pb-1">
            {otherAmeneties?.length > 0 &&
              otherAmeneties?.map((value, index) => (
                <Button
                  className="btn btnsecondary m-1 rounded-5 amenityButton"
                  onClick={() => removeOtherAmenety(value)}
                  key={index}
                  style={{ paddingLeft: '15px', paddingBottom: '8px' }}
                >
                  {value}
                  <span
                    style={{
                      marginLeft: "8px",
                      cursor: "pointer",
                      fontSize: "20px",
                    }}
                  >
                    <LiaTimesSolid />
                  </span>
                </Button>
              ))}
            {Amenities?.map((value, index) => {
              const isAmenitySelected = amenities?.includes(value);

              return (
                <React.Fragment key={index}>
                  {isAmenitySelected ? (
                    <Button
                      onClick={() => toggleAmenity(value)}
                      className="btn btnsecondary m-1 rounded-5 amenityButton"
                      key={index}
                      style={{ paddingLeft: '15px', paddingBottom: '8px' }}
                    >
                      {value}
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAmenity(value);
                        }}
                        style={{
                          marginLeft: "8px",
                          cursor: "pointer",
                          fontSize: "20px",
                        }}
                      >
                        <LiaTimesSolid />
                      </span>
                    </Button>
                  ) : (
                    <Button
                      onClick={() => toggleAmenity(value)}
                      className="btn btn-light rounded-5 my-1 mx-2 amenityButton border-0"
                      style={{ paddingLeft: '15px', paddingBottom: '8px' }}
                    >
                      {value}
                      <span
                        style={{
                          marginLeft: "6px",
                          cursor: "pointer",
                          fontSize: "20px",
                        }}
                      >
                        <HiOutlinePlus />
                      </span>
                    </Button>
                  )}
                </React.Fragment>
              );
            })}

            {!otherClick ? (
              <Button
                className="btn btn-light rounded-5 my-1 mx-2 amenityButton border-0"
                onClick={() => setOtherClick(true)}
                style={{ paddingLeft: '15px', paddingBottom: '8px' }}
              >
                Add Custom Ameneties
                <span
                  style={{
                    marginLeft: "6px",
                    cursor: "pointer",
                    fontSize: "20px",
                  }}
                >
                  <HiOutlinePlus />
                </span>
              </Button>
            ) : (
              <Button
                className="btn btnsecondary m-1 rounded-5 amenityButton"
                onClick={() => setOtherClick(false)}
                style={{ paddingLeft: '15px', paddingBottom: '8px' }}
              >
                Add Custom Ameneties
                <span
                  style={{
                    marginLeft: "8px",
                    cursor: "pointer",
                    fontSize: "20px",
                  }}
                >
                  <LiaTimesSolid />
                </span>
              </Button>
            )}
          </div>

          {otherClick && (
            <div class="form-floating d-flex mt-2">
              <input
                type="text"
                class="form-control amenity-input"
                id="floatingInputCustomAmenity"
                placeholder="Add Custom Amenity"
                value={customAmenity}
                onChange={handleCustomAmenityChange}
              />
              <label for="floatingInputCustomAmenity">Add Custom Amenity</label>
              <button
                className="btn btn-primary posButton amenity-input-button"
                type="button"
                onClick={addCustomAmenity}
              >
                Append
              </button>
            </div>
          )}
        </div>
      </Col>
    </>
  );
};

export default AmenitiesComponent;