import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SBLayout from '../components/SBLayout';

const DUMMY_BOOKINGS = [
  {
    booking_id: 'SB28473',
    event_title: 'Kalki 2898 AD',
    venue_name: 'Luxe Cinemas',
    show_date: '2026-05-01',
    show_time: '10:30:00',
    seats: 'A3,A4',
    final_amount: 750,
    status: 'confirmed',
    is_used: false,
  },
  {
    booking_id: 'SB28441',
    event_title: 'Zakir Khan Live',
    venue_name: 'Nova Theatre',
    show_date: '2026-04-20',
    show_time: '19:00:00',
    seats: 'C2',
    final_amount: 499,
    status: 'confirmed',
    is_used: true,
  },
];

const aCard = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 16,
  padding: '16px',
  marginBottom: 12,
  backdropFilter: 'blur(10px)',
};

export default function Profile() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const username = localStorage.getItem('username') || 'Guest';
  const token    = localStorage.getItem('token');

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      if (token) {
        const res = await axios.get('http://127.0.0.1:8000/api/booking/my/', {
          headers: { Authorization: `Token ${token}` },
        });
        setBookings(res.data.length > 0 ? res.data : DUMMY_BOOKINGS);
      } else {
        setBookings(DUMMY_BOOKINGS);
      }
    } catch { setBookings(DUMMY_BOOKINGS); }
    finally  { setLoading(false); }
  };

  const upcoming   = bookings.filter(b => !b.is_used);
  const past       = bookings.filter(b =>  b.is_used);
  const displayed  = activeTab === 'upcoming' ? upcoming : past;
  const totalSpent = bookings.reduce((sum, b) => sum + parseFloat(b.final_amount), 0);

  const formatTime = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hr = parseInt(h);
    return `${hr > 12 ? hr - 12 : hr}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <SBLayout title="My Profile" subtitle="SmartBook" hideLogin>

      {/* Profile hero card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(108,59,255,0.5), rgba(255,79,109,0.3))',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 20, padding: '20px 18px',
        marginBottom: 16, backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div style={{ display:'flex', gap:14, alignItems:'center' }}>
            <div style={{
              width:52, height:52, borderRadius:'50%',
              background:'rgba(255,255,255,0.15)',
              border:'2px solid rgba(255,255,255,0.25)',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:24,
            }}>👤</div>
            <div>
              <div style={{ fontSize:18, fontWeight:600, color:'#fff' }}>{username}</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.55)' }}>SmartBook Member</div>
            </div>
          </div>
          <button onClick={handleLogout}
            style={{
              background:'rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.8)',
              border:'1px solid rgba(255,255,255,0.25)', borderRadius:50,
              padding:'7px 14px', fontSize:12, cursor:'pointer',
            }}>
            Logout
          </button>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginTop:18 }}>
          {[
            { label:'Bookings',    value: bookings.length },
            { label:'Upcoming',   value: upcoming.length },
            { label:'Total Spent',value: `₹${totalSpent.toLocaleString()}` },
          ].map(s => (
            <div key={s.label} style={{
              background:'rgba(255,255,255,0.1)', borderRadius:12,
              padding:'10px 8px', textAlign:'center',
            }}>
              <div style={{ fontSize:18, fontWeight:700, color:'#fff' }}>{s.value}</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.5)', marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', background:'rgba(255,255,255,0.06)', borderRadius:50, padding:4, marginBottom:16 }}>
        {['upcoming','past'].map(tab => (
          <div key={tab} onClick={() => setActiveTab(tab)}
            style={{
              flex:1, textAlign:'center', padding:'9px',
              borderRadius:50, cursor:'pointer', fontSize:13,
              fontWeight: activeTab===tab ? 600 : 400,
              background: activeTab===tab ? 'linear-gradient(135deg,#6c3bff,#2575fc)' : 'transparent',
              color: activeTab===tab ? '#fff' : 'rgba(255,255,255,0.45)',
              transition:'all 0.2s',
            }}>
            {tab === 'upcoming' ? `Upcoming (${upcoming.length})` : `Past (${past.length})`}
          </div>
        ))}
      </div>

      {/* Booking cards */}
      {loading ? (
        <div style={{ textAlign:'center', padding:40, color:'rgba(255,255,255,0.4)' }}>
          Loading your bookings...
        </div>
      ) : displayed.length === 0 ? (
        <div style={{ textAlign:'center', padding:40 }}>
          <div style={{ fontSize:44, marginBottom:12 }}>🎟️</div>
          <div style={{ color:'rgba(255,255,255,0.4)', fontSize:14 }}>
            {activeTab === 'upcoming' ? 'No upcoming bookings' : 'No past bookings'}
          </div>
          <div onClick={() => navigate('/')}
            style={{ marginTop:12, color:'#a07aff', fontSize:13, cursor:'pointer', textDecoration:'underline' }}>
            Book something now →
          </div>
        </div>
      ) : displayed.map(b => (
        <div key={b.booking_id} style={{
          ...aCard,
          borderLeft: `4px solid ${b.is_used ? 'rgba(255,255,255,0.15)' : '#6c3bff'}`,
          opacity: b.is_used ? 0.75 : 1,
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <div style={{ fontSize:14, fontWeight:600, color:'#fff' }}>{b.event_title}</div>
            <span className={b.is_used ? 'sbl-badge-gray' : 'sbl-badge-green'}>
              {b.is_used ? 'Used' : 'Confirmed'}
            </span>
          </div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.45)', marginBottom:10, lineHeight:1.7 }}>
            <div>🏢 {b.venue_name}</div>
            <div>📅 {formatDate(b.show_date)} · {formatTime(b.show_time)}</div>
            <div>💺 Seats: {b.seats}</div>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:10 }}>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>{b.booking_id}</div>
            <div style={{ fontSize:15, fontWeight:700, color:'#a07aff' }}>₹{parseFloat(b.final_amount).toLocaleString()}</div>
          </div>
          {!b.is_used && (
            <div onClick={() => navigate(`/ticket/${b.booking_id}`)}
              style={{ marginTop:10, textAlign:'center', fontSize:12, color:'#a07aff', cursor:'pointer', textDecoration:'underline' }}>
              View Ticket →
            </div>
          )}
        </div>
      ))}

      <button className="sbl-btn" onClick={() => navigate('/')}>
        Book More Tickets
      </button>

    </SBLayout>
  );
}