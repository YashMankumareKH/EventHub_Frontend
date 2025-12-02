import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { managerApi } from '../../api/managerApi';
import { Edit, Trash2, Users, XCircle } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import SuccessMessage from '../common/SuccessMessage';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';
import EventForm from './EventForm';
import AttendeesList from './AttendeesList';

const EventManagement = () => {
  const { user: authUser } = useAuth();
  const mountedRef = useRef(true);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editEvent, setEditEvent] = useState(null);
  const [viewAttendees, setViewAttendees] = useState(null);
  const [deleteEvent, setDeleteEvent] = useState(null);
  const [cancelEvent, setCancelEvent] = useState(null);

  // loading flags for confirm actions
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  // helper to safely extract user id (prefer context, fallback to localStorage)
  const getUserId = () => {
    if (authUser && (authUser.id || authUser.userId)) return authUser.id ?? authUser.userId;
    try {
      const raw = localStorage.getItem('user');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed?.id ?? parsed?.userId ?? null;
    } catch (e) {
      console.warn('Failed to parse user from localStorage', e);
      return null;
    }
  };

  // helper to extract the most useful message from backend errors
  const parseErrorMessage = (err) => {
    // Axios style: err.response.data
    const r = err?.response?.data;
    if (r) {
      // common: { message: '...' }
      if (typeof r.message === 'string' && r.message.trim()) return r.message;
      // common: { errors: [ 'a', 'b' ] } or { errors: { field: ['a'] } }
      if (r.errors) {
        if (Array.isArray(r.errors) && r.errors.length) return r.errors.join(', ');
        if (typeof r.errors === 'object') {
          // flatten object values
          const vals = Object.values(r.errors).flat().filter(Boolean);
          if (vals.length) return vals.join(', ');
        }
      }
      // sometimes backend returns { error: '...' }
      if (typeof r.error === 'string' && r.error.trim()) return r.error;
      // sometimes backend returns a string directly
      if (typeof r === 'string' && r.trim()) return r;
    }
    // fallback to standard Error.message
    if (err?.message) return err.message;
    return 'Something went wrong';
  };

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const id = getUserId();
      if (!id) {
        throw new Error('User id not found');
      }

      const res = await managerApi.getManagerEvents(id);
      const data = res?.data ?? res;
      if (mountedRef.current) setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('fetchEvents error', err);
      if (mountedRef.current) setError(parseErrorMessage(err) || 'Failed to load events');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [authUser]);

  useEffect(() => {
    mountedRef.current = true;
    fetchEvents();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchEvents]);

  const handleDelete = async () => {
    setError('');
    setSuccess('');
    if (!deleteEvent?.id) {
      setError('Invalid event selected');
      setDeleteEvent(null);
      return;
    }

    setDeleteLoading(true);
    try {
      await managerApi.deleteEvent(deleteEvent.id);
      setSuccess('Event deleted successfully');
      await fetchEvents();
    } catch (err) {
      console.error('deleteEvent error', err);
      setError(parseErrorMessage(err) || 'Failed to delete event');
    } finally {
      setDeleteLoading(false);
      setDeleteEvent(null);
    }
  };

  const handleCancel = async () => {
    setError('');
    setSuccess('');
    if (!cancelEvent?.id) {
      setError('Invalid event selected');
      setCancelEvent(null);
      return;
    }

    setCancelLoading(true);
    try {
      const res = await managerApi.cancelEvent(cancelEvent.id);
      // backend might return message in different shapes
      const msg = res?.data?.message ?? res?.message ?? 'Event cancelled successfully';
      setSuccess(msg);
      await fetchEvents();
    } catch (err) {
      console.error('cancelEvent error', err);
      setError(parseErrorMessage(err) || 'Failed to cancel event');
    } finally {
      setCancelLoading(false);
      setCancelEvent(null);
    }
  };

  const handleEventUpdated = (msg) => {
    setEditEvent(null);
    if (msg) setSuccess(msg);
    fetchEvents();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="event-management">
      <h2>My Events</h2>

      <SuccessMessage message={success} onClose={() => setSuccess('')} />
      <ErrorMessage message={error} onClose={() => setError('')} />

      {events.length === 0 ? (
        <p className="no-data">No events created yet</p>
      ) : (
        <div className="events-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>City</th>
                <th>Capacity</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id ?? event.eventId}>
                  <td>{event.title}</td>
                  <td>{formatDateTime(event.startOn)}</td>
                  <td>{event.city}</td>
                  <td>{event.capacity}</td>
                  <td>₹{event.price}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => setViewAttendees(event)}
                        className="btn btn-sm btn-info"
                        title="View Attendees"
                      >
                        <Users size={16} />
                      </button>
                      <button
                        onClick={() => setEditEvent(event)}
                        className="btn btn-sm btn-secondary"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setCancelEvent(event)}
                        className="btn btn-sm btn-warning"
                        title="Cancel Event"
                      >
                        <XCircle size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteEvent(event)}
                        className="btn btn-sm btn-danger"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={!!editEvent}
        onClose={() => setEditEvent(null)}
        title="Edit Event"
      >
        <EventForm
          event={editEvent}
          onSuccess={handleEventUpdated}
          onCancel={() => setEditEvent(null)}
        />
      </Modal>

      <Modal
        isOpen={!!viewAttendees}
        onClose={() => setViewAttendees(null)}
        title={`Attendees - ${viewAttendees?.title}`}
      >
        <AttendeesList
          eventId={viewAttendees?.id}
          onUpdate={fetchEvents}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteEvent}
        onClose={() => setDeleteEvent(null)}
        onConfirm={handleDelete}
        title="Delete Event"
        message={`Are you sure you want to delete "${deleteEvent?.title}"?`}
        // pass prop to disable confirm button while request is running
        confirmDisabled={deleteLoading}
      />

      <ConfirmDialog
        isOpen={!!cancelEvent}
        onClose={() => setCancelEvent(null)}
        onConfirm={handleCancel}
        title="Cancel Event"
        message={`Are you sure you want to cancel "${cancelEvent?.title}"?`}
        confirmDisabled={cancelLoading}
      />
    </div>
  );
};

export default EventManagement;
