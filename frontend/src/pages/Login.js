import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SBLayout from '../components/SBLayout';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode]       = useState('login');
  const [step, setStep]       = useState('form');
  const [form, setForm]       = useState({ username:'', password:'', email:'', mobile:'' });
  const [otp, setOtp]         = useState('');
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (mode === 'login') {
        const res = await axios.post('http://127.0.0.1:8000/api/auth/send-otp/', { mobile: form.mobile });
        setSuccess(`OTP sent! For testing use: ${res.data.otp}`);
        setStep('otp');
      } else {
        if (!form.email) { setError('Email is required'); setLoading(false); return; }
        if (!form.mobile || form.mobile.length !== 10) { setError('Enter valid 10 digit mobile number'); setLoading(false); return; }
        const res = await axios.post('http://127.0.0.1:8000/api/auth/register/', {
          username: form.username, password: form.password,
          email: form.email, mobile: form.mobile,
        });
        setSuccess(`Account created! OTP sent. Use: ${res.data.otp || 'check terminal'}`);
        setStep('otp');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError(''); setLoading(true);
    try {
      await axios.post('http://127.0.0.1:8000/api/auth/verify-otp/', { mobile: form.mobile, otp });
      if (mode === 'login') {
        const loginRes = await axios.post('http://127.0.0.1:8000/api/auth/login/', { username: form.username, password: form.password });
        localStorage.setItem('token', loginRes.data.token);
localStorage.setItem('token', loginRes.data.token);
localStorage.setItem('username', loginRes.data.username);
localStorage.setItem('mobile', form.mobile);
navigate('/events');
setTimeout(() => window.dispatchEvent(new Event("authChange")), 200);// ← goes back to previous page (events/seats page)
      } else {
        setSuccess('Mobile verified! Please login now.');
        setStep('form'); setMode('login');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError(''); setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/auth/send-otp/', { mobile: form.mobile });
      setSuccess(`New OTP sent! Use: ${res.data.otp}`);
    } catch { setError('Failed to resend OTP'); }
    finally { setLoading(false); }
  };

  /* ── OTP SCREEN ── */
  if (step === 'otp') return (
    <SBLayout title="Verify Mobile" subtitle="SmartBook">
      <div className="sbl-card" style={{ textAlign:'center' }}>
        <div style={{ fontSize:48, marginBottom:10 }}>📱</div>
        <div style={{ fontSize:15, fontWeight:500, color:'#fff', marginBottom:4 }}>OTP Sent!</div>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.45)', marginBottom:20 }}>
          Enter the 6-digit OTP sent to <strong style={{ color:'#a07aff' }}>{form.mobile}</strong>
        </div>

        <input
          style={{
            width:'100%', border:'2px solid #6c3bff', borderRadius:12,
            padding:'14px', fontSize:24, outline:'none',
            textAlign:'center', letterSpacing:10, fontWeight:600,
            marginBottom:16, background:'rgba(108,59,255,0.1)', color:'#fff',
            fontFamily: 'DM Sans, sans-serif',
          }}
          placeholder="------"
          maxLength={6}
          value={otp}
          onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
        />

        {error   && <div className="sbl-alert-error">{error}</div>}
        {success && <div className="sbl-alert-success">{success}</div>}

        <button className="sbl-btn" onClick={handleVerifyOTP} disabled={loading || otp.length !== 6}>
          {loading ? 'Verifying...' : 'Verify OTP →'}
        </button>

        <div style={{ display:'flex', justifyContent:'space-between', marginTop:12, fontSize:12 }}>
          <button className="sbl-link" onClick={() => { setStep('form'); setOtp(''); setError(''); setSuccess(''); }}>
            ← Change number
          </button>
          <button className="sbl-link" onClick={handleResendOTP}>Resend OTP</button>
        </div>
      </div>
    </SBLayout>
  );

  /* ── FORM SCREEN ── */
  return (
    <SBLayout title={mode === 'login' ? 'Welcome back!' : 'Create account'} subtitle="SmartBook">

      <div className="sbl-card">
        {/* Toggle */}
        <div style={{ display:'flex', background:'rgba(255,255,255,0.07)', borderRadius:50, padding:4, marginBottom:20 }}>
          {['login','register'].map(m => (
            <div key={m} onClick={() => { setMode(m); setError(''); setSuccess(''); }}
              style={{
                flex:1, textAlign:'center', padding:'9px',
                borderRadius:50, cursor:'pointer', fontSize:13,
                fontWeight: mode===m ? 500 : 400,
                background: mode===m ? 'linear-gradient(135deg,#6c3bff,#2575fc)' : 'transparent',
                color: mode===m ? '#fff' : 'rgba(255,255,255,0.45)',
                transition:'all 0.2s',
              }}>
              {m === 'login' ? 'Login' : 'Register'}
            </div>
          ))}
        </div>

        <input className="sbl-input" placeholder="Username"
          value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />

        {mode === 'register' && (
          <input className="sbl-input" placeholder="Email address *" type="email"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        )}

        <input className="sbl-input" placeholder="Password" type="password"
          value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />

        <div style={{ position:'relative' }}>
          <div style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:13, color:'rgba(255,255,255,0.5)', fontWeight:500 }}>
            +91
          </div>
          <input className="sbl-input" placeholder="Mobile number *" type="tel" maxLength={10}
            style={{ paddingLeft:44 }}
            value={form.mobile}
            onChange={e => setForm({ ...form, mobile: e.target.value.replace(/\D/g,'') })} />
        </div>

        {error   && <div className="sbl-alert-error">{error}</div>}
        {success && <div className="sbl-alert-success">{success}</div>}

        <button className="sbl-btn" onClick={handleSubmit}
          disabled={loading || !form.username || !form.password || !form.mobile}>
          {loading ? 'Please wait...' : mode==='login' ? 'Send OTP & Login →' : 'Register & Send OTP →'}
        </button>

        <div className="sbl-alert-info" style={{ marginTop:8 }}>
          💡 Demo — Username: <strong>admin</strong> · Password: <strong>admin123</strong> · Mobile: <strong>9999999999</strong>
        </div>
      </div>

    </SBLayout>
  );
}