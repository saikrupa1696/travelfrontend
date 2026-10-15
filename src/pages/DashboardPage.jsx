import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tripsApi } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/formatters';
import { Compass, PlusCircle, MapPin, Calendar, Users, Eye, Trash2, Edit3, ArrowRight, Sparkles } from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const res = await tripsApi.getAll();
      setTrips(res.data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load your trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trip and its itinerary?')) return;
    try {
      await tripsApi.delete(id);
      setTrips(trips.filter((t) => t.id !== id));
    } catch (err) {
      alert('Error deleting trip: ' + err.message);
    }
  };

  const totalBudgetPlanned = trips.reduce((acc, t) => acc + (Number(t.budgetAmount) || 0), 0);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#ffffff',
        padding: '2.5rem',
        borderRadius: '20px',
        marginBottom: '2.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.3)'
      }}>
        <div>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: 'rgba(2, 132, 199, 0.2)',
            color: '#38bdf8',
            padding: '0.3rem 0.8rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
            border: '1px solid rgba(56, 189, 248, 0.3)'
          }}>
            <Sparkles size={14} /> Travel Dashboard
          </span>
          <h1 style={{ color: '#ffffff', fontSize: '2rem', marginBottom: '0.5rem' }}>
            Welcome back, {user?.name || 'Explorer'}!
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '550px' }}>
            Ready for your next getaway? Generate AI itineraries or manage your existing travel plans below.
          </p>
        </div>

        <div>
          <Link to="/create-trip" className="btn btn-primary btn-lg" style={{ boxShadow: '0 4px 15px rgba(2, 132, 199, 0.5)' }}>
            <PlusCircle size={20} /> Plan a New Trip
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 1.5rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#e0f2fe',
            color: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Compass size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Total Saved Trips</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{trips.length}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 1.5rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#ccfbf1',
            color: '#0d9488',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MapPin size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Destinations Explored</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
              {new Set(trips.map((t) => t.destination.toLowerCase())).size}
            </h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem 1.5rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#fef3c7',
            color: '#d97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem',
            fontWeight: 800
          }}>
            ₹
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Planned Trip Budgets</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
              {formatCurrency(totalBudgetPlanned)}
            </h3>
          </div>
        </div>
      </div>

      {/* Trips Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: '#0f172a' }}>Recently Planned Trips</h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Open, customize, or export your saved travel plans</p>
        </div>
        {trips.length > 0 && (
          <Link to="/trips" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0284c7', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            View all trips <ArrowRight size={16} />
          </Link>
        )}
      </div>

      {/* Trips List / Loading / Empty State */}
      {loading ? (
        <div className="card" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LoadingSpinner message="Fetching your travel plans..." />
        </div>
      ) : error ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#fee2e2' }}>
          <p style={{ color: '#991b1b', fontWeight: 600 }}>{error}</p>
          <button onClick={fetchTrips} className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
            Try Again
          </button>
        </div>
      ) : trips.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#ffffff' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#e0f2fe',
            color: '#0284c7',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <Compass size={32} />
          </div>
          <h3 style={{ fontSize: '1.3rem', color: '#0f172a', marginBottom: '0.5rem' }}>No trips planned yet</h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
            Ready to embark on an adventure? Tell TravelMate AI your destination and let us generate an unforgettable itinerary.
          </p>
          <Link to="/create-trip" className="btn btn-primary">
            <PlusCircle size={18} /> Plan Your First Trip
          </Link>
        </div>
      ) : (
        <div className="grid-3">
          {trips.slice(0, 6).map((trip) => (
            <div key={trip.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span className={`badge ${trip.generationSource === 'AI_GENERATED' ? 'badge-ai' : 'badge-fallback'}`}>
                    {trip.generationSource === 'AI_GENERATED' ? 'AI Planned' : 'Curated Itinerary'}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {trip.createdAt ? new Date(trip.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '0.5rem' }}>
                  {trip.destination}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem', color: '#64748b', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={15} color="#0284c7" />
                    <span>Starts {trip.startDate} &bull; {trip.durationDays} Days</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Users size={15} color="#0d9488" />
                    <span>{trip.travelType} &bull; {trip.travellerCount} Traveller{trip.travellerCount > 1 ? 's' : ''}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontWeight: 800, color: '#f59e0b', fontSize: '0.95rem' }}>₹</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>
                      {formatCurrency(trip.budgetAmount)} ({trip.budgetMode === 'PER_PERSON' ? 'Per Person' : 'Total Group'})
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                <Link to={`/itinerary/${trip.id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                  <Eye size={15} /> View Plan
                </Link>
                <button
                  onClick={() => handleDelete(trip.id)}
                  className="btn btn-secondary btn-sm"
                  style={{ color: '#ef4444' }}
                  title="Delete Trip"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default DashboardPage;
