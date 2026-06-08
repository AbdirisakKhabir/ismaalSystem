import React, { useState, useEffect, useRef } from 'react';
import './ViewProductModal.css';

const ViewProductModal = ({ product, isOpen, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const sliderRef = useRef(null);

  // Reset image index when modal opens with new product
  useEffect(() => {
    if (isOpen && product) {
      setCurrentImageIndex(0);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  // Helper to format price based on price_option
  const formatPrice = () => {
    const price = product.price;
    const priceTo = product.price_to;
    const priceOption = product.price_option;
    const crossedPrice = product.crossed_price;

    switch (priceOption) {
      case 'Range':
        return (
          <div className="price-range">
            <span className="price-main">${price} - ${priceTo}</span>
          </div>
        );
      case 'Negotiable':
        return (
          <div className="price-negotiable">
            {price ? <span className="price-main">${price}</span> : null}
            <span className="price-tag negotiable">Negotiable</span>
          </div>
        );
      case 'Crossed':
        return (
          <div className="price-crossed">
            <span className="price-main">${price}</span>
            {crossedPrice && (
              <span className="price-original">${crossedPrice}</span>
            )}
          </div>
        );
      case 'Fixed':
      default:
        return <span className="price-main">${price || 'N/A'}</span>;
    }
  };

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
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }
    if (product.primaryImage) {
      return [product.primaryImage];
    }
    if (product.image) {
      if (typeof product.image === 'string' && product.image.includes(',')) {
        return product.image.split(',').map((url) => url.trim()).filter(Boolean);
      }
      return [product.image];
    }
    return [];
  };

  const images = getImages();

  // Format category
  const formatCategory = (category) => {
    if (Array.isArray(category)) {
      return category;
    }
    if (typeof category === 'string' && category.includes(',')) {
      return category.split(',').map((c) => c.trim());
    }
    return category ? [category] : [];
  };

  const categories = formatCategory(product.category);

  const handlePrevImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setTimeout(() => setIsTransitioning(false), 400);
  };

  const handleNextImage = () => {
    if (isTransitioning) return;
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
      <div className="view-product-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="view-modal-header">
          <h2>Product Details</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="view-modal-content">
          {/* Image Gallery with Slider */}
          <div className="product-gallery">
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
                          alt={`${product.name} ${index + 1}`}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
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

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="gallery-thumbnails">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                      >
                        <img
                          src={img}
                          alt={`${product.name} ${index + 1}`}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="no-image">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                  <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>No Image Available</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            {/* Title & Status */}
            <div className="info-header">
              <h3 className="product-title">{product.name}</h3>
              <span className={`status-badge ${getStatusClass(product.status)}`}>
                {product.status}
              </span>
            </div>

            {/* Price Section */}
            <div className="price-section">
              <label>Price</label>
              <div className="price-display">
                {formatPrice()}
                <span className="price-option-badge">{product.price_option || 'Fixed'}</span>
              </div>
            </div>

            {/* Description */}
            <div className="info-section">
              <label>Description</label>
              <p className="description-text">{product.description || 'No description available'}</p>
            </div>

            {/* Details Grid */}
            <div className="details-grid">
              {/* Category */}
              <div className="detail-item">
                <label>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 4.66667L8 1.33333L14 4.66667M2 4.66667L8 8M2 4.66667V11.3333L8 14.6667M14 4.66667L8 8M14 4.66667V11.3333L8 14.6667M8 8V14.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Category
                </label>
                <div className="category-tags">
                  {categories.map((cat, index) => (
                    <span key={index} className="category-tag">{cat}</span>
                  ))}
                </div>
              </div>

              {/* Type */}
              <div className="detail-item">
                <label>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5.33333V8L10 10M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Condition
                </label>
                <span className="type-value">{product.type || 'New'}</span>
              </div>

              {/* Location */}
              <div className="detail-item">
                <label>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 8.66667C9.10457 8.66667 10 7.77124 10 6.66667C10 5.5621 9.10457 4.66667 8 4.66667C6.89543 4.66667 6 5.5621 6 6.66667C6 7.77124 6.89543 8.66667 8 8.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 14.6667C10.6667 12 13.3333 9.61217 13.3333 6.66667C13.3333 3.72115 10.9455 1.33333 8 1.33333C5.05448 1.33333 2.66666 3.72115 2.66666 6.66667C2.66666 9.61217 5.33333 12 8 14.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Location
                </label>
                <span>{product.location || 'N/A'}</span>
              </div>

              {/* Posted From */}
              <div className="detail-item">
                <label>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.6667 14V12.6667C10.6667 11.9594 10.3857 11.2811 9.88562 10.781C9.38552 10.281 8.70724 10 8 10H4C3.29276 10 2.61448 10.281 2.11438 10.781C1.61428 11.2811 1.33333 11.9594 1.33333 12.6667V14M14.6667 14V12.6667C14.6663 12.0758 14.4695 11.5018 14.1076 11.0349C13.7457 10.568 13.2388 10.2344 12.6667 10.0867M10.6667 2.08667C11.2403 2.23353 11.7487 2.56713 12.1117 3.03487C12.4748 3.50261 12.6719 4.07789 12.6719 4.67C12.6719 5.26211 12.4748 5.83739 12.1117 6.30513C11.7487 6.77287 11.2403 7.10647 10.6667 7.25333M8 6.66667C9.47276 6.66667 10.6667 5.47276 10.6667 4C10.6667 2.52724 9.47276 1.33333 8 1.33333C6.52724 1.33333 5.33333 2.52724 5.33333 4C5.33333 5.47276 6.52724 6.66667 8 6.66667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Posted From
                </label>
                <span>{product.posted_from || 'Personal'}</span>
              </div>
            </div>

            {/* Timestamps */}
            <div className="timestamps-section">
              <div className="timestamp-item">
                <label>Product ID</label>
                <span>#{product.id}</span>
              </div>
              <div className="timestamp-item">
                <label>User ID</label>
                <span>#{product.userId}</span>
              </div>
              <div className="timestamp-item">
                <label>Submitted</label>
                <span>{formatDate(product.submittedDate)}</span>
              </div>
              <div className="timestamp-item">
                <label>Created</label>
                <span>{formatDate(product.createdAt)}</span>
              </div>
              <div className="timestamp-item">
                <label>Last Updated</label>
                <span>{formatDate(product.updatedAt)}</span>
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

export default ViewProductModal;
