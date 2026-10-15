import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/formatters';
import { Compass, Sparkles, MapPin, Calendar, Users, Share2, ShieldCheck, ArrowRight, CheckCircle2, TrendingUp, Heart } from 'lucide-react';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero Section with Ambient Backdrop */}
      <section style={{
        position: 'relative',
        padding: '5.5rem 0 4.5rem 0',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)'
      }}>
        {/* Decorative Blurred Glow Orbs */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '15%',
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.22) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(50px)',
          zIndex: 0,
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(13, 148, 136, 0.18) 0%, rgba(255,255,255,0) 70%)',
          filter: 'blur(60px)',
          zIndex: 0,
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#e0f2fe',
            color: '#0369a1',
            padding: '0.45rem 1.15rem',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1.75rem',
            border: '1px solid #bae6fd',
            boxShadow: '0 2px 10px rgba(2, 132, 199, 0.15)'
          }}>
            <Sparkles size={16} /> Intelligent AI Planner &bull; Indian Rupee (₹) Costing
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4rem)',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.035em',
            lineHeight: 1.15,
            maxWidth: '920px',
            margin: '0 auto 1.5rem auto'
          }}>
            Plan Your Dream Journey in Seconds with{' '}
            <span style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Intelligent Precision
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            color: '#475569',
            maxWidth: '720px',
            margin: '0 auto 2.5rem auto',
            lineHeight: 1.65
          }}>
            Generate personalized, day-by-day travel itineraries in <strong>Indian Rupees (₹)</strong> tailored to your destination, pace, interests, and group size. Verified attractions, realistic daily timings, and smart budget breakdowns.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to={isAuthenticated ? "/create-trip" : "/register"} className="btn btn-primary btn-lg">
              <Compass size={20} /> Start Planning Free <ArrowRight size={18} />
            </Link>
            <a href="#preview" className="btn btn-secondary btn-lg">
              View Sample ₹ Itinerary
            </a>
          </div>

          {/* Destination Badges Carousel */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.65rem',
            marginTop: '3.5rem'
          }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginRight: '0.25rem' }}>Popular Destinations:</span>
            {['🏖️ Goa', '🏰 Jaipur', '🌊 Kerala', '🏔️ Manali', '⛩️ Tokyo', '🗼 Paris', '🕌 Dubai'].map((dest) => (
              <span
                key={dest}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.85)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '9999px',
                  padding: '4px 14px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#334155',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
                }}
              >
                {dest}
              </span>
            ))}
          </div>

          {/* Quick Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            maxWidth: '850px',
            margin: '3rem auto 0 auto'
          }}>
            <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0284c7' }}>100%</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>Customized Schedules</p>
            </div>
            <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0d9488' }}>₹ INR</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>Localized Cost Estimates</p>
            </div>
            <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b' }}>OpenStreetMap</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>Verified Attractions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section style={{ padding: '5.5rem 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge badge-ai" style={{ marginBottom: '0.75rem' }}>Engineered for Real Travel</span>
            <h2 style={{ fontSize: '2.3rem', marginBottom: '0.75rem' }}>Everything You Need for a Seamless Vacation</h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto' }}>
              Replace chaotic group chats and messy spreadsheets with a unified, intelligent itinerary generator.
            </p>
          </div>

          <div className="grid-3">
            <div className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                backgroundColor: '#e0f2fe',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkles size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>AI Day-Wise Plans</h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                Builds logical morning, afternoon, and evening itineraries avoiding impossible transit times and excessive backtracking.
              </p>
            </div>

            <div className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                backgroundColor: '#ccfbf1',
                color: '#0d9488',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TrendingUp size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>Indian Rupee (₹) Costing</h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                Realistic breakdown for hotels, dining, local cabs/autos, entry tickets, and miscellaneous buffer in INR.
              </p>
            </div>

            <div className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                backgroundColor: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MapPin size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>Authentic Places & POIs</h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                Powered by OpenStreetMap Nominatim and curated city landmarks with accurate coordinates and timing.
              </p>
            </div>

            <div className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                backgroundColor: '#ede9fe',
                color: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Share2 size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>One-Click Public Sharing</h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                Share your personalized travel plans through unique tokenized links without exposing passwords or private data.
              </p>
            </div>

            <div className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>Spring Security & JWT</h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                BCrypt password encryption, stateless token authentication, and strict user ownership checks on all private resources.
              </p>
            </div>

            <div className="card card-interactive" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                backgroundColor: '#d1fae5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Users size={26} />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>Solo, Couple & Family Modes</h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                Automatically adjusts pace, meal budgets, and activity types whether you travel solo, as a couple, or with family.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Sample Itinerary Preview Section (INR Focused) */}
      <section id="preview" style={{ padding: '5.5rem 0', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge badge-ai" style={{ marginBottom: '0.75rem' }}>Interactive Demo Preview</span>
            <h2 style={{ fontSize: '2.3rem', marginBottom: '0.75rem' }}>Experience a Sample Travel Plan</h2>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>
              Here is what TravelMate AI creates for a 3-Day Couple getaway to Goa with ₹35,000 budget
            </p>
          </div>

          <div style={{ maxWidth: '880px', margin: '0 auto' }}>
            <div className="card" style={{ padding: '2.25rem', border: '1.5px solid #bae6fd' }}>
              {/* Header Preview */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                borderBottom: '1px solid #e2e8f0',
                paddingBottom: '1.25rem',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.45rem', color: '#0f172a' }}>3-Day Coastal & Heritage Getaway in Goa</h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    <MapPin size={15} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Goa, India &bull; Couple Travel &bull; Moderate Pace
                  </p>
                </div>
                <div>
                  <span className="badge badge-ai">AI-GENERATED &bull; WITHIN BUDGET</span>
                </div>
              </div>

              {/* Day 1 Preview Card */}
              <div style={{ backgroundColor: '#f1f5f9', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ color: '#0369a1', fontSize: '1.15rem' }}>Day 1: Coastal Breezes & Sunset Orientation</h4>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0d9488' }}>
                    Est. Day Total: {formatINR(3850)}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                  <div style={{ backgroundColor: '#ffffff', padding: '1rem 1.25rem', borderRadius: '10px', borderLeft: '4px solid #0284c7' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 700, color: '#0284c7' }}>10:00 AM - 12:00 PM</span>
                      <span>Transit &bull; {formatINR(800)}</span>
                    </div>
                    <strong style={{ color: '#0f172a' }}>Arrival in Goa & Boutique Beachfront Check-in</strong>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.3rem 0 0 0' }}>
                      Settle in, unpack, refresh with fresh coconut water, and enjoy seaside orientation.
                    </p>
                  </div>

                  <div style={{ backgroundColor: '#ffffff', padding: '1rem 1.25rem', borderRadius: '10px', borderLeft: '4px solid #10b981' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 700, color: '#059669' }}>03:00 PM - 05:30 PM</span>
                      <span>Sightseeing &bull; {formatINR(1200)}</span>
                    </div>
                    <strong style={{ color: '#0f172a' }}>Fort Aguada Historical Walk & Lighthouse</strong>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.3rem 0 0 0' }}>
                      Explore the 17th-century Portuguese fortress with panoramic Arabian Sea views.
                    </p>
                  </div>

                  <div style={{ backgroundColor: '#ffffff', padding: '1rem 1.25rem', borderRadius: '10px', borderLeft: '4px solid #f59e0b' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 700, color: '#d97706' }}>07:30 PM - 09:30 PM</span>
                      <span>Dining &bull; {formatINR(1850)}</span>
                    </div>
                    <strong style={{ color: '#0f172a' }}>Candlelight Coastal Dinner at Baga Shore</strong>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.3rem 0 0 0' }}>
                      Dine with soft waves and live acoustic music featuring authentic Goan culinary dishes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sample Budget Strip in INR */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                backgroundColor: '#ffffff',
                border: '1.5px dashed #cbd5e1',
                borderRadius: '12px',
                padding: '1.25rem',
                textAlign: 'center'
              }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Target Budget</span>
                  <strong style={{ fontSize: '1.25rem', color: '#0f172a' }}>{formatINR(35000)}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Estimated Total Cost</span>
                  <strong style={{ fontSize: '1.25rem', color: '#0284c7' }}>{formatINR(28400)}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Buffer Balance</span>
                  <strong style={{ fontSize: '1.25rem', color: '#10b981' }}>+{formatINR(6600)} (Safe)</strong>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <Link to={isAuthenticated ? "/create-trip" : "/register"} className="btn btn-primary btn-lg">
                  Plan Your Own Trip in ₹ INR <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action footer */}
      <section style={{
        background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
        color: '#ffffff',
        padding: '5rem 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{ color: '#ffffff', fontSize: '2.5rem', marginBottom: '1rem' }}>
            Ready to explore India and the world?
          </h2>
          <p style={{ fontSize: '1.15rem', color: '#e0f2fe', maxWidth: '620px', margin: '0 auto 2.25rem auto' }}>
            Join smart travelers who explore with tailored day-wise plans and realistic Indian Rupee budgeting.
          </p>
          <Link to={isAuthenticated ? "/create-trip" : "/register"} className="btn btn-secondary btn-lg" style={{ backgroundColor: '#ffffff', color: '#0369a1' }}>
            Get Started For Free
          </Link>
        </div>
      </section>
    </div>
  );
};
export default LandingPage;
