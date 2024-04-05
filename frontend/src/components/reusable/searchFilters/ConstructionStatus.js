import React from 'react'
import '../../styles/search.css'

const ConstructionStatus = ({ addToconstructionTypes, constructionTypes, Button, RxCross1, BsPlusLg }) => {
    const ConstructionStatus = ["New Launch", "Resale", "Under Construction", "Ready to move"];
    return (
        <>
            <p>Construction Status</p>
            <div className="d-flex flex-wrap">
                {ConstructionStatus?.map((cType) => (
                    <div key={cType} className="">
                        <Button onClick={() => addToconstructionTypes(cType)} className={`rounded-5 ${constructionTypes.includes(cType) ? 'postedStyle' : 'ssb'}`}> {constructionTypes.includes(cType) ? <RxCross1 className="me-1 mb-1" /> : <BsPlusLg className="me-1 mb-1" />}{cType}</Button>
                    </div>
                ))}
            </div>
        </>
    )
}

export default ConstructionStatus