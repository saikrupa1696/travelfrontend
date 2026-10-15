import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sharedApi } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PlaceCard } from '../components/PlaceCard';
import { InteractiveMap } from '../components/InteractiveMap';
import { formatCurrency } from '../utils/formatters';
import { Compass, MapPin, Calendar, Users, Printer, AlertTriangle, ArrowRight } from 'lucide-react';

export const SharedTripPage = () => {
  const { token } = useParams();
  const [trip, setTrip] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Map focus interaction
  const [focusedActivity, setFocusedActivity] = useState(null);
  const mapSectionRef = useRef(null);

  useEffect(() => {
    const fetchSharedData = async () => {
      try {
        setLoading(true);
        const tripRes = await sharedApi.getTrip(token);
        setTrip(tripRes.data);

        const itinRes = await sharedApi.getItinerary(token);
        setItinerary(itinRes.data);
      } catch (err) {
        setError(err.message || 'Shared itinerary not found or link has expired.');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedData();
  }, [token]);

  const handleViewOnMap = (activity) => {
    setFocusedActivity(activity);
    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner message="Opening shared travel itinerary..." />
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '2.5rem' }}>
          <AlertTriangle size={40} color="#ef4444" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.4rem', color: '#0f172a', marginBottom: '0.5rem' }}>Link Unavailable</h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>{error}</p>
          <Link to="/" className="btn btn-primary btn-sm">Visit TravelMate AI Home</Link>
        </div>
      </div>
    );
  }

  const budgetBreakdown = itinerary.budgetBreakdown;
  const allActivities = itinerary.days?.flatMap((d) => d.activities || []) || [];
  const destinationCoords = (trip?.destinationLatitude && trip?.destinationLongitude)
    ? { lat: trip.destinationLatitude, lon: trip.destinationLongitude }
    : null;

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Notice Banner */}
      <div className="no-print" style={{
        backgroundColor: '#e0f2fe',
        color: '#0369a1',
        padding: '0.85rem 1.25rem',
        borderRadius: '10px',
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem',
        fontSize: '0.9rem'
      }}>
        <span>🌐 <strong>Shared Travel Plan:</strong> You are viewing a read-only itinerary shared via TravelMate AI.</span>
        <button onClick={() => window.print()} className="btn btn-secondary btn-sm" style={{ padding: '4px 10px' }}>
          <Printer size={14} /> Print Plan
        </button>
      </div>

      {/* Header Banner */}
      <div className="card" style={{
        padding: '2rem',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
        color: '#ffffff'
      }}>
        <h1 style={{ color: '#ffffff', fontSize: 'clamp(1.75rem, 3vw, 2.4rem)', fontWeight: 800 }}>
          {itinerary.title}
        </h1>
        <p style={{ color: '#e0f2fe', fontSize: '1rem', marginTop: '0.4rem', maxWidth: '750px', lineHeight: '1.6' }}>
          {itinerary.summary}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem',
          backgroundColor: 'rgba(15, 23, 42, 0.25)',
          padding: '1rem 1.25rem',
          borderRadius: '12px',
          marginTop: '1.5rem',
          fontSize: '0.9rem'
        }}>
          <div>
            <span style={{ color: '#93c5fd', fontSize: '0.8rem', display: 'block' }}>Destination</span>
            <strong style={{ color: '#ffffff' }}>{trip?.destination}</strong>
          </div>
          <div>
            <span style={{ color: '#93c5fd', fontSize: '0.8rem', display: 'block' }}>Dates</span>
            <strong style={{ color: '#ffffff' }}>{trip?.startDate} ({trip?.durationDays} Days)</strong>
          </div>
          <div>
            <span style={{ color: '#93c5fd', fontSize: '0.8rem', display: 'block' }}>Travellers</span>
            <strong style={{ color: '#ffffff' }}>{trip?.travelType} ({trip?.travellerCount} Pers.)</strong>
          </div>
          <div>
            <span style={{ color: '#93c5fd', fontSize: '0.8rem', display: 'block' }}>Target Budget (₹)</span>
            <strong style={{ color: '#ffffff' }}>{formatCurrency(trip?.budgetAmount)}</strong>
          </div>
        </div>
      </div>

      {/* Interactive Map Section */}
      <div ref={mapSectionRef} style={{ marginBottom: '2.5rem' }}>
        <InteractiveMap
          destination={trip?.destination}
          destinationCoords={destinationCoords}
          activities={allActivities}
          focusedActivity={focusedActivity}
          height="420px"
        />
      </div>

      {/* Days & Schedule */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: '#0f172a', marginBottom: '1.25rem', fontWeight: 800 }}>
            Daily Schedule & Real Places
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {itinerary.days?.map((day) => (
              <div key={day.id || day.dayNumber} className="card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.85rem' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#0f172a' }}>
                    <span style={{
                      backgroundColor: '#e0f2fe',
                      color: '#0284c7',
                      padding: '3px 8px',
                      borderRadius: '5px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      marginRight: '8px'
                    }}>
                      DAY {day.dayNumber}
                    </span>
                    {day.theme}
                  </h3>
                  <span style={{
                    fontSize: '0.85rem',
                    color: '#0d9488',
                    fontWeight: 700,
                    backgroundColor: '#f0fdf4',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: '1px solid #bbf7d0'
                  }}>
                    {formatCurrency(day.dailyEstimatedCost || 0)}
                  </span>
                </div>

                {(!day.activities || day.activities.length === 0) ? (
                  <p style={{ color: '#64748b', fontSize: '0.85rem', fontStyle: 'italic' }}>
                    Free time for leisure and relaxation.
                  </p>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '1.25rem'
                  }}>
                    {day.activities.map((act, idx) => (
                      <PlaceCard
                        key={act.id || idx}
                        activity={act}
                        onViewOnMap={handleViewOnMap}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Budget breakdown summary */}
        <div>
          <div className="card" style={{ position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                backgroundColor: '#ccfbf1',
                color: '#0f766e',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.95rem',
                fontWeight: 800
              }}>
                ₹
              </span>
              Estimated Trip Expenses (INR)
            </h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Target Budget</span>
                <h4 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 800 }}>
                  {formatCurrency(budgetBreakdown?.totalBudget || 0)}
                </h4>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Estimated Total</span>
                <h4 style={{ fontSize: '1.2rem', color: '#0284c7', fontWeight: 800 }}>
                  {formatCurrency(budgetBreakdown?.totalEstimatedCost || 0)}
                </h4>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>🏨 Stays & Accommodation</span>
                <strong style={{ color: '#0f172a' }}>{formatCurrency(budgetBreakdown?.accommodationEst || 0)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>🍽️ Food & Dining</span>
                <strong style={{ color: '#0f172a' }}>{formatCurrency(budgetBreakdown?.foodEst || 0)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>🚕 Local Transit</span>
                <strong style={{ color: '#0f172a' }}>{formatCurrency(budgetBreakdown?.transportEst || 0)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>🎟️ Sights & Activities</span>
                <strong style={{ color: '#0f172a' }}>{formatCurrency(budgetBreakdown?.activitiesEst || 0)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>🛡️ Misc / Buffer</span>
                <strong style={{ color: '#0f172a' }}>{formatCurrency(budgetBreakdown?.miscEst || 0)}</strong>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
              <Link to="/register" className="btn btn-primary btn-sm" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                Plan Your Own Trip Free <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 950px) {
          div[style*="grid-template-columns: 1.8fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SharedTripPage;
