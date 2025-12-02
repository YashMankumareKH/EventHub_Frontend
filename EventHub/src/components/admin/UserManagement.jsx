import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { Edit, UserPlus, UserCheck, UserX } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import SuccessMessage from '../common/SuccessMessage';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [deactivateUser, setDeactivateUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deactivateLoading, setDeactivateLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  // helper to parse backend messages (safe)
  const parseErrorMessage = (err) => {
    const r = err?.response?.data;
    if (r) {
      if (typeof r.message === 'string' && r.message.trim()) return r.message;
      if (typeof r.error === 'string' && r.error.trim()) return r.error;
    }
    return err?.message ?? 'Operation failed';
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.getAllUsers();
      const data = res?.data ?? res;
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('fetchUsers error', err);
      setError(parseErrorMessage(err));
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!deactivateUser?.id) {
      setError('Invalid user selected');
      setDeactivateUser(null);
      return;
    }

    setDeactivateLoading(true);
    setError('');
    setSuccess('');
    try {
      // assume API toggles status and returns updated user or a message
      const res = await adminApi.deactivateUser(deactivateUser.id);
      const data = res?.data ?? res;

      // prefer server-provided message when available
      const msg =
        (typeof data === 'string' && data) ||
        data?.message ||
        `User ${deactivateUser.firstName} ${deactivateUser.lastName} status updated`;

      // refresh list from server to reflect actual state
      await fetchUsers();
      setSuccess(msg);
    } catch (err) {
      console.error('handleDeactivate error', err);
      setError(parseErrorMessage(err));
    } finally {
      setDeactivateLoading(false);
      setDeactivateUser(null);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editUser?.id) {
      setError('Invalid user');
      return;
    }
    setError('');
    setSuccess('');
    try {
      const res = await adminApi.updateUser(editUser.id, editUser);
      const data = res?.data ?? res;
      const msg = data?.message ?? 'User updated successfully';
      setEditUser(null);
      setSuccess(msg);
      await fetchUsers();
    } catch (err) {
      console.error('handleUpdateUser error', err);
      setError(parseErrorMessage(err));
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="user-management">
      <div className="management-header">
        <h2>User Management</h2>
        
      </div>

      <SuccessMessage message={success} onClose={() => setSuccess('')} />
      <ErrorMessage message={error} onClose={() => setError('')} />

      {users.length === 0 ? (
        <p className="no-data">No users found</p>
      ) : (
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const isActive = !!u.isActive; // defensive
                return (
                  <tr key={u.id}>
                    <td>{u.firstName} {u.lastName}</td>
                    <td>{u.emailId}</td>
                    <td>{u.phone}</td>
                    <td>
                      <span className="role-badge">{(u.role || '').replace('ROLE_', '')}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => setEditUser(u)}
                          className="btn btn-sm btn-secondary"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeactivateUser(u)}
                          className={`btn btn-sm ${isActive ? 'btn-danger' : 'btn-success'}`}
                          title={isActive ? 'Deactivate' : 'Activate'}
                        >
                          {isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={!!editUser}
        onClose={() => setEditUser(null)}
        title="Edit User"
      >
        <form onSubmit={handleUpdateUser} className="admin-form">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              value={editUser?.firstName || ''}
              onChange={(e) => setEditUser({...editUser, firstName: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={editUser?.lastName || ''}
              onChange={(e) => setEditUser({...editUser, lastName: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={editUser?.emailId || ''}
              onChange={(e) => setEditUser({...editUser, emailId: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              value={editUser?.phone || ''}
              onChange={(e) => setEditUser({...editUser, phone: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select
              value={editUser?.role || ''}
              onChange={(e) => setEditUser({...editUser, role: e.target.value})}
            >
              <option value="ROLE_PARTICIPANT">Participant</option>
              <option value="ROLE_MANAGER">Manager</option>
              <option value="ROLE_ADMIN">Admin</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => setEditUser(null)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Update User
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deactivateUser}
        onClose={() => setDeactivateUser(null)}
        onConfirm={handleDeactivate}
        title={deactivateUser?.isActive ? 'Deactivate User' : 'Activate User'}
        message={`Are you sure you want to ${deactivateUser?.isActive ? 'deactivate' : 'activate'} ${deactivateUser?.firstName} ${deactivateUser?.lastName}?`}
        confirmDisabled={deactivateLoading}
      />
    </div>
  );
};

export default UserManagement;
