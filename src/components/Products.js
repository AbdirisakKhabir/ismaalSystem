import React, { useState, useEffect } from 'react';
import ProductsTable from './ProductsTable';
import ViewProductModal from './ViewProductModal';
import DeleteProductModal from './DeleteProductModal';
import Pagination from './Pagination';
import { productApi } from '../services/productApi';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await productApi.getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.response?.data?.error || 'Failed to fetch products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewClick = (product) => { setViewingProduct(product); setIsViewModalOpen(true); };
  const handleCloseViewModal = () => { setIsViewModalOpen(false); setViewingProduct(null); };
  const handleDeleteClick = (product) => { setDeletingProduct(product); setIsDeleteModalOpen(true); };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    try {
      setIsDeleting(true);
      await productApi.deleteProduct(deletingProduct.id);
      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
      setIsDeleteModalOpen(false);
      setDeletingProduct(null);
      alert('Product deleted successfully!');
    } catch (err) {
      console.error('Error deleting product:', err);
      if (err.code === 'ENDPOINT_NOT_FOUND') {
        alert('Delete endpoint not available. Please contact admin.');
      } else {
        alert(err.response?.data?.error || 'Failed to delete product.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => { setIsDeleteModalOpen(false); setDeletingProduct(null); };
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="products-container">
      <div className="products-header">
        <div className="header-content">
          <h1 className="products-title">Products Management</h1>
          <p className="products-subtitle">View and manage your products</p>
        </div>
        <button className="btn-refresh" onClick={fetchProducts}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3.33334 10C3.33334 6.3181 6.3181 3.33334 10 3.33334C11.5622 3.33334 12.9856 3.93667 14.0622 4.91667M16.6667 10C16.6667 13.6819 13.6819 16.6667 10 16.6667C8.43778 16.6667 7.01445 16.0633 5.93778 15.0833M5.93778 15.0833L8.33334 12.5M5.93778 15.0833L3.33334 17.5M14.0622 4.91667L11.6667 7.5M14.0622 4.91667L16.6667 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Refresh
        </button>
      </div>
      {error && <div className="error-banner"><span>{error}</span><button onClick={() => setError(null)} className="error-close">×</button></div>}
      <div className="products-content">
        <ProductsTable products={paginatedProducts} onView={handleViewClick} onDelete={handleDeleteClick} isLoading={isLoading} />
        {!isLoading && products.length > 0 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={products.length} itemsPerPage={itemsPerPage} onItemsPerPageChange={(n) => { setItemsPerPage(n); setCurrentPage(1); }} />
        )}
      </div>
      <ViewProductModal product={viewingProduct} isOpen={isViewModalOpen} onClose={handleCloseViewModal} />
      <DeleteProductModal product={deletingProduct} isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} onConfirm={handleDeleteConfirm} isLoading={isDeleting} />
    </div>
  );
};

export default Products;
