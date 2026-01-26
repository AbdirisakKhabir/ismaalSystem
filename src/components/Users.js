import React, { useState, useEffect } from 'react';
import UsersTable from './UsersTable';
import ViewUserModal from './ViewUserModal';
import DeleteUserModal from './DeleteUserModal';
import Pagination from './Pagination';
import { userApi } from '../services/userApi';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await userApi.getAllUsers();
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch users.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewClick = (user) => { setViewingUser(user); setIsViewModalOpen(true); };
  const handleCloseViewModal = () => { setIsViewModalOpen(false); setViewingUser(null); };
  const handleDeleteClick = (user) => { setDeletingUser(user); setIsDeleteModalOpen(true); };

  const handleDeleteConfirm = async () => {
    if (!deletingUser) return;
    try {
      setIsDeleting(true);
      await userApi.deleteUser(deletingUser.id);
      setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
      setIsDeleteModalOpen(false);
      setDeletingUser(null);
      alert('User deleted successfully!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete user.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => { setIsDeleteModalOpen(false); setDeletingUser(null); };

  const filteredUsers = users.filter((user) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return user.name?.toLowerCase().includes(search) || user.email?.toLowerCase().includes(search) || user.role?.toLowerCase().includes(search);
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="users-container">
      <div className="users-header">
        <div className="header-content">
          <h1 className="users-title">Users Management</h1>
          <p className="users-subtitle">View and manage user accounts</p>
        </div>
        <button className="btn-refresh" onClick={fetchUsers}>Refresh</button>
      </div>
      <div className="users-search">
        <input type="text" placeholder="Search by name, email, or role..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="search-input" />
        <span className="search-results">{filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found</span>
      </div>
      {error && <div className="error-banner"><span>{error}</span><button onClick={() => setError(null)}>×</button></div>}
      <div className="users-content">
        <UsersTable users={paginatedUsers} onView={handleViewClick} onDelete={handleDeleteClick} isLoading={isLoading} />
        {!isLoading && filteredUsers.length > 0 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filteredUsers.length} itemsPerPage={itemsPerPage} onItemsPerPageChange={(n) => { setItemsPerPage(n); setCurrentPage(1); }} />
        )}
      </div>
      <ViewUserModal user={viewingUser} isOpen={isViewModalOpen} onClose={handleCloseViewModal} />
      <DeleteUserModal user={deletingUser} isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} onConfirm={handleDeleteConfirm} isLoading={isDeleting} />
    </div>
  );
};

export default Users;
