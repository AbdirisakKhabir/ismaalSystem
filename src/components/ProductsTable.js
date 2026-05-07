import React from 'react';
import './ProductsTable.css';

const ProductsTable = ({ products, onView, onDelete, isLoading }) => {
  if (isLoading) {
    return <div className="products-table-loading"><div className="loading-spinner"></div><p>Loading products...</p></div>;
  }
  if (!products || products.length === 0) {
    return <div className="products-table-empty"><p>No products found</p></div>;
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'APPROVED': return 'status-approved';
      case 'PENDING': return 'status-pending';
      case 'REJECTED': return 'status-rejected';
      default: return 'status-default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatPrice = (price, priceTo, priceOption) => {
    if (priceOption === 'Negotiable') return price ? `$${price} (Negotiable)` : 'Negotiable';
    if (priceOption === 'Range' && priceTo) return `$${price} - $${priceTo}`;
    return price ? `$${price}` : 'N/A';
  };

  const getImageUrl = (image) => {
    if (!image) return null;
    if (typeof image === 'string' && image.includes(',')) return image.split(',')[0].trim();
    return image;
  };

  return (
    <div className="products-table-container">
      <div className="products-table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Type</th><th>Location</th><th>Status</th><th>Created</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="image-cell">
                  {getImageUrl(product.image) ? <img src={getImageUrl(product.image)} alt={product.name} className="product-image" onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }} /> : <div className="product-image-placeholder">No Image</div>}
                </td>
                <td className="name-cell"><div className="product-name">{product.name}</div></td>
                <td><span className="category-badge">{product.category}</span></td>
                <td className="price-cell">{formatPrice(product.price, product.price_to, product.price_option)}</td>
                <td><span className="type-badge">{product.type || 'N/A'}</span></td>
                <td>{product.location || 'N/A'}</td>
                <td><span className={`status-badge ${getStatusClass(product.status)}`}>{product.status || 'N/A'}</span></td>
                <td>{formatDate(product.createdAt)}</td>
                <td className="actions-cell">
                  <div className="action-buttons">
                    <button className="btn-view" onClick={() => onView(product)} title="View">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1.33334 8C1.33334 8 3.33334 3.33334 8 3.33334C12.6667 3.33334 14.6667 8 14.6667 8C14.6667 8 12.6667 12.6667 8 12.6667C3.33334 12.6667 1.33334 8 1.33334 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <button className="btn-delete" onClick={() => onDelete(product)} title="Delete">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4H14M12.6667 4V13.3333C12.6667 14.0697 12.0697 14.6667 11.3333 14.6667H4.66667C3.93029 14.6667 3.33333 14.0697 3.33333 13.3333V4M5.33333 4V2.66667C5.33333 1.93029 5.93029 1.33333 6.66667 1.33333H9.33333C10.0697 1.33333 10.6667 1.93029 10.6667 2.66667V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsTable;
