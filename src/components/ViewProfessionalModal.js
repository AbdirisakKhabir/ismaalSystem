import React, { useState, useEffect, useRef } from 'react';
import './ViewProfessionalModal.css';

const ViewProfessionalModal = ({ professional, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const sliderRef = useRef(null);

  // Reset image index when modal opens with new professional
  useEffect(() => {
    if (isOpen && professional) {
      setCurrentImageIndex(0);
    }
  }, [isOpen, professional]);

  if (!isOpen || !professional) return null;

  // Helper to format date
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

  // Helper to get status badge class
  const getStatusClass = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'status-approved';
      case 'PENDING':
        return 'status-pending';
      case 'REJECTED':
        return 'status-rejected';
      case 'ACTIVE':
        return 'status-active';
      default:
        return 'status-default';
    }
  };

  // Get images array
  const getImages = () => {
    if (professional.images && Array.isArray(professional.images) && professional.images.length > 0) {
      return professional.images;
    }
    if (professional.image) {
      if (typeof professional.image === 'string' && professional.image.includes(',')) {
        return professional.image.split(',').map((url) => url.trim()).filter(Boolean);
      }
      return [professional.image];
    }
    return [];
  };

  const images = getImages();

  // Format profession array
  const formatProfession = (profession) => {
    if (Array.isArray(profession)) {
      return profession;
    }
    if (typeof profession === 'string' && profession.includes(',')) {
      return profession.split(',').map((p) => p.trim());
    }
    return profession ? [profession] : [];
  };

  const professions = formatProfession(professional.profession);

  const handlePrevImage = () => {
    if (isTransitioning || images.length <= 1) return;
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 400);
  };

  const handleNextImage = () => {
    if (isTransitioning || images.length <= 1) return;
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsTransitioning(false), 400);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentImageIndex) return;
    setIsTransitioning(true);
    setCurrentImageIndex(index);
    setTimeout(() => setIsTransitioning(false), 400);
  };

  // Touch handlers for swipe support
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
    
    if (isLeftSwipe) {
      handleNextImage();
    } else if (isRightSwipe) {
      handlePrevImage();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="view-professional-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="view-modal-header">
          <h2>Professional Details</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="view-modal-content">
          {/* Image Gallery with Slider */}
          <div className="professional-gallery">
            {images.length > 0 ? (
              <>
                <div 
                  className="gallery-slider-container"
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                >
                  <div 
                    className="gallery-slider"
                    ref={sliderRef}
                    style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                  >
                    {images.map((img, index) => (
                      <div key={index} className="slide">
                        <img
                          src={img}
                          alt={`${professional.specialty} ${index + 1}`}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button className="gallery-nav prev" onClick={handlePrevImage}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button className="gallery-nav next" onClick={handleNextImage}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {images.length > 1 && (
                    <div className="image-counter">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  )}
                </div>

                {/* Dot Indicators */}
                {images.length > 1 && (
                  <div className="gallery-dots">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        className={`dot ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="no-image">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>No Image Available</span>
              </div>
            )}
          </div>

          {/* Professional Info */}
          <div className="professional-info">
            {/* Header with Status */}
            <div className="info-header">
              <div className="header-text">
                <h3 className="professional-specialty">{professional.specialty || 'Professional'}</h3>
                {professional.userName && (
                  <p className="professional-user">by {professional.userName}</p>
                )}
              </div>
              <span className={`status-badge ${getStatusClass(professional.status)}`}>
                {professional.status}
              </span>
            </div>

            {/* Professions */}
            <div className="professions-section">
              <label>Professions</label>
              <div className="profession-tags">
                {professions.map((prof, index) => (
                  <span key={index} className="profession-tag">{prof}</span>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="experience-section">
              <label>Experience Level</label>
              <span className="experience-value">{professional.experience || 'N/A'}</span>
            </div>

            {/* Description */}
            {professional.description && (
              <div className="info-section">
                <label>About</label>
                <p className="description-text">{professional.description}</p>
              </div>
            )}

            {/* Contact Details Grid */}
            <div className="contact-grid">
              {/* Email */}
              <div className="contact-item">
                <label>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.66666 2.66667H13.3333C14.0667 2.66667 14.6667 3.26667 14.6667 4.00001V12C14.6667 12.7333 14.0667 13.3333 13.3333 13.3333H2.66666C1.93332 13.3333 1.33332 12.7333 1.33332 12V4.00001C1.33332 3.26667 1.93332 2.66667 2.66666 2.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14.6667 4L8 8.66667L1.33334 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Email
                </label>
                <span>{professional.email || 'N/A'}</span>
              </div>

              {/* Phone */}
              <div className="contact-item">
                <label>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.6667 11.28V13.28C14.6674 13.4657 14.6294 13.6495 14.5551 13.8196C14.4809 13.9897 14.3721 14.1424 14.2359 14.2679C14.0997 14.3934 13.9389 14.489 13.7634 14.5485C13.5879 14.608 13.4016 14.6301 13.2167 14.6133C11.1591 14.3904 9.18635 13.6894 7.46001 12.5667C5.84926 11.5431 4.48359 10.1774 3.46001 8.56668C2.33336 6.83175 1.6322 4.84897 1.41334 2.78334C1.39668 2.59899 1.41857 2.41323 1.47766 2.23816C1.53676 2.06309 1.63176 1.90255 1.75655 1.76645C1.88134 1.63034 2.03324 1.52135 2.20256 1.44665C2.37189 1.37195 2.55491 1.33326 2.74001 1.33334H4.74001C5.06354 1.33013 5.37719 1.4447 5.62251 1.6557C5.86784 1.86669 6.02809 2.15962 6.07334 2.48001C6.15775 3.12003 6.31431 3.74847 6.54001 4.35334C6.62973 4.59193 6.64915 4.85126 6.59597 5.10057C6.5428 5.34988 6.41928 5.57872 6.24001 5.76001L5.39334 6.60668C6.34241 8.27568 7.72434 9.65761 9.39334 10.6067L10.24 9.76001C10.4213 9.58074 10.6501 9.45765 10.8994 9.40447C11.1488 9.3513 11.4081 9.37072 11.6467 9.46001C12.2516 9.68571 12.88 9.84227 13.52 9.92668C13.8439 9.97234 14.1396 10.1355 14.351 10.385C14.5625 10.6345 14.6748 10.9531 14.6667 11.28Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Phone
                </label>
                <span>{professional.phone || 'N/A'}</span>
              </div>

              {/* Location */}
              <div className="contact-item full-width">
                <label>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 8.66667C9.10457 8.66667 10 7.77124 10 6.66667C10 5.5621 9.10457 4.66667 8 4.66667C6.89543 4.66667 6 5.5621 6 6.66667C6 7.77124 6.89543 8.66667 8 8.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 14.6667C10.6667 12 13.3333 9.61217 13.3333 6.66667C13.3333 3.72115 10.9455 1.33333 8 1.33333C5.05448 1.33333 2.66666 3.72115 2.66666 6.66667C2.66666 9.61217 5.33333 12 8 14.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Location
                </label>
                <span>{professional.location || 'N/A'}</span>
              </div>
            </div>

            {/* Timestamps */}
            <div className="timestamps-section">
              <div className="timestamp-item">
                <label>Professional ID</label>
                <span>#{professional.id}</span>
              </div>
              <div className="timestamp-item">
                <label>User ID</label>
                <span>#{professional.userId}</span>
              </div>
              <div className="timestamp-item">
                <label>Submitted</label>
                <span>{formatDate(professional.submittedDate)}</span>
              </div>
              <div className="timestamp-item">
                <label>Created</label>
                <span>{formatDate(professional.createdAt)}</span>
              </div>
              <div className="timestamp-item">
                <label>Last Updated</label>
                <span>{formatDate(professional.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="view-modal-footer">
          <button className="btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProfessionalModal;
