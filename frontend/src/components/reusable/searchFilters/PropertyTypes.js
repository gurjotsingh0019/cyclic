import React, { useEffect } from 'react'
import '../../styles/search.css'
import { useSelector } from 'react-redux';
const PropertyTypes = ({ toggleCheckbox, ptClassname }) => {
    const propertyTypes = [
        "Flat/Apartment",
        "Independent/Builder Floor",
        "Independent House/Villa",
        "Residential Land",
        "1 RK/Studio Apartment",
        "Farm House",
        "Serviced Apartments",
        "Condo",
        "Basement",
        "Others"
      ];
    
    const category = useSelector((state) => state.basicData.category)
    return (
        <div className="row">
            {propertyTypes?.map((propertyType) => (
                <div key={propertyType} className={ptClassname}>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id={propertyType}
                            checked={category && category?.includes(propertyType)}
                            onChange={() => toggleCheckbox(propertyType)}
                        />
                        <label className="form-check-label" htmlFor={propertyType} style={{ fontSize: "12px" }}>
                            {propertyType}
                        </label>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default PropertyTypes