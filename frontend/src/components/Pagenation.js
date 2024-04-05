import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updatePage } from '../slices/basicDataSlice';

const Pagenation = ({ houseCount, resultPerPage, filterHouses }) => {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(houseCount / resultPerPage);

    if (totalPages <= 1) {
        return null;
    }

    const gotoPageNumber = (i) => {
        if (i === currentPage) {
            return;
        }
        setCurrentPage(i);
        dispatch(updatePage(i));
    }

    const gotoPrevNumber = () => {
        if (currentPage === 1) {
            return;
        }
        const prev = currentPage - 1;
        setCurrentPage(prev);
        dispatch(updatePage(prev));
    }

    const gotoNextNumber = () => {
        if (currentPage === totalPages) {
            return;
        }
        const next = currentPage + 1;
        setCurrentPage(next);
        dispatch(updatePage(next));
    }

    const renderPaginationLinks = () => {
        const links = [];
        const maxPagesToShow = 4;

        // Calculate the range of pages to display
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        // Adjust the startPage if we are near the end of the totalPages
        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            links?.push(
                <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`} style={{ cursor: 'pointer' }} onClick={() => gotoPageNumber(i)}>
                    <div className="page-link cursor-pointer fs-4">
                        {i}
                    </div>
                </li>
            );
        }

        return links;
    };

    return (
        <>
            <nav aria-label="Page navigation example">
                <ul className="pagination">
                    <li className="page-item" style={{ cursor: 'pointer' }} onClick={() => gotoPrevNumber()}>
                        <div className="page-link fs-4" aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                        </div>
                    </li>
                    {filterHouses === resultPerPage && renderPaginationLinks()}
                    {filterHouses === resultPerPage && 
                    <li className="page-item" style={{ cursor: 'pointer' }} onClick={() => gotoNextNumber()}>
                        <div className="page-link fs-4" aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                        </div>
                    </li>
}
                </ul>
            </nav>
        </>
    );
};

export default Pagenation;
