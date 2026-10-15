import React from 'react';
import { PlaceImage } from './PlaceImage';
import { formatCurrency } from '../utils/formatters';
import {
  Clock, MapPin, Navigation, Compass, Star,
  DollarSign, ExternalLink, Calendar, Info
} from 'lucide-react';

export const PlaceCard = ({ activity, onViewOnMap, userLocation }) => {
  if (!activity) return null;

  const {
    placeName,
    photoUrl,
    description,
    category,
    address,
    openingHours,
    rating,
    reviewCount,
    durationMinutes,
    estimatedCost,
    latitude,
    longitude,
    startTime,
    endTime
  } = activity;

  // Build external directions URL
  const getDirectionsUrl = () => {
    if (latitude && longitude && latitude !== 0 && longitude !== 0) {
      if (userLocation && userLocation.lat && userLocation.lon) {
        return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lon}&destination=${latitude},${longitude}`;
      }
      return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    }
    const query = encodeURIComponent(`${placeName} ${address || ''}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  const hasCoords = latitude && longitude && (latitude !== 0 || longitude !== 0);

  return (
    <div
      className="card card-interactive place-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '0',
        overflow: 'hidden',
        border: '1px solid rgba(226, 232, 240, 0.9)',
        boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)',
        transition: 'all 0.25s ease'
      }}
    >
      {/* Top Photograph with Category Badge */}
      <PlaceImage
        src={photoUrl}
        alt={placeName}
        category={category}
        height="180px"
      />

      {/* Card Content Body */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          {/* Header Row: Timing Pill & Cost Tag */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.4rem' }}>
            {startTime && endTime && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#0284c7',
                backgroundColor: '#e0f2fe',
                padding: '2px 8px',
                borderRadius: '6px'
              }}>
                <Clock size={13} /> {startTime} - {endTime}
              </span>
            )}

            <span style={{
              fontSize: '0.85rem',
              fontWeight: 800,
              color: Number(estimatedCost) === 0 ? '#10b981' : '#0f172a'
            }}>
              {Number(estimatedCost) === 0 ? 'Free Entry' : `Est. ${formatCurrency(estimatedCost)}`}
            </span>
          </div>

          {/* Place Title */}
          <h4 style={{
            fontSize: '1.15rem',
            fontWeight: 800,
            color: '#0f172a',
            margin: '0.1rem 0 0.4rem 0',
            lineHeight: 1.3
          }}>
            {placeName}
          </h4>

          {/* Ratings & Duration Strip */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem', fontSize: '0.8rem', color: '#64748b', marginBottom: '0.65rem' }}>
            {rating && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#d97706', fontWeight: 700 }}>
                <Star size={14} fill="#f59e0b" color="#f59e0b" />
                {rating.toFixed(1)}
                {reviewCount && <span style={{ color: '#94a3b8', fontWeight: 500 }}>({reviewCount.toLocaleString()})</span>}
              </span>
            )}

            {durationMinutes && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Clock size={13} color="#94a3b8" /> {durationMinutes} mins visit
              </span>
            )}
          </div>

          {/* Description */}
          <p style={{
            color: '#475569',
            fontSize: '0.875rem',
            lineHeight: '1.5',
            margin: '0 0 0.75rem 0',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {description}
          </p>

          {/* Address / Location */}
          {address && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.4rem',
              fontSize: '0.8rem',
              color: '#64748b',
              marginBottom: '0.5rem'
            }}>
              <MapPin size={14} color="#0284c7" style={{ marginTop: '2px', flexShrink: 0 }} />
              <span style={{ lineHeight: 1.4 }}>{address}</span>
            </div>
          )}

          {/* Opening Hours */}
          {openingHours && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.78rem',
              color: '#10b981',
              fontWeight: 600,
              marginBottom: '0.75rem'
            }}>
              <Info size={13} />
              <span>{openingHours}</span>
            </div>
          )}
        </div>

        {/* Action Buttons Strip: Directions & View on Map */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid #f1f5f9',
          marginTop: '0.5rem'
        }}>
          <a
            href={getDirectionsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ flex: 1, fontSize: '0.8rem', padding: '0.45rem 0.6rem' }}
            title="Open turn-by-turn directions in external map"
          >
            <Navigation size={14} color="#0284c7" /> Directions <ExternalLink size={12} color="#94a3b8" />
          </a>

          {hasCoords && onViewOnMap && (
            <button
              type="button"
              onClick={() => onViewOnMap(activity)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem' }}
              title="Locate on itinerary interactive map"
            >
              <Compass size={14} color="#0d9488" /> Map
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
