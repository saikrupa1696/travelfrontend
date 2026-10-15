import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tripsApi, itineraryApi } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PlaceCard } from '../components/PlaceCard';
import { InteractiveMap } from '../components/InteractiveMap';
import { formatCurrency } from '../utils/formatters';
import {
  Compass, Sparkles, MapPin, Calendar, Users,
  Share2, RefreshCw, Printer, Clock, CheckCircle2, AlertTriangle,
  Send, X, Copy, Check, Info, ChevronRight, Edit3, TrendingUp, AlertCircle
} from 'lucide-react';

export const ItineraryPage = () => {
  const { id } = useParams();

  const [trip, setTrip] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  // Map focus interaction
  const [focusedActivity, setFocusedActivity] = useState(null);
  const mapSectionRef = useRef(null);

  // Modals
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [copied, setCopied] = useState(false);

  const [modifyModalOpen, setModifyModalOpen] = useState(false);
  const [modifyPrompt, setModifyPrompt] = useState('');

  const fetchTripAndItinerary = async () => {
    try {
      setLoading(true);
      const tripRes = await tripsApi.getById(id);
      setTrip(tripRes.data);

      try {
        const itinRes = await itineraryApi.get(id);
        setItinerary(itinRes.data);
      } catch (itinErr) {
        // If itinerary not yet generated, auto-generate
        const genRes = await itineraryApi.generate(id);
        setItinerary(genRes.data);
      }
      setError('');
    } catch (err) {
      setError(err.message || 'Could not load itinerary.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripAndItinerary();
  }, [id]);

  const handleRegenerate = async () => {
    if (!window.confirm('Regenerate fresh itinerary? Your previous plan will be replaced.')) return;
    try {
      setActionLoading(true);
      const res = await itineraryApi.regenerate(id);
      setItinerary(res.data);
    } catch (err) {
      alert('Regeneration failed: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleModifySubmit = async (e) => {
    e.preventDefault();
    if (!modifyPrompt.trim()) return;

    try {
      setActionLoading(true);
      const res = await itineraryApi.modify(id, { instruction: modifyPrompt });
      setItinerary(res.data);
      setModifyModalOpen(false);
      setModifyPrompt('');
    } catch (err) {
      alert('Modification failed: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenShare = async () => {
    try {
      const res = await tripsApi.share(id);
      setShareData(res.data);
      setShareModalOpen(true);
    } catch (err) {
      alert('Could not create share link: ' + err.message);
    }
  };

  const handleCopyLink = () => {
    if (!shareData) return;
    const fullUrl = `${window.location.origin}/shared/${shareData.shareToken}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleViewOnMap = (activity) => {
    setFocusedActivity(activity);
    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner message="Loading your customized travel plan..." />
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '500px', margin: '0 auto', padding: '2.5rem' }}>
          <AlertTriangle size={40} color="#ef4444" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.4rem', color: '#0f172a', marginBottom: '0.5rem' }}>Unable to load itinerary</h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>{error || 'Itinerary could not be retrieved.'}</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={fetchTripAndItinerary} className="btn btn-primary btn-sm">Try Again</button>
            <Link to="/dashboard" className="btn btn-secondary btn-sm">Go to Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  const budgetBreakdown = itinerary.budgetBreakdown;
  const isAi = itinerary.generationSource === 'AI_GENERATED';
  const allActivities = itinerary.days?.flatMap((d) => d.activities || []) || [];

  const destinationCoords = (trip?.destinationLatitude && trip?.destinationLongitude)
    ? { lat: trip.destinationLatitude, lon: trip.destinationLongitude }
    : null;

  // Calculate budget utilization percentage
  const budgetPercentUsed = budgetBreakdown?.percentageUsed !== undefined
    ? Math.round(budgetBreakdown.percentageUsed)
    : (budgetBreakdown?.totalBudget > 0
        ? Math.round((Number(budgetBreakdown.totalEstimatedCost) / Number(budgetBreakdown.totalBudget)) * 100)
        : 0);

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Top Breadcrumb & Actions Bar */}
      <div className="no-print" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
          <Link to="/dashboard" style={{ color: '#0284c7', fontWeight: 600 }}>Dashboard</Link>
          <ChevronRight size={14} />
          <Link to="/trips" style={{ color: '#0284c7', fontWeight: 600 }}>My Trips</Link>
          <ChevronRight size={14} />
          <span>{trip?.destination}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button onClick={() => setModifyModalOpen(true)} className="btn btn-secondary btn-sm" disabled={actionLoading}>
            <Sparkles size={16} color="#0284c7" /> Modify with AI
          </button>
          <button onClick={handleRegenerate} className="btn btn-secondary btn-sm" disabled={actionLoading}>
            <RefreshCw size={16} /> Regenerate
          </button>
          <button onClick={handleOpenShare} className="btn btn-secondary btn-sm">
            <Share2 size={16} /> Share Link
          </button>
          <button onClick={() => window.print()} className="btn btn-secondary btn-sm">
            <Printer size={16} /> Print / PDF
          </button>
        </div>
      </div>

      {/* Trip Header Banner */}
      <div className="card" style={{
        padding: '2rem',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
        color: '#ffffff'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span className={`badge ${isAi ? 'badge-ai' : 'badge-fallback'}`} style={{ backgroundColor: '#ffffff', color: isAi ? '#0369a1' : '#334155' }}>
                {isAi ? 'AI Generated Itinerary' : 'High-Fidelity Curated Plan'}
              </span>
              <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
                {trip?.travelPace} PACE
              </span>
              {trip?.travelType && (
                <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
                  {trip.travelType.toUpperCase()}
                </span>
              )}
            </div>

            <h1 style={{ color: '#ffffff', fontSize: 'clamp(1.75rem, 3vw, 2.4rem)', fontWeight: 800 }}>
              {itinerary.title}
            </h1>
            <p style={{ color: '#e0f2fe', fontSize: '1rem', marginTop: '0.4rem', maxWidth: '750px', lineHeight: '1.6' }}>
              {itinerary.summary}
            </p>
          </div>
        </div>

        {/* Quick Facts Strip */}
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
            <span style={{ color: '#93c5fd', fontSize: '0.8rem', display: 'block' }}>Trip Dates</span>
            <strong style={{ color: '#ffffff' }}>{trip?.startDate} ({trip?.durationDays} Days)</strong>
          </div>
          <div>
            <span style={{ color: '#93c5fd', fontSize: '0.8rem', display: 'block' }}>Travellers</span>
            <strong style={{ color: '#ffffff' }}>{trip?.travelType} ({trip?.travellerCount} Pers.)</strong>
          </div>
          <div>
            <span style={{ color: '#93c5fd', fontSize: '0.8rem', display: 'block' }}>Budget Target (₹)</span>
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
          height="450px"
        />
      </div>

      {/* Main Grid: Days Timeline (Left) & Budget Breakdown (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2rem' }}>
        {/* Left Column: Chronological Days & Rich Place Cards */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: 800 }}>
              Day-by-Day Schedule & Real Places
            </h2>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
              {itinerary.days?.length} Planned Days &bull; {allActivities.length} Places
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {itinerary.days?.map((day) => (
              <div key={day.id || day.dayNumber} className="card" style={{ padding: '1.75rem' }}>
                {/* Day Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid #e2e8f0',
                  paddingBottom: '1rem',
                  marginBottom: '1.5rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  <div>
                    <span style={{
                      backgroundColor: '#e0f2fe',
                      color: '#0284c7',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      marginRight: '8px'
                    }}>
                      DAY {day.dayNumber}
                    </span>
                    <strong style={{ fontSize: '1.2rem', color: '#0f172a' }}>{day.theme}</strong>
                    {day.date && (
                      <span style={{ color: '#64748b', fontSize: '0.85rem', marginLeft: '8px' }}>
                        &bull; {day.date}
                      </span>
                    )}
                  </div>
                  <div>
                    <span style={{
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: '#0d9488',
                      backgroundColor: '#f0fdf4',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid #bbf7d0'
                    }}>
                      Est. Day Total: {formatCurrency(day.dailyEstimatedCost || 0)}
                    </span>
                  </div>
                </div>

                {/* Activities grid for the day using PlaceCard with photos */}
                {(!day.activities || day.activities.length === 0) ? (
                  <div style={{
                    padding: '2.5rem 1.5rem',
                    textAlign: 'center',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px dashed #cbd5e1'
                  }}>
                    <Compass size={32} color="#94a3b8" style={{ marginBottom: '0.5rem' }} />
                    <h4 style={{ fontSize: '1rem', color: '#334155', marginBottom: '0.25rem' }}>Free Time & Leisure</h4>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', maxWidth: '380px', margin: '0 auto' }}>
                      No scheduled stops for this window. Perfect opportunity to relax at your hotel, stroll local markets, or try spontaneous dining.
                    </p>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
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

        {/* Right Column: Realistic Trip Budget Analytics (INR) */}
        <div>
          <div className="card" style={{ position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: '#ccfbf1',
                color: '#0f766e',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                fontWeight: 800
              }}>
                ₹
              </span>
              Trip Budget Analytics (INR)
            </h3>

            {/* Dynamic Status Advice Pill */}
            <div style={{
              padding: '0.85rem 1rem',
              borderRadius: '8px',
              backgroundColor: budgetBreakdown?.budgetStatus === 'OVER_BUDGET' ? '#fee2e2' :
                               budgetBreakdown?.budgetStatus === 'TIGHT_BUDGET' ? '#fef3c7' : '#d1fae5',
              color: budgetBreakdown?.budgetStatus === 'OVER_BUDGET' ? '#991b1b' :
                     budgetBreakdown?.budgetStatus === 'TIGHT_BUDGET' ? '#92400e' : '#065f46',
              fontSize: '0.85rem',
              lineHeight: '1.5',
              marginBottom: '1.25rem',
              border: '1px solid rgba(0,0,0,0.06)'
            }}>
              <strong>
                {budgetBreakdown?.budgetStatus === 'OVER_BUDGET' ? '⚠️ Over Budget Alert: ' :
                 budgetBreakdown?.budgetStatus === 'TIGHT_BUDGET' ? 'ℹ️ Tight Budget: ' : '✅ Within Budget: '}
              </strong>
              {budgetBreakdown?.advice || 'Estimated expenditure aligns with your planned budget.'}
            </div>

            {/* Budget Utilization Progress Bar */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.4rem' }}>
                <span style={{ color: '#64748b', fontWeight: 600 }}>Budget Utilization</span>
                <strong style={{
                  color: budgetPercentUsed > 100 ? '#ef4444' : budgetPercentUsed > 85 ? '#f59e0b' : '#10b981'
                }}>
                  {budgetPercentUsed}% Used
                </strong>
              </div>
              <div style={{
                height: '8px',
                width: '100%',
                backgroundColor: '#e2e8f0',
                borderRadius: '9999px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, budgetPercentUsed)}%`,
                  backgroundColor: budgetPercentUsed > 100 ? '#ef4444' : budgetPercentUsed > 85 ? '#f59e0b' : '#10b981',
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>

            {/* Totals Comparison */}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Target Budget</span>
                <h4 style={{ fontSize: '1.25rem', color: '#0f172a', fontWeight: 800 }}>
                  {formatCurrency(budgetBreakdown?.totalBudget || 0)}
                </h4>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Estimated Total</span>
                <h4 style={{ fontSize: '1.25rem', color: '#0284c7', fontWeight: 800 }}>
                  {formatCurrency(budgetBreakdown?.totalEstimatedCost || 0)}
                </h4>
              </div>
            </div>

            {/* Per person indicator */}
            <div style={{
              fontSize: '0.85rem',
              color: '#64748b',
              marginBottom: '1.25rem',
              backgroundColor: '#f1f5f9',
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>Cost Per Person:</span>
              <div>
                <strong style={{ color: '#0f172a' }}>
                  {formatCurrency(budgetBreakdown?.perPersonEstimatedCost || 0)}
                </strong>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  {' '}/ {formatCurrency(budgetBreakdown?.perPersonBudget || 0)}
                </span>
              </div>
            </div>

            {/* Daily Estimated Spending */}
            {budgetBreakdown?.dailyEstimatedSpending && (
              <div style={{
                fontSize: '0.85rem',
                color: '#64748b',
                marginBottom: '1.25rem',
                backgroundColor: '#f8fafc',
                padding: '0.5rem 0.85rem',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>Daily Avg. Spending:</span>
                <strong style={{ color: '#0284c7' }}>
                  {formatCurrency(budgetBreakdown.dailyEstimatedSpending)} / day
                </strong>
              </div>
            )}

            {/* Itemized Categories */}
            <h5 style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '0.75rem', fontWeight: 700 }}>
              Estimated Expense Allocations
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>🏨 Accommodation ({trip?.accommodationPref})</span>
                <strong style={{ color: '#0f172a' }}>{formatCurrency(budgetBreakdown?.accommodationEst || 0)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>🍽️ Dining & Food ({trip?.foodPref})</span>
                <strong style={{ color: '#0f172a' }}>{formatCurrency(budgetBreakdown?.foodEst || 0)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>🚕 Local Transit & Cabs</span>
                <strong style={{ color: '#0f172a' }}>{formatCurrency(budgetBreakdown?.transportEst || 0)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>🎟️ Activities & Entry Tickets</span>
                <strong style={{ color: '#0f172a' }}>{formatCurrency(budgetBreakdown?.activitiesEst || 0)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>🛡️ Contingency & Misc</span>
                <strong style={{ color: '#0f172a' }}>{formatCurrency(budgetBreakdown?.miscEst || 0)}</strong>
              </div>
            </div>

            {/* Remaining Balance */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '1.25rem',
              paddingTop: '1rem',
              borderTop: '2px solid #e2e8f0'
            }}>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>Estimated Balance:</span>
              <strong style={{
                fontSize: '1.15rem',
                color: Number(budgetBreakdown?.remainingBudget) >= 0 ? '#10b981' : '#ef4444'
              }}>
                {Number(budgetBreakdown?.remainingBudget) >= 0 ? '+' : '-'}
                {formatCurrency(Math.abs(Number(budgetBreakdown?.remainingBudget || 0)))}
              </strong>
            </div>

            {/* Realistic Calculation Disclaimer */}
            <div style={{ marginTop: '1.25rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.85rem' }}>
              <p style={{ fontSize: '0.74rem', color: '#94a3b8', lineHeight: '1.45', margin: 0 }}>
                {budgetBreakdown?.disclaimer ||
                  "* All prices reflect estimated local market averages. Excludes major long-distance transit (e.g. flights/trains) unless configured."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {shareModalOpen && shareData && (
        <div className="modal-backdrop" onClick={() => setShareModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#0f172a' }}>Share this Itinerary</h3>
              <button onClick={() => setShareModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#64748b" />
              </button>
            </div>

            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Anyone with this link can view the complete itinerary, interactive map, place photos, and budget breakdown without needing an account.
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input
                type="text"
                readOnly
                className="form-control"
                value={`${window.location.origin}/shared/${shareData.shareToken}`}
                style={{ backgroundColor: '#f1f5f9', fontSize: '0.85rem' }}
              />
              <button onClick={handleCopyLink} className="btn btn-primary" style={{ padding: '0 1.25rem' }}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div style={{ textAlign: 'right' }}>
              <button onClick={() => setShareModalOpen(false)} className="btn btn-secondary btn-sm">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Modify with AI Modal */}
      {modifyModalOpen && (
        <div className="modal-backdrop" onClick={() => setModifyModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.3rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={20} color="#0284c7" /> Modify Itinerary with AI
              </h3>
              <button onClick={() => setModifyModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#64748b" />
              </button>
            </div>

            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Tell TravelMate AI how you'd like to adjust your trip (e.g., "Add more seafood restaurants in North Goa", "Make Day 2 more relaxed", or "Cut expenses to stay under ₹20,000").
            </p>

            <form onSubmit={handleModifySubmit}>
              <div className="form-group">
                <textarea
                  rows="4"
                  className="form-control"
                  placeholder="e.g. Please swap the afternoon museum visit on Day 2 for a scenic sunset beach walk and local cafe."
                  value={modifyPrompt}
                  onChange={(e) => setModifyPrompt(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setModifyModalOpen(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={actionLoading || !modifyPrompt.trim()}>
                  {actionLoading ? 'Updating Plan...' : 'Apply Modifications'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

export default ItineraryPage;
