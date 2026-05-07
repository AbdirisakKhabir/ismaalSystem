import React, { useState, useEffect } from 'react';
import ProfessionalsTable from './ProfessionalsTable';
import ViewProfessionalModal from './ViewProfessionalModal';
import DeleteProfessionalModal from './DeleteProfessionalModal';
import Pagination from './Pagination';
import { professionalApi } from '../services/professionalApi';
import './Professionals.css';

const Professionals = () => {
  const [professionals, setProfessionals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingProfessional, setViewingProfessional] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProfessional, setDeletingProfessional] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => { fetchProfessionals(); }, []);

  const fetchProfessionals = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await professionalApi.getAllProfessionals();
      setProfessionals(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch professionals.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewClick = (p) => { setViewingProfessional(p); setIsViewModalOpen(true); };
  const handleCloseViewModal = () => { setIsViewModalOpen(false); setViewingProfessional(null); };
  const handleDeleteClick = (p) => { setDeletingProfessional(p); setIsDeleteModalOpen(true); };

  const handleDeleteConfirm = async () => {
    if (!deletingProfessional) return;
    try {
      setIsDeleting(true);
      await professionalApi.deleteProfessional(deletingProfessional.id);
      setProfessionals((prev) => prev.filter((p) => p.id !== deletingProfessional.id));
      setIsDeleteModalOpen(false);
      setDeletingProfessional(null);
      alert('Professional deleted successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete professional.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => { setIsDeleteModalOpen(false); setDeletingProfessional(null); };
  const totalPages = Math.ceil(professionals.length / itemsPerPage);
  const paginatedProfessionals = professionals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="professionals-container">
      <div className="professionals-header">
        <div className="header-content">
          <h1 className="professionals-title">Professionals Management</h1>
          <p className="professionals-subtitle">View and manage professional profiles</p>
        </div>
        <button className="btn-refresh" onClick={fetchProfessionals}>Refresh</button>
      </div>
      {error && <div className="error-banner"><span>{error}</span><button onClick={() => setError(null)}>×</button></div>}
      <div className="professionals-content">
        <ProfessionalsTable professionals={paginatedProfessionals} onView={handleViewClick} onDelete={handleDeleteClick} isLoading={isLoading} />
        {!isLoading && professionals.length > 0 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={professionals.length} itemsPerPage={itemsPerPage} onItemsPerPageChange={(n) => { setItemsPerPage(n); setCurrentPage(1); }} />
        )}
      </div>
      <ViewProfessionalModal professional={viewingProfessional} isOpen={isViewModalOpen} onClose={handleCloseViewModal} />
      <DeleteProfessionalModal professional={deletingProfessional} isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} onConfirm={handleDeleteConfirm} isLoading={isDeleting} />
    </div>
  );
};

export default Professionals;
