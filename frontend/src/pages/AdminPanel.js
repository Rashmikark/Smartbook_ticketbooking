import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SBLayout from '../components/SBLayout';

const TABS = ['Dashboard', 'Events', 'Venues', 'Shows', 'Bookings', 'QR Verify', 'Users'];

const DUMMY_BOOKINGS = [
  { id: 'SB28473', user: 'Ravi Kumar',  event: 'Kalki 2898 AD',    seats: 'A3, A4', amount: 750,  method: 'UPI',    status: 'confirmed' },
  { id: 'SB28472', user: 'Priya S',     event: 'AR Rahman Live',   seats: 'B5',     amount: 1500, method: 'Card',   status: 'confirmed' },
  { id: 'SB28441', user: 'Karthik M',   event: 'Zakir Khan Live',  seats: 'C2',     amount: 499,  method: 'Wallet', status: 'used' },
  { id: 'SB28400', user: 'Sneha R',     event: 'IPL CSK vs MI',    seats: 'D7, D8', amount: 1200, method: 'UPI',    status: 'confirmed' },
];

const DUMMY_EVENTS = [
  { id: 1, title: 'Kalki 2898 AD',    category: 'Movies',   language: 'Hindi',  rating: 8.4, active: true },
  { id: 2, title: 'AR Rahman Live',   category: 'Concerts', language: 'Tamil',  rating: 9.6, active: true },
  { id: 3, title: 'Zakir Khan Live',  category: 'Comedy',   language: 'Hindi',  rating: 9.1, active: false },
];

const DUMMY_USERS = [
  { name: 'Ravi Kumar', email: 'ravi@gmail.com',    bookings: 5, spent: 3200 },
  { name: 'Priya S',    email: 'priya@gmail.com',   bookings: 3, spent: 4500 },
  { name: 'Karthik M',  email: 'karthik@gmail.com', bookings: 8, spent: 6800 },
  { name: 'Sneha R',    email: 'sneha@gmail.com',   bookings: 2, spent: 1200 },
];

/* ── Shared small card style for admin ── */
const aCard = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 14,
  padding: '14px 16px',
  marginBottom: 10,
};

const rowStyle = {
  display: 'flex', justifyContent: 'space-between',
  alignItems: 'center', padding: '7px 0',
  borderBottom: '1px solid rgba(255,255,255,0.07)',
  fontSize: 12,
};

