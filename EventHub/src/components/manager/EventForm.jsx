import { useState, useEffect } from "react";

import { useAuth } from '../../context/AuthContext';
import { managerApi } from '../../api/managerApi';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import SuccessMessage from '../common/SuccessMessage';

const EventForm = ({ event = null, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    description: '',
    city: '',
    venue: '',
    startOn: '',
    endOn: '',
    capacity: '',
    price: '',
    categoryName: 'Technology'
  });


  // When editing an event, update form data when `event` changes
 

  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

   useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        categoryName: event.categoryName || 'Technology'
      });
    }
     if (event && event.category) {
        setCategory(event.category);
    }
  }, [event]);

  const categories = [
    'Technology', 'Business', 'Education', 'Health', 'Sports',
    'Music', 'Arts', 'Science', 'Entertainment', 'Other'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const eventData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        price: parseInt(formData.price),
        managerId: user.id
      };

      if (event) {
        await managerApi.updateEvent(event.id, eventData);
        setSuccess('Event updated successfully');
      } else {
        await managerApi.createEvent(user.id, eventData);
        setSuccess('Event created successfully');
      }

      setTimeout(() => {
        onSuccess && onSuccess();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <h2>{event ? 'Edit Event' : 'Create New Event'}</h2>

      <SuccessMessage message={success} onClose={() => setSuccess('')} />
      <ErrorMessage message={error} onClose={() => setError('')} />

      <div className="form-group">
        <label htmlFor="title">Event Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="organization">Organization *</label>
        <input
          type="text"
          id="organization"
          name="organization"
          value={formData.organization}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="city">City *</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="venue">Venue *</label>
          <input
            type="text"
            id="venue"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="startOn">Start Date & Time *</label>
          <input
            type="datetime-local"
            id="startOn"
            name="startOn"
            value={formData.startOn}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endOn">End Date & Time *</label>
          <input
            type="datetime-local"
            id="endOn"
            name="endOn"
            value={formData.endOn}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-row no-spinner">
        <div className="form-group">
          <label htmlFor="capacity">Capacity *</label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price (₹) *</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            required
          />
        </div>
      </div>


      <div className="form-group">
        <label htmlFor="categoryName">Category *</label>
        <select
          id="categoryName"
          name="categoryName"
          value={formData.categoryName}
          onChange={handleChange}
          required
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <LoadingSpinner size="small" /> : event ? 'Update Event' : 'Create Event'}
        </button>
      </div>
    </form>
  );
};

export default EventForm;