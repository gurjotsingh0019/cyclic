import React from 'react';

const listingShimmer = () => {

    const isPageMyListing = window.location.href.includes('my-listings');


    return (
        <div className='my-2 p-1'>
            <div className='p-1 px-2 my-auto'>
                <h4 className='bh1 d-flex justify-content-center fs-1'>My Listings</h4>
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <th className='cartHeading'>{isPageMyListing ? "Index" : "No."}</th>
                            <th className='listHeading'>Location</th>
                            <th className='listHeading'>Category</th>
                            {isPageMyListing && <th className='listHeading'>Construction Status</th>}
                            <th className='listHeading'>Created</th>
                            <th className='listHeading'>Updated</th>
                            <th className='listHeading'>Availability</th>
                            <th className='listHeading'>View</th>
                            {isPageMyListing && <th className='listHeading'>Update</th>}
                            {!isPageMyListing && <th className='listHeading'>Listed</th>}
                            {isPageMyListing && <th className='listHeading'>Delete</th>}
                        </tr>
                    </thead>
                </table>
                <div className='placeholder-glow'>
                    <span class="placeholder w-100 rounded-1 my-1" style={{ height: '2.8rem' }}></span>
                    <span class="placeholder w-100 rounded-1 my-1" style={{ height: '2.8rem' }}></span>
                    <span class="placeholder w-100 rounded-1 my-1" style={{ height: '2.8rem' }}></span>
                    <span class="placeholder w-100 rounded-1 my-1" style={{ height: '2.8rem' }}></span>
                    <span class="placeholder w-100 rounded-1 my-1" style={{ height: '2.8rem' }}></span>
                </div>
            </div>
        </div>
    );
};

export default listingShimmer;