export default function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab]     = useState('Dashboard');
  const [qrInput, setQrInput]         = useState('');
  const [qrResult, setQrResult]       = useState(null);
  const [events, setEvents]           = useState(DUMMY_EVENTS);
  const [bookings]                    = useState(DUMMY_BOOKINGS);
  const [search, setSearch]           = useState('');
  const [newEvent, setNewEvent]       = useState({ title:'', category:'Movies', language:'', rating:'' });
  const [showAddEvent, setShowAddEvent] = useState(false);
  
  React.useEffect(() => {
    fetch('http://127.0.0.1:8000/api/events/')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setEvents(data);
      })
      .catch(() => {});
  }, []);
  const verifyQR = () => {
    if      (qrInput === 'SB28441')              setQrResult({ valid: false, message: 'Ticket already used ❌' });
    else if (bookings.find(b => b.id === qrInput)) setQrResult({ valid: true,  message: 'Valid ticket — Allow entry ✅' });
    else                                          setQrResult({ valid: false, message: 'Invalid ticket ID ❌' });
  };

  const removeEvent = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://127.0.0.1:8000/api/events/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Token ${token}` },
      });
      setEvents(events.filter(e => e.id !== id));
    } catch {
      setEvents(events.filter(e => e.id !== id));
    }
  };

  const addEvent = () => {
    if (!newEvent.title) return;
    setEvents([...events, { ...newEvent, id: Date.now(), active: true }]);
    setNewEvent({ title:'', category:'Movies', language:'', rating:'' });
    setShowAddEvent(false);
  };

  const filteredBookings = bookings.filter(b =>
    b.id.toLowerCase().includes(search.toLowerCase()) ||
    b.user.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = bookings.reduce((sum, b) => sum + b.amount, 0);

  /* ── DASHBOARD ── */
  const renderDashboard = () => (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:10, marginBottom:14 }}>
        {[
          { label:'Total Revenue', value:`₹${totalRevenue.toLocaleString()}`, icon:'💰' },
          { label:'Total Bookings', value:bookings.length, icon:'🎟️' },
          { label:'Active Events', value:events.filter(e=>e.active).length, icon:'🎬' },
          { label:'Total Users', value:DUMMY_USERS.length, icon:'👥' },
        ].map(s => (
          <div key={s.label} className="sbl-stat">
            <div style={{ fontSize:22, marginBottom:4 }}>{s.icon}</div>
            <div className="sbl-stat-num">{s.value}</div>
            <div className="sbl-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={aCard}>
        <div style={{ fontSize:13, fontWeight:500, marginBottom:12, color:'#fff' }}>Revenue by Category</div>
        {[
          { label:'Movies',   amount:750,  color:'#6c3bff' },
          { label:'Concerts', amount:1500, color:'#2575fc' },
          { label:'Comedy',   amount:499,  color:'#f59e0b' },
          { label:'Sports',   amount:1200, color:'#059669' },
        ].map(cat => (
          <div key={cat.label} style={{ marginBottom:10 }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:4 }}>
              <span style={{ color:'rgba(255,255,255,0.5)' }}>{cat.label}</span>
              <span style={{ color:'#fff', fontWeight:500 }}>₹{cat.amount}</span>
            </div>
            <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:20, height:6 }}>
              <div style={{ height:6, borderRadius:20, background:cat.color, width:`${(cat.amount/1500)*100}%`, transition:'width 0.6s ease' }} />
            </div>
          </div>
        ))}
      </div>

      <div style={aCard}>
        <div style={{ fontSize:13, fontWeight:500, marginBottom:10, color:'#fff' }}>Recent Bookings</div>
        {bookings.slice(0,3).map(b => (
          <div key={b.id} style={rowStyle}>
            <div>
              <div style={{ fontWeight:500, color:'#fff' }}>{b.user}</div>
              <div style={{ color:'rgba(255,255,255,0.4)', fontSize:11 }}>{b.event} · {b.id}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ color:'#a07aff', fontWeight:500 }}>₹{b.amount}</div>
              <span className={b.status==='confirmed' ? 'sbl-badge-green' : 'sbl-badge-gray'}>{b.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ── EVENTS ── */
  const renderEvents = () => (
    <div>
      <button className="sbl-btn" style={{ marginBottom:12 }} onClick={() => setShowAddEvent(!showAddEvent)}>
        {showAddEvent ? 'Cancel' : '+ Add New Event'}
      </button>

      {showAddEvent && (
        <div style={{ ...aCard, marginBottom:12 }}>
          <div style={{ fontSize:13, fontWeight:500, marginBottom:10, color:'#fff' }}>New Event</div>
          {[
            { key:'title',    placeholder:'Event title',           type:'text' },
            { key:'language', placeholder:'Language',              type:'text' },
            { key:'rating',   placeholder:'Rating (e.g. 8.5)',     type:'number' },
          ].map(f => (
            <input key={f.key} type={f.type} placeholder={f.placeholder}
              className="sbl-input"
              value={newEvent[f.key]}
              onChange={e => setNewEvent({ ...newEvent, [f.key]: e.target.value })}
            />
          ))}
          <select className="sbl-select" value={newEvent.category}
            onChange={e => setNewEvent({ ...newEvent, category: e.target.value })}>
            {['Movies','Comedy','Concerts','Sports','Theatre'].map(c => <option key={c}>{c}</option>)}
          </select>
          <button className="sbl-btn" onClick={addEvent}>Add Event</button>
        </div>
      )}

      {events.map(ev => (
        <div key={ev.id} style={{ ...aCard, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:13, fontWeight:500, color:'#fff' }}>{ev.title}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>{ev.category} · {ev.language} · ★{ev.rating}</div>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <span className={ev.active ? 'sbl-badge-green' : 'sbl-badge-gray'}>{ev.active ? 'Active' : 'Inactive'}</span>
            <button onClick={() => removeEvent(ev.id)}
              style={{ background:'rgba(239,68,68,0.15)', color:'#f87171', border:'none', borderRadius:8, padding:'4px 10px', fontSize:11, cursor:'pointer' }}>
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  /* ── BOOKINGS ── */
  const renderBookings = () => (
    <div>
      <input className="sbl-input" placeholder="Search by booking ID or user..."
        value={search} onChange={e => setSearch(e.target.value)} />
      {filteredBookings.map(b => (
        <div key={b.id} style={aCard}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
            <span style={{ fontSize:13, fontWeight:500, color:'#fff' }}>{b.user}</span>
            <span style={{ fontSize:12, color:'#a07aff', fontWeight:500 }}>₹{b.amount}</span>
          </div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>{b.event} · Seats: {b.seats}</div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span className="sbl-badge-blue">{b.method}</span>
            <span style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>{b.id}</span>
            <span className={b.status==='confirmed' ? 'sbl-badge-green' : 'sbl-badge-gray'}>{b.status}</span>
          </div>
        </div>
      ))}
    </div>
  );

  /* ── QR VERIFY ── */
  const renderQR = () => (
    <div style={aCard}>
      <div style={{ fontSize:13, fontWeight:500, marginBottom:10, color:'#fff' }}>Scan / Enter Booking ID</div>
      <div style={{
        width:160, height:160, margin:'0 auto 16px',
        border:'3px solid #6c3bff', borderRadius:12,
        position:'relative', overflow:'hidden',
        background:'rgba(108,59,255,0.05)'
      }}>
        <div style={{
          position:'absolute', left:0, right:0, height:2,
          background:'linear-gradient(90deg,transparent,#6c3bff,transparent)',
          animation:'scanLine 2s ease-in-out infinite'
        }} />
        {['top-left','top-right','bottom-left','bottom-right'].map(pos => (
          <div key={pos} style={{
            position:'absolute',
            top: pos.includes('top') ? 0 : 'auto',
            bottom: pos.includes('bottom') ? 0 : 'auto',
            left: pos.includes('left') ? 0 : 'auto',
            right: pos.includes('right') ? 0 : 'auto',
            width:16, height:16,
            borderTop: pos.includes('top') ? '3px solid #6c3bff' : 'none',
            borderBottom: pos.includes('bottom') ? '3px solid #6c3bff' : 'none',
            borderLeft: pos.includes('left') ? '3px solid #6c3bff' : 'none',
            borderRight: pos.includes('right') ? '3px solid #6c3bff' : 'none',
          }} />
        ))}
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'rgba(255,255,255,0.3)', textAlign:'center' }}>
          Camera not<br/>available
        </div>
      </div>
      <style>{`@keyframes scanLine { 0%{top:0} 50%{top:calc(100% - 2px)} 100%{top:0} }`}</style>
      <input className="sbl-input" placeholder="Enter Booking ID (e.g. SB28473)"
        value={qrInput} onChange={e => { setQrInput(e.target.value); setQrResult(null); }} />
      <button className="sbl-btn" onClick={verifyQR}>Verify Ticket</button>
      {qrResult && (
        <div className={qrResult.valid ? 'sbl-alert-success' : 'sbl-alert-error'}>
          {qrResult.message}
        </div>
      )}
      <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:8 }}>
        Try: SB28473 (valid) · SB28441 (used) · FAKE001 (invalid)
      </div>
    </div>
  );

  /* ── USERS ── */
  const renderUsers = () => (
    <div>
      {DUMMY_USERS.map(u => (
        <div key={u.email} style={{ ...aCard, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:13, fontWeight:500, color:'#fff' }}>{u.name}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>{u.email}</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:12, color:'#a07aff', fontWeight:500 }}>₹{u.spent.toLocaleString()}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>{u.bookings} bookings</div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard': return renderDashboard();
      case 'Events':    return renderEvents();
      case 'Bookings':  return renderBookings();
      case 'QR Verify': return renderQR();
      case 'Users':     return renderUsers();
      default: return <div className="sbl-alert-info" style={{ textAlign:'center', padding:30 }}>{activeTab} — Coming Soon</div>;
    }
  };

  return (
    <SBLayout title="Control Panel" subtitle="SmartBook Admin">
      {/* Tab bar */}
      <div style={{ display:'flex', gap:6, marginBottom:14, overflowX:'auto', paddingBottom:4 }}>
        {TABS.map(tab => (
          <div key={tab} onClick={() => setActiveTab(tab)}
            className={`sbl-chip${activeTab === tab ? ' active' : ''}`}
            style={{ whiteSpace:'nowrap' }}>
            {tab}
          </div>
        ))}
      </div>

      {renderContent()}
    </SBLayout>
  );
}