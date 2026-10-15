import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tripsApi } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/formatters';
import { Compass, Search, Filter, PlusCircle, Calendar, Users, Eye, Trash2, Edit, AlertCircle } from 'lucide-react';

export const MyTripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [travelTypeFilter, setTravelTypeFilter] = useState('');

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const res = await tripsApi.getAll(searchQuery, travelTypeFilter);
      setTrips(res.data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [travelTypeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTrips();
  };

  const handleDelete = async (id, destination) => {
    if (!window.confirm(`Are you sure you want to delete your trip to ${destination}?`)) return;
    try {
      await tripsApi.delete(id);
      setTrips(trips.filter((t) => t.id !== id));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: '#0f172a', fontWeight: 800 }}>My Saved Trips</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Browse, manage, or reopen your travel itineraries stored in MySQL
          </p>
        </div>
        <Link to="/create-trip" className="btn btn-primary">
          <PlusCircle size={18} /> Plan New Trip
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 250px', position: 'relative' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by destination (e.g. Paris, Goa, Tokyo)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          <div style={{ width: '180px' }}>
            <select
              className="form-control"
              value={travelTypeFilter}
              onChange={(e) => setTravelTypeFilter(e.target.value)}
            >
              <option value="">All Travel Types</option>
              <option value="Solo">Solo</option>
              <option value="Couple">Couple</option>
              <option value="Family">Family</option>
              <option value="Friends">Friends</option>
            </select>
          </div>

          <button type="submit" className="btn btn-secondary btn-sm" style={{ padding: '0.7rem 1.25rem' }}>
            Search
          </button>
        </form>
      </div>

      {/* Trips Grid */}
      {loading ? (
        <div className="card" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LoadingSpinner message="Loading your saved journeys..." />
        </div>
      ) : error ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#fee2e2' }}>
          <AlertCircle size={32} color="#dc2626" style={{ marginBottom: '0.5rem' }} />
          <p style={{ color: '#991b1b', fontWeight: 600 }}>{error}</p>
          <button onClick={fetchTrips} className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
            Try Again
          </button>
        </div>
      ) : trips.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Compass size={40} color="#0284c7" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '0.5rem' }}>No trips found</h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            {searchQuery || travelTypeFilter ? 'No trips match your current search filters.' : "You haven't created any trips yet."}
          </p>
          <Link to="/create-trip" className="btn btn-primary">
            Plan a Trip Now
          </Link>
        </div>
      ) : (
        <div className="grid-3">
          {trips.map((trip) => (
            <div key={trip.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <span className={`badge ${trip.generationSource === 'AI_GENERATED' ? 'badge-ai' : 'badge-fallback'}`}>
                    {trip.generationSource === 'AI_GENERATED' ? 'AI Generated' : 'Curated Plan'}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {trip.createdAt ? new Date(trip.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.3rem', color: '#0f172a', marginBottom: '0.5rem' }}>
                  {trip.destination}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={15} color="#0284c7" />
                    <span>Starts {trip.startDate} &bull; {trip.durationDays} Days</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Users size={15} color="#0d9488" />
                    <span>{trip.travelType} ({trip.travellerCount} Travellers)</span>
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
                  <Eye size={15} /> View Itinerary
                </Link>
                <button
                  onClick={() => handleDelete(trip.id, trip.destination)}
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
export default MyTripsPage;
