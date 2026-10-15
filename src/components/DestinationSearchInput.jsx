import React, { useState, useEffect, useRef } from 'react';
import { placesApi } from '../services/api';
import { MapPin, Search, Loader2, Check, Globe } from 'lucide-react';

export const DestinationSearchInput = ({
  value = '',
  onChange,
  onSelectLocation,
  placeholder = 'e.g. Goa, Hyderabad, Bengaluru, Manali, Jaipur, Visakhapatnam...',
  required = true
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedStructured, setSelectedStructured] = useState(null);
  const containerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Click outside listener to dismiss suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    setSelectedStructured(null);
    onChange(val);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (val.trim().length >= 2) {
      setLoading(true);
      debounceTimerRef.current = setTimeout(async () => {
        try {
          const res = await placesApi.geocode(val);
          setSuggestions(res.data || []);
          setOpen(true);
        } catch (err) {
          console.warn('Geocode lookup failed, allowing manual input:', err);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      }, 350);
    } else {
      setSuggestions([]);
      setOpen(false);
      setLoading(false);
    }
  };

  const handleSelectSuggestion = (place) => {
    setInputValue(place.name);
    setSelectedStructured(place);
    setOpen(false);
    onChange(place.name);

    if (onSelectLocation) {
      onSelectLocation({
        destination: place.name,
        latitude: place.latitude,
        longitude: place.longitude,
        placeId: place.placeId,
        displayName: place.displayName,
        address: place.address
      });
    }
  };

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <MapPin
          size={18}
          color="#0284c7"
          style={{ position: 'absolute', left: '12px', zIndex: 2, pointerEvents: 'none' }}
        />

        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true);
          }}
          required={required}
          style={{ paddingLeft: '2.5rem', paddingRight: loading || selectedStructured ? '2.5rem' : '1rem' }}
          autoComplete="off"
        />

        {loading && (
          <Loader2
            size={16}
            color="#0284c7"
            className="spinner-icon"
            style={{ position: 'absolute', right: '12px', zIndex: 2, animation: 'spin 1s linear infinite' }}
          />
        )}

        {!loading && selectedStructured && (
          <Check
            size={16}
            color="#10b981"
            style={{ position: 'absolute', right: '12px', zIndex: 2 }}
            title="Verified location selected"
          />
        )}
      </div>

      {/* Selected Location Pill */}
      {selectedStructured && (
        <div style={{
          marginTop: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.78rem',
          color: '#0d9488',
          backgroundColor: '#ccfbf1',
          padding: '3px 8px',
          borderRadius: '6px',
          width: 'fit-content'
        }}>
          <Globe size={12} />
          <span>Verified Coordinates: {selectedStructured.latitude?.toFixed(4)}, {selectedStructured.longitude?.toFixed(4)} ({selectedStructured.address || selectedStructured.displayName})</span>
        </div>
      )}

      {/* Autocomplete Dropdown */}
      {open && suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '4px',
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          border: '1px solid #cbd5e1',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.15)',
          zIndex: 1000,
          maxHeight: '260px',
          overflowY: 'auto'
        }}>
          <div style={{ padding: '6px 12px', fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, borderBottom: '1px solid #f1f5f9' }}>
            Location Suggestions
          </div>
          {suggestions.map((item, idx) => (
            <div
              key={item.placeId || idx}
              onClick={() => handleSelectSuggestion(item)}
              style={{
                padding: '10px 14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                borderBottom: idx === suggestions.length - 1 ? 'none' : '1px solid #f8fafc',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f9ff')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
            >
              <MapPin size={16} color="#0284c7" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <strong style={{ display: 'block', fontSize: '0.9rem', color: '#0f172a' }}>
                  {item.name}
                </strong>
                <span style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.3 }}>
                  {item.displayName}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DestinationSearchInput;
