import React from 'react';
import './PlansTable.css';

const PlansTable = ({ plans, onView, onEdit, onDelete, isLoading }) => {
  if (isLoading) return <div className="plans-table-loading"><div className="loading-spinner"></div><p>Loading plans...</p></div>;
  if (!plans || plans.length === 0) return <div className="plans-table-empty"><p>No plans found</p></div>;

  const formatPrice = (plan, period) => {
    if (!plan) return '';
    const monthly = plan.priceMonthly ?? plan.price ?? 0;
    const yearly = plan.priceYearly ?? 0;
    const price = period === 'YEARLY' ? yearly : monthly;
    return price === 0 ? 'Free' : `$${parseFloat(price).toFixed(2)}`;
  };
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';

  return (
    <div className="plans-table-container">
      <table className="plans-table">
        <thead><tr><th>Plan Name</th><th>Description</th><th>Monthly</th><th>Yearly</th><th>Businesses</th><th>Products</th><th>Profile Status</th><th>Users</th><th>Created</th><th>Actions</th></tr></thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan.id}>
              <td><div className="plan-name">{plan.name}</div><div className="plan-id">ID: #{plan.id}</div></td>
              <td>{plan.description ? (plan.description.length > 60 ? `${plan.description.substring(0, 60)}...` : plan.description) : 'No description'}</td>
              <td><span className={`price-badge ${formatPrice(plan, 'MONTHLY') === 'Free' ? 'free' : 'paid'}`}>{formatPrice(plan, 'MONTHLY')}</span></td>
              <td><span className={`price-badge ${formatPrice(plan, 'YEARLY') === 'Free' ? 'free' : 'paid'}`}>{formatPrice(plan, 'YEARLY')}</span></td>
              <td>{plan.allowedBusinesses}</td>
              <td>{plan.allowedProducts}</td>
              <td>{plan.profile_status || 'N/A'}</td>
              <td>{plan.users?.length || 0}</td>
              <td>{formatDate(plan.createdAt)}</td>
              <td className="actions-cell">
                <div className="action-buttons">
                  <button className="btn-view" onClick={() => onView(plan)} title="View">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1.33334 8C1.33334 8 3.33334 3.33334 8 3.33334C12.6667 3.33334 14.6667 8 14.6667 8C14.6667 8 12.6667 12.6667 8 12.6667C3.33334 12.6667 1.33334 8 1.33334 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button className="btn-edit" onClick={() => onEdit(plan)} title="Edit">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M11.3333 2.00001C11.5084 1.82491 11.7163 1.68602 11.9441 1.59231C12.1719 1.4986 12.4151 1.45178 12.6667 1.45178C12.9182 1.45178 13.1614 1.4986 13.3892 1.59231C13.617 1.68602 13.8249 1.82491 14 2.00001C14.1751 2.1751 14.314 2.383 14.4077 2.61081C14.5014 2.83862 14.5482 3.08183 14.5482 3.33334C14.5482 3.58485 14.5014 3.82807 14.4077 4.05588C14.314 4.28369 14.1751 4.49159 14 4.66668L5.00001 13.6667L1.33334 14.6667L2.33334 11L11.3333 2.00001Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button className="btn-delete" onClick={() => onDelete(plan)} title="Delete">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4H14M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2761 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66667C4.31305 14.6667 3.97391 14.5262 3.72386 14.2761C3.47381 14.0261 3.33333 13.687 3.33333 13.3333V4M5.33333 4V2.66667C5.33333 2.31305 5.47381 1.97391 5.72386 1.72386C5.97391 1.47381 6.31305 1.33333 6.66667 1.33333H9.33333C9.68696 1.33333 10.0261 1.47381 10.2761 1.72386C10.5262 1.97391 10.6667 2.31305 10.6667 2.66667V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlansTable;
