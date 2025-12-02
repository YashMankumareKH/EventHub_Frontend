import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, Building } from 'lucide-react';
import { formatDateTime, formatCurrency } from '../../utils/formatters';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  return (
    <div className="event-card" onClick={() => navigate(`/events/${event.id}`)}>
      <div className="event-card-header">
        <h3>{event.title}</h3>
        <span className="event-price">
          {event.price === 0 ? 'Free' : formatCurrency(event.price)}
        </span>
      </div>
      
      <div className="event-card-body">
        <div className="event-detail">
          <Building size={16} />
          <span>{event.organization}</span>
        </div>
        <div className="event-detail">
          <MapPin size={16} />
          <span>{event.city}</span>
        </div>
        <div className="event-detail">
          <Calendar size={16} />
          <span>{formatDateTime(event.startOn)}</span>
        </div>
      </div>

      <button className="btn btn-primary btn-sm">View Details</button>
    </div>
  );
};

export default EventCard;