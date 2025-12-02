import React, { useState } from 'react';
import UserProfile from '../components/user/UserProfile';
import MyEvents from '../components/user/MyEvents';
import { User, Calendar } from 'lucide-react';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('events');

  return (
    <div className="dashboard">
      <h1>User Dashboard</h1>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          <Calendar size={18} />
          My Events
        </button>
        <button 
          className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={18} />
          Profile
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'events' ? <MyEvents /> : <UserProfile />}
      </div>
    </div>
  );
};

export default UserDashboard;