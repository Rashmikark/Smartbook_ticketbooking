import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SBLayout from '../components/SBLayout';

const STATES = [
  { name: 'Tamil Nadu',        icon: '🕌', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Trichy'] },
  { name: 'Karnataka',         icon: '🏰', cities: ['Bengaluru', 'Mysuru', 'Mangaluru'] },
  { name: 'Maharashtra',       icon: '🌆', cities: ['Mumbai', 'Pune', 'Aurangabad'] },
  { name: 'Telangana',         icon: '💎', cities: ['Hyderabad', 'Warangal', 'Nizamabad'] },
  { name: 'Delhi (NCT)',       icon: '🏛️', cities: ['New Delhi', 'Noida', 'Gurgaon'] },
  { name: 'Kerala',            icon: '🌴', cities: ['Thiruvananthapuram', 'Kochi', 'Thrissur'] },
  { name: 'Gujarat',           icon: '🦁', cities: ['Gandhinagar', 'Ahmedabad'] },
  { name: 'Rajasthan',         icon: '🏜️', cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Ajmer'] },
  { name: 'West Bengal',       icon: '🐟', cities: ['Kolkata', 'Howrah', 'Durgapur'] },
  { name: 'Uttar Pradesh',     icon: '🕌', cities: ['Lucknow', 'Varanasi'] },
  { name: 'Punjab',            icon: '🌾', cities: ['Chandigarh', 'Amritsar', 'Jalandhar'] },
  { name: 'Andhra Pradesh',    icon: '🏛️', cities: ['Amaravati', 'Visakhapatnam', 'Guntur'] },
  { name: 'Madhya Pradesh',    icon: '🐯', cities: ['Bhopal', 'Indore', 'Gwalior'] },
  { name: 'Bihar',             icon: '🏺', cities: ['Patna', 'Gaya', 'Bhagalpur'] },
  { name: 'Odisha',            icon: '🛕', cities: ['Bhubaneswar', 'Rourkela', 'Puri'] },
  { name: 'Assam',             icon: '🍵', cities: ['Guwahati', 'Dibrugarh', 'Jorhat'] },
  { name: 'Jharkhand',         icon: '⛏️', cities: ['Ranchi', 'Jamshedpur', 'Dhanbad'] },
  { name: 'Uttarakhand',       icon: '🏔️', cities: ['Dehradun', 'Haridwar', 'Rishikesh'] },
  { name: 'Himachal Pradesh',  icon: '🏔️', cities: ['Shimla', 'Manali', 'Dharamshala'] },
  { name: 'Goa',               icon: '🏖️', cities: ['Panaji', 'Margao', 'Mapusa'] },
  { name: 'Chhattisgarh',      icon: '🌿', cities: ['Raipur', 'Bhilai', 'Bilaspur'] },
  { name: 'Haryana',           icon: '🌾', cities: ['Gurugram', 'Faridabad', 'Panipat'] },
  { name: 'Jammu & Kashmir',   icon: '❄️', cities: ['Srinagar', 'Jammu',  'Baramulla'] },
  { name: 'Tripura',           icon: '🌺', cities: ['Agartala', 'Udaipur', 'Dharmanagar'] },
  { name: 'Meghalaya',         icon: '☁️', cities: ['Shillong', 'Tura', 'Nongpoh'] },
  { name: 'Manipur',           icon: '🎭', cities: ['Imphal', 'Thoubal', 'Bishnupur'] },
  { name: 'Nagaland',          icon: '🦅', cities: ['Kohima', 'Dimapur', 'Mokokchung'] },
  { name: 'Sikkim',            icon: '🏔️', cities: ['Gangtok', 'Namchi', 'Gyalshing'] },
];

export default function Home() {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState('');
  const [search, setSearch] = useState('');

  const filtered = STATES.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleContinue = () => {
    if (selectedCity) {
      localStorage.setItem('selectedCity', selectedCity);
      localStorage.setItem('selectedState', selectedState.name);
      navigate('/events');
    }
  };

  return (
    <SBLayout title="Where are you?" subtitle="SmartBook — Movies, Events & More" hideLogin>

      <div className="sbl-card">
        <div className="sbl-card-label">Select your state</div>
        <input
          className="sbl-input"
          placeholder="Search state..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, maxHeight:280, overflowY:'auto' }}>
          {filtered.map(state => (
            <div
              key={state.name}
              onClick={() => { setSelectedState(state); setSelectedCity(''); }}
              style={{
                border: selectedState?.name === state.name ? '2px solid #a07aff' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12, padding: '10px 6px', cursor: 'pointer', textAlign: 'center',
                background: selectedState?.name === state.name ? 'rgba(108,59,255,0.2)' : 'rgba(255,255,255,0.04)',
                transition: 'all 0.18s',
              }}
            >
              <div style={{ fontSize: 22 }}>{state.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 500, marginTop: 4, color: '#fff' }}>{state.name}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{state.cities[0]}</div>
            </div>
          ))}
        </div>
      </div>

      {selectedState && (
        <div className="sbl-card">
          <div className="sbl-card-label">Cities in {selectedState.name}</div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {selectedState.cities.map(city => (
              <div key={city} onClick={() => setSelectedCity(city)}
                className={`sbl-chip${selectedCity === city ? ' active' : ''}`}>
                {city}
              </div>
            ))}
          </div>
          {localStorage.getItem('username') === 'admin' && (
            <div onClick={() => navigate('/admin-panel')}
              style={{ textAlign:'center', marginTop:14, fontSize:12, color:'rgba(160,122,255,0.7)', cursor:'pointer' }}>
              Admin Panel →
            </div>
          )}
        </div>
      )}

      <button className="sbl-btn" disabled={!selectedCity} onClick={handleContinue}>
        Continue →
      </button>

    </SBLayout>
  );
}