import React from 'react'
import '../../styles/search.css'

const BHK = ({ Button, RxCross1, BsPlusLg, addToBhkTypes, bhkTypes }) => {
    const bedrooms = ["1 RK/1 BHK", "2 BHK", "3 BHK", "4 BHK", "more than 4 BHK's"];

    return (
        <>
            <p>Number of Bedrooms</p>
            <div className="d-flex flex-wrap">
                {bedrooms?.map((bhkType) => (
                    <div key={bhkType} className="">
                        <Button onClick={() => addToBhkTypes(bhkType)} className={`rounded-5 ${bhkTypes?.includes(bhkType) ? 'postedStyle' : 'ssb'}`}> {bhkTypes?.includes(bhkType) ? <RxCross1 className="me-1 mb-1" /> : <BsPlusLg className="me-1 mb-1" />}{bhkType}</Button>
                    </div>
                ))}
            </div>
        </>
    )
}

export default BHK