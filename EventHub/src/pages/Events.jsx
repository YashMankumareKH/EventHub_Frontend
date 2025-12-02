import React, { useState, useEffect } from 'react';
import { userApi } from '../api/userApi';
import EventCard from '../components/user/EventCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { Search, Filter } from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [searchTerm, cityFilter, events]);

  const fetchEvents = async () => {
    try {
      const data = await userApi.getAllEvents();
      setEvents(data);
      setFilteredEvents(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load events');

    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (cityFilter) {
      filtered = filtered.filter(event =>
        event.city.toLowerCase() === cityFilter.toLowerCase()
      );
    }

    setFilteredEvents(filtered);
  };

  const cities = [...new Set(events.map(e => e.city))];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="events-page">
      <div className="page-header">
        <h1>Discover Events</h1>
        <p>Find amazing events happening in your city</p>
      </div>

      <div className="filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <Filter size={20} />
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      <ErrorMessage message={error} onClose={() => setError('')} />

      {filteredEvents.length === 0 ? (
        <p className="no-data">No events found</p>
      ) : (
        <div className="events-grid">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;