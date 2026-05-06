import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import SBLayout from '../components/SBLayout';

export default function Ticket() {
  const { bookingId } = useParams();
  const navigate      = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [seconds, setSeconds]   = useState(null);

  const event       = JSON.parse(localStorage.getItem('selectedEvent') || '{}');
  const seats       = JSON.parse(localStorage.getItem('selectedSeats') || '[]');
  const finalAmount = localStorage.getItem('finalAmount') || '0';
  const city        = localStorage.getItem('selectedCity') || 'Chennai';

  const showTime = new Date();
  showTime.setHours(showTime.getHours() + 2);

  useEffect(() => {
    const diff = showTime.getTime() - Date.now();
    setSeconds(Math.floor(diff / 1000));
    const timer = setInterval(() => setSeconds(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (s) => {
    if (!s && s !== 0) return '--:--:--';
    const h   = Math.floor(s / 3600);
    const m   = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}h ${m}m ${sec}s`;
  };

  return (
    <SBLayout title="Your Ticket" subtitle="Booking Confirmed ✅" hideLogin>

      {/* Ticket card */}
      <div onClick={() => setExpanded(!expanded)}
        style={{
          background:'rgba(255,255,255,0.06)',
          border:'1px solid rgba(108,59,255,0.35)',
          borderRadius:20, overflow:'hidden',
          boxShadow:'0 8px 32px rgba(108,59,255,0.2)',
          marginBottom:14, cursor:'pointer',
          backdropFilter:'blur(12px)',
        }}>

        {/* Header */}
        <div style={{
          background:'linear-gradient(135deg,#6c3bff,#2575fc)',
          padding:'18px 20px', color:'white',
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div>
              <div style={{ fontSize:11, opacity:0.7, marginBottom:2 }}>SmartBook · {city}</div>
              <div style={{ fontSize:20, fontWeight:700 }}>{event.title || 'Event'}</div>
              <div style={{ fontSize:12, opacity:0.75, marginTop:2 }}>
                {event.category}{event.language ? ` · ${event.language}` : ''}
              </div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:10, opacity:0.7 }}>Booking ID</div>
              <div style={{ fontSize:13, fontWeight:700, letterSpacing:1.5 }}>{bookingId}</div>
            </div>
          </div>

          {/* Countdown */}
          <div style={{
            marginTop:14, background:'rgba(255,255,255,0.15)',
            borderRadius:10, padding:'9px 14px',
            display:'flex', justifyContent:'space-between', alignItems:'center',
          }}>
            <span style={{ fontSize:11 }}>⏱ Show starts in</span>
            <span style={{ fontSize:15, fontWeight:700, fontFamily:'monospace' }}>
              {formatCountdown(seconds)}
            </span>
          </div>
        </div>

        {/* Dashed separator */}
        <div style={{ borderTop:'2px dashed rgba(255,255,255,0.12)', margin:'0 16px', position:'relative' }}>
          <div style={{ position:'absolute', left:-28, top:-10, width:20, height:20, borderRadius:'50%', background:'#0a0010' }} />
          <div style={{ position:'absolute', right:-28, top:-10, width:20, height:20, borderRadius:'50%', background:'#0a0010' }} />
        </div>

        {/* Collapsed info */}
        <div style={{ padding:'14px 20px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
            <div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>Seats</div>
              <div style={{ fontSize:14, fontWeight:600, color:'#fff' }}>
                {seats.map(s => s.id).join(', ') || 'N/A'}
              </div>
            </div>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>Date</div>
              <div style={{ fontSize:14, fontWeight:600, color:'#fff' }}>
                {new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short'})}
              </div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>Amount</div>
              <div style={{ fontSize:14, fontWeight:600, color:'#a07aff' }}>₹{finalAmount}</div>
            </div>
          </div>
          <div style={{ textAlign:'center', fontSize:11, color:'rgba(255,255,255,0.3)' }}>
            {expanded ? '▲ Tap to collapse' : '▼ Tap to expand full ticket'}
          </div>
        </div>

        {/* Expanded section */}
        {expanded && (
          <div style={{ padding:'0 20px 22px' }}>

            {/* QR Code */}
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', margin:'14px 0' }}>
              <div style={{
                background:'white', padding:14, borderRadius:16,
                boxShadow:'0 4px 20px rgba(108,59,255,0.3)',
              }}>
                <QRCode value={bookingId} size={120} />
              </div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', marginTop:8 }}>
                Show this QR at the venue entrance
              </div>
            </div>

            {/* Details */}
            {[
              { label:'Event',    value: event.title },
              { label:'Category', value: event.category },
              { label:'Language', value: event.language || 'N/A' },
              { label:'Duration', value: event.duration || 'N/A' },
              { label:'Venue',    value: `SmartBook Cinemas, ${city}` },
              { label:'Date',     value: JSON.parse(localStorage.getItem('selectedShow') || '{}').date || 'N/A' },
{ label:'Show Time', value: JSON.parse(localStorage.getItem('selectedShow') || '{}').time || 'N/A' },
              { label:'Seats',    value: seats.map(s => s.id).join(', ') || 'N/A' },
              { label:'Payment',  value: 'Razorpay (Test)' },
              { label:'Booked At', value: new Date().toLocaleString('en-IN', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit', hour12:true }) },
            ].map(row => (
              <div key={row.label} style={{
                display:'flex', justifyContent:'space-between',
                fontSize:12, padding:'7px 0',
                borderBottom:'1px solid rgba(255,255,255,0.07)',
              }}>
                <span style={{ color:'rgba(255,255,255,0.4)' }}>{row.label}</span>
                <span style={{ fontWeight:500, color:'#fff' }}>{row.value}</span>
              </div>
            ))}

            {/* Rules */}
            <div style={{
              background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.25)',
              borderRadius:12, padding:'12px 14px', marginTop:14,
              fontSize:11, color:'#fbbf24', lineHeight:1.8,
            }}>
              <div style={{ fontWeight:600, marginBottom:4 }}>⚠️ Important</div>
              <div>· Arrive 15 mins before show time</div>
              <div>· Outside food not allowed</div>
              <div>· Ticket valid for one entry only</div>
            </div>

            {/* Support */}
            <div style={{ textAlign:'center', fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:12 }}>
              📞 Support: 1800-123-4567 · smartbook.help
            </div>
          </div>
        )}
      </div>

      <button className="sbl-btn" onClick={() => navigate('/home')}>
        Book Another Ticket
      </button>

    </SBLayout>
  );
}