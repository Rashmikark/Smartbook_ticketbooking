import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SBLayout from '../components/SBLayout';

const LAYOUTS = {
  Movies: [
    { cat:'Premium', rows:['A','B'],         cols:8,  price:350, booked:[2,6,10,14],       fast:[4,5,11,12] },
    { cat:'Gold',    rows:['C','D','E'],      cols:9,  price:250, booked:[3,9,15,18,24],    fast:[5,6,7,20,21] },
    { cat:'Silver',  rows:['F','G','H'],      cols:10, price:180, booked:[1,4,11,20,25],    fast:[8,9,15,22] },
  ],
  Sports: [
    { cat:'Pavilion',  rows:['A','B'],        cols:12, price:500, booked:[3,7,15,20],       fast:[5,6,13,14] },
    { cat:'East Stand', rows:['C','D','E','F'], cols:14, price:300, booked:[4,10,20,30,40], fast:[8,9,10,25,26] },
    { cat:'West Stand', rows:['G','H','I'],   cols:14, price:200, booked:[2,8,18,28],       fast:[6,7,15,16] },
    { cat:'General',   rows:['J','K','L'],    cols:16, price:100, booked:[5,12,25,35,45],   fast:[10,11,20,21] },
  ],
  Concerts: [
    { cat:'VIP Floor',  rows:['A','B'],       cols:10, price:1500, booked:[3,8,12,18],      fast:[5,6,9,10] },
    { cat:'Balcony',    rows:['C','D','E'],   cols:12, price:800,  booked:[4,10,18,24,30],  fast:[6,7,8,20] },
    { cat:'General',    rows:['F','G','H','I'], cols:14, price:400, booked:[2,9,20,30,40],  fast:[7,8,15,22] },
  ],
  Theatre: [
    { cat:'Royal Circle', rows:['A','B'],     cols:8,  price:800, booked:[2,5,10,14],       fast:[4,5,7,8] },
    { cat:'Stalls',       rows:['C','D','E'], cols:10, price:500, booked:[3,8,15,20,25],    fast:[5,6,12,13] },
    { cat:'Gallery',      rows:['F','G'],     cols:12, price:250, booked:[1,5,12,18],        fast:[6,7,10,11] },
  ],
  Comedy: [
    { cat:'Front Row',  rows:['A','B'],       cols:8,  price:800, booked:[2,6,10,14],       fast:[4,5,7,8] },
    { cat:'Middle',     rows:['C','D','E'],   cols:8,  price:500, booked:[3,9,15,18],       fast:[5,6,13,14] },
    { cat:'Back',       rows:['F','G'],       cols:10, price:300, booked:[1,4,11,20],        fast:[6,7,9,10] },
  ],
};

const getLayout = (category) => LAYOUTS[category] || LAYOUTS['Movies'];

const DATES = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return {
    label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short' }),
    date:  d.toISOString().split('T')[0],
    day:   d.getDate(),
    month: d.toLocaleDateString('en-IN', { month: 'short' }),
  };
});

const DUMMY_SHOWS = [
  { id:1, venue_name:'Luxe Cinemas',     venue_city:'Chennai', screen:'Screen 1',    times:['10:30 AM','1:30 PM','6:00 PM'],         price_premium:350, price_gold:250, price_silver:180, amenities:'Dolby Atmos · 4K', fast:['1:30 PM'] },
  { id:2, venue_name:'Nova Theatre',     venue_city:'Chennai', screen:'IMAX Screen', times:['11:00 AM','2:00 PM','7:30 PM'],         price_premium:400, price_gold:300, price_silver:200, amenities:'IMAX · Dolby',     fast:[] },
  { id:3, venue_name:'Broadway Screens', venue_city:'Chennai', screen:'Screen 2',    times:['9:30 AM','12:30 PM','4:00 PM','8:00 PM'],price_premium:300, price_gold:220, price_silver:160, amenities:'Standard · Parking',fast:['4:00 PM','8:00 PM'] },
];

// ── localStorage keys ──
const LS_LOCKED_SEATS = 'lockedSeats';     // seats held during payment attempt
const LS_LOCKED_SHOW  = 'lockedShowId';    // which show they belong to

export default function SeatSelection() {
  const navigate = useNavigate();
  const [step, setStep] = useState(sessionStorage.getItem('seatStep') || 'date');
  const [selectedDate, setSelectedDate]   = useState(DATES[0]);
  const [selectedShow, setSelectedShow] = useState(JSON.parse(sessionStorage.getItem('selectedShow') || 'null'));
const [selectedTime, setSelectedTime] = useState(sessionStorage.getItem('selectedTime') || null);
  const [shows, setShows]                 = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [lockSeconds, setLockSeconds]     = useState(300);
  const [lockActive, setLockActive]       = useState(false);

  // ── seats that are LOCKED because user went to payment and came back ──
  const [paymentLockedSeats, setPaymentLockedSeats] = useState([]);
const [dynamicBookedSeats, setDynamicBookedSeats] = useState([]);

  const event = JSON.parse(localStorage.getItem('selectedEvent') || '{}');
  const city  = localStorage.getItem('selectedCity') || 'Chennai';

  useEffect(() => { fetchShows(); }, []);
  useEffect(() => {
  const showKey = `bookedSeats_${selectedShow?.id || 1}_${selectedTime || 'na'}`;
const booked = JSON.parse(localStorage.getItem(showKey) || '[]');
  setDynamicBookedSeats(booked);
}, [selectedShow, selectedTime]);
  // ── On mount: restore locked seats from localStorage (if payment failed/back) ──
  useEffect(() => {
    const locked = localStorage.getItem(LS_LOCKED_SEATS);
    const lockedShowId = localStorage.getItem(LS_LOCKED_SHOW);
    const lockedTime = localStorage.getItem('lockedShowTime');
    const lockedUser = localStorage.getItem('lockedByUser');
    const currentUser = localStorage.getItem('username');

    if (locked && lockedShowId && lockedTime) {
      try {
        const parsed = JSON.parse(locked);
        // ── Only show red locks if SAME user ──
        if (parsed && parsed.length > 0 && lockedUser === currentUser) {
          setPaymentLockedSeats(parsed);
        } else {
          // Other user's locked seats show as booked (grey)
          setDynamicBookedSeats(prev => [
            ...prev,
            ...JSON.parse(locked).map(s => s.id)
          ]);
        }
      } catch { /* ignore */ }
    }
  }, [selectedShow, selectedTime]);

  // ── Countdown timer ──
  useEffect(() => {
    let timer;
    if (lockActive && lockSeconds > 0) {
      timer = setInterval(() => setLockSeconds(s => s - 1), 1000);
    } else if (lockSeconds === 0) {
      setSelectedSeats([]);
      setLockActive(false);
      setLockSeconds(300);
    }
    return () => clearInterval(timer);
  }, [lockActive, lockSeconds]);

  const fetchShows = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/shows/');
      setShows(res.data.results?.length > 0 ? res.data.results : DUMMY_SHOWS);
    } catch { setShows(DUMMY_SHOWS); }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const toggleSeat = (seatId, price, isBooked) => {
    if (isBooked) return;
    // Also block payment-locked seats from being re-selected
    if (paymentLockedSeats.find(s => s.id === seatId)) return;

    if (selectedSeats.find(s => s.id === seatId)) {
      const newSeats = selectedSeats.filter(s => s.id !== seatId);
      setSelectedSeats(newSeats);
      if (newSeats.length === 0) { setLockActive(false); setLockSeconds(300); }
    } else if (selectedSeats.length < 8) {
      setSelectedSeats([...selectedSeats, { id: seatId, price }]);
      if (!lockActive) setLockActive(true);
    }
  };

  const totalAmount = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const handleProceed = () => {
    // ── Save seats to localStorage so they show as locked if user comes back ──
    localStorage.setItem(LS_LOCKED_SEATS, JSON.stringify(selectedSeats));
    localStorage.setItem('lockedByUser', localStorage.getItem('username'));
    localStorage.setItem(LS_LOCKED_SHOW, selectedShow?.id?.toString() || '1');
    localStorage.setItem('lockedShowTime', selectedTime);
    sessionStorage.setItem('selectedShow', JSON.stringify(selectedShow));
sessionStorage.setItem('selectedTime', selectedTime); // ← ADD THIS
    localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
    localStorage.setItem('totalAmount', totalAmount);
    localStorage.setItem('selectedShow', JSON.stringify({
      ...selectedShow, time: selectedTime, date: selectedDate.date
    }));
    navigate('/payment');
  };

  // ── Clear locked seats (call this when user wants to pick fresh seats) ──
  const clearLockedSeats = () => {
    localStorage.removeItem(LS_LOCKED_SEATS);
    localStorage.removeItem(LS_LOCKED_SHOW);
    setPaymentLockedSeats([]);
  };

  // ── Shared seat color logic ──
  const getSeatStyle = (seatId, isBooked, isFast, isSelected, isPaymentLocked) => {
    if (isBooked) return {
      background: 'rgba(255,255,255,0.1)',
      border: '1.5px solid rgba(255,255,255,0.15)',
      cursor: 'default',
    };
    if (isPaymentLocked) return {
      background: 'rgba(255,79,109,0.25)',
      border: '1.5px solid rgba(255,79,109,0.5)',
      cursor: 'not-allowed',
    };
    if (isSelected) return {
      background: 'linear-gradient(135deg,#6c3bff,#2575fc)',
      border: 'none',
      cursor: 'pointer',
    };
    if (isFast) return {
      background: 'transparent',
      border: '1.5px solid #f59e0b',
      boxShadow: '0 0 6px rgba(245,158,11,0.4)',
      cursor: 'pointer',
    };
    return {
      background: 'transparent',
      border: '1.5px solid rgba(79,172,254,0.6)',
      cursor: 'pointer',
    };
  };

  // ════════════════════════════════
  // STEP 1 — Date
  // ════════════════════════════════
  if (step === 'date') return (
    <SBLayout title="Select Date" subtitle={event.title || 'Event'}>
  <button className="sbl-back" onClick={() => navigate('/events')}>
    ← Back to Events
  </button>
      <div className="sbl-card">
        <div style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:4 }}>
          {DATES.map(d => (
            <div key={d.date} onClick={() => setSelectedDate(d)}
              style={{
                minWidth:60, textAlign:'center', padding:'10px 8px',
                borderRadius:12, cursor:'pointer', flexShrink:0,
                border: selectedDate.date===d.date ? '2px solid #a07aff' : '1px solid rgba(255,255,255,0.1)',
                background: selectedDate.date===d.date ? 'rgba(108,59,255,0.25)' : 'rgba(255,255,255,0.04)',
                color:'#fff', transition:'all 0.2s',
              }}>
              <div style={{ fontSize:10, opacity:0.6 }}>{d.label}</div>
              <div style={{ fontSize:22, fontWeight:700 }}>{d.day}</div>
              <div style={{ fontSize:10, opacity:0.6 }}>{d.month}</div>
            </div>
          ))}
        </div>
      </div>
      <button className="sbl-btn" onClick={() => setStep('show')}>
        See Shows for {selectedDate.label} →
      </button>
    </SBLayout>
  );

  // ════════════════════════════════
  // STEP 2 — Theatre + Showtime
  // ════════════════════════════════
  if (step === 'show') return (
    <SBLayout title="Select Theatre" subtitle={`${event.title} · ${selectedDate.label}, ${selectedDate.day} ${selectedDate.month}`}>
      <button className="sbl-back" onClick={() => setStep('date')}>← Change date</button>

      {DUMMY_SHOWS.map(show => (
        <div key={show.id} className="sbl-card">
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <div>
              <div style={{ fontSize:14, fontWeight:500, color:'#fff' }}>{show.venue_name}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>{show.amenities}</div>
            </div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', textAlign:'right' }}>
              <div>From ₹{show.price_silver}</div>
              <div>{show.screen}</div>
            </div>
          </div>

          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {show.times.map(time => (
              <div key={time}
                onClick={() => { setSelectedShow(show); setSelectedTime(time); setStep('seats'); }}
                style={{
                  border: show.fast.includes(time) ? '1.5px solid #f59e0b' : '1.5px solid rgba(79,172,254,0.5)',
                  borderRadius:10, padding:'6px 14px', cursor:'pointer',
                  fontSize:12, fontWeight:500,
                  color: show.fast.includes(time) ? '#fbbf24' : '#93c5fd',
                  background: show.fast.includes(time) ? 'rgba(245,158,11,0.08)' : 'rgba(79,172,254,0.07)',
                  boxShadow: show.fast.includes(time) ? '0 0 8px rgba(245,158,11,0.25)' : 'none',
                }}>
                {time}
                {show.fast.includes(time) && (
                  <span style={{ fontSize:9, display:'block', color:'#f59e0b' }}>🔥 Fast filling</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </SBLayout>
  );

  // ════════════════════════════════
  // STEP 3 — Seat Selection
  // ════════════════════════════════
  return (
    <SBLayout title="Pick your seats" subtitle={`${selectedShow?.venue_name} · ${selectedTime}`}>
      <button className="sbl-back"
        onClick={() => { setStep('show'); setSelectedSeats([]); setLockActive(false); setLockSeconds(300); sessionStorage.removeItem('seatStep'); }}>
        ← Change showtime
      </button>

      {/* ── Payment-locked seats notice ── */}
      {paymentLockedSeats.length > 0 && localStorage.getItem('lockedByUser') === localStorage.getItem('username') && (
        <div className="sbl-alert-error" style={{ marginBottom:12 }}>
          <div style={{ fontWeight:600, marginBottom:4 }}>⚠️ Seats held from your last payment attempt</div>
          <div style={{ fontSize:12 }}>
            Seats <strong>{paymentLockedSeats.map(s => s.id).join(', ')}</strong> are locked (shown in red).
            They will be released if you don't complete payment soon.
          </div>
          <button onClick={clearLockedSeats}
            style={{ marginTop:8, background:'rgba(255,79,109,0.2)', border:'1px solid rgba(255,79,109,0.4)', color:'#ff4f6d', borderRadius:8, padding:'4px 12px', fontSize:11, cursor:'pointer' }}>
            Release these seats
          </button>
        </div>
      )}

      <div className="sbl-card">
        {/* Screen indicator */}
        <div style={{
          textAlign:'center', fontSize:11, color:'rgba(255,255,255,0.3)',
          borderBottom:'2px solid rgba(255,255,255,0.08)',
          paddingBottom:10, marginBottom:16, letterSpacing:3,
        }}>
          {event.category === 'Sports' ? '── PITCH THIS WAY ──'
: event.category === 'Concerts' ? '── STAGE THIS WAY ──'
: event.category === 'Theatre' ? '── STAGE THIS WAY ──'
: '── SCREEN THIS WAY ──'}
        </div>

        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
          {getLayout(event.category).map(section => (
            <div key={section.cat} style={{ width:'100%' }}>
              <div style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.4)', margin:'10px 0 5px', letterSpacing:1 }}>
                {section.cat} · ₹{
                  section.cat==='Premium' ? selectedShow?.price_premium
                  : section.cat==='Gold'  ? selectedShow?.price_gold
                  : selectedShow?.price_silver
                }
              </div>
              {section.rows.map((row, rowIdx) => (
                <div key={row} style={{ display:'flex', gap:4, marginBottom:4, justifyContent:'center' }}>
                  <div style={{ width:14, fontSize:9, color:'rgba(255,255,255,0.25)', textAlign:'center', paddingTop:4 }}>{row}</div>
                  {Array.from({ length: section.cols }, (_, colIdx) => {
                    const localIdx     = rowIdx * section.cols + colIdx + 1;
                    const seatId       = `${row}${colIdx + 1}`;
                    const isBooked = section.booked.includes(localIdx) || 
                 dynamicBookedSeats.includes(seatId);
                    const isFast       = section.fast.includes(localIdx);
                    const isSelected   = !!selectedSeats.find(s => s.id === seatId);
                    // ── Check if this seat is payment-locked ──
                    const isPaymentLocked = !!paymentLockedSeats.find(s => s.id === seatId);
                    const price = section.cat==='Premium' ? selectedShow?.price_premium
                                : section.cat==='Gold'    ? selectedShow?.price_gold
                                : selectedShow?.price_silver;

                    return (
                      <React.Fragment key={seatId}>
                        {colIdx === Math.floor(section.cols / 2) && <div style={{ width:8 }} />}
                        <div
                          onClick={() => toggleSeat(seatId, price, isBooked)}
                          title={isPaymentLocked ? 'Locked — payment in progress' : seatId}
                          style={{
                            width:24, height:20, borderRadius:'3px 3px 0 0',
                            transition:'all 0.15s',
                            ...getSeatStyle(seatId, isBooked, isFast, isSelected, isPaymentLocked),
                          }}
                        />
                      </React.Fragment>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:10, justifyContent:'center', marginTop:14, paddingTop:10, borderTop:'1px solid rgba(255,255,255,0.07)' }}>
          {[
            { label:'Available',       border:'1.5px solid rgba(79,172,254,0.6)', bg:'transparent' },
            { label:'Selected',        border:'none',                             bg:'linear-gradient(135deg,#6c3bff,#2575fc)' },
            { label:'Booked',          border:'1.5px solid rgba(255,255,255,0.15)', bg:'rgba(255,255,255,0.1)' },
            { label:'Fast Filling',    border:'1.5px solid #f59e0b',             bg:'transparent' },
            { label:'Payment Locked',  border:'1.5px solid rgba(255,79,109,0.5)', bg:'rgba(255,79,109,0.25)' },
          ].map(l => (
            <div key={l.label} style={{ display:'flex', alignItems:'center', gap:5, fontSize:10, color:'rgba(255,255,255,0.5)' }}>
              <div style={{ width:14, height:12, borderRadius:'2px 2px 0 0', border:l.border, background:l.bg }} />
              {l.label}
            </div>
          ))}
        </div>
      </div>

      {/* Lock countdown bar */}
      {selectedSeats.length > 0 && (
        <div className="sbl-card" style={{ background:'rgba(108,59,255,0.1)', border:'1px solid rgba(108,59,255,0.25)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>Locked for</div>
              <div style={{ fontSize:22, fontWeight:700, color:'#a07aff', fontFamily:'monospace' }}>
                {formatTime(lockSeconds)}
              </div>
            </div>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>Seats</div>
              <div style={{ fontSize:12, fontWeight:500, color:'#fff' }}>
                {selectedSeats.map(s => s.id).join(', ')}
              </div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>Total</div>
              <div style={{ fontSize:20, fontWeight:700, color:'#a07aff' }}>₹{totalAmount}</div>
            </div>
          </div>
        </div>
      )}

      <button className="sbl-btn" disabled={selectedSeats.length === 0} onClick={handleProceed}>
        Proceed to Pay →
      </button>

    </SBLayout>
  );
}