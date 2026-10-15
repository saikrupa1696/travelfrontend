import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tripsApi, itineraryApi } from '../services/api';
import { DestinationSearchInput } from '../components/DestinationSearchInput';
import { formatCurrency, formatINR } from '../utils/formatters';
import { Compass, Sparkles, MapPin, Calendar, DollarSign, Users, Clock, AlertCircle, IndianRupee } from 'lucide-react';

const POPULAR_DESTINATIONS = [
  { name: 'Goa', lat: 15.2993, lon: 74.1240 },
  { name: 'Hyderabad', lat: 17.3850, lon: 78.4867 },
  { name: 'Bengaluru', lat: 12.9716, lon: 77.5946 },
  { name: 'Manali', lat: 32.2432, lon: 77.1892 },
  { name: 'Jaipur', lat: 26.9124, lon: 75.7873 },
  { name: 'Visakhapatnam', lat: 17.6868, lon: 83.2185 },
  { name: 'New Delhi', lat: 28.6139, lon: 77.2090 },
  { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
  { name: 'Kochi', lat: 9.9312, lon: 76.2673 },
  { name: 'Paris', lat: 48.8566, lon: 2.3522 },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503 }
];

const INTEREST_OPTIONS = [
  '🏖️ Beaches', '🌿 Nature & Hills', '🏰 Forts & History', '🪂 Adventure & Trekking',
  '🛍️ Shopping & Bazaars', '🍛 Street Food & Cuisine', '📸 Photography',
  '🛕 Temples & Heritage', '✨ Nightlife', '🧘 Relaxation & Wellness'
];

const TRAVEL_TYPES = ['Solo', 'Couple', 'Family', 'Friends'];
const PACES = [
  { id: 'RELAXED', label: 'Relaxed', desc: '1-2 leisurely highlights daily' },
  { id: 'MODERATE', label: 'Moderate', desc: 'Balanced sights & downtime' },
  { id: 'FAST_PACED', label: 'Packed', desc: 'Maximum highlights covered' },
];

const ACCOMMODATIONS = [
  { id: 'HOSTEL', label: 'Backpacker / Hostel (₹800 - ₹1,500/night)' },
  { id: 'BUDGET', label: 'Budget Hotel / Homestay (₹1,500 - ₹3,000/night)' },
  { id: 'STANDARD', label: 'Standard 3-Star Hotel (₹3,000 - ₹6,000/night)' },
  { id: 'LUXURY', label: 'Luxury 4/5-Star (₹7,000 - ₹15,000/night)' },
  { id: 'RESORT', label: 'Heritage Palace / Beach Resort (₹12,000+/night)' },
];

const FOOD_PREFS = [
  { id: 'ANY', label: 'Any / Local Regional Thalis' },
  { id: 'VEGETARIAN', label: 'Pure Vegetarian (Pure Veg / Jain)' },
  { id: 'NON_VEGETARIAN', label: 'Non-Vegetarian (Mughlai, Coastal Seafood)' },
  { id: 'VEGAN', label: 'Vegan Options' },
  { id: 'LOCAL_STREET', label: 'Street Food & Chaat Explorer' },
];

const QUICK_BUDGETS = [
  { label: '₹15,000', value: 15000, tag: 'Budget' },
  { label: '₹30,000', value: 30000, tag: 'Standard' },
  { label: '₹60,000', value: 60000, tag: 'Comfort' },
  { label: '₹1,20,000', value: 120000, tag: 'Premium' },
];

export const CreateTripPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    destination: '',
    destinationLatitude: null,
    destinationLongitude: null,
    destinationPlaceId: null,
    startDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    durationDays: 3,
    travelType: 'Solo',
    travellerCount: 1,
    budgetAmount: 25000,
    budgetMode: 'TOTAL',
    interests: ['🏰 Forts & History', '🍛 Street Food & Cuisine'],
    travelPace: 'MODERATE',
    accommodationPref: 'STANDARD',
    foodPref: 'ANY',
    additionalNotes: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitStage, setSubmitStage] = useState('');
  const [serverError, setServerError] = useState('');

  const toggleInterest = (interest) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      const updated = exists
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: updated };
    });
  };

  const handleTravelTypeChange = (type) => {
    let count = formData.travellerCount;
    if (type === 'Solo') count = 1;
    else if (type === 'Couple') count = 2;
    else if (count < 2) count = 3;

    setFormData({ ...formData, travelType: type, travellerCount: count });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.destination.trim()) newErrors.destination = 'Destination is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.durationDays || formData.durationDays < 1 || formData.durationDays > 15) {
      newErrors.durationDays = 'Duration must be between 1 and 15 days';
    }
    if (!formData.budgetAmount || Number(formData.budgetAmount) < 1000) {
      newErrors.budgetAmount = 'Please enter a valid budget in INR (minimum ₹1,000)';
    }
    if (!formData.travellerCount || Number(formData.travellerCount) < 1) {
      newErrors.travellerCount = 'Travellers count must be at least 1';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    setSubmitStage('Persisting your trip configuration to MySQL...');

    try {
      const tripPayload = {
        ...formData,
        interests: formData.interests.join(', '),
        budgetAmount: Number(formData.budgetAmount),
        travellerCount: Number(formData.travellerCount),
        durationDays: Number(formData.durationDays),
      };

      const tripRes = await tripsApi.create(tripPayload);
      const createdTrip = tripRes.data;

      setSubmitStage('AI is assembling your day-by-day plan & INR expense breakdown...');
      await itineraryApi.generate(createdTrip.id);

      navigate(`/itinerary/${createdTrip.id}`);
    } catch (err) {
      setServerError(err.message || 'Failed to generate itinerary. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '900px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          backgroundColor: '#e0f2fe',
          color: '#0284c7',
          padding: '0.4rem 1rem',
          borderRadius: '9999px',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '0.75rem',
          border: '1px solid #bae6fd'
        }}>
          <Sparkles size={16} /> Intelligent Travel Wizard &bull; Indian Rupee (₹) Costing
        </div>
        <h1 style={{ fontSize: '2.3rem', color: '#0f172a', fontWeight: 800 }}>
          Where would you like to travel?
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '620px', margin: '0.5rem auto 0 auto' }}>
          Customize your destination, timeline, and budget in <strong>₹ INR</strong>. TravelMate AI will generate a realistic day-wise plan with verified spots and clear cost analytics.
        </p>
      </div>

      {serverError && (
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          padding: '1rem 1.25rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          fontSize: '0.95rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          border: '1px solid #fecaca'
        }}>
          <AlertCircle size={20} />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Step 1: Destination & Dates */}
        <div className="card" style={{ padding: '2.25rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <MapPin size={22} color="#0284c7" /> 1. Destination & Dates
          </h3>

          <div className="form-group">
            <label className="form-label" htmlFor="destination-input">
              Destination City or Region <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <DestinationSearchInput
              value={formData.destination}
              onChange={(val) => setFormData({ ...formData, destination: val })}
              onSelectLocation={(loc) => {
                setFormData({
                  ...formData,
                  destination: loc.destination,
                  destinationLatitude: loc.latitude,
                  destinationLongitude: loc.longitude,
                  destinationPlaceId: loc.placeId,
                });
              }}
              placeholder="Search destination (e.g. Goa, Hyderabad, Bengaluru, Manali, Jaipur, Visakhapatnam...)"
            />
            {errors.destination && <p className="form-error">{errors.destination}</p>}

            {/* Popular Destination Suggestions */}
            <div style={{ marginTop: '0.85rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Popular Destinations:</span>
              {POPULAR_DESTINATIONS.map((dest) => (
                <button
                  key={dest.name}
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    destination: dest.name,
                    destinationLatitude: dest.lat,
                    destinationLongitude: dest.lon,
                    destinationPlaceId: `curated-${dest.name.toLowerCase()}`
                  })}
                  style={{
                    background: formData.destination === dest.name ? '#e0f2fe' : '#f1f5f9',
                    border: formData.destination === dest.name ? '1px solid #0284c7' : '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '4px 11px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: formData.destination === dest.name ? '#0369a1' : '#334155',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {dest.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="start-date-input">
                Start Date <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="start-date-input"
                type="date"
                className="form-control"
                value={formData.startDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
              {errors.startDate && <p className="form-error">{errors.startDate}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="duration-input">
                Duration (Days) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="duration-input"
                type="number"
                min="1"
                max="15"
                className="form-control"
                value={formData.durationDays}
                onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
              />
              {errors.durationDays && <p className="form-error">{errors.durationDays}</p>}
            </div>
          </div>
        </div>

        {/* Step 2: Travellers & Indian Rupee (₹) Budget */}
        <div className="card" style={{ padding: '2.25rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <IndianRupee size={22} color="#0d9488" /> 2. Travellers & Budget (₹ INR)
          </h3>

          <div className="form-group">
            <label className="form-label">Travel Group Type</label>
            <div className="chip-group">
              {TRAVEL_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`chip ${formData.travelType === type ? 'active' : ''}`}
                  onClick={() => handleTravelTypeChange(type)}
                >
                  {type === 'Solo' ? '👤 Solo' : type === 'Couple' ? '👫 Couple' : type === 'Family' ? '👨‍👩‍👧‍👦 Family' : '👥 Friends'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="traveller-count">
                Number of Travellers
              </label>
              <input
                id="traveller-count"
                type="number"
                min="1"
                max="30"
                className="form-control"
                value={formData.travellerCount}
                onChange={(e) => setFormData({ ...formData, travellerCount: Math.max(1, parseInt(e.target.value) || 1) })}
              />
              {errors.travellerCount && <p className="form-error">{errors.travellerCount}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="budget-amount">
                Budget Target (₹ Indian Rupees) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#0d9488' }}>
                  ₹
                </span>
                <input
                  id="budget-amount"
                  type="number"
                  min="1000"
                  step="1000"
                  className="form-control"
                  style={{ paddingLeft: '2rem' }}
                  value={formData.budgetAmount}
                  onChange={(e) => setFormData({ ...formData, budgetAmount: e.target.value })}
                />
              </div>
              {errors.budgetAmount && <p className="form-error">{errors.budgetAmount}</p>}

              {/* Quick Preset Buttons */}
              <div style={{ marginTop: '0.6rem', display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                {QUICK_BUDGETS.map((qb) => (
                  <button
                    key={qb.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, budgetAmount: qb.value })}
                    style={{
                      background: Number(formData.budgetAmount) === qb.value ? '#ccfbf1' : '#f8fafc',
                      border: Number(formData.budgetAmount) === qb.value ? '1.5px solid #0d9488' : '1px solid #e2e8f0',
                      borderRadius: '6px',
                      padding: '3px 8px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: Number(formData.budgetAmount) === qb.value ? '#0f766e' : '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    {qb.label} ({qb.tag})
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '0.75rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <label className="form-label" style={{ marginBottom: '0.5rem' }}>Budget Calculation Mode</label>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.95rem' }}>
                <input
                  type="radio"
                  name="budgetMode"
                  value="TOTAL"
                  checked={formData.budgetMode === 'TOTAL'}
                  onChange={() => setFormData({ ...formData, budgetMode: 'TOTAL' })}
                />
                <div>
                  <strong>Total Group Budget</strong>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b' }}>
                    {formatINR(formData.budgetAmount)} shared among all {formData.travellerCount} travelers
                  </span>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.95rem' }}>
                <input
                  type="radio"
                  name="budgetMode"
                  value="PER_PERSON"
                  checked={formData.budgetMode === 'PER_PERSON'}
                  onChange={() => setFormData({ ...formData, budgetMode: 'PER_PERSON' })}
                />
                <div>
                  <strong>Per-Person Budget</strong>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b' }}>
                    {formatINR(formData.budgetAmount)} &times; {formData.travellerCount} = {formatINR(Number(formData.budgetAmount) * Number(formData.travellerCount))} total
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Step 3: Interests & Travel Preferences */}
        <div className="card" style={{ padding: '2.25rem', marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Compass size={22} color="#f59e0b" /> 3. Interests & Travel Style
          </h3>

          <div className="form-group">
            <label className="form-label">Activity & Sightseeing Interests</label>
            <div className="chip-group">
              {INTEREST_OPTIONS.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  className={`chip ${formData.interests.includes(interest) ? 'active' : ''}`}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1.75rem' }}>
            <label className="form-label">Travel Pace</label>
            <div className="grid-3">
              {PACES.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setFormData({ ...formData, travelPace: p.id })}
                  style={{
                    padding: '1rem',
                    border: formData.travelPace === p.id ? '2px solid #0284c7' : '1.5px solid #e2e8f0',
                    borderRadius: '12px',
                    backgroundColor: formData.travelPace === p.id ? '#f0f9ff' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: formData.travelPace === p.id ? '0 4px 12px rgba(2, 132, 199, 0.15)' : 'none'
                  }}
                >
                  <strong style={{ color: formData.travelPace === p.id ? '#0284c7' : '#0f172a', display: 'block', fontSize: '1rem' }}>
                    {p.label}
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{p.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid-2" style={{ marginTop: '1.75rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="stay-pref">Stay & Accommodation</label>
              <select
                id="stay-pref"
                className="form-control"
                value={formData.accommodationPref}
                onChange={(e) => setFormData({ ...formData, accommodationPref: e.target.value })}
              >
                {ACCOMMODATIONS.map((acc) => (
                  <option key={acc.id} value={acc.id}>{acc.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="food-pref">Food & Dining Preference</label>
              <select
                id="food-pref"
                className="form-control"
                value={formData.foodPref}
                onChange={(e) => setFormData({ ...formData, foodPref: e.target.value })}
              >
                {FOOD_PREFS.map((food) => (
                  <option key={food.id} value={food.id}>{food.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label" htmlFor="notes-input">Special Instructions (Optional)</label>
            <textarea
              id="notes-input"
              rows="3"
              className="form-control"
              placeholder="e.g. We love scenic sunset viewpoints, prefer authentic local cafes, and need wheelchair accessible places."
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
            />
          </div>
        </div>

        {/* Action Button */}
        <div style={{ textAlign: 'center' }}>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ minWidth: '320px', padding: '1.1rem 2.5rem', fontSize: '1.1rem' }}
            disabled={submitting}
          >
            {submitting ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
                <Compass className="spin" size={22} /> {submitStage || 'Generating Itinerary...'}
              </span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
                <Sparkles size={22} /> Generate Itinerary in ₹ INR
              </span>
            )}
          </button>
          {submitting && (
            <p style={{ color: '#0284c7', fontSize: '0.9rem', marginTop: '0.75rem', fontWeight: 600 }}>
              Analyzing attractions, estimating realistic INR budgets, and timing daily schedules...
            </p>
          )}
        </div>
      </form>

      <style>{`
        .spin {
          animation: spin 1.5s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
export default CreateTripPage;
