import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage, onItemsPerPageChange, showItemsPerPage = true }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1 && !showItemsPerPage) return null;

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        {showItemsPerPage && (
          <div className="items-per-page">
            <span>Show</span>
            <select value={itemsPerPage} onChange={(e) => onItemsPerPageChange(Number(e.target.value))} className="per-page-select">
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>
        )}
        <span className="showing-text">Showing {startItem} to {endItem} of {totalItems} entries</span>
      </div>
      <div className="pagination-controls">
        <button className="pagination-btn prev" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Previous
        </button>
        <div className="pagination-pages">
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
            ) : (
              <button key={page} className={`pagination-page ${currentPage === page ? 'active' : ''}`} onClick={() => onPageChange(page)}>{page}</button>
            )
          ))}
        </div>
        <button className="pagination-btn next" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
