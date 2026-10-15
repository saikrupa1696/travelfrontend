import React, { useState } from 'react';
import { Camera, MapPin, Utensils, Mountain, ShoppingBag, Car, Landmark } from 'lucide-react';

const CATEGORY_FALLBACK_IMAGES = {
  BEACH: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop',
  RELAXATION: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop',
  DINING: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop',
  FOOD: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop',
  HERITAGE: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop',
  CULTURE: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&auto=format&fit=crop',
  NATURE: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop',
  ADVENTURE: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop',
  SHOPPING: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&auto=format&fit=crop',
  TRANSIT: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop',
  SIGHTSEEING: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop'
};

export const PlaceImage = ({ src, alt, category, className = '', style = {}, height = '180px' }) => {
  const catKey = (category || 'SIGHTSEEING').toUpperCase();
  const defaultFallback = CATEGORY_FALLBACK_IMAGES[catKey] || CATEGORY_FALLBACK_IMAGES.SIGHTSEEING;

  const [imgSrc, setImgSrc] = useState(src || defaultFallback);
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(defaultFallback);
    }
  };

  const getCategoryIcon = () => {
    switch (catKey) {
      case 'DINING':
      case 'FOOD':
        return <Utensils size={18} />;
      case 'NATURE':
      case 'ADVENTURE':
        return <Mountain size={18} />;
      case 'SHOPPING':
        return <ShoppingBag size={18} />;
      case 'TRANSIT':
        return <Car size={18} />;
      case 'HERITAGE':
      case 'CULTURE':
        return <Landmark size={18} />;
      default:
        return <MapPin size={18} />;
    }
  };

  return (
    <div
      className={`place-image-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height,
        overflow: 'hidden',
        borderRadius: '12px',
        backgroundColor: '#e2e8f0',
        ...style
      }}
    >
      {/* Category Pill Over Image */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 2,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        color: '#ffffff',
        padding: '3px 9px',
        borderRadius: '9999px',
        fontSize: '0.72rem',
        fontWeight: 700,
        letterSpacing: '0.04em',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        textTransform: 'uppercase'
      }}>
        {getCategoryIcon()}
        <span>{category || 'Attraction'}</span>
      </div>

      {/* Shimmer Placeholder before load */}
      {!loaded && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94a3b8'
        }}>
          <Camera size={24} style={{ opacity: 0.4 }} />
        </div>
      )}

      <img
        src={imgSrc}
        alt={alt || 'Place photograph'}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={handleError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transition: 'transform 0.35s ease, opacity 0.3s ease',
          opacity: loaded ? 1 : 0
        }}
        className="place-image-img"
      />
    </div>
  );
};

export default PlaceImage;
