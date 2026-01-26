import React, { useState, useEffect } from 'react';
import BusinessTable from './BusinessTable';
import EditBusinessModal from './EditBusinessModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import Pagination from './Pagination';
import { businessApi } from '../services/businessApi';
import './Business.css';

const Business = () => {
  const [businesses, setBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBusiness, setEditingBusiness] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingBusiness, setDeletingBusiness] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userId, setUserId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setUserId(1);
  }, []);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await businessApi.getAllBusinesses();
      setBusinesses(data);
    } catch (err) {
      console.error('Error fetching businesses:', err);
      setError(err.response?.data?.error || 'Failed to fetch businesses. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (business) => {
    setEditingBusiness(business);
    setIsEditModalOpen(true);
  };

  const handleSave = async (updatedData) => {
    if (!editingBusiness || !userId) {
      alert('User ID is required for updating. Please ensure you are logged in.');
      return;
    }

    try {
      setIsSaving(true);
      await businessApi.updateBusiness(editingBusiness.id, updatedData, userId);
      
      setBusinesses((prev) =>
        prev.map((b) =>
          b.id === editingBusiness.id ? { ...b, ...updatedData, status: 'PENDING' } : b
        )
      );

      setIsEditModalOpen(false);
      setEditingBusiness(null);
      alert('Business updated successfully! It will be reviewed by admin.');
    } catch (err) {
      console.error('Error updating business:', err);
      alert(err.response?.data?.error || 'Failed to update business. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (business) => {
    setDeletingBusiness(business);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingBusiness) return;

    try {
      setIsDeleting(true);
      await businessApi.deleteBusiness(deletingBusiness.id);
      setBusinesses((prev) => prev.filter((b) => b.id !== deletingBusiness.id));
      setIsDeleteModalOpen(false);
      setDeletingBusiness(null);
      alert('Business deleted successfully!');
    } catch (err) {
      console.error('Error deleting business:', err);
      if (err.code === 'ENDPOINT_NOT_FOUND' || err.message?.includes('DELETE endpoint not available')) {
        alert('Delete endpoint not available. Please contact admin or add DELETE endpoint to backend.');
      } else {
        alert(err.response?.data?.error || 'Failed to delete business. Please try again.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingBusiness(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingBusiness(null);
  };

  const totalPages = Math.ceil(businesses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBusinesses = businesses.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return (
    <div className="business-container">
      <div className="business-header">
        <div className="header-content">
          <h1 className="business-title">Business Management</h1>
          <p className="business-subtitle">View, edit, and manage your businesses</p>
        </div>
        <button className="btn-refresh" onClick={fetchBusinesses}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.33334 10C3.33334 6.3181 6.3181 3.33334 10 3.33334C11.5622 3.33334 12.9856 3.93667 14.0622 4.91667M16.6667 10C16.6667 13.6819 13.6819 16.6667 10 16.6667C8.43778 16.6667 7.01445 16.0633 5.93778 15.0833M5.93778 15.0833L8.33334 12.5M5.93778 15.0833L3.33334 17.5M14.0622 4.91667L11.6667 7.5M14.0622 4.91667L16.6667 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Refresh
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 6.66667V10M10 13.3333H10.0083" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>{error}</span>
          <button onClick={() => setError(null)} className="error-close">×</button>
        </div>
      )}

      <div className="business-content">
        <BusinessTable
          businesses={paginatedBusinesses}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          isLoading={isLoading}
        />
        {!isLoading && businesses.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={businesses.length}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}
      </div>

      <EditBusinessModal
        business={editingBusiness}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSave}
        isLoading={isSaving}
      />

      <DeleteConfirmModal
        business={deletingBusiness}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Business;
