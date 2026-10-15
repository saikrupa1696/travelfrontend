import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { formatCurrency } from '../utils/formatters';
import {
  Navigation, Crosshair, MapPin, ExternalLink,
  Layers, AlertCircle, CheckCircle2, Compass
} from 'lucide-react';

// Custom DivIcon generator for distinct category pins
const createCategoryIcon = (category, isUserLocation = false) => {
  if (isUserLocation) {
    return L.divIcon({
      className: 'custom-map-pin user-pin',
      html: `
        <div style="
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #0284c7;
          border: 3px solid #ffffff;
          box-shadow: 0 0 12px rgba(2, 132, 199, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          animation: pulse 2s infinite;
        ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10"></circle>
            <circle cx="12" cy="12" r="3" fill="white"></circle>
          </svg>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
      popupAnchor: [0, -17]
    });
  }

  const cat = (category || 'SIGHTSEEING').toUpperCase();
  let bgColor = '#0284c7'; // default blue
  let iconSvg = '<circle cx="12" cy="10" r="3"></circle>';

  if (cat === 'DINING' || cat === 'FOOD') {
    bgColor = '#f59e0b'; // amber
    iconSvg = '<path d="M18 2v6a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V2"></path><path d="M12 11v11"></path>';
  } else if (cat === 'NATURE' || cat === 'BEACH' || cat === 'RELAXATION') {
    bgColor = '#10b981'; // emerald
    iconSvg = '<path d="m8 3 4 8 5-5 5 15H2L8 3z"></path>';
  } else if (cat === 'SHOPPING') {
    bgColor = '#8b5cf6'; // violet
    iconSvg = '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path>';
  } else if (cat === 'TRANSIT') {
    bgColor = '#64748b'; // slate
    iconSvg = '<rect width="16" height="16" x="4" y="4" rx="2"></rect><path d="M9 9h6"></path><path d="M9 15h6"></path>';
  } else {
    // HERITAGE / SIGHTSEEING
    bgColor = '#0284c7';
    iconSvg = '<path d="m3 11 18-5v12L3 14v-3z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path>';
  }

  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        position: relative;
        width: 32px;
        height: 38px;
        filter: drop-shadow(0 3px 6px rgba(15, 23, 42, 0.3));
      ">
        <svg viewBox="0 0 24 28" width="32" height="38" style="overflow: visible;">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 16 12 16s12-7 12-16c0-6.627-5.373-12-12-12z" fill="${bgColor}" stroke="#ffffff" stroke-width="1.5"/>
          <g transform="translate(4, 3) scale(0.68)" stroke="#ffffff" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            ${iconSvg}
          </g>
        </svg>
      </div>
    `,
    iconSize: [32, 38],
    iconAnchor: [16, 38],
    popupAnchor: [0, -38]
  });
};

// Component to dynamically adjust map view when places change or a card is clicked
const MapController = ({ center, zoom, focusPlace }) => {
  const map = useMap();

  useEffect(() => {
    if (focusPlace && focusPlace.latitude && focusPlace.longitude) {
      map.flyTo([focusPlace.latitude, focusPlace.longitude], 15, { duration: 1.2 });
    } else if (center && center[0] && center[1]) {
      map.setView(center, zoom);
    }
  }, [center, zoom, focusPlace, map]);

  return null;
};

export const InteractiveMap = ({
  destination,
  destinationCoords,
  activities = [],
  focusedActivity = null,
  height = '480px'
}) => {
  // Filter activities that have valid coordinates
  const validPlaces = activities.filter(
    (act) => act.latitude && act.longitude && (act.latitude !== 0 || act.longitude !== 0)
  );

  // Compute default center
  const defaultLat = destinationCoords?.lat || (validPlaces.length > 0 ? validPlaces[0].latitude : 15.2993);
  const defaultLon = destinationCoords?.lon || (validPlaces.length > 0 ? validPlaces[0].longitude : 74.1240);
  const center = [defaultLat, defaultLon];

  // Geolocation state
  const [userLocation, setUserLocation] = useState(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoMessage, setGeoMessage] = useState(null);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoMessage({ type: 'error', text: 'Geolocation is not supported by your current browser.' });
      return;
    }

    setGeoLoading(true);
    setGeoMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        setUserLocation(coords);
        setGeoLoading(false);
        setGeoMessage({
          type: 'success',
          text: 'Current location identified! External directions will now calculate routes from your position.'
        });
      },
      (error) => {
        setGeoLoading(false);
        let errorText = 'Unable to detect location.';
        if (error.code === error.PERMISSION_DENIED) {
          errorText = 'Location permission was denied. You can still explore all destination places and get directions.';
        } else if (error.code === error.TIMEOUT) {
          errorText = 'Location request timed out. Please try again.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorText = 'Location information is currently unavailable.';
        }
        setGeoMessage({ type: 'error', text: errorText });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const getDirectionsLink = (place) => {
    if (userLocation) {
      return `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lon}&destination=${place.latitude},${place.longitude}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
  };

  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid #cbd5e1', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)' }}>
      {/* Top Map Action Bar */}
      <div style={{
        padding: '0.85rem 1.25rem',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: '#e0f2fe',
            color: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MapPin size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', color: '#0f172a', margin: 0 }}>
              Interactive Itinerary Map &bull; {destination}
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {validPlaces.length} mapped attractions &bull; OpenStreetMap Tiles
            </span>
          </div>
        </div>

        {/* Current Location Request Button */}
        <div>
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="btn btn-secondary btn-sm"
            disabled={geoLoading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.82rem',
              backgroundColor: userLocation ? '#f0fdf4' : '#ffffff',
              borderColor: userLocation ? '#86efac' : '#cbd5e1'
            }}
          >
            <Crosshair size={14} color={userLocation ? '#16a34a' : '#0284c7'} />
            {geoLoading ? 'Detecting...' : userLocation ? 'Location Active' : 'Use My Current Location'}
          </button>
        </div>
      </div>

      {/* Geolocation Feedback Alert */}
      {geoMessage && (
        <div style={{
          padding: '0.6rem 1.25rem',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: geoMessage.type === 'success' ? '#f0fdf4' : '#fef2f2',
          color: geoMessage.type === 'success' ? '#166534' : '#991b1b',
          borderBottom: '1px solid #e2e8f0'
        }}>
          {geoMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{geoMessage.text}</span>
        </div>
      )}

      {/* Leaflet Map Container */}
      <div style={{ height, width: '100%', position: 'relative' }}>
        <MapContainer
          center={center}
          zoom={12}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%', zIndex: 1 }}
        >
          {/* Dynamic Controller for panning/zooming */}
          <MapController center={center} zoom={12} focusPlace={focusedActivity} />

          {/* OpenStreetMap Tile Layer with standard polite attribution */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />

          {/* User Location Marker */}
          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lon]}
              icon={createCategoryIcon(null, true)}
            >
              <Popup>
                <div style={{ padding: '4px' }}>
                  <strong style={{ color: '#0284c7', fontSize: '0.9rem' }}>📍 Your Current Location</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                    Origin set for turn-by-turn navigation.
                  </p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Mapped Itinerary Places */}
          {validPlaces.map((place, idx) => (
            <Marker
              key={place.id || idx}
              position={[place.latitude, place.longitude]}
              icon={createCategoryIcon(place.category)}
            >
              <Popup>
                <div style={{ maxWidth: '240px', padding: '2px' }}>
                  {place.photoUrl && (
                    <img
                      src={place.photoUrl}
                      alt={place.placeName}
                      style={{
                        width: '100%',
                        height: '110px',
                        objectFit: 'cover',
                        borderRadius: '6px',
                        marginBottom: '6px'
                      }}
                    />
                  )}
                  <span style={{
                    display: 'inline-block',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#0284c7',
                    marginBottom: '2px'
                  }}>
                    {place.category || 'Attraction'}
                  </span>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', color: '#0f172a' }}>
                    {place.placeName}
                  </h4>
                  {place.estimatedCost !== undefined && (
                    <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', fontWeight: 600, color: '#10b981' }}>
                      {Number(place.estimatedCost) === 0 ? 'Free Entry' : `Est. ${formatCurrency(place.estimatedCost)}`}
                    </p>
                  )}
                  {place.address && (
                    <p style={{ margin: '0 0 8px 0', fontSize: '0.75rem', color: '#64748b', lineHeight: 1.3 }}>
                      {place.address}
                    </p>
                  )}
                  <a
                    href={getDirectionsLink(place)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                    style={{
                      width: '100%',
                      padding: '4px 8px',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <Navigation size={12} /> Open Directions <ExternalLink size={10} />
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Map Legend Overlay in bottom-left */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          zIndex: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(6px)',
          padding: '6px 12px',
          borderRadius: '8px',
          fontSize: '0.72rem',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontWeight: 700, color: '#0f172a' }}>Legend:</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0284c7', fontWeight: 600 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0284c7' }}></span> Sights
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 600 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span> Dining
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontWeight: 600 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span> Nature
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#8b5cf6', fontWeight: 600 }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#8b5cf6' }}></span> Shopping
          </span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
