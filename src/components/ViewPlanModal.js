import React from 'react';
import './ViewPlanModal.css';

const ViewPlanModal = ({ plan, isOpen, onClose }) => {
  if (!isOpen || !plan) return null;

  // Helper to format price
  const formatPrice = (plan, period) => {
    if (!plan) return '';
    const monthly = plan.priceMonthly ?? plan.price ?? 0;
    const yearly = plan.priceYearly ?? 0;
    const price = period === 'YEARLY' ? yearly : monthly;
    return price === 0 ? 'Free' : `$${parseFloat(price).toFixed(2)}`;
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

  // Helper to get profile status class
  const getProfileStatusClass = (status) => {
    if (!status) return 'profile-status-default';
    const statusLower = status.toLowerCase();
    if (statusLower === 'active' || statusLower === 'enabled') return 'profile-status-active';
    if (statusLower === 'inactive' || statusLower === 'disabled') return 'profile-status-inactive';
    return 'profile-status-default';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="view-plan-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="view-plan-header">
          <div className="plan-header-content">
            <h2>{plan.name}</h2>
            <span className={`price-tag ${(plan.priceMonthly ?? plan.price ?? 0) === 0 && (plan.priceYearly ?? 0) === 0 ? 'free' : 'paid'}`}>
              {formatPrice(plan, 'MONTHLY')} / {formatPrice(plan, 'YEARLY')}
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="view-plan-content">
          {/* Plan Overview Card */}
          <div className="plan-overview-card">
            <div className="overview-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="24" cy="24" r="24" fill="#f3e8ff"/>
                <path d="M24 14L30 18V26L24 30L18 26V18L24 14Z" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M24 30V22M24 22L30 18M24 22L18 18" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="overview-details">
              <span className="overview-label">Plan ID</span>
              <span className="overview-value">#{plan.id}</span>
            </div>
            <div className="overview-details">
              <span className="overview-label">Monthly Price</span>
              <span className="overview-value">{formatPrice(plan, 'MONTHLY')}</span>
            </div>
            <div className="overview-details">
              <span className="overview-label">Yearly Price</span>
              <span className="overview-value">{formatPrice(plan, 'YEARLY')}</span>
            </div>
            <div className="overview-details">
              <span className="overview-label">Profile Status</span>
              <span className={`profile-status-badge ${getProfileStatusClass(plan.profile_status)}`}>
                {plan.profile_status || 'N/A'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="plan-section">
            <h3>Description</h3>
            <p className="plan-description-text">
              {plan.description || 'No description available for this plan.'}
            </p>
          </div>

          {/* Limits */}
          <div className="plan-limits-section">
            <h3>Plan Limits</h3>
            <div className="limits-grid">
              <div className="limit-card businesses">
                <div className="limit-icon">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.33333 28V12L16 4L26.6667 12V28H18.6667V18.6667H13.3333V28H5.33333Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="limit-info">
                  <span className="limit-value">{plan.allowedBusinesses}</span>
                  <span className="limit-label">Businesses Allowed</span>
                </div>
              </div>
              <div className="limit-card products">
                <div className="limit-icon">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M26.6667 9.33333L16 2.66667L5.33333 9.33333M26.6667 9.33333L16 16M26.6667 9.33333V22.6667L16 29.3333M16 16L5.33333 9.33333M16 16V29.3333M5.33333 9.33333V22.6667L16 29.3333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="limit-info">
                  <span className="limit-value">{plan.allowedProducts}</span>
                  <span className="limit-label">Products Allowed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subscribed Users */}
          <div className="plan-users-section">
            <h3>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.3333 17.5V15.8333C13.3333 14.9493 12.9821 14.1014 12.357 13.4763C11.7319 12.8512 10.884 12.5 10 12.5H5C4.11595 12.5 3.26809 12.8512 2.64298 13.4763C2.01786 14.1014 1.66667 14.9493 1.66667 15.8333V17.5M18.3333 17.5V15.8333C18.3329 15.0948 18.087 14.3773 17.6345 13.7936C17.182 13.2099 16.5484 12.793 15.8333 12.6083M13.3333 2.60833C14.0503 2.79192 14.6858 3.20892 15.1396 3.79359C15.5935 4.37827 15.8398 5.09736 15.8398 5.8375C15.8398 6.57764 15.5935 7.29673 15.1396 7.88141C14.6858 8.46608 14.0503 8.88308 13.3333 9.06667M10 5.83333C10 7.67428 8.50762 9.16667 6.66667 9.16667C4.82572 9.16667 3.33334 7.67428 3.33334 5.83333C3.33334 3.99238 4.82572 2.5 6.66667 2.5C8.50762 2.5 10 3.99238 10 5.83333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Subscribed Users ({plan.users?.length || 0})
            </h3>
            {plan.users && plan.users.length > 0 ? (
              <div className="users-list">
                {plan.users.map((user, index) => (
                  <div key={index} className="user-item">
                    <div className="user-avatar">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="user-info">
                      <span className="user-name">{user.name || 'Unknown'}</span>
                      <span className="user-email">{user.email || 'No email'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-users">
                <p>No users subscribed to this plan yet.</p>
              </div>
            )}
          </div>

          {/* Timestamps */}
          <div className="plan-timestamps">
            <div className="timestamp-item">
              <span className="timestamp-label">Created</span>
              <span className="timestamp-value">{formatDate(plan.createdAt)}</span>
            </div>
            <div className="timestamp-item">
              <span className="timestamp-label">Last Updated</span>
              <span className="timestamp-value">{formatDate(plan.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="view-plan-footer">
          <button className="btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewPlanModal;
