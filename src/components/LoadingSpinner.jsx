import React from 'react';
import { Compass } from 'lucide-react';

export const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem',
      gap: '1rem'
    }}>
      <div style={{
        animation: 'spin 2s linear infinite',
        color: '#0284c7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Compass size={40} />
      </div>
      <p style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 500 }}>
        {message}
      </p>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
export default LoadingSpinner;
