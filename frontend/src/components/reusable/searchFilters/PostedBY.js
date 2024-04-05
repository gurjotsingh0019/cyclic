import React from 'react'
import '../../styles/search.css'

const PostedBY = ({ addToPosted, Button, postedBy, RxCross1, BsPlusLg }) => {
  const posted = ["Owner", "Builder", "Dealer"];
  return (
    <>
      <p>Posted By</p>
      <div className="d-flex flex-wrap">
        {posted?.map((pType) => (
          <div key={pType}>
            <Button onClick={() => addToPosted(pType)} className={`rounded-5 ${postedBy.includes(pType) ? 'postedStyle' : 'ssb'}`}> {postedBy.includes(pType) ? <RxCross1 className="me-1 mb-1" /> : <BsPlusLg className="me-1 mb-1" />}{pType}</Button>
          </div>
        ))}
      </div>
    </>
  )
}

export default PostedBY