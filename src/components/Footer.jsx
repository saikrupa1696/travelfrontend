import React from 'react';
import { Compass, Heart, ShieldCheck, Cpu, Database } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#0f172a',
      color: '#94a3b8',
      padding: '3rem 0 1.5rem 0',
      marginTop: 'auto',
      borderTop: '1px solid #1e293b'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem'
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
                padding: '6px',
                borderRadius: '8px',
                display: 'flex',
                color: '#ffffff'
              }}>
                <Compass size={20} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                TravelMate <span style={{ color: '#38bdf8' }}>AI</span>
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#94a3b8' }}>
              AI-Powered Personalized Travel Planner engineered with Spring Boot 3, MySQL, and React Vite.
              Crafting realistic, budget-conscious day-wise itineraries tailored to your unique travel style.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1rem' }}>Quick Navigation</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li><a href="/" style={{ color: '#94a3b8' }}>Home</a></li>
              <li><a href="/dashboard" style={{ color: '#94a3b8' }}>Dashboard</a></li>
              <li><a href="/create-trip" style={{ color: '#94a3b8' }}>Plan New Trip</a></li>
              <li><a href="/trips" style={{ color: '#94a3b8' }}>My Saved Trips</a></li>
            </ul>
          </div>

          {/* Architecture & Tech Stack */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1rem' }}>Technology Highlights</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1' }}>
                <Cpu size={15} color="#38bdf8" /> Java 21 / Spring Boot 3.3.4
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1' }}>
                <Database size={15} color="#34d399" /> MySQL 8.x + Flyway Schema Migration
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1' }}>
                <ShieldCheck size={15} color="#f59e0b" /> Spring Security & Stateless JWT
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1' }}>
                <Compass size={15} color="#a855f7" /> OpenStreetMap Nominatim Places
              </span>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #1e293b',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.85rem'
        }}>
          <div>
            &copy; {new Date().getFullYear()} TravelMate AI. B.Tech Technical Project & Portfolio Demonstration.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>Crafted with</span>
            <Heart size={14} color="#ef4444" fill="#ef4444" />
            <span>for seamless travel planning</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
