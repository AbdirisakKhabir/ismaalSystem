import React from 'react';
import './ViewUserModal.css';

const ViewUserModal = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null;

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

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getPlanBadgeClass = (plan) => {
    if (!plan) return 'plan-free';
    const planName = plan.name?.toLowerCase() || '';
    if (planName.includes('premium') || planName.includes('pro')) return 'plan-premium';
    if (planName.includes('business') || planName.includes('enterprise')) return 'plan-business';
    return 'plan-free';
  };

  const businessCount = user.businesses?.length || user._count?.businesses || 0;
  const productCount = user.products?.length || user._count?.products || 0;
  const professionalCount = user.professionals?.length || user._count?.professionals || 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="view-user-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="view-user-header">
          <div className="user-header-content">
            <div className="user-avatar-lg">
              {getInitials(user.name)}
            </div>
            <div className="user-header-info">
              <h2>{user.name || 'Unknown User'}</h2>
              <span className="user-email">{user.email || 'No email'}</span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="view-user-content">
          {/* User ID Card */}
          <div className="user-id-card">
            <span className="id-label">User ID</span>
            <span className="id-value">#{user.id}</span>
          </div>

          {/* Account Info */}
          <div className="info-section">
            <h3>Account Information</h3>
            <div className="contact-grid">
              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.6667 3.33334H3.33334C2.41286 3.33334 1.66667 4.07953 1.66667 5.00001V15C1.66667 15.9205 2.41286 16.6667 3.33334 16.6667H16.6667C17.5872 16.6667 18.3333 15.9205 18.3333 15V5.00001C18.3333 4.07953 17.5872 3.33334 16.6667 3.33334Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.3333 5L10 10.8333L1.66667 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="contact-content">
                  <span className="contact-label">Email</span>
                  <span className="contact-value">{user.email || 'Not provided'}</span>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon role">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 12.5C12.7614 12.5 15 10.2614 15 7.5C15 4.73858 12.7614 2.5 10 2.5C7.23858 2.5 5 4.73858 5 7.5C5 10.2614 7.23858 12.5 10 12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2.5 17.5V15.8333C2.5 14.9493 2.85119 14.1014 3.47631 13.4763C4.10143 12.8512 4.94928 12.5 5.83333 12.5H14.1667C15.0507 12.5 15.8986 12.8512 16.5237 13.4763C17.1488 14.1014 17.5 14.9493 17.5 15.8333V17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="contact-content">
                  <span className="contact-label">Role</span>
                  <span className={`role-value ${user.role?.toLowerCase() || 'user'}`}>
                    {user.role || 'USER'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Plan */}
          <div className="info-section">
            <h3>Subscription Plan</h3>
            <div className="plan-card">
              <div className="plan-info">
                <span className={`plan-badge-lg ${getPlanBadgeClass(user.plan)}`}>
                  {user.plan?.name || 'Free Plan'}
                </span>
                {user.plan && (
                  <div className="plan-details">
                    <span className="plan-price">
                      {user.plan.price === 0 ? 'Free' : `$${user.plan.price}/month`}
                    </span>
                  </div>
                )}
              </div>
              {user.plan && (
                <div className="plan-limits">
                  <div className="limit-item">
                    <span className="limit-value">{user.plan.allowedBusinesses || 0}</span>
                    <span className="limit-label">Businesses</span>
                  </div>
                  <div className="limit-item">
                    <span className="limit-value">{user.plan.allowedProducts || 0}</span>
                    <span className="limit-label">Products</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Activity Stats */}
          <div className="info-section">
            <h3>Activity</h3>
            <div className="stats-grid">
              <div className="stat-item businesses">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 21V9L12 3L20 9V21H14V14H10V21H4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <span className="stat-value">{businessCount}</span>
                  <span className="stat-label">Businesses</span>
                </div>
              </div>
              <div className="stat-item products">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <span className="stat-value">{productCount}</span>
                  <span className="stat-label">Products</span>
                </div>
              </div>
              <div className="stat-item professionals">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <span className="stat-value">{professionalCount}</span>
                  <span className="stat-label">Profiles</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="timestamps-section">
            <div className="timestamp-item">
              <span className="label">Joined</span>
              <span className="value">{formatDate(user.createdAt)}</span>
            </div>
            <div className="timestamp-item">
              <span className="label">Last Updated</span>
              <span className="value">{formatDate(user.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="view-user-footer">
          <button className="btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewUserModal;
