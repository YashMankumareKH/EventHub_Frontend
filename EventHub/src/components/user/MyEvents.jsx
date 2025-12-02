import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userApi } from '../../api/userApi';
import { Calendar, MapPin, XCircle } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import SuccessMessage from '../common/SuccessMessage';
import ConfirmDialog from '../common/ConfirmDialog';

const MyEvents = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cancelEvent, setCancelEvent] = useState(null);

  useEffect(() => {
    // Clear previous events immediately when tab changes so UI updates
    setEvents([]);
    setError('');
    setLoading(true);
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const fetchEvents = async () => {
    // keep defensive guards
    if (!user?.id) {
      setError('User not available');
      setLoading(false);
      return;
    }

    try {
      // API might return axios response { data: [...] } or raw array
      const res = activeTab === 'upcoming'
        ? await userApi.getUpcomingEvents(user.id)
        : await userApi.getCompletedEvents(user.id);

      const data = res?.data ?? res;
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('fetchEvents error', err);
      const msg = err?.response?.data?.message ?? err?.message ?? 'Failed to load events';
      setError(msg);
      setEvents([]); // ensure cleared on error
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!user?.id || !cancelEvent?.id) {
      setError('Invalid request');
      setCancelEvent(null);
      return;
    }

    try {
      await userApi.cancelRegistration(user.id, cancelEvent.id);
      setSuccess('Registration cancelled successfully');
      // re-fetch current tab events
      fetchEvents();
    } catch (err) {
      console.error('cancelRegistration error', err);
      const msg = err?.response?.data?.message ?? err?.message ?? 'Failed to cancel registration';
      setError(msg);
    } finally {
      setCancelEvent(null);
    }
  };

  return (
    <div className="my-events">
      <h2>My Events</h2>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
      </div>

      <SuccessMessage message={success} onClose={() => setSuccess('')} />
      <ErrorMessage message={error} onClose={() => setError('')} />

      {loading ? (
        <LoadingSpinner />
      ) : events.length === 0 ? (
        <p className="no-data">No {activeTab} events found</p>
      ) : (
        <div className="events-grid">
          {events.map(event => (
            <div key={event.id} className="event-card">
              <h3>{event.title}</h3>
              <div className="event-detail">
                <MapPin size={16} />
                <span>{event.city}</span>
              </div>
              <div className="event-detail">
                <Calendar size={16} />
                <span>{formatDateTime(event.startOn)}</span>
              </div>
              {activeTab === 'upcoming' && (
                <button
                  onClick={() => setCancelEvent(event)}
                  className="btn btn-danger btn-sm"
                >
                  <XCircle size={16} />
                  Cancel Registration
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!cancelEvent}
        onClose={() => setCancelEvent(null)}
        onConfirm={handleCancelRegistration}
        title="Cancel Registration"
        message={`Are you sure you want to cancel your registration for "${cancelEvent?.title}"?`}
      />
    </div>
  );
};

export default MyEvents;
