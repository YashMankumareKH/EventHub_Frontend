import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { Users, Calendar, UserCog } from 'lucide-react';
import UserManagement from './UserManagement';
import EventManagement from './EventManagement';
import LoadingSpinner from '../common/LoadingSpinner';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalManagers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [users, events, managers] = await Promise.all([
        adminApi.getAllUsers(),
        adminApi.getAllEvents(),
        adminApi.getAllManagers()
      ]);
      setStats({
        totalUsers: users.length,
        totalEvents: events.length,
        totalManagers: managers.length
      });
    } catch (err) {
      console.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <Users size={32} />
            <div>
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>
          <div className="stat-card">
            <Calendar size={32} />
            <div>
              <h3>{stats.totalEvents}</h3>
              <p>Total Events</p>
            </div>
          </div>
          <div className="stat-card">
            <UserCog size={32} />
            <div>
              <h3>{stats.totalManagers}</h3>
              <p>Total Managers</p>
            </div>
          </div>
        </div>
      )}

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button 
          className={`tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Event Management
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'users' ? <UserManagement /> : <EventManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;