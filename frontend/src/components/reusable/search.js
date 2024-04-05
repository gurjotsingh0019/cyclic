import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useGetAllCitiesQuery } from "../../slices/HouseSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
  updateKeyword,
  updateMinPrice,
  updateMaxPrice,
  updateCategory,
  updatePage,
  updateToggleSearch,
  updateBhk,
  updateConstructionStatus,
  updatePostedBy,
} from "../../slices/basicDataSlice";
import "../styles/search.css";
import { PiClockClockwiseLight } from "react-icons/pi";
import { PiArrowUpRightLight } from "react-icons/pi";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { BsPlusLg } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import PropertyTypes from "./searchFilters/PropertyTypes";
import Budget from "./searchFilters/Budget";
import ConstructionStatus from "./searchFilters/ConstructionStatus";
import PostedBY from "./searchFilters/PostedBY";
import BHK from "./searchFilters/BHK";

const Search = () => {
  const getState = JSON.parse(sessionStorage.getItem("initialState"));
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { data, error, isLoading } = useGetAllCitiesQuery();
  const [cancelButton, setCancelButton] = useState(false);
  const [clickIndex, setClickIndex] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchedItems, setSearchedItems] = useState([]);
  const [ptb, setPtb] = useState(false);
  const [bb, setBb] = useState(false);
  const [csb, setCsb] = useState(false);
  const [pbb, setPbb] = useState(false);
  const [bhkb, setBhkb] = useState(false);
  const [minPrice, setMinPrice] = useState(getState?.minPrice || 0);
  const [maxPrice, setMaxPrice] = useState(getState?.maxPrice || 100000000);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState(JSON.parse(localStorage.getItem("propertyType")) || []);
  const [constructionTypes, setConstructionTypes] = useState(getState?.construction || []);
  const [bhkTypes, setBhkTypes] = useState(getState?.bathroom || []);
  const [postedBy, setPostedBy] = useState(getState?.posted || []);
  const dispatch = useDispatch();
  const handleSearch = () => {
    //object
    const IsCityPresentInData = data?.cities?.some((city) => {
      const lowercaseTitle = city?.title?.toLowerCase();
      const lowerSearchTerm = searchTerm?.trim().toLowerCase();
      return lowercaseTitle === lowerSearchTerm;
    });

    if (IsCityPresentInData === false && searchTerm?.trim() !== "") {
      toast.error(`Opps!! ${searchTerm} not present in our database`);
      return;
    }
    if (minPrice > maxPrice) {
      toast.warning("Max Price should be greater than Min Price");
      return;
    }

    setSearching(true);

    if (searchTerm.trim() !== "") {
      const isPresent = searchedItems?.some(item => item?.term === searchTerm.trim());
      
      if (!isPresent) {
        const updatedSearchItems = [
          ...searchedItems,
          { term: searchTerm.trim(), timestamp: Date.now() }
        ];
    
        setSearchedItems(updatedSearchItems);
        localStorage.setItem("searchItems", JSON.stringify(updatedSearchItems));
      }
      else{
        const updatedSearchItems = searchedItems
          .map(item =>
            item.term === searchTerm.trim()
              ? { ...item, timestamp: Date.now() }
              : item
          )
          .sort((a, b) => a.timestamp - b.timestamp);
    
        setSearchedItems(updatedSearchItems);
        localStorage.setItem("searchItems", JSON.stringify(updatedSearchItems));
      }
    }
    
    dispatch(updateKeyword(searchTerm.trim()));
    dispatch(updateMinPrice(minPrice));
    dispatch(updateMaxPrice(maxPrice));
    dispatch(updateCategory(selectedPropertyTypes));
    dispatch(updatePage(page));
    dispatch(updateBhk(bhkTypes));
    dispatch(updateConstructionStatus(constructionTypes));
    dispatch(updatePostedBy(postedBy));
    dispatch(updateToggleSearch());
    setSearching(false);

    navigate(`/search`);
  };
  useEffect(() => {
    const searchedData = localStorage.getItem("searchItems")
      ? JSON.parse(localStorage.getItem("searchItems"))
      : [];
    setSearchedItems(searchedData);
  }, []);

  useEffect(() => {
    localStorage.setItem("propertyType", JSON.stringify(selectedPropertyTypes));
    dispatch(updateCategory(selectedPropertyTypes))
  }, [selectedPropertyTypes]);

  const removeSearchItems = (item) => {
    const updatedSearchItems = searchedItems?.filter((searchItem) => searchItem?.term !== item);
    setSearchedItems(updatedSearchItems);
    localStorage.setItem("searchItems", JSON.stringify(updatedSearchItems));
  };  

  const filteredCities = data?.cities?.filter((city) => {
    const lowercaseTitle = city?.title?.toLowerCase();
    return lowercaseTitle.includes(searchTerm?.trim().toLowerCase());
  });
  const initialState = {
    minPrice,
    maxPrice,
    bathroom:bhkTypes,
    construction:constructionTypes,
    posted:postedBy,
  }
  useEffect(() => {
    sessionStorage.setItem('initialState', JSON.stringify(initialState));
  }, [minPrice, maxPrice, bhkTypes, constructionTypes, postedBy]);
  useEffect(() => {
    const windowResize = () => {
      const isMobilePhone = window.innerWidth <= 992;
      setCancelButton(isMobilePhone);
    };
    const keypress = (e) => {
      if (e.key === "Escape") {
        dispatch(updateToggleSearch());
      }
      if (e.key === "Enter") {
        handleSearch();
      }
    }

    windowResize();
    window.addEventListener("resize", windowResize);
    window.addEventListener("keydown", keypress)
    return () => {
      window.removeEventListener("resize", windowResize);
      window.removeEventListener("keydown", keypress);
    };
  }, []);
  function toggleStateVariable(setter, otherSetters) {
    setter((prevState) => !prevState);
    otherSetters?.forEach(setter => setter(false));
  }

  function fptb() {
    toggleStateVariable(setPtb, [setBb, setCsb, setBhkb, setPbb]);
  }

  function fbb() {
    toggleStateVariable(setBb, [setPtb, setCsb, setBhkb, setPbb]);
  }

  function fcs() {
    toggleStateVariable(setCsb, [setPtb, setBb, setBhkb, setPbb]);
  }

  function fpbb() {
    toggleStateVariable(setPbb, [setPtb, setBb, setCsb, setBhkb]);
  }

  function bhkbutton() {
    toggleStateVariable(setBhkb, [setPtb, setBb, setCsb, setPbb]);
  }

  const toggleCheckbox = (propertyType) => {
    if (selectedPropertyTypes.includes(propertyType)) {
      setSelectedPropertyTypes((prevSelected) =>
        prevSelected?.filter((type) => type !== propertyType)
      );
    } else {
      setSelectedPropertyTypes((prevSelected) => [...prevSelected, propertyType]);
    }
  };

  const handleMinChange = (event) => {
    const newMin = parseInt(event.target.value, 10);
    setMinPrice(newMin);
    if (newMin > maxPrice) {
      setMaxPrice(newMin);
    }
  };

  const handleMaxChange = (event) => {
    const newMax = parseInt(event.target.value, 10);
    setMaxPrice(newMax);
    if (newMax < minPrice) {
      setMinPrice(newMax);
    }
  };

  function addToconstructionTypes(cType) {
    if (constructionTypes.includes(cType)) {
      setConstructionTypes((prevSelected) => prevSelected?.filter((type) => type !== cType));
    }
    else {
      setConstructionTypes((prevSelected) => [...prevSelected, cType]);
    }
  }

  function addToBhkTypes(bhkType) {
    if (bhkTypes.includes(bhkType)) {
      setBhkTypes((prevSelected) => prevSelected?.filter((type) => type !== bhkType));
    }
    else {
      setBhkTypes((prevSelected) => [...prevSelected, bhkType]);
    }
  }

  function addToPosted(pType) {
    if (postedBy.includes(pType)) {
      setPostedBy((prevSelected) => prevSelected.filter((type) => type !== pType));
    }
    else {
      setPostedBy((prevSelected) => [...prevSelected, pType]);
    }
  }
  return (
    <>
      <div
        className="fixed-top div-at-back"
        onClick={() => dispatch(updateToggleSearch())}
      >
      </div>
      <div className="fixed-top rounded-2 border border-light search-width">
        <div className="p-3">
          {cancelButton && (
            <div className="mb-2" style={{right:'0', top:'0', marginLeft:'10rem'}}>
              <span
                className="cancel-button"
                onClick={() => dispatch(updateToggleSearch())}
              >
                <RxCross1 />
              </span>
            </div>
          )}
          <div className="search-bar border border-1 rounded-2 border-primary bg-white">
            <div className="d-flex align-items-center px-1 py-2">
              <CiSearch size={35} className="mx-1 my-auto" />
              <input
                type="text"
                placeholder="Enter Locality / Landmark / City"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
                onClick={() => setClickIndex(true)}
              />
              {searchTerm && (
                <span
                  className="searchTerm-span"
                  onClick={() => setSearchTerm("")}
                >
                  &times;
                </span>
              )}
            </div>
          </div>
          {
            !searchTerm && searchedItems && (
              <div
                className="border-bottom border-2 border-primary filteredCities-scroll"
              >
                {searchedItems?.length ? searchedItems && !searchTerm &&
                  [...searchedItems]?.reverse()?.map((item, index) => (
                    <div
                      className="d-flex search-li my-1 border rounded-2"
                      key={index}
                    >
                      <PiClockClockwiseLight size={24} className="ms-2 me-3 my-auto" />
                      <li className="mx-1 my-2" key={index} style={{ width: "90%" }}
                        onClick={() => { setSearchTerm(item.term); setClickIndex(false); }}
                      >
                        {item.term}
                      </li>
                      <span
                        style={{
                          margin: "5px 10px 0 auto",
                          cursor: "pointer",
                          fontSize: "22px",
                        }}
                        onClick={() => removeSearchItems(item.term)}
                      >
                        &times;
                      </span>
                    </div>
                  ))
                  :
                  <div className="text-secondary d-flex fs-7 justify-content-center py-2 my-1 border-primary bg-light" style={{ fontSize: "12px" }}>No Recent Searches</div>
                }
              </div>
            )
          }
          {searchTerm && filteredCities && clickIndex && (
            <div
              className="border-bottom border-2 border-primary filteredCities-scroll"
            >
              {filteredCities?.length ?
                searchTerm &&
                !isLoading &&
                filteredCities?.map((city, index) => (
                  <div
                    className="d-flex search-li my-1 border rounded-2"
                    onClick={() => { setSearchTerm(city?.title); setClickIndex(false); }}
                    key={city?._id}
                  >
                    <CiSearch size={24} className="mx-1 my-auto" />
                    <li className="mx-1 my-2" key={city?._id}>
                      {city?.title}
                    </li>
                    <PiArrowUpRightLight style={{ margin: "auto 10px auto auto" }} />
                  </div>
                )) :
                <div className="text-secondary d-flex fs-7 justify-content-center py-2 my-1 border-primary bg-light" style={{ fontSize: "12px" }}>No Results Found</div>
              }
            </div>
          )}
          <Container fluid className="mt-3 p-0">
            <Form>
              <Container>
                <div className="searchSelectButtons">
                  <Button onClick={() => fptb()} className="ssb rounded-5" style={{ minWidth: "9rem" }}>Property Types {ptb ? <IoIosArrowUp /> : <IoIosArrowDown />}</Button>
                  <Button onClick={() => fbb()} className="ssb rounded-5" style={{ minWidth: "6rem" }}>Budget {bb ? <IoIosArrowUp /> : <IoIosArrowDown />}</Button>
                  <Button onClick={() => fcs()} className="ssb rounded-5" style={{ minWidth: "11rem" }}>Construction Status {csb ? <IoIosArrowUp /> : <IoIosArrowDown />}</Button>
                  <Button onClick={() => bhkbutton()} className="ssb rounded-5" style={{ minWidth: "4rem" }}>BHK {bhkb ? <IoIosArrowUp /> : <IoIosArrowDown />}</Button>
                  <Button onClick={() => fpbb()} className="ssb rounded-5" style={{ minWidth: "7rem" }}>Posted By{pbb ? <IoIosArrowUp /> : <IoIosArrowDown />}</Button>
                </div>
                <div className="my-3">
                  {ptb && (
                    <PropertyTypes toggleCheckbox={toggleCheckbox}  ptClassname={"col-lg-4 col-md-6"} />
                  )}
                  {bb &&
                    <Budget minPrice={minPrice} maxPrice={maxPrice} handleMinChange={handleMinChange} handleMaxChange={handleMaxChange} />
                  }
                  {csb && (
                    <ConstructionStatus addToconstructionTypes={addToconstructionTypes} constructionTypes={constructionTypes} Button={Button} RxCross1={RxCross1} BsPlusLg={BsPlusLg} />
                  )}
                  {bhkb && (
                    <BHK Button={Button} RxCross1={RxCross1} BsPlusLg={BsPlusLg} addToBhkTypes={addToBhkTypes} bhkTypes={bhkTypes} />
                  )}
                  {pbb && (
                    <PostedBY addToPosted={addToPosted} Button={Button} postedBy={postedBy} RxCross1={RxCross1} BsPlusLg={BsPlusLg} />
                  )}
                </div>
              </Container>
              <Row className="mt-3">
                <Col md={12}>
                  <Button
                    className="w-100 my-Button"
                    type="button"
                    onClick={handleSearch}
                    disabled={searching}
                  >
                    {searching ? "Searching..." : "Search"}

                  </Button>
                </Col>
              </Row>
            </Form>
          </Container>
        </div>
      </div>
    </>
  );
};

export default Search;