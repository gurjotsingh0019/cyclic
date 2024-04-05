import React from 'react'
import '../../styles/search.css'
import {formatPrice} from '../FormatPrice.js'

const Budget = ({ minPrice, maxPrice, handleMinChange, handleMaxChange }) => {
    return (
        <div className="mb-3">
            <label htmlFor="minRange" className="form-label">Min Price: {formatPrice(minPrice)}</label>
            <input type="range" className="form-range" id="minRange" min="0" max="100000000" step="1" value={minPrice} onChange={handleMinChange} />

            <label htmlFor="maxRange" className="form-label">Max Price: {formatPrice(maxPrice)}</label>
            <input type="range" className="form-range" id="maxRange" min="0" max="100000000" step="1" value={maxPrice} onChange={handleMaxChange} />
        </div>
    )
}

export default Budget