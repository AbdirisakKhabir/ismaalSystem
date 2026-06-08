import React, { useState, useEffect } from 'react';
import PlansTable from './PlansTable';
import ViewPlanModal from './ViewPlanModal';
import EditPlanModal from './EditPlanModal';
import DeletePlanModal from './DeletePlanModal';
import Pagination from './Pagination';
import { planApi } from '../services/planApi';
import './Plans.css';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingPlan, setViewingPlan] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingPlan, setDeletingPlan] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => { fetchPlans(); }, []);

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await planApi.getAllPlans();
      setPlans(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch plans.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewClick = (plan) => { setViewingPlan(plan); setIsViewModalOpen(true); };
  const handleCloseViewModal = () => { setIsViewModalOpen(false); setViewingPlan(null); };
  const handleEditClick = (plan) => { setEditingPlan(plan); setIsEditModalOpen(true); };
  const handleCloseEditModal = () => { setIsEditModalOpen(false); setEditingPlan(null); };

  const handleSaveEdit = async (updatedData) => {
    if (!editingPlan) return;
    try {
      setIsSaving(true);
      const updatedPlan = await planApi.updatePlan(editingPlan.id, updatedData);
      setPlans((prev) => prev.map((p) => p.id === editingPlan.id ? { ...p, ...updatedPlan } : p));
      setIsEditModalOpen(false);
      setEditingPlan(null);
      alert('Plan updated successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update plan.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (plan) => { setDeletingPlan(plan); setIsDeleteModalOpen(true); };

  const handleDeleteConfirm = async () => {
    if (!deletingPlan) return;
    try {
      setIsDeleting(true);
      await planApi.deletePlan(deletingPlan.id);
      setPlans((prev) => prev.filter((p) => p.id !== deletingPlan.id));
      setIsDeleteModalOpen(false);
      setDeletingPlan(null);
      alert('Plan deleted successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete plan.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => { setIsDeleteModalOpen(false); setDeletingPlan(null); };
  const totalPages = Math.ceil(plans.length / itemsPerPage);
  const paginatedPlans = plans.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="plans-container">
      <div className="plans-header">
        <div className="header-content">
          <h1 className="plans-title">Plans Management</h1>
          <p className="plans-subtitle">View and manage subscription plans</p>
        </div>
        <button className="btn-refresh" onClick={fetchPlans}>Refresh</button>
      </div>
      {error && <div className="error-banner"><span>{error}</span><button onClick={() => setError(null)}>×</button></div>}
      <div className="plans-content">
        <PlansTable plans={paginatedPlans} onView={handleViewClick} onEdit={handleEditClick} onDelete={handleDeleteClick} isLoading={isLoading} />
        {!isLoading && plans.length > 0 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={plans.length} itemsPerPage={itemsPerPage} onItemsPerPageChange={(n) => { setItemsPerPage(n); setCurrentPage(1); }} />
        )}
      </div>
      <ViewPlanModal plan={viewingPlan} isOpen={isViewModalOpen} onClose={handleCloseViewModal} />
      <EditPlanModal plan={editingPlan} isOpen={isEditModalOpen} onClose={handleCloseEditModal} onSave={handleSaveEdit} isLoading={isSaving} />
      <DeletePlanModal plan={deletingPlan} isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} onConfirm={handleDeleteConfirm} isLoading={isDeleting} />
    </div>
  );
};

export default Plans;
