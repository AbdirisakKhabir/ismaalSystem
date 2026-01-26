import React, { useState, useEffect } from 'react';
import SubmissionsTable from './SubmissionsTable';
import ViewSubmissionModal from './ViewSubmissionModal';
import Pagination from './Pagination';
import { submissionApi } from '../services/submissionApi';
import './Submissions.css';

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingSubmission, setViewingSubmission] = useState(null);
  const [approvingId, setApprovingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => { fetchSubmissions(); }, []);

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await submissionApi.getAllSubmissions();
      setSubmissions(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch submissions.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewClick = (s) => { setViewingSubmission(s); setIsViewModalOpen(true); };
  const handleCloseViewModal = () => { setIsViewModalOpen(false); setViewingSubmission(null); };

  const handleApprove = async (submission) => {
    try {
      setApprovingId(submission.id);
      await submissionApi.approveSubmission(submission.id, submission.submissionType);
      setSubmissions((prev) => prev.map((s) => s.id === submission.id && s.submissionType === submission.submissionType ? { ...s, status: 'APPROVED' } : s));
      if (viewingSubmission?.id === submission.id) setViewingSubmission((prev) => ({ ...prev, status: 'APPROVED' }));
      alert('Submission approved!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to approve.');
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (submission) => {
    try {
      setRejectingId(submission.id);
      await submissionApi.rejectSubmission(submission.id, submission.submissionType);
      setSubmissions((prev) => prev.map((s) => s.id === submission.id && s.submissionType === submission.submissionType ? { ...s, status: 'REJECTED' } : s));
      if (viewingSubmission?.id === submission.id) setViewingSubmission((prev) => ({ ...prev, status: 'REJECTED' }));
      alert('Submission rejected!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to reject.');
    } finally {
      setRejectingId(null);
    }
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (filter === 'all') return true;
    const status = s.status?.toLowerCase();
    if (filter === 'pending') return !status || status === 'pending';
    if (filter === 'approved') return status === 'approved' || status === 'active';
    if (filter === 'rejected') return status === 'rejected';
    return true;
  });

  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const paginatedSubmissions = filteredSubmissions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="submissions-container">
      <div className="submissions-header">
        <div className="header-content">
          <h1 className="submissions-title">Submissions</h1>
          <p className="submissions-subtitle">Review and approve pending submissions</p>
        </div>
        <button className="btn-refresh" onClick={fetchSubmissions}>Refresh</button>
      </div>
      <div className="submissions-stats">
        {['all', 'pending', 'approved', 'rejected'].map((f) => (
          <button key={f} className={`stat-card ${filter === f ? 'active' : ''}`} onClick={() => { setFilter(f); setCurrentPage(1); }}>
            {f.charAt(0).toUpperCase() + f.slice(1)} ({f === 'all' ? submissions.length : submissions.filter((s) => {
              const st = s.status?.toLowerCase();
              if (f === 'pending') return !st || st === 'pending';
              if (f === 'approved') return st === 'approved' || st === 'active';
              if (f === 'rejected') return st === 'rejected';
              return false;
            }).length})
          </button>
        ))}
      </div>
      {error && <div className="error-banner"><span>{error}</span><button onClick={() => setError(null)}>×</button></div>}
      <div className="submissions-content">
        <SubmissionsTable submissions={paginatedSubmissions} onView={handleViewClick} onApprove={handleApprove} onReject={handleReject} isLoading={isLoading} approvingId={approvingId} rejectingId={rejectingId} />
        {!isLoading && filteredSubmissions.length > 0 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filteredSubmissions.length} itemsPerPage={itemsPerPage} onItemsPerPageChange={(n) => { setItemsPerPage(n); setCurrentPage(1); }} />
        )}
      </div>
      <ViewSubmissionModal submission={viewingSubmission} isOpen={isViewModalOpen} onClose={handleCloseViewModal} onApprove={handleApprove} onReject={handleReject} isApproving={approvingId === viewingSubmission?.id} isRejecting={rejectingId === viewingSubmission?.id} />
    </div>
  );
};

export default Submissions;
