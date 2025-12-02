import React, { useState } from 'react';
import EventManagement from './EventManagement';
import EventForm from './EventForm';
import { Plus } from 'lucide-react';
import Modal from '../common/Modal';

const ManagerDashboard = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEventCreated = () => {
    setShowCreateModal(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="manager-dashboard">
      <div className="dashboard-header">
        <h1>Manager Dashboard</h1>
        <button 
          onClick={() => setShowCreateModal(true)} 
          className="btn btn-primary"
        >
          <Plus size={18} />
          Create Event
        </button>
      </div>

      <EventManagement key={refreshKey} />

      <Modal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        title="Create New Event"
      >
        <EventForm 
          onSuccess={handleEventCreated}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
    </div>
  );
};

export default ManagerDashboard;