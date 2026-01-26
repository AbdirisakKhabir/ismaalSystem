import React, { useState, useRef } from 'react';
import './ViewSubmissionModal.css';

const ViewSubmissionModal = ({ submission, isOpen, onClose, onApprove, onReject, isApproving, isRejecting }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const sliderRef = useRef(null);

  if (!isOpen || !submission) return null;

  // Get images array
  const getImages = () => {
    if (submission.image) {
      return submission.image.split(',').map(img => img.trim()).filter(img => img);
    }
    if (submission.logo) {
      return [submission.logo];
    }
    return [];
  };

  const images = getImages();

  // Image navigation handlers
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setCurrentImageIndex(index);
  };

  // Touch handlers for swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) handleNextImage();
    if (isRightSwipe) handlePrevImage();
  };

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeBadgeClass = (type) => {
    if (!type) return 'type-default';
    const typeLower = type.toLowerCase();
    if (typeLower === 'business') return 'type-business';
    if (typeLower === 'product') return 'type-product';
    if (typeLower === 'professional') return 'type-professional';
    return 'type-default';
  };

  const getStatusBadgeClass = (status) => {
    if (!status) return 'status-pending';
    const statusLower = status.toLowerCase();
    if (statusLower === 'approved' || statusLower === 'active') return 'status-approved';
    if (statusLower === 'rejected') return 'status-rejected';
    return 'status-pending';
  };

  const formatPrice = (price) => {
    if (!price) return null;
    return `$${parseFloat(price).toFixed(2)}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="view-submission-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="view-submission-header">
          <div className="header-info">
            <span className={`type-badge ${getTypeBadgeClass(submission.type)}`}>
              {submission.type || 'Submission'}
            </span>
            <span className={`status-badge ${getStatusBadgeClass(submission.status)}`}>
              {submission.status || 'PENDING'}
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="view-submission-content">
          {/* Image Carousel */}
          {images.length > 0 && (
            <div className="submission-image-section">
              <div
                className="image-carousel"
                ref={sliderRef}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <div
                  className="carousel-track"
                  style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                >
                  {images.map((img, index) => (
                    <div key={index} className="carousel-slide">
                      <img src={img} alt={`${submission.name} ${index + 1}`} />
                    </div>
                  ))}
                </div>

                {images.length > 1 && (
                  <>
                    <button className="carousel-nav prev" onClick={handlePrevImage}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button className="carousel-nav next" onClick={handleNextImage}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>

                    <div className="carousel-counter">
                      {currentImageIndex + 1} / {images.length}
                    </div>

                    <div className="carousel-dots">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                          onClick={() => goToSlide(index)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Main Info */}
          <div className="submission-main-info">
            <h2>{submission.name}</h2>
            <p className="submission-id">ID: #{submission.id}</p>
          </div>

          {/* Description */}
          {submission.description && (
            <div className="info-section">
              <h3>Description</h3>
              <p className="description-text">{submission.description}</p>
            </div>
          )}

          {/* Details Grid */}
          <div className="details-grid">
            {/* Location */}
            {submission.location && (
              <div className="detail-item">
                <div className="detail-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.6667 8.33334C16.6667 14.1667 10 18.3333 10 18.3333C10 18.3333 3.33334 14.1667 3.33334 8.33334C3.33334 6.56522 4.03572 4.86954 5.28596 3.6193C6.5362 2.36905 8.23189 1.66667 10 1.66667C11.7681 1.66667 13.4638 2.36905 14.7141 3.6193C15.9643 4.86954 16.6667 6.56522 16.6667 8.33334Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 10.8333C11.3807 10.8333 12.5 9.71405 12.5 8.33334C12.5 6.95263 11.3807 5.83334 10 5.83334C8.61929 5.83334 7.5 6.95263 7.5 8.33334C7.5 9.71405 8.61929 10.8333 10 10.8333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="detail-content">
                  <span className="detail-label">Location</span>
                  <span className="detail-value">{submission.location}</span>
                </div>
              </div>
            )}

            {/* Price */}
            {submission.price && (
              <div className="detail-item">
                <div className="detail-icon price">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 0.833336V19.1667M14.1667 4.16667H7.91667C7.14312 4.16667 6.40125 4.47396 5.85427 5.02094C5.30729 5.56792 5 6.30979 5 7.08334C5 7.85688 5.30729 8.59876 5.85427 9.14573C6.40125 9.69271 7.14312 10 7.91667 10H12.0833C12.8569 10 13.5987 10.3073 14.1457 10.8543C14.6927 11.4013 15 12.1431 15 12.9167C15 13.6902 14.6927 14.4321 14.1457 14.9791C13.5987 15.526 12.8569 15.8333 12.0833 15.8333H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="detail-content">
                  <span className="detail-label">Price</span>
                  <span className="detail-value">{formatPrice(submission.price)}</span>
                </div>
              </div>
            )}

            {/* Category */}
            {submission.category && (
              <div className="detail-item">
                <div className="detail-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.5 5.83334L10 1.66667L2.5 5.83334M17.5 5.83334L10 10M17.5 5.83334V14.1667L10 18.3333M10 10L2.5 5.83334M10 10V18.3333M2.5 5.83334V14.1667L10 18.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="detail-content">
                  <span className="detail-label">Category</span>
                  <span className="detail-value">{submission.category}</span>
                </div>
              </div>
            )}

            {/* Specialty */}
            {submission.specialty && (
              <div className="detail-item">
                <div className="detail-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 1.66667L12.575 6.88334L18.3333 7.725L14.1667 11.7833L15.15 17.5167L10 14.8083L4.85 17.5167L5.83333 11.7833L1.66667 7.725L7.425 6.88334L10 1.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="detail-content">
                  <span className="detail-label">Specialty</span>
                  <span className="detail-value">{submission.specialty}</span>
                </div>
              </div>
            )}

            {/* Experience */}
            {submission.experience && (
              <div className="detail-item">
                <div className="detail-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.6667 3.33334H3.33334C2.41286 3.33334 1.66667 4.07953 1.66667 5.00001V15C1.66667 15.9205 2.41286 16.6667 3.33334 16.6667H16.6667C17.5872 16.6667 18.3333 15.9205 18.3333 15V5.00001C18.3333 4.07953 17.5872 3.33334 16.6667 3.33334Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13.3333 16.6667V1.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="detail-content">
                  <span className="detail-label">Experience</span>
                  <span className="detail-value">{submission.experience}</span>
                </div>
              </div>
            )}
          </div>

          {/* Submitter Info */}
          <div className="submitter-section">
            <h3>Submitted By</h3>
            <div className="submitter-card">
              <div className="submitter-avatar-lg">
                {submission.user?.name ? submission.user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="submitter-info-lg">
                <span className="name">{submission.user?.name || 'Unknown User'}</span>
                <span className="email">{submission.user?.email || 'No email provided'}</span>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="timestamps-section">
            <div className="timestamp-item">
              <span className="label">Submitted</span>
              <span className="value">{formatDate(submission.submittedDate || submission.createdAt)}</span>
            </div>
            <div className="timestamp-item">
              <span className="label">Last Updated</span>
              <span className="value">{formatDate(submission.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Footer with Actions */}
        <div className="view-submission-footer">
          <button className="btn-close" onClick={onClose}>
            Close
          </button>
          <div className="action-buttons-footer">
            <button
              className="btn-reject-footer"
              onClick={() => onReject(submission)}
              disabled={isRejecting || submission.status === 'REJECTED'}
            >
              {isRejecting ? (
                <>
                  <span className="spinner-small"></span>
                  Rejecting...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Reject
                </>
              )}
            </button>
            <button
              className="btn-approve-footer"
              onClick={() => onApprove(submission)}
              disabled={isApproving || submission.status === 'APPROVED'}
            >
              {isApproving ? (
                <>
                  <span className="spinner-small"></span>
                  Approving...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Approve
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSubmissionModal;
