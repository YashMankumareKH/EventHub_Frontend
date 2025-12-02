import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userApi } from '../../api/userApi';
import { 
  Calendar, MapPin, DollarSign, Building, Users, 
  Clock, ArrowLeft, CheckCircle 
} from 'lucide-react';
import { formatDateTime, formatCurrency } from '../../utils/formatters';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import SuccessMessage from '../common/SuccessMessage';

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const data = await userApi.getEventById(id);
      setEvent(data);
    } catch (err) {
      setError('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setRegistering(true);
    try {
      await userApi.registerForEvent(user.id, id);
      setSuccess('Successfully registered for the event!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response.data.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!event) return <ErrorMessage message="Event not found" />;

  return (
    <div className="event-details">
      <button onClick={() => navigate(-1)} className="btn btn-back">
        <ArrowLeft size={18} />
        Back
      </button>

      <SuccessMessage message={success} onClose={() => setSuccess('')} />
      <ErrorMessage message={error} onClose={() => setError('')} />

      <div className="event-details-header">
        <h1>{event.title}</h1>
        <span className="event-price-large">
          {event.price === 0 ? 'Free Event' : formatCurrency(event.price)}
        </span>
      </div>

      <div className="event-details-grid">
        <div className="event-info-card">
          <Building size={20} />
          <div>
            <span className="label">Organization</span>
            <span className="value">{event.organization}</span>
          </div>
        </div>

        <div className="event-info-card">
          <MapPin size={20} />
          <div>
            <span className="label">Location</span>
            <span className="value">{event.city}, {event.venue}</span>
          </div>
        </div>

        <div className="event-info-card">
          <Calendar size={20} />
          <div>
            <span className="label">Start Date</span>
            <span className="value">{formatDateTime(event.startOn)}</span>
          </div>
        </div>

        <div className="event-info-card">
          <Clock size={20} />
          <div>
            <span className="label">End Date</span>
            <span className="value">{formatDateTime(event.endOn)}</span>
          </div>
        </div>

        <div className="event-info-card">
          <Users size={20} />
          <div>
            <span className="label">Capacity</span>
            <span className="value">{event.capacity} attendees</span>
          </div>
        </div>

        <div className="event-info-card">
          <CheckCircle size={20} />
          <div>
            <span className="label">Category</span>
            <span className="value">{event.categoryName}</span>
          </div>
        </div>
      </div>

      <div className="event-description">
        <h2>About this event</h2>
        <p>{event.description}</p>
      </div>

      {user && user.role === 'ROLE_PARTICIPANT' && (
        <button 
          onClick={handleRegister} 
          className="btn btn-primary btn-lg"
          disabled={registering}
        >
          {registering ? <LoadingSpinner size="small" /> : 'Register Now'}
        </button>
      )}
    </div>
  );
};

export default EventDetails;