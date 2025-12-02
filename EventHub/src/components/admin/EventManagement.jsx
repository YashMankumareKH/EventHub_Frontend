import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { Calendar, XCircle, CheckCircle } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import SuccessMessage from '../common/SuccessMessage';
import ConfirmDialog from '../common/ConfirmDialog';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deactivateEvent, setDeactivateEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAllEvents();
       const data = res?.data ?? res;
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    try {
      await adminApi.deactivateEvent(deactivateEvent.id);
      setSuccess(`Event ${deactivateEvent.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchEvents();
    } catch (err) {
      setError('Operation failed');
    } finally {
      setDeactivateEvent(null);
    }
  };

  const getStatusBadge = (event) => {
    if (!event.isActive) return <span className="status-badge inactive">Inactive</span>;
    
    return <span className="status-badge active">active</span>;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="event-management">
      <h2>Event Management</h2>

      <SuccessMessage message={success} onClose={() => setSuccess('')} />
      <ErrorMessage message={error} onClose={() => setError('')} />

      {events.length === 0 ? (
        <p className="no-data">No events found</p>
      ) : (
        <div className="events-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Organization</th>
                <th>Date</th>
                <th>City</th>
                <th>Capacity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id}>
                  <td>{event.title}</td>
                  <td>{event.organization}</td>
                  <td>{formatDateTime(event.startOn)}</td>
                  <td>{event.city}</td>
                  <td>{event.capacity}</td>
                  <td>{getStatusBadge(event)}</td>
                  <td>
                    <button
                      onClick={() => setDeactivateEvent(event)}
                      className={`btn btn-sm ${event.isActive ? 'btn-danger' : 'btn-success'}`}
                      title={event.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {event.isActive ? <XCircle size={16} /> : <CheckCircle size={16} />}
                      {event.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deactivateEvent}
        onClose={() => setDeactivateEvent(null)}
        onConfirm={handleDeactivate}
        title={deactivateEvent?.isActive ? 'Deactivate Event' : 'Activate Event'}
        message={`Are you sure you want to ${deactivateEvent?.isActive ? 'deactivate' : 'activate'} "${deactivateEvent?.title}"?`}
      />
    </div>
  );
};

export default EventManagement;