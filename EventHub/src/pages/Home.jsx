import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Award, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to EventHub</h1>
          <p>Discover and manage amazing events in your city</p>
          <div className="hero-actions">
            <Link to="/events" className="btn btn-primary btn-lg">
              Browse Events
            </Link>
            <Link to="/register" className="btn btn-secondary btn-lg">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Why Choose EventHub?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <Calendar size={48} />
            <h3>Easy Event Management</h3>
            <p>Create, manage, and track your events with our intuitive platform</p>
          </div>
          <div className="feature-card">
            <Users size={48} />
            <h3>Attendee Management</h3>
            <p>Track registrations and manage attendees effortlessly</p>
          </div>
          <div className="feature-card">
            <Award size={48} />
            <h3>Professional Tools</h3>
            <p>Access powerful tools designed for event organizers</p>
          </div>
          <div className="feature-card">
            <Zap size={48} />
            <h3>Real-time Updates</h3>
            <p>Stay informed with instant notifications and updates</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of event organizers and attendees</p>
        <Link to="/register" className="btn btn-primary btn-lg">
          Create Free Account
        </Link>
      </section>
    </div>
  );
};

export default Home;