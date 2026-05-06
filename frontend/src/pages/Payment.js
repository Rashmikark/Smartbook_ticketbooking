import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SBLayout from '../components/SBLayout';

const ANIM_STEPS = [
  { label:'Connecting to Razorpay...',      sub:'Establishing secure connection' },
  { label:'Verifying payment details...',    sub:'Checking your credentials' },
  { label:'Processing transaction...',       sub:'Communicating with your bank' },
  { label:'Confirming booking...',           sub:'Almost done, hold tight!' },
];

export default function Payment() {
  const navigate = useNavigate();
  const [screen, setScreen]           = useState('review');
  const [error, setError]             = useState('');
  const [payMethod, setPayMethod]     = useState('upi');
  const [upiApp, setUpiApp]           = useState('GPay');
  const [animStep, setAnimStep]       = useState(0);
  const [progress, setProgress]       = useState(0);
  const [retryUsed, setRetryUsed]     = useState(false);
  const [lockTimer, setLockTimer]     = useState(300);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval;
    if (timerActive && lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer(s => {
          if (s <= 1) {
            localStorage.removeItem('lockedSeats');
            localStorage.removeItem('lockedShowId');
            localStorage.removeItem('lockedShowTime');
            setTimerActive(false);
            setScreen('review');
            setLockTimer(300);
            setRetryUsed(false);
            return 300;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTimer = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };
  const event       = JSON.parse(localStorage.getItem('selectedEvent') || '{}');
  const seats       = JSON.parse(localStorage.getItem('selectedSeats') || '[]');
  const totalAmount = parseInt(localStorage.getItem('totalAmount') || '0');
  const fee         = Math.round(totalAmount * 0.1);
  const discount    = 50;
  const finalAmount = totalAmount + fee - discount;

  // ── 5 min countdown after payment failure ──
  {/*useEffect(() => {
    let interval;
    if (timerActive && lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer(s => {
          if (s <= 1) {
            // Auto release seats after 5 minutes
            localStorage.removeItem('lockedSeats');
            localStorage.removeItem('lockedShowId');
            localStorage.removeItem('lockedShowTime');
            setTimerActive(false);
            setScreen('review');
            setLockTimer(300);
            setRetryUsed(false);
            return 300;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTimer = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };*/}

  const startPayment = () => {
    if (payMethod==='upi') {
      const el = document.getElementById('upi-input');
      if (!el || !el.value.includes('@')) { setError('Please enter a valid UPI ID (e.g. name@ybl)'); return; }
    }
    if (payMethod==='card') {
      const el = document.getElementById('card-input');
      if (!el || el.value.replace(/\s/g,'').length < 16) { setError('Please enter a valid 16 digit card number'); return; }
    }
    if (payMethod==='nb') {
      const el = document.getElementById('bank-input');
      if (!el || el.value==='Select your bank') { setError('Please select your bank'); return; }
    }
    setError('');
    const savedUpiValue = document.getElementById('upi-input')?.value || '';
    setScreen('animating');
    setAnimStep(0); setProgress(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setAnimStep(step);
      setProgress(Math.round((step / (ANIM_STEPS.length-1)) * 100));
      if (step >= ANIM_STEPS.length) {
        clearInterval(interval);
        setTimeout(async () => {

          // ── Simulate payment failure for demo (30% chance or if retry already used) ──
          const shouldFail = retryUsed || savedUpiValue === 'fail@test' || Math.random() < 0.3;
          if (shouldFail) {
            setScreen('failed');
            setTimerActive(true);
            return;
          }

          try {
            const token = localStorage.getItem('token');
            const bookingData = {
              show_id: 1, seats: seats.map(s=>s.id).join(','),
              total_amount: totalAmount, payment_method: payMethod,
              payment_id: 'PAY_' + Math.random().toString(36).substr(2,9).toUpperCase(),
              discount: 50,
            };
            if (token) {
              const res = await axios.post('http://127.0.0.1:8000/api/booking/create/', bookingData,
                { headers: { Authorization: `Token ${token}` } });
              localStorage.setItem('bookingId', res.data.booking_id);
              localStorage.setItem('finalAmount', res.data.final_amount);
              const bookedSeats = JSON.parse(localStorage.getItem('selectedSeats') || '[]');
              const selectedShow = JSON.parse(localStorage.getItem('selectedShow') || '{}');
const showKey = `bookedSeats_${selectedShow.id || 1}_${selectedShow.time || 'na'}`;
const existingBooked = JSON.parse(localStorage.getItem(showKey) || '[]');
localStorage.setItem(showKey, JSON.stringify([...existingBooked, ...bookedSeats.map(s => s.id)]));
              localStorage.removeItem('lockedSeats');
              localStorage.removeItem('lockedShowId');
              localStorage.removeItem('lockedShowTime');
              navigate(`/ticket/${res.data.booking_id}`);
            } else {
              const bookingId = 'SB' + Math.floor(10000 + Math.random() * 90000);
              localStorage.setItem('bookingId', bookingId);
              localStorage.setItem('finalAmount', finalAmount);
              const bookedSeats = JSON.parse(localStorage.getItem('selectedSeats') || '[]');
              const selectedShow = JSON.parse(localStorage.getItem('selectedShow') || '{}');
const showKey = `bookedSeats_${selectedShow.id || 1}_${selectedShow.time || 'na'}`;
const existingBooked = JSON.parse(localStorage.getItem(showKey) || '[]');
localStorage.setItem(showKey, JSON.stringify([...existingBooked, ...bookedSeats.map(s => s.id)]));
              localStorage.removeItem('lockedSeats');
              localStorage.removeItem('lockedShowId');
              localStorage.removeItem('lockedShowTime');
              navigate(`/ticket/${bookingId}`);
            }
          } catch {
            const bookingId = 'SB' + Math.floor(10000 + Math.random() * 90000);
            localStorage.setItem('bookingId', bookingId);
            localStorage.setItem('finalAmount', finalAmount);
            const bookedSeats = JSON.parse(localStorage.getItem('selectedSeats') || '[]');
            const selectedShow = JSON.parse(localStorage.getItem('selectedShow') || '{}');
const showKey = `bookedSeats_${selectedShow.id || 1}_${selectedShow.time || 'na'}`;
const existingBooked = JSON.parse(localStorage.getItem(showKey) || '[]');
localStorage.setItem(showKey, JSON.stringify([...existingBooked, ...bookedSeats.map(s => s.id)]));
            localStorage.removeItem('lockedSeats');
            localStorage.removeItem('lockedShowId');
            localStorage.removeItem('lockedShowTime');
            navigate(`/ticket/${bookingId}`);
          }
        }, 600);
      }
    }, 900);
  };

  /* ── FAILED SCREEN ── */
  if (screen==='failed') {
    return (
      <SBLayout title="Payment Failed" subtitle="SmartBook Pay">
        <div className="sbl-card" style={{ textAlign:'center', padding:'28px 20px' }}>

          {/* Failed icon */}
          <div style={{ fontSize:56, marginBottom:12 }}>❌</div>
          <div style={{ fontSize:18, fontWeight:700, color:'#f87171', marginBottom:6 }}>
            Payment Failed
          </div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.45)', marginBottom:20 }}>
            Your transaction could not be completed.
          </div>

          {/* Seat lock warning with countdown */}
          <div style={{
            background:'rgba(255,79,109,0.1)',
            border:'1px solid rgba(255,79,109,0.3)',
            borderRadius:12, padding:'14px 16px', marginBottom:20,
          }}>
            <div style={{ fontSize:13, color:'#ff4f6d', fontWeight:600, marginBottom:6 }}>
              🔒 Your seats are temporarily locked
            </div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', marginBottom:10 }}>
              Seats <strong style={{ color:'#fff' }}>
                {seats.map(s => s.id).join(', ')}
              </strong> are held for:
            </div>

            {/* Countdown Timer */}
            <div style={{
              fontSize:42, fontWeight:700, fontFamily:'monospace',
              color: lockTimer < 60 ? '#f87171' : '#fbbf24',
              marginBottom:4,
              textShadow: lockTimer < 60 ? '0 0 20px rgba(248,113,113,0.5)' : '0 0 20px rgba(251,191,36,0.5)',
            }}>
              {formatTimer(lockTimer)}
            </div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>
              Seats will be automatically released after timer expires
            </div>
          </div>

          {/* Retry button — only if not used */}
          {!retryUsed ? (
            <div>
              <div className="sbl-alert-info" style={{ marginBottom:12, fontSize:12 }}>
                💡 You have <strong>1 retry attempt</strong> remaining
              </div>
              <button
                className="sbl-btn"
                onClick={() => {
                  setRetryUsed(true);
                  setScreen('review');
                  setTimerActive(false);
                }}>
                🔄 Retry Payment
              </button>
            </div>
          ) : (
            <div>
              <div className="sbl-alert-error" style={{ marginBottom:12, fontSize:12 }}>
                ❌ No retry attempts remaining. Seats will be released after timer expires.
              </div>
            </div>
          )}
          <button
            className="sbl-btn-ghost"
            style={{ marginTop:12 }}
            onClick={() => navigate('/home')}>
            ← Go to Home
          </button>

          {/*<button
            className="sbl-btn-ghost"
            style={{ marginTop:8 }}
            onClick={() => {
              localStorage.removeItem('lockedSeats');
              localStorage.removeItem('lockedShowId');
              localStorage.removeItem('lockedShowTime');
              setTimerActive(false);
              navigate('/seats/1');
            }}>
            ← Choose Different Seats
          </button> */}

        </div>
      </SBLayout>
    );
  }

  /* ── ANIMATING SCREEN ── */
  if (screen==='animating') {
    const cur = ANIM_STEPS[Math.min(animStep, ANIM_STEPS.length-1)];
    return (
      <SBLayout title="Processing..." subtitle="SmartBook Pay">
        <div className="sbl-card" style={{ textAlign:'center', padding:'32px 20px' }}>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', marginBottom:20, fontWeight:500 }}>{cur.label}</div>

          {/* Floating card + coins animation */}
          <div style={{ position:'relative', width:200, height:150, margin:'0 auto 20px' }}>

            {/* ── Realistic Credit Card ── */}
            <div style={{
              width:130, height:82, borderRadius:14,
              background:'linear-gradient(135deg,#1a1a6e,#6c3bff,#2575fc)',
              boxShadow:'0 8px 24px rgba(108,59,255,0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
              position:'absolute', left:'50%', top:8,
              transform:'translateX(-50%)',
              animation:'floatCard 2s ease-in-out infinite',
              padding:'10px 14px',
              display:'flex', flexDirection:'column', justifyContent:'space-between',
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ width:26, height:20, borderRadius:4, background:'linear-gradient(135deg,#ffd700,#b8860b)', position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:'50%', left:0, right:0, height:1, background:'rgba(0,0,0,0.3)' }} />
                  <div style={{ position:'absolute', left:'50%', top:0, bottom:0, width:1, background:'rgba(0,0,0,0.3)' }} />
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:2, alignItems:'flex-end' }}>
                  {[10,14,18].map(w => (
                    <div key={w} style={{ width:w, height:1.5, borderRadius:1, background:'rgba(255,255,255,0.5)' }} />
                  ))}
                </div>
              </div>
              <div style={{ fontSize:8, color:'rgba(255,255,255,0.85)', letterSpacing:2.5, fontFamily:'monospace', textShadow:'0 1px 2px rgba(0,0,0,0.3)' }}>
                •••• •••• •••• 4242
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ fontSize:6.5, color:'rgba(255,255,255,0.7)', letterSpacing:1, textTransform:'uppercase' }}>SmartBook</div>
                <div style={{ fontSize:13, fontStyle:'italic', fontWeight:900, color:'#fff', letterSpacing:-1, textShadow:'0 1px 3px rgba(0,0,0,0.4)' }}>VISA</div>
              </div>
            </div>

            {/* ── Gold Coin 1 ── */}
            <div style={{
              position:'absolute', left:8, top:85,
              width:36, height:36, borderRadius:'50%',
              background:'radial-gradient(circle at 35% 35%, #ffe566, #f59e0b, #b45309)',
              boxShadow:'0 3px 8px rgba(180,83,9,0.5), inset 0 -2px 4px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.3)',
              border:'1.5px solid #b45309',
              display:'flex', alignItems:'center', justifyContent:'center',
              animation:'floatCoin1 1.4s ease-in-out infinite',
            }}>
              <span style={{ fontSize:14, fontWeight:900, color:'#78350f', fontFamily:'serif', textShadow:'0 1px 0 rgba(255,255,255,0.4)' }}>₹</span>
            </div>

            {/* ── Silver Coin ── */}
            <div style={{
              position:'absolute', right:8, top:80,
              width:30, height:30, borderRadius:'50%',
              background:'radial-gradient(circle at 35% 35%, #f0f0f0, #b0b0b0, #787878)',
              boxShadow:'0 3px 8px rgba(0,0,0,0.3), inset 0 -2px 4px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.4)',
              border:'1.5px solid #888',
              display:'flex', alignItems:'center', justifyContent:'center',
              animation:'floatCoin2 1.7s ease-in-out infinite',
            }}>
              <span style={{ fontSize:11, fontWeight:900, color:'#444', fontFamily:'serif', textShadow:'0 1px 0 rgba(255,255,255,0.5)' }}>₹</span>
            </div>

            {/* ── Gold Coin 2 ── */}
            <div style={{
              position:'absolute', left:30, top:118,
              width:24, height:24, borderRadius:'50%',
              background:'radial-gradient(circle at 35% 35%, #ffe566, #f59e0b, #b45309)',
              boxShadow:'0 2px 6px rgba(180,83,9,0.4), inset 0 -1px 3px rgba(0,0,0,0.2), inset 0 1px 3px rgba(255,255,255,0.3)',
              border:'1px solid #b45309',
              display:'flex', alignItems:'center', justifyContent:'center',
              animation:'floatCoin1 2.1s ease-in-out 0.3s infinite',
            }}>
              <span style={{ fontSize:9, fontWeight:900, color:'#78350f', fontFamily:'serif' }}>₹</span>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:20, height:5, margin:'0 0 14px', overflow:'hidden' }}>
            <div style={{ height:5, borderRadius:20, background:'linear-gradient(90deg,#6c3bff,#ff4f6d)', width:`${progress}%`, transition:'width 0.8s ease' }} />
          </div>

          <div style={{ display:'flex', justifyContent:'center', gap:8, marginBottom:10 }}>
            {ANIM_STEPS.map((_,i) => (
              <div key={i} style={{
                width:8, height:8, borderRadius:'50%',
                background: i<animStep ? '#34d399' : i===animStep ? '#6c3bff' : 'rgba(255,255,255,0.15)',
                transition:'background 0.3s',
              }} />
            ))}
          </div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)' }}>{cur.sub}</div>
        </div>

        <style>{`
          @keyframes floatCard { 0%,100%{transform:translateX(-50%) translateY(0) rotate(-3deg)} 50%{transform:translateX(-50%) translateY(-14px) rotate(3deg)} }
          @keyframes floatCoin1 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-18px) rotate(180deg)} }
          @keyframes floatCoin2 { 0%,100%{transform:translateY(0) rotate(0deg)} 33%{transform:translateY(-12px) rotate(120deg)} 66%{transform:translateY(-6px) rotate(240deg)} }
        `}</style>
      </SBLayout>
    );
  }

  /* ── REVIEW SCREEN ── */
  const METHODS = [
    { id:'upi',    label:'UPI',                sub:'GPay, PhonePe, Paytm',      color:'#93c5fd', bg:'rgba(82,143,245,0.12)' },
    { id:'card',   label:'Credit / Debit Card', sub:'Visa · Mastercard · Rupay', color:'#fbbf24', bg:'rgba(245,158,11,0.12)' },
    { id:'nb',     label:'Net Banking',          sub:'All major banks',           color:'#6ee7b7', bg:'rgba(5,150,105,0.12)' },
    { id:'wallet', label:'Wallets',              sub:'Paytm, Amazon Pay',         color:'#c4b5fd', bg:'rgba(108,59,255,0.12)' },
  ];

  return (
    <SBLayout title="Review & Pay" subtitle="Almost there!">
      <button className="sbl-back" onClick={() => { sessionStorage.setItem('seatStep', 'seats'); navigate('/seats/1'); }}>
  ← Select Seats
</button>

      {/* Summary */}
      <div className="sbl-card">
        <div className="sbl-card-label">Booking summary</div>
        {[
          { label:'Event',           value: event.title },
          { label:'Seats',           value: seats.map(s=>s.id).join(', ') },
          { label:'Date',            value: localStorage.getItem('selectedShow') ? JSON.parse(localStorage.getItem('selectedShow')).date : 'N/A' },
          { label:'Show Time',       value: localStorage.getItem('selectedShow') ? JSON.parse(localStorage.getItem('selectedShow')).time : 'N/A' },
          { label:'Place',           value: localStorage.getItem('selectedShow') ? JSON.parse(localStorage.getItem('selectedShow')).venue_name + ', ' + localStorage.getItem('selectedCity') : localStorage.getItem('selectedCity') || 'N/A' },
          { label:'Ticket price',    value: `₹${totalAmount}` },
          { label:'Convenience fee', value: `₹${fee}` },
        ].map(row => (
          <div key={row.label} className="sbl-row">
            <span className="sbl-row-label">{row.label}</span>
            <span className="sbl-row-value">{row.value}</span>
          </div>
        ))}
        <div className="sbl-alert-success" style={{ margin:'8px 0' }}>Promo BOOK50 applied — ₹50 off</div>
        <div style={{ display:'flex', justifyContent:'space-between', paddingTop:10, borderTop:'1px solid rgba(255,255,255,0.1)', marginTop:4 }}>
          <span style={{ fontWeight:500, fontSize:14, color:'#fff' }}>Total payable</span>
          <span style={{ fontSize:20, fontWeight:700, color:'#a07aff' }}>₹{finalAmount}</span>
        </div>
      </div>

      {/* Razorpay gateway */}
      <div className="sbl-card">
        <div style={{
          background:'linear-gradient(135deg,#528ff5,#3056d3)',
          borderRadius:12, padding:'12px 16px', color:'white',
          display:'flex', justifyContent:'space-between', alignItems:'center',
          marginBottom:14,
        }}>
          <div>
            <div style={{ fontSize:10, opacity:0.7 }}>Powered by</div>
            <div style={{ fontSize:16, fontWeight:600 }}>Razorpay</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:10, opacity:0.7 }}>Amount</div>
            <div style={{ fontSize:17, fontWeight:600 }}>₹{finalAmount}</div>
          </div>
        </div>

        <div className="sbl-card-label">Select payment method</div>

        {METHODS.map(m => (
          <div key={m.id}>
            <div onClick={() => setPayMethod(m.id)}
              style={{
                display:'flex', alignItems:'center', gap:10,
                padding:'10px 12px', borderRadius:12, cursor:'pointer',
                border: payMethod===m.id ? '2px solid #6c3bff' : '1px solid rgba(255,255,255,0.1)',
                background: payMethod===m.id ? 'rgba(108,59,255,0.15)' : 'rgba(255,255,255,0.04)',
                marginBottom:6, transition:'all 0.2s',
              }}>
              <div style={{ width:36, height:22, borderRadius:6, background:m.bg, color:m.color, fontSize:9, fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {m.id.toUpperCase().slice(0,3)}
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:500, color:'#fff' }}>{m.label}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>{m.sub}</div>
              </div>
            </div>

            {/* UPI */}
            {payMethod==='upi' && m.id==='upi' && (
              <div style={{ paddingLeft:8, marginBottom:10 }}>
                <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:8 }}>
                  {['GPay','PhonePe','Paytm','BHIM'].map(app => (
                    <div key={app} onClick={() => setUpiApp(app)}
                      className={`sbl-chip${upiApp===app ? ' active' : ''}`}>{app}</div>
                  ))}
                </div>
                <input id="upi-input" className="sbl-input" placeholder="Enter UPI ID (e.g. name@ybl)" />
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>No PIN required · Simulated via Razorpay test mode</div>
              </div>
            )}

            {/* Card */}
            {payMethod==='card' && m.id==='card' && (
              <div style={{ paddingLeft:8, marginBottom:10 }}>
                <input id="card-input" className="sbl-input" placeholder="Card number (16 digits)" maxLength={19} />
                <div style={{ display:'flex', gap:8 }}>
                  <input className="sbl-input" style={{ flex:1, marginBottom:0 }} placeholder="MM/YY" maxLength={5} />
                  <input className="sbl-input" style={{ flex:1, marginBottom:0 }} placeholder="CVV" maxLength={3} />
                </div>
              </div>
            )}

            {/* Net Banking */}
            {payMethod==='nb' && m.id==='nb' && (
              <div style={{ paddingLeft:8, marginBottom:10 }}>
                <select id="bank-input" className="sbl-select">
                  <option>Select your bank</option>
                  {['SBI','HDFC','ICICI','Axis','Kotak','PNB'].map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
            )}
          </div>
        ))}

        <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', textAlign:'center', margin:'6px 0 10px' }}>
          🔒 Secured · 256-bit SSL encryption
        </div>

        {/* Show retry warning if retry was used */}
        {retryUsed && (
          <div className="sbl-alert-error" style={{ marginBottom:10, fontSize:12 }}>
            ⚠️ This is your <strong>last retry attempt</strong>. If this fails, seats will be locked for 5 minutes.
          </div>
        )}

        {error && <div className="sbl-alert-error">{error}</div>}

        <button onClick={startPayment}
          style={{
            background: retryUsed
              ? 'linear-gradient(135deg,#f59e0b,#d97706)'
              : 'linear-gradient(135deg,#528ff5,#3056d3)',
            color:'white', border:'none', borderRadius:50,
            padding:'13px', fontSize:14, fontWeight:600,
            cursor:'pointer', width:'100%',
          }}>
          {retryUsed ? '🔄 Retry Payment (Last Attempt)' : 'Proceed to Payment'}
          
        </button>
        
      </div>
        
    </SBLayout>
  );
}
