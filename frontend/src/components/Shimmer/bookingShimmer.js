import React from 'react';

const bookingShimmer = () => {

    const isMyBooking = window.location.href.includes('my-bookings');


    return (
        <div className='my-2 p-1'>
            <div className='p-1 px-2 my-auto'>
                <h4 className='bh1 d-flex justify-content-center fs-1'>My Bookings</h4>
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <th className='cartHeading'>{isMyBooking ? "Index" : "No."}</th>
                            <th className='posSpan1'>Check In</th>
                            <th className='posSpan1'>Check Out</th>
                            {isMyBooking && <th className='posSpan1'>Booking Type</th>}
                            {isMyBooking && <th className='posSpan1'>Total Guests</th>}
                            <th className='posSpan1'>Paid On</th>
                            <th className='posSpan1'>Total Price</th>
                            {isMyBooking && <th className='posSpan1'>Created On</th>}
                            <th className='posSpan1'>Phone Number</th>
                            <th className='posSpan1'>View</th>

                            {!isMyBooking && <th className='listHeading'>Listed</th>}
                            {isMyBooking && <th className='listHeading'>Delete</th>}
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

export default bookingShimmer;
