import React, { useState, useEffect } from 'react';
import { managerApi } from '../../api/managerApi';
import { XCircle } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import SuccessMessage from '../common/SuccessMessage';
import ConfirmDialog from '../common/ConfirmDialog';

const AttendeesList = ({ eventId, onUpdate }) => {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cancelAttendee, setCancelAttendee] = useState(null);

  useEffect(() => {
    fetchAttendees();
  }, [eventId]);

  const fetchAttendees = async () => {
    setLoading(true);
    try {
      const data = await managerApi.getEventAttendees(eventId);
      setAttendees(data);
    } catch (err) {
      setError('Failed to load attendees');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async () => {
    try {
      await managerApi.cancelUserRegistration(eventId, cancelAttendee.userId);
      setSuccess('Registration cancelled successfully');
      fetchAttendees();
      onUpdate && onUpdate();
    } catch (err) {
      setError('Failed to cancel registration');
    } finally {
      setCancelAttendee(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="attendees-list">
      <SuccessMessage message={success} onClose={() => setSuccess('')} />
      <ErrorMessage message={error} onClose={() => setError('')} />

      {attendees.length === 0 ? (
        <p className="no-data">No attendees registered yet</p>
      ) : (
        <table className="attendees-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendees.map(attendee => (
              <tr key={attendee.userId}>
                <td>{attendee.firstName} {attendee.lastName}</td>
                <td>{attendee.emailId}</td>
                <td>{attendee.phone}</td>
                <td>
                  <button
                    onClick={() => setCancelAttendee(attendee)}
                    className="btn btn-sm btn-danger"
                  >
                    <XCircle size={16} />
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ConfirmDialog
        isOpen={!!cancelAttendee}
        onClose={() => setCancelAttendee(null)}
        onConfirm={handleCancelRegistration}
        title="Cancel Registration"
        message={`Cancel registration for ${cancelAttendee?.firstName} ${cancelAttendee?.lastName}?`}
      />
    </div>
  );
};

export default AttendeesList;