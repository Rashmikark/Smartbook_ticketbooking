import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SBLayout from '../components/SBLayout';



const CATEGORY_ICONS = { Movies:'🎬', Comedy:'🎤', Concerts:'🎵', Sports:'🏏', Theatre:'🎭' };
const TABS = ['All','Movies','Comedy','Concerts','Sports','Theatre'];

export default function MovieList() {
  const navigate = useNavigate();
  const [events, setEvents]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch]     = useState('');
  const city  = localStorage.getItem('selectedCity')  || 'Chennai';
  const state = localStorage.getItem('selectedState') || 'Tamil Nadu';

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    const city = localStorage.getItem('selectedCity') || 'Chennai';
    try {
      // Get shows for selected city
      const showsRes = await axios.get(`http://127.0.0.1:8000/api/shows/city/${city}/`);
      const shows = Array.isArray(showsRes.data) ? showsRes.data : showsRes.data.results || [];

      // Get unique event IDs from those shows
      const eventIds = [...new Set(shows.map(s => s.event))];

      // Get all events
      const res = await axios.get('http://127.0.0.1:8000/api/events/');
      const rawData = Array.isArray(res.data) ? res.data : res.data.results || [];

      // Filter only events that have shows in this city
      const apiData = rawData
        .filter(e => eventIds.includes(e.id))
        .map(e => ({
          ...e,
          icon: CATEGORY_ICONS[e.category] || '🎬',
          base_price: e.base_price || 180,
          is_hot: parseFloat(e.rating) >= 9.0,
        }));

      setEvents(apiData);
    } catch (err) {
      console.error('API error:', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };
  const filtered = events.filter(e => {
    const matchTab = activeTab==='All' || 
      e.category?.toLowerCase() === activeTab.toLowerCase();
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const handleSelect = (event) => {
    localStorage.setItem('selectedEvent', JSON.stringify(event));
    navigate('/seats/1');
  };

  if (loading) return (
    <SBLayout title="What to book?" subtitle={`${city} · ${state}`} hideLogin>
  <button className="sbl-back" onClick={() => navigate('/home')}>
    ← Change City
  </button>
      <div style={{ textAlign:'center', padding:50, color:'rgba(255,255,255,0.4)' }}>
        <div style={{ fontSize:40, marginBottom:12 }}>🎬</div>
        <div>Loading events...</div>
      </div>
    </SBLayout>
  );

  return (
    <SBLayout title="What to book?" subtitle={`${city} · ${state}`} hideLogin>
  <button className="sbl-back" onClick={() => navigate('/home')}>
    ← Change City
  </button>

      {/* Search */}
      <div className="sbl-card" style={{ padding:'12px 16px' }}>
        <input className="sbl-input" style={{ marginBottom:0 }}
          placeholder="Search movies, events, concerts..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:12, flexWrap:'wrap' }}>
        {TABS.map(tab => (
          <div key={tab} onClick={() => setActiveTab(tab)}
            className={`sbl-chip${activeTab===tab ? ' active' : ''}`}>
            {tab}
          </div>
        ))}
      </div>

      {/* Event list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:30, color:'rgba(255,255,255,0.4)' }}>
          No events found for "{search}"
        </div>
      ) : filtered.map(event => (
        <div key={event.id}
          onClick={() => handleSelect(event)}
          className="sbl-card"
          style={{ display:'flex', gap:12, cursor:'pointer', alignItems:'flex-start' }}
        >
          {/* Poster / icon */}
          <div style={{
            width:48, height:64, borderRadius:10,
            background:'linear-gradient(135deg,#1a003a,#3a0080)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:24, flexShrink:0, overflow:'hidden',
            border:'1px solid rgba(108,59,255,0.3)',
          }}>
            {event.poster_url
              ? <img src={event.poster_url} alt={event.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              : event.icon}
          </div>

          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap', marginBottom:4 }}>
              <span style={{ fontSize:14, fontWeight:500, color:'#fff' }}>{event.title}</span>
              {event.certificate && <span className="sbl-badge-gray">{event.certificate}</span>}
              {event.is_hot && <span className="sbl-badge-hot">🔥 Hot</span>}
            </div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)', marginBottom:4 }}>
              <span className="sbl-badge-blue">{event.category}</span>
              {event.language && ` · ${event.language}`}
              {event.duration  && ` · ${event.duration}`}
            </div>
            <div style={{ fontSize:11, color:'#ffd166', fontWeight:500 }}>
              {event.rating && `★ ${event.rating}`}
              <span style={{ color:'rgba(255,255,255,0.4)', fontWeight:400 }}>&nbsp;&nbsp;From ₹{event.base_price||180}</span>
            </div>
          </div>
        </div>
      ))}

    </SBLayout>
  );
}