// src/components/SBLayout.jsx
// ─────────────────────────────────────────────────────────────
// Wrap ANY page with <SBLayout> to get the SmartBook dark
// animated background, top-nav and consistent page chrome.
// Usage:
//   <SBLayout title="Where are you?" subtitle="SmartBook — Movies, Events & More">
//     {/* your page content */}
//   </SBLayout>
// ─────────────────────────────────────────────────────────────
 
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
 
const LAYOUT_STYLE_ID = "sb-layout-styles";
 
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&display=swap');
 
  :root {
    --brand:       #6c3bff;
    --brand-light: #a07aff;
    --brand-dark:  #4a1fa8;
    --accent:      #ff4f6d;
    --gold:        #ffd166;
    --surface:     rgba(255,255,255,0.06);
    --border:      rgba(255,255,255,0.12);
    --text:        #ffffff;
    --text-muted:  rgba(255,255,255,0.5);
  }
 
  /* ── RESET FOR DARK PAGES ── */
  .sbl-root * { box-sizing: border-box; }
 
  /* ── FULL PAGE SHELL ── */
  .sbl-root {
    font-family: 'DM Sans', sans-serif;
    background: #0a0010;
    color: #fff;
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
  }
 
  /* ── ANIMATED BACKGROUND ── */
  .sbl-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }
 
  .sbl-bg-grad {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 15% 30%, rgba(108,59,255,0.28) 0%, transparent 60%),
      radial-gradient(ellipse 60% 70% at 85% 65%, rgba(255,79,109,0.18) 0%, transparent 55%),
      radial-gradient(ellipse 100% 80% at 50% 0%,  #1a003a 0%, #0a0010 100%);
    animation: sblPulse 10s ease-in-out infinite alternate;
  }
 
  @keyframes sblPulse {
    0%   { filter: brightness(1); }
    100% { filter: brightness(1.25); }
  }
 
  .sbl-particles {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }
 
  .sbl-particle {
    position: absolute;
    border-radius: 50%;
    opacity: 0;
    animation: sblFloat linear infinite;
  }
 
  @keyframes sblFloat {
    0%   { transform: translateY(110vh) scale(0.5); opacity: 0; }
    10%  { opacity: 0.5; }
    90%  { opacity: 0.2; }
    100% { transform: translateY(-10vh) scale(1.1); opacity: 0; }
  }
 
  /* ── NAV BAR ── */
  .sbl-nav {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 24px;
    background: rgba(10,0,16,0.7);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
 
  .sbl-logo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    letter-spacing: 2px;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
  }
 
  .sbl-logo-dot {
    display: inline-block;
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--accent);
    animation: sblBlink 1.4s ease-in-out infinite;
  }
 
  @keyframes sblBlink { 0%,100%{opacity:1} 50%{opacity:0.2} }
 
  .sbl-nav-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }
 
  .sbl-nav-user {
    font-size: 13px;
    color: var(--brand-light);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
  }
 
  .sbl-nav-btn {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.2);
    color: rgba(255,255,255,0.75);
    padding: 7px 16px;
    border-radius: 50px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  .sbl-nav-btn:hover { background: rgba(255,255,255,0.15); color: #fff; }
 
  .sbl-nav-btn-accent {
    background: var(--accent);
    border: none;
    color: #fff;
    padding: 7px 16px;
    border-radius: 50px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 3px 14px rgba(255,79,109,0.35);
  }
  .sbl-nav-btn-accent:hover { transform: translateY(-1px); box-shadow: 0 5px 20px rgba(255,79,109,0.5); }
 
  /* ── PAGE CONTENT AREA ── */
  .sbl-content {
    position: relative;
    z-index: 1;
    max-width: 520px;
    margin: 0 auto;
    padding: 28px 20px 80px;
  }
 
  /* ── PAGE HEADER ── */
  .sbl-page-header {
    margin-bottom: 24px;
    animation: sblFadeUp 0.5s ease-out both;
  }
 
  @keyframes sblFadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
 
  .sbl-page-subtitle {
    font-size: 13px;
    color: var(--brand-light);
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 4px;
    font-weight: 500;
  }
 
  .sbl-page-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 42px;
    letter-spacing: 1px;
    color: #fff;
    line-height: 1;
    margin: 0;
    text-shadow: 0 0 40px rgba(108,59,255,0.4);
  }
 
  /* ── GLASS CARDS ── */
  .sbl-card {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 18px;
    padding: 20px;
    margin-bottom: 14px;
    backdrop-filter: blur(10px);
    animation: sblFadeUp 0.5s ease-out both;
  }
 
  .sbl-card-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 10px;
  }
 
  /* ── INPUTS ── */
  .sbl-input {
    width: 100%;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 12px;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    padding: 12px 14px;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
    margin-bottom: 10px;
  }
  .sbl-input::placeholder { color: rgba(255,255,255,0.25); }
  .sbl-input:focus { border-color: var(--brand-light); background: rgba(108,59,255,0.1); }
 
  /* ── PRIMARY BUTTON ── */
  .sbl-btn {
    width: 100%;
    background: linear-gradient(135deg, #6c3bff, #ff4f6d);
    border: none;
    color: #fff;
    padding: 15px;
    border-radius: 50px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.25s;
    box-shadow: 0 6px 24px rgba(108,59,255,0.35);
    margin-top: 8px;
    margin-bottom: 10px;
  }
  .sbl-btn:hover { transform: translateY(-1px); box-shadow: 0 10px 32px rgba(108,59,255,0.5); }
  .sbl-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
 
  /* ── GHOST BUTTON ── */
  .sbl-btn-ghost {
    width: 100%;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.2);
    color: rgba(255,255,255,0.75);
    padding: 13px;
    border-radius: 50px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 8px;
  }
  .sbl-btn-ghost:hover { background: rgba(255,255,255,0.13); color: #fff; }
 
  /* ── CHIP / BADGE ── */
  .sbl-chip {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: 50px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.5px;
    cursor: pointer;
    border: 1.5px solid rgba(255,255,255,0.2);
    color: rgba(255,255,255,0.65);
    background: transparent;
    transition: all 0.2s;
  }
  .sbl-chip:hover { border-color: rgba(255,255,255,0.4); color: #fff; }
  .sbl-chip.active {
    background: linear-gradient(135deg, #6c3bff, #2575fc);
    border-color: transparent;
    color: #fff;
    box-shadow: 0 3px 12px rgba(108,59,255,0.35);
  }
 
  /* ── STATUS BADGES ── */
  .sbl-badge-green { display:inline-block; padding: 2px 10px; border-radius: 50px; font-size:10px; font-weight:600; background:rgba(5,150,105,0.18); color:#34d399; border:1px solid rgba(52,211,153,0.3); }
  .sbl-badge-red   { display:inline-block; padding: 2px 10px; border-radius: 50px; font-size:10px; font-weight:600; background:rgba(239,68,68,0.15); color:#f87171; border:1px solid rgba(248,113,113,0.3); }
  .sbl-badge-gray  { display:inline-block; padding: 2px 10px; border-radius: 50px; font-size:10px; font-weight:600; background:rgba(255,255,255,0.08); color:rgba(255,255,255,0.4); border:1px solid rgba(255,255,255,0.12); }
  .sbl-badge-amber { display:inline-block; padding: 2px 10px; border-radius: 50px; font-size:10px; font-weight:600; background:rgba(245,158,11,0.15); color:#fbbf24; border:1px solid rgba(251,191,36,0.3); }
  .sbl-badge-blue  { display:inline-block; padding: 2px 10px; border-radius: 50px; font-size:10px; font-weight:600; background:rgba(82,143,245,0.15); color:#93c5fd; border:1px solid rgba(147,197,253,0.3); }
  .sbl-badge-hot   { display:inline-block; padding: 2px 10px; border-radius: 50px; font-size:10px; font-weight:600; background:rgba(255,79,109,0.18); color:#ff4f6d; border:1px solid rgba(255,79,109,0.3); }
 
  /* ── DIVIDER ── */
  .sbl-divider {
    display: flex; align-items: center; gap: 10px;
    margin: 14px 0;
    font-size: 11px; color: rgba(255,255,255,0.3); letter-spacing:1px;
  }
  .sbl-divider::before, .sbl-divider::after {
    content:''; flex:1; height:1px;
    background: rgba(255,255,255,0.1);
  }
 
  /* ── TOAST-STYLE ALERTS ── */
  .sbl-alert-error {
    background: rgba(239,68,68,0.12);
    border: 1px solid rgba(239,68,68,0.3);
    color: #fca5a5;
    border-radius: 12px;
    padding: 10px 14px;
    font-size: 13px;
    margin-bottom: 12px;
  }
  .sbl-alert-success {
    background: rgba(5,150,105,0.12);
    border: 1px solid rgba(5,150,105,0.3);
    color: #6ee7b7;
    border-radius: 12px;
    padding: 10px 14px;
    font-size: 13px;
    margin-bottom: 12px;
  }
  .sbl-alert-info {
    background: rgba(108,59,255,0.12);
    border: 1px solid rgba(108,59,255,0.3);
    color: var(--brand-light);
    border-radius: 12px;
    padding: 10px 14px;
    font-size: 13px;
    margin-bottom: 12px;
  }
 
  /* ── ROW ITEM ── */
  .sbl-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 9px 0;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    font-size: 13px;
  }
  .sbl-row:last-child { border-bottom: none; }
  .sbl-row-label { color: var(--text-muted); }
  .sbl-row-value { font-weight: 500; color: #fff; }
 
  /* ── SELECT ── */
  .sbl-select {
    width: 100%;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 12px;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    padding: 12px 14px;
    outline: none;
    margin-bottom: 10px;
    appearance: none;
  }
  .sbl-select option { background: #1a0038; color: #fff; }
 
  /* ── LINK ── */
  .sbl-link {
    color: var(--brand-light);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 13px;
    padding: 0;
    text-decoration: none;
  }
  .sbl-link:hover { text-decoration: underline; }
 
  /* ── BACK BUTTON ── */
  .sbl-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: rgba(255,255,255,0.45);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 13px;
    padding: 0;
    margin-bottom: 16px;
    font-family: 'DM Sans', sans-serif;
    transition: color 0.2s;
  }
  .sbl-back:hover { color: rgba(255,255,255,0.85); }
 
  /* ── STAT MINI CARD ── */
  .sbl-stat {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px;
    padding: 14px 10px;
    text-align: center;
  }
  .sbl-stat-num { font-family: 'Bebas Neue', sans-serif; font-size: 26px; color: #fff; letter-spacing: 1px; }
  .sbl-stat-label { font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }
 
  /* ── SCROLLBAR ── */
  .sbl-root ::-webkit-scrollbar { width: 4px; }
  .sbl-root ::-webkit-scrollbar-track { background: transparent; }
  .sbl-root ::-webkit-scrollbar-thumb { background: rgba(108,59,255,0.4); border-radius: 4px; }
`;
 
// ── hideLogin: pass this prop to hide the Login button (e.g. on the Home/location page)
export default function SBLayout({ children, title, subtitle, showBack = false, backLabel = "Back", hideLogin = false }) {
  const navigate = useNavigate();
  const particlesRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
const [username, setUsername] = useState(localStorage.getItem("username"));
 
  // Inject CSS once
  useEffect(() => {
    if (!document.getElementById(LAYOUT_STYLE_ID)) {
      const tag = document.createElement("style");
      tag.id = LAYOUT_STYLE_ID;
      tag.textContent = css;
      document.head.appendChild(tag);
    }
  }, []);
 
  // Particles
  useEffect(() => {
    if (!particlesRef.current) return;
    const colors = ["#6c3bff", "#ff4f6d", "#ffd166", "#a07aff", "#ffffff"];
    const container = particlesRef.current;
    container.innerHTML = "";
    for (let i = 0; i < 20; i++) {
      const p = document.createElement("div");
      p.className = "sbl-particle";
      const size = Math.random() * 4 + 2;
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}%;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        animation-duration:${9 + Math.random() * 12}s;
        animation-delay:${Math.random() * 10}s;
      `;
      container.appendChild(p);
    }
  }, []);
 // Re-check login state whenever storage changes
useEffect(() => {
  const checkAuth = () => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    setUsername(localStorage.getItem("username"));
  };
  checkAuth();
  window.addEventListener("authChange", checkAuth);
  return () => window.removeEventListener("authChange", checkAuth);
}, []);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };
 
  return (
    <div className="sbl-root">
      {/* Animated background */}
      <div className="sbl-bg">
        <div className="sbl-bg-grad" />
        <div className="sbl-particles" ref={particlesRef} />
      </div>
 
      {/* Nav */}
      <nav className="sbl-nav">
        <div className="sbl-logo" onClick={() => navigate("/")}>
          <span className="sbl-logo-dot" />
          SMARTBOOK
        </div>
        <div className="sbl-nav-right">
          {username && (
            <span className="sbl-nav-user" onClick={() => navigate("/profile")}>
              👤 {username}
            </span>
          )}
          {isLoggedIn ? (
            <button className="sbl-nav-btn" onClick={handleLogout}>Logout</button>
          ) : (
            !hideLogin && <button className="sbl-nav-btn-accent" onClick={() => navigate("/")}>Login</button>
          )}
        </div>
      </nav>
 
      {/* Content */}
      <div className="sbl-content">
        {showBack && (
          <button className="sbl-back" onClick={() => navigate(-1)}>
            ← {backLabel}
          </button>
        )}
        {(title || subtitle) && (
          <div className="sbl-page-header">
            {subtitle && <div className="sbl-page-subtitle">{subtitle}</div>}
            {title && <h1 className="sbl-page-title">{title}</h1>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}