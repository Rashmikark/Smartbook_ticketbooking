import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&display=swap');

  :root {
    --brand: #6c3bff;
    --brand-light: #a07aff;
    --brand-dark: #4a1fa8;
    --accent: #ff4f6d;
    --gold: #ffd166;
  }

  .sb-body { font-family: 'DM Sans', sans-serif; background: #0a0010; color: #fff; overflow-x: hidden; min-height: 100vh; }

  .sb-hero { position: relative; width: 100%; height: 100vh; min-height: 600px; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; }
  .sb-hero-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.4; z-index: 0; }
  .sb-hero-fallback { position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 20% 40%, #6c3bff55 0%, transparent 60%), radial-gradient(ellipse 60% 70% at 80% 60%, #ff4f6d44 0%, transparent 60%), radial-gradient(ellipse 100% 80% at 50% 0%, #1a003a 0%, #0a0010 100%); z-index: 0; animation: sbBgPulse 8s ease-in-out infinite alternate; }
  @keyframes sbBgPulse { 0%{filter:brightness(1)} 100%{filter:brightness(1.3)} }
  .sb-particles { position: absolute; inset: 0; pointer-events: none; z-index: 1; overflow: hidden; }
  .sb-particle { position: absolute; border-radius: 50%; animation: sbFloat linear infinite; opacity: 0; }
  @keyframes sbFloat { 0%{transform:translateY(110vh) scale(0.5);opacity:0} 10%{opacity:0.6} 90%{opacity:0.3} 100%{transform:translateY(-10vh) scale(1);opacity:0} }
  .sb-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(10,0,16,0.3) 0%, rgba(10,0,16,0.1) 50%, rgba(10,0,16,0.9) 100%); z-index: 2; }

  .sb-nav { position: absolute; top: 0; left: 0; right: 0; z-index: 10; display: flex; align-items: center; justify-content: space-between; padding: 20px 48px; }
  .sb-logo { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 2px; color: #fff; text-decoration: none; display: flex; align-items: center; gap: 10px; cursor: pointer; }
  .sb-logo-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: var(--accent); animation: sbBlink 1.4s ease-in-out infinite; }
  @keyframes sbBlink { 0%,100%{opacity:1} 50%{opacity:0.2} }
  .sb-nav-actions { display: flex; align-items: center; gap: 14px; }
  .sb-btn-ghost { background: transparent; border: 1.5px solid rgba(255,255,255,0.4); color: #fff; padding: 9px 22px; border-radius: 50px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
  .sb-btn-ghost:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.7); }
  .sb-btn-primary { background: var(--accent); border: none; color: #fff; padding: 10px 26px; border-radius: 50px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 20px rgba(255,79,109,0.4); }
  .sb-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(255,79,109,0.55); }

  .sb-hero-content { position: relative; z-index: 5; text-align: center; padding: 0 24px; max-width: 800px; animation: sbFadeUp 0.9s ease-out both; }
  @keyframes sbFadeUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
  .sb-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(108,59,255,0.25); border: 1px solid rgba(160,122,255,0.4); color: var(--brand-light); font-size: 12px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; padding: 6px 16px; border-radius: 50px; margin-bottom: 28px; }
  .sb-badge-dot { display: inline-block; width: 6px; height: 6px; background: var(--brand-light); border-radius: 50%; animation: sbBlink 1.4s ease-in-out infinite; }
  .sb-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(56px, 10vw, 110px); line-height: 0.92; letter-spacing: 2px; color: #fff; margin-bottom: 12px; text-shadow: 0 0 80px rgba(108,59,255,0.5); }
  .sb-title-accent { color: var(--accent); text-shadow: 0 0 60px rgba(255,79,109,0.6); }
  .sb-subtitle { font-size: 17px; font-weight: 300; color: rgba(255,255,255,0.65); margin-bottom: 40px; line-height: 1.6; max-width: 500px; margin-left: auto; margin-right: auto; }
  .sb-cta-group { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
  .sb-btn-cta-main { background: linear-gradient(135deg, #6c3bff, #ff4f6d); border: none; color: #fff; padding: 16px 38px; border-radius: 50px; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.25s; box-shadow: 0 8px 32px rgba(108,59,255,0.4); }
  .sb-btn-cta-main:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 12px 40px rgba(108,59,255,0.55); }
  .sb-btn-cta-sec { background: rgba(255,255,255,0.1); border: 1.5px solid rgba(255,255,255,0.3); color: #fff; padding: 16px 38px; border-radius: 50px; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 500; cursor: pointer; transition: all 0.25s; backdrop-filter: blur(8px); }
  .sb-btn-cta-sec:hover { background: rgba(255,255,255,0.18); }
  .sb-scroll-hint { position: absolute; bottom: 36px; left: 50%; transform: translateX(-50%); z-index: 5; display: flex; flex-direction: column; align-items: center; gap: 8px; color: rgba(255,255,255,0.4); font-size: 11px; letter-spacing: 2px; text-transform: uppercase; animation: sbBounce 2s ease-in-out infinite; }
  .sb-scroll-hint::after { content: ''; display: block; width: 1px; height: 40px; background: linear-gradient(to bottom, rgba(255,255,255,0.4), transparent); }
  @keyframes sbBounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(8px)} }

  .sb-stats { background: rgba(255,255,255,0.06); backdrop-filter: blur(16px); border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: center; }
  .sb-stat-item { padding: 22px 48px; text-align: center; border-right: 1px solid rgba(255,255,255,0.1); flex: 1; max-width: 220px; }
  .sb-stat-item:last-child { border-right: none; }
  .sb-stat-num { font-family: 'Bebas Neue', sans-serif; font-size: 32px; color: #fff; letter-spacing: 1px; }
  .sb-stat-label { font-size: 12px; color: rgba(255,255,255,0.45); letter-spacing: 1px; text-transform: uppercase; margin-top: 2px; }

  /* ══ ABOUT / WHY US SECTION ══ */
  .sb-about { padding: 90px 48px; max-width: 1200px; margin: 0 auto; }
  .sb-about-header { text-align: center; margin-bottom: 64px; }
  .sb-about-eyebrow { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,79,109,0.15); border: 1px solid rgba(255,79,109,0.3); color: var(--accent); font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; padding: 6px 16px; border-radius: 50px; margin-bottom: 20px; }
  .sb-about-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(36px, 5vw, 58px); letter-spacing: 2px; line-height: 1; margin-bottom: 16px; }
  .sb-about-title span { color: var(--brand-light); }
  .sb-about-desc { font-size: 16px; font-weight: 300; color: rgba(255,255,255,0.55); max-width: 560px; margin: 0 auto; line-height: 1.75; }

  /* Story / Timeline strip */
  .sb-story-strip { display: flex; gap: 0; margin-bottom: 72px; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); }
  .sb-story-step { flex: 1; padding: 32px 24px; background: rgba(255,255,255,0.03); position: relative; transition: background 0.25s; }
  .sb-story-step:hover { background: rgba(108,59,255,0.1); }
  .sb-story-step:not(:last-child)::after { content: '›'; position: absolute; right: -10px; top: 50%; transform: translateY(-50%); font-size: 24px; color: rgba(255,255,255,0.2); z-index: 2; }
  .sb-story-step:not(:last-child) { border-right: 1px solid rgba(255,255,255,0.08); }
  .sb-story-num { font-family: 'Bebas Neue', sans-serif; font-size: 44px; color: rgba(108,59,255,0.35); letter-spacing: 1px; line-height: 1; margin-bottom: 8px; }
  .sb-story-title { font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 6px; letter-spacing: 0.5px; }
  .sb-story-text { font-size: 13px; color: rgba(255,255,255,0.45); line-height: 1.6; }

  /* Feature cards grid */
  .sb-features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 72px; }
  .sb-feat-box { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); border-radius: 20px; padding: 30px 24px; position: relative; overflow: hidden; transition: all 0.3s; cursor: default; }
  .sb-feat-box::before { content: ''; position: absolute; inset: 0; background: var(--feat-glow); opacity: 0; transition: opacity 0.3s; border-radius: 20px; }
  .sb-feat-box:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.18); }
  .sb-feat-box:hover::before { opacity: 1; }
  .sb-feat-box-icon { font-size: 36px; margin-bottom: 16px; display: block; }
  .sb-feat-box-title { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 1px; color: #fff; margin-bottom: 8px; }
  .sb-feat-box-text { font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.65; }
  .sb-feat-box-badge { display: inline-block; margin-top: 14px; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--feat-color); background: var(--feat-bg); padding: 4px 12px; border-radius: 50px; border: 1px solid var(--feat-border); }

  /* Trust / partners strip */
  .sb-trust-strip { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 36px 40px; margin-bottom: 72px; }
  .sb-trust-label { font-size: 11px; font-weight: 700; letter-spacing: 2px; color: rgba(255,255,255,0.3); text-transform: uppercase; text-align: center; margin-bottom: 24px; }
  .sb-trust-logos { display: flex; gap: 32px; justify-content: center; align-items: center; flex-wrap: wrap; }
  .sb-trust-logo { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 50px; padding: 10px 20px; font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.5); letter-spacing: 0.5px; white-space: nowrap; transition: all 0.2s; }
  .sb-trust-logo:hover { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.85); }
  .sb-trust-logo-icon { font-size: 20px; }

  /* Testimonials */
  .sb-testimonials { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 72px; }
  .sb-testi-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); border-radius: 18px; padding: 24px; transition: all 0.25s; }
  .sb-testi-card:hover { transform: translateY(-3px); border-color: rgba(160,122,255,0.3); background: rgba(108,59,255,0.07); }
  .sb-testi-stars { color: var(--gold); font-size: 14px; margin-bottom: 14px; letter-spacing: 2px; }
  .sb-testi-text { font-size: 14px; color: rgba(255,255,255,0.65); line-height: 1.7; margin-bottom: 18px; font-style: italic; }
  .sb-testi-author { display: flex; align-items: center; gap: 12px; }
  .sb-testi-avatar { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
  .sb-testi-name { font-size: 14px; font-weight: 600; color: #fff; }
  .sb-testi-meta { font-size: 12px; color: rgba(255,255,255,0.35); }

  /* How it works */
  .sb-how-section { background: linear-gradient(135deg, rgba(108,59,255,0.08) 0%, rgba(255,79,109,0.05) 100%); border: 1px solid rgba(108,59,255,0.2); border-radius: 28px; padding: 48px 40px; margin-bottom: 72px; }
  .sb-how-title { font-family: 'Bebas Neue', sans-serif; font-size: 38px; letter-spacing: 1.5px; text-align: center; margin-bottom: 6px; }
  .sb-how-sub { text-align: center; color: rgba(255,255,255,0.4); font-size: 14px; margin-bottom: 40px; }
  .sb-how-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
  .sb-how-step { text-align: center; }
  .sb-how-step-icon-wrap { position: relative; display: inline-block; margin-bottom: 16px; }
  .sb-how-step-num { position: absolute; top: -6px; right: -8px; background: var(--accent); color: #fff; font-family: 'Bebas Neue', sans-serif; font-size: 14px; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .sb-how-step-icon { width: 64px; height: 64px; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 28px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); margin: 0 auto; }
  .sb-how-step-title { font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 6px; }
  .sb-how-step-text { font-size: 13px; color: rgba(255,255,255,0.45); line-height: 1.55; }

  /* CTA Banner */
  .sb-cta-banner { position: relative; border-radius: 28px; overflow: hidden; padding: 56px 48px; text-align: center; margin-bottom: 16px; }
  .sb-cta-banner-bg { position: absolute; inset: 0; background: linear-gradient(135deg, #3a1580 0%, #6c3bff 40%, #ff4f6d 100%); }
  .sb-cta-banner-glow { position: absolute; inset: 0; background: radial-gradient(ellipse 60% 80% at 50% 0%, rgba(255,255,255,0.15) 0%, transparent 70%); }
  .sb-cta-banner-content { position: relative; z-index: 2; }
  .sb-cta-banner-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(32px,5vw,52px); letter-spacing: 2px; margin-bottom: 12px; text-shadow: 0 4px 20px rgba(0,0,0,0.3); }
  .sb-cta-banner-sub { font-size: 16px; color: rgba(255,255,255,0.8); margin-bottom: 32px; font-weight: 300; }
  .sb-cta-banner-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
  .sb-cta-banner-btn-white { background: #fff; color: #3a1580; border: none; padding: 14px 36px; border-radius: 50px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
  .sb-cta-banner-btn-white:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.3); }
  .sb-cta-banner-btn-outline { background: transparent; color: #fff; border: 2px solid rgba(255,255,255,0.5); padding: 14px 36px; border-radius: 50px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
  .sb-cta-banner-btn-outline:hover { background: rgba(255,255,255,0.15); border-color: #fff; }

  .sb-section { padding: 80px 48px; max-width: 1200px; margin: 0 auto; }
  .sb-section-title { font-family: 'Bebas Neue', sans-serif; font-size: 44px; letter-spacing: 1.5px; margin-bottom: 8px; }
  .sb-section-sub { color: rgba(255,255,255,0.45); font-size: 15px; margin-bottom: 40px; }

  .sb-cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; }
  .sb-cat-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 18px; padding: 28px 20px; text-align: center; cursor: pointer; transition: all 0.25s; position: relative; overflow: hidden; }
  .sb-cat-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.25); background: rgba(255,255,255,0.09); }
  .sb-cat-icon { font-size: 36px; margin-bottom: 14px; display: block; transition: transform 0.25s; }
  .sb-cat-card:hover .sb-cat-icon { transform: scale(1.15); }
  .sb-cat-name { font-size: 15px; font-weight: 500; color: #fff; }
  .sb-cat-count { font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 4px; }

  .sb-featured-grid { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; }
  .sb-feat-card { border-radius: 18px; overflow: hidden; position: relative; min-height: 300px; cursor: pointer; transition: transform 0.25s; }
  .sb-feat-card:hover { transform: scale(1.02); }
  .sb-feat-card.large { min-height: 380px; }
  .sb-fc-bg { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 80px; }
  .sb-fc-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.1) 60%); }
  .sb-fc-info { position: absolute; bottom: 0; left: 0; right: 0; padding: 24px; }
  .sb-fc-tag { display: inline-block; background: var(--accent); color: #fff; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 4px 10px; border-radius: 50px; margin-bottom: 10px; }
  .sb-fc-title { font-family: 'Bebas Neue', sans-serif; font-size: 26px; letter-spacing: 1px; line-height: 1; margin-bottom: 6px; }
  .sb-feat-card.large .sb-fc-title { font-size: 38px; }
  .sb-fc-meta { font-size: 12px; color: rgba(255,255,255,0.55); }
  .sb-fc-tap-hint { font-size: 10px; color: rgba(255,255,255,0.3); margin-top: 6px; letter-spacing: 1px; }

  /* ── LOGIN MODAL ── */
  .sb-modal-backdrop { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(12px); z-index: 1000; align-items: center; justify-content: center; }
  .sb-modal-backdrop.open { display: flex; animation: sbFadeIn 0.2s ease; }
  @keyframes sbFadeIn { from{opacity:0} to{opacity:1} }
  .sb-modal { background: rgba(20,5,40,0.97); border: 1px solid rgba(255,255,255,0.15); border-radius: 24px; width: min(440px, 92vw); padding: 40px 36px; position: relative; animation: sbModalUp 0.3s cubic-bezier(0.34,1.56,0.64,1) both; max-height: 90vh; overflow-y: auto; }
  @keyframes sbModalUp { from{opacity:0;transform:translateY(24px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
  .sb-modal-close { position: absolute; top: 18px; right: 20px; background: rgba(255,255,255,0.1); border: none; color: rgba(255,255,255,0.6); width: 32px; height: 32px; border-radius: 50%; font-size: 18px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
  .sb-modal-close:hover { background: rgba(255,255,255,0.2); color: #fff; }
  .sb-modal-logo { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 2px; color: #fff; text-align: center; margin-bottom: 6px; }
  .sb-modal-tagline { text-align: center; color: rgba(255,255,255,0.4); font-size: 13px; margin-bottom: 28px; }
  .sb-tab-row { display: flex; background: rgba(255,255,255,0.06); border-radius: 50px; padding: 4px; margin-bottom: 28px; }
  .sb-tab-btn { flex: 1; background: transparent; border: none; color: rgba(255,255,255,0.45); font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; padding: 10px; border-radius: 50px; cursor: pointer; transition: all 0.2s; }
  .sb-tab-btn.active { background: var(--brand); color: #fff; box-shadow: 0 4px 16px rgba(108,59,255,0.4); }
  .sb-modal h2 { font-family: 'Bebas Neue', sans-serif; font-size: 34px; letter-spacing: 1px; margin-bottom: 6px; color: #fff; }
  .sb-modal-hint { color: rgba(255,255,255,0.45); font-size: 14px; margin-bottom: 24px; }
  .sb-form-group { margin-bottom: 16px; }
  .sb-form-label { display: block; font-size: 12px; font-weight: 500; letter-spacing: 1px; color: rgba(255,255,255,0.5); text-transform: uppercase; margin-bottom: 8px; }
  .sb-form-input { width: 100%; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 15px; padding: 14px 16px; outline: none; transition: border-color 0.2s, background 0.2s; box-sizing: border-box; }
  .sb-form-input::placeholder { color: rgba(255,255,255,0.25); }
  .sb-form-input:focus { border-color: var(--brand-light); background: rgba(108,59,255,0.12); }
  .sb-form-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
  .sb-form-check { display: flex; align-items: center; gap: 8px; font-size: 13px; color: rgba(255,255,255,0.5); cursor: pointer; }
  .sb-form-check input { accent-color: var(--brand); }
  .sb-form-link { font-size: 13px; color: var(--brand-light); background: none; border: none; cursor: pointer; padding: 0; }
  .sb-form-link:hover { text-decoration: underline; }
  .sb-btn-login { width: 100%; background: linear-gradient(135deg, #6c3bff, #ff4f6d); border: none; color: #fff; padding: 16px; border-radius: 50px; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.25s; box-shadow: 0 8px 28px rgba(108,59,255,0.4); margin-bottom: 20px; }
  .sb-btn-login:hover { transform: translateY(-1px); box-shadow: 0 12px 36px rgba(108,59,255,0.55); }
  .sb-btn-login:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .sb-divider { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
  .sb-divider::before, .sb-divider::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.12); }
  .sb-divider span { font-size: 12px; color: rgba(255,255,255,0.35); letter-spacing: 1px; }
  .sb-social-btns { display: flex; gap: 10px; margin-bottom: 22px; }
  .sb-btn-social { flex: 1; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.7); padding: 11px; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .sb-btn-social:hover { background: rgba(255,255,255,0.13); border-color: rgba(255,255,255,0.3); color: #fff; }
  .sb-modal-footer { text-align: center; font-size: 13px; color: rgba(255,255,255,0.4); }
  .sb-modal-footer button { color: var(--brand-light); background: none; border: none; cursor: pointer; font-size: 13px; padding: 0; }
  .sb-modal-footer button:hover { text-decoration: underline; }

  /* ── OTP ── */
  .sb-otp-box { background: rgba(108,59,255,0.1); border: 1px solid rgba(108,59,255,0.4); border-radius: 16px; padding: 20px; margin-bottom: 20px; text-align: center; }
  .sb-otp-icon { font-size: 40px; margin-bottom: 10px; }
  .sb-otp-title { font-family: 'Bebas Neue', sans-serif; font-size: 26px; letter-spacing: 1px; margin-bottom: 6px; }
  .sb-otp-desc { font-size: 13px; color: rgba(255,255,255,0.5); margin-bottom: 20px; line-height: 1.5; }
  .sb-otp-inputs { display: flex; gap: 10px; justify-content: center; margin-bottom: 16px; }
  .sb-otp-digit { width: 46px; height: 54px; background: rgba(255,255,255,0.07); border: 2px solid rgba(255,255,255,0.15); border-radius: 12px; color: #fff; font-size: 22px; font-weight: 700; text-align: center; outline: none; font-family: 'DM Sans', sans-serif; transition: border-color 0.2s; }
  .sb-otp-digit:focus { border-color: var(--brand-light); background: rgba(108,59,255,0.2); }
  .sb-otp-timer { font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 10px; }
  .sb-otp-resend { font-size: 13px; color: var(--brand-light); background: none; border: none; cursor: pointer; padding: 0; }
  .sb-otp-resend:disabled { color: rgba(255,255,255,0.3); cursor: not-allowed; }
  .sb-demo-otp { background: rgba(255,209,102,0.12); border: 1px solid rgba(255,209,102,0.3); border-radius: 10px; padding: 10px 14px; font-size: 13px; color: var(--gold); margin-bottom: 16px; text-align: center; }
  .sb-back-btn { background: transparent; border: none; color: rgba(255,255,255,0.4); font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; padding: 0; margin-bottom: 16px; display: flex; align-items: center; gap: 6px; }
  .sb-back-btn:hover { color: rgba(255,255,255,0.8); }

  /* ── FEATURED DETAIL MODAL ── */
  .sb-detail-backdrop { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(16px); z-index: 2000; align-items: center; justify-content: center; padding: 20px; }
  .sb-detail-backdrop.open { display: flex; animation: sbFadeIn 0.25s ease; }
  .sb-detail-modal { background: rgba(12,2,28,0.98); border: 1px solid rgba(255,255,255,0.12); border-radius: 28px; width: min(680px, 96vw); max-height: 88vh; overflow-y: auto; position: relative; animation: sbModalUp 0.35s cubic-bezier(0.34,1.4,0.64,1) both; }
  .sb-detail-hero { position: relative; height: 220px; overflow: hidden; border-radius: 28px 28px 0 0; }
  .sb-detail-hero-bg { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 100px; }
  .sb-detail-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(12,2,28,0.95) 100%); }
  .sb-detail-hero-content { position: absolute; bottom: 0; left: 0; right: 0; padding: 24px 28px; }
  .sb-detail-tag { display: inline-block; background: var(--accent); color: #fff; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 4px 12px; border-radius: 50px; margin-bottom: 8px; }
  .sb-detail-title { font-family: 'Bebas Neue', sans-serif; font-size: 42px; letter-spacing: 2px; line-height: 1; color: #fff; margin-bottom: 4px; text-shadow: 0 0 40px rgba(108,59,255,0.5); }
  .sb-detail-subtitle { font-size: 13px; color: rgba(255,255,255,0.5); }
  .sb-detail-body { padding: 24px 28px 32px; }
  .sb-detail-close { position: absolute; top: 16px; right: 16px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.7); width: 36px; height: 36px; border-radius: 50%; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10; transition: all 0.2s; }
  .sb-detail-close:hover { background: rgba(255,255,255,0.15); color: #fff; }
  .sb-detail-desc { font-size: 15px; line-height: 1.75; color: rgba(255,255,255,0.75); margin-bottom: 24px; }
  .sb-detail-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 24px; }
  .sb-detail-stat { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 14px 10px; text-align: center; }
  .sb-detail-stat-num { font-family: 'Bebas Neue', sans-serif; font-size: 24px; color: var(--brand-light); letter-spacing: 1px; }
  .sb-detail-stat-label { font-size: 11px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }
  .sb-detail-section-title { font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 1px; color: rgba(255,255,255,0.8); margin-bottom: 12px; }
  .sb-detail-highlights { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
  .sb-detail-highlight { display: flex; gap: 12px; align-items: flex-start; }
  .sb-detail-highlight-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
  .sb-detail-highlight-text { font-size: 14px; color: rgba(255,255,255,0.65); line-height: 1.5; }
  .sb-detail-images { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 24px; }
  .sb-detail-img-box { aspect-ratio: 4/3; border-radius: 12px; overflow: hidden; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 36px; position: relative; }
  .sb-detail-img-box img { width: 100%; height: 100%; object-fit: cover; }
  .sb-detail-img-label { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); padding: 8px 10px; font-size: 10px; color: rgba(255,255,255,0.7); }
  .sb-detail-book-btn { width: 100%; background: linear-gradient(135deg, #6c3bff, #ff4f6d); border: none; color: #fff; padding: 16px; border-radius: 50px; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.25s; box-shadow: 0 8px 28px rgba(108,59,255,0.4); }
  .sb-detail-book-btn:hover { transform: translateY(-1px); box-shadow: 0 12px 36px rgba(108,59,255,0.55); }
  .sb-detail-tags-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
  .sb-detail-pill { display: inline-block; background: rgba(108,59,255,0.2); border: 1px solid rgba(160,122,255,0.3); color: var(--brand-light); font-size: 11px; font-weight: 500; padding: 4px 12px; border-radius: 50px; }

  /* ── FOOTER ── */
  .sb-footer { background: #06000f; border-top: 1px solid rgba(255,255,255,0.07); padding: 48px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; }
  .sb-footer-brand { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 2px; }
  .sb-footer-copy { font-size: 13px; color: rgba(255,255,255,0.3); }
  .sb-footer-links { display: flex; gap: 24px; }
  .sb-footer-links a { color: rgba(255,255,255,0.4); text-decoration: none; font-size: 13px; }
  .sb-footer-links a:hover { color: rgba(255,255,255,0.8); }

  @media (max-width: 900px) {
    .sb-features-grid { grid-template-columns: 1fr 1fr; }
    .sb-how-steps { grid-template-columns: repeat(2, 1fr); }
    .sb-testimonials { grid-template-columns: 1fr; }
    .sb-story-strip { flex-direction: column; }
    .sb-story-step:not(:last-child)::after { content: '↓'; right: auto; left: 50%; top: auto; bottom: -14px; transform: translateX(-50%); }
  }

  @media (max-width: 768px) {
    .sb-nav { padding: 16px 20px; }
    .sb-section { padding: 60px 20px; }
    .sb-about { padding: 60px 20px; }
    .sb-featured-grid { grid-template-columns: 1fr; }
    .sb-stat-item { padding: 16px 14px; }
    .sb-footer { padding: 32px 20px; flex-direction: column; text-align: center; }
    .sb-detail-stats { grid-template-columns: repeat(3,1fr); }
    .sb-detail-images { grid-template-columns: repeat(2,1fr); }
    .sb-features-grid { grid-template-columns: 1fr; }
    .sb-how-steps { grid-template-columns: 1fr 1fr; }
    .sb-trust-logos { gap: 12px; }
    .sb-how-section { padding: 36px 20px; }
    .sb-cta-banner { padding: 40px 24px; }
  }
`;

// ── Rich content for each featured card ──
const FEATURED_DETAIL = {
  "KALKI 2898 AD": {
    tag: "Now Showing",
    bg: "linear-gradient(135deg,#1a0038,#4a0080)",
    icon: "🎬",
    subtitle: "Action · Sci-Fi | 3h 1m | Tamil, Hindi, Telugu",
    desc: "Kalki 2898 AD is a monumental sci-fi epic that reimagines the ancient Hindu prophecy of Kalki — the 10th and final avatar of Lord Vishnu — in a distant dystopian future. Set in the year 2898, the film blends mythology with futuristic technology, pitting an immortal warrior against a godlike villain in a battle for humanity's survival. Directed by Nag Ashwin, this is one of the most ambitious Indian films ever made.",
    stats: [
      { num: "₹1000Cr+", label: "Box Office" },
      { num: "8.4★", label: "IMDb Rating" },
      { num: "3h 1m", label: "Duration" },
    ],
    highlights: [
      { icon: "🕉️", text: "Based on the Kalki Avatar prophecy from Hindu scriptures — the warrior who arrives at the end of the Kali Yuga to destroy evil and restore dharma." },
      { icon: "🌍", text: "Set in Kasi (Varanasi) in 2898 AD — a dystopian world ruled by Supreme Yaskin who hunts a pregnant woman believed to carry the chosen one." },
      { icon: "⚔️", text: "Prabhas plays Bhairava, a mercenary and bounty hunter with a hilarious and complex arc — teaming up with Deepika Padukone's character SUM-80." },
      { icon: "🎭", text: "Amitabh Bachchan as Ashwatthama, the immortal warrior from Mahabharata, who has waited 6000 years to protect the chosen one." },
      { icon: "🏆", text: "Broke multiple box office records — one of the highest-grossing Indian films of all time. A sequel (Kalki 2898 AD Part 2) is in production." },
    ],
    images: [
      { emoji: "🎬", label: "Bhairava in Kasi" },
      { emoji: "🏛️", label: "Futuristic Kasi 2898" },
      { emoji: "⚡", label: "Kalki Avatar Awakening" },
    ],
    pills: ["Prabhas", "Deepika Padukone", "Amitabh Bachchan", "Kamal Haasan", "Pan-India", "Mythology"],
    bookLabel: "Book Tickets — Kalki 2898 AD",
  },
  "IPL 2026": {
    tag: "Live Soon",
    bg: "linear-gradient(135deg,#001a40,#003380)",
    icon: "🏏",
    subtitle: "Cricket · IPL Season 19 · Chennai",
    desc: "The Indian Premier League 2026 is back with the most thrilling edition yet! The fiercest rivalry in T20 cricket — Chennai Super Kings vs Mumbai Indians — returns to the iconic MA Chidambaram Stadium. Two of the most decorated franchises, two passionate fanbases, and one electric atmosphere. This is not just a cricket match — it's a festival!",
    stats: [
      { num: "5x", label: "CSK Titles" },
      { num: "5x", label: "MI Titles" },
      { num: "50K+", label: "Capacity" },
    ],
    highlights: [
      { icon: "🏆", text: "CSK vs MI is the most-watched rivalry in IPL history — called 'El Clásico of Indian Cricket'. Both teams have won 5 IPL titles each." },
      { icon: "🦁", text: "Chennai Super Kings — led by the legendary MS Dhoni — are playing on home turf at Chepauk. The crowd noise here is unlike anywhere else." },
      { icon: "💙", text: "Mumbai Indians boast superstars like Rohit Sharma, Hardik Pandya and Jasprit Bumrah — making them the most feared T20 side in the world." },
      { icon: "🔥", text: "Previous CSK vs MI encounters have produced last-ball finishes, super overs and unforgettable moments that cricket fans replay for years." },
      { icon: "🎉", text: "Live entertainment, team anthems, cheerleaders, fireworks at every boundary — IPL is as much a concert as it is a cricket match!" },
    ],
    images: [
      { emoji: "🏟️", label: "MA Chidambaram Stadium" },
      { emoji: "🦁", label: "CSK Yellow Army" },
      { emoji: "💙", label: "MI Blue Wave" },
    ],
    pills: ["MS Dhoni", "Rohit Sharma", "T20 Cricket", "Chepauk", "IPL Season 19", "Live"],
    bookLabel: "Book Match Tickets — IPL 2026",
  },
  "AR RAHMAN LIVE": {
    tag: "Tonight",
    bg: "linear-gradient(135deg,#1a1000,#503000)",
    icon: "🎵",
    subtitle: "Concert · Bengaluru · World Tour 2026",
    desc: "Allah Rakha Rahman — Oscar winner, Grammy laureate, and the Mozart of Madras — brings his breathtaking live concert experience to Bengaluru. Known for weaving Indian classical, Sufi, folk and Western orchestral music into one seamless tapestry, an AR Rahman live show is not just a concert — it's a spiritual experience. He has performed for over 100 million people across 6 continents.",
    stats: [
      { num: "2 Oscars", label: "Academy Awards" },
      { num: "150+", label: "Film Scores" },
      { num: "100M+", label: "Fans Worldwide" },
    ],
    highlights: [
      { icon: "🎵", text: "Expect timeless classics — Jai Ho, Roja, Dil Se, Tere Bina, Kun Faya Kun, Humma Humma, Vande Mataram and many more across 3 electrifying hours." },
      { icon: "🏆", text: "Winner of 2 Academy Awards (Best Original Score & Best Original Song) for Slumdog Millionaire — the first Indian to achieve this milestone." },
      { icon: "🎼", text: "Rahman's live concerts feature a 60-piece orchestra, Sufi vocalists, classical dancers and mind-blowing light shows synced to every beat." },
      { icon: "🌍", text: "Previous concerts in Chennai, Delhi and Mumbai sold out in minutes. His Jai Ho world tour (2014) remains one of the highest-grossing concert tours by an Indian artist." },
      { icon: "🎤", text: "Special guest vocalists including Shreya Ghoshal, Haricharan and his daughter Khatija Rahman are expected to join on stage." },
    ],
    images: [
      { emoji: "🎼", label: "Rahman on Stage" },
      { emoji: "🎻", label: "Live Orchestra" },
      { emoji: "✨", label: "Light Show" },
    ],
    pills: ["AR Rahman", "Oscar Winner", "Live Orchestra", "Sufi Music", "World Tour 2026", "Bengaluru"],
    bookLabel: "Book Concert Tickets — AR Rahman Live",
  },
};

const CATEGORIES = [
  { icon: "🎬", name: "Movies",      count: "340+ shows today", color: "#ff4f6d" },
  { icon: "🎵", name: "Concerts",    count: "52 upcoming",      color: "#6c3bff" },
  { icon: "🏏", name: "Sports",      count: "18 matches",       color: "#ffd166" },
  { icon: "🎭", name: "Theatre",     count: "24 shows",         color: "#06d6a0" },
  { icon: "🎪", name: "Comedy",      count: "30+ gigs",         color: "#ef476f" },
  { icon: "🎡", name: "Experiences", count: "80+ activities",   color: "#118ab2" },
];

const FEATURED = [
  { large: true,  bg: "linear-gradient(135deg,#1a0038,#4a0080)", icon: "🎬", tag: "Now Showing", title: "KALKI 2898 AD",  meta: "Action · Sci-Fi | 3h 1m | Tamil, Hindi, Telugu" },
  { large: false, bg: "linear-gradient(135deg,#001a40,#003380)", icon: "🏏", tag: "Live Soon",   title: "IPL 2026",       meta: "Cricket · Chennai" },
  { large: false, bg: "linear-gradient(135deg,#1a1000,#503000)", icon: "🎵", tag: "Tonight",     title: "AR RAHMAN LIVE", meta: "Concert · Bengaluru" },
];

const STATS = [
  { num: "50K+", label: "Events Listed" },
  { num: "2M+",  label: "Tickets Booked" },
  { num: "28",   label: "States Covered" },
  { num: "4.8★", label: "App Rating" },
];

// ── About Section Data ──
const FEATURES = [
  {
    icon: "⚡",
    title: "Instant Confirmation",
    text: "No more waiting. Tickets confirmed in under 3 seconds with real-time seat availability across 3,000+ venues nationwide.",
    badge: "3-sec booking",
    color: "#ffd166",
    bg: "rgba(255,209,102,0.08)",
    border: "rgba(255,209,102,0.25)",
    glow: "radial-gradient(ellipse at 0% 0%, rgba(255,209,102,0.08), transparent 70%)",
  },
  {
    icon: "🎟️",
    title: "Best Seat Guarantee",
    text: "Our smart seat picker shows you exactly what you'll see from every row. Pick your spot with full confidence — no surprises.",
    badge: "AI-powered",
    color: "#a07aff",
    bg: "rgba(108,59,255,0.08)",
    border: "rgba(160,122,255,0.25)",
    glow: "radial-gradient(ellipse at 0% 0%, rgba(108,59,255,0.1), transparent 70%)",
  },
  {
    icon: "💰",
    title: "Zero Hidden Charges",
    text: "The price you see is the price you pay. We show all fees upfront — no booking fee surprise at checkout. Ever.",
    badge: "100% transparent",
    color: "#06d6a0",
    bg: "rgba(6,214,160,0.08)",
    border: "rgba(6,214,160,0.25)",
    glow: "radial-gradient(ellipse at 0% 0%, rgba(6,214,160,0.08), transparent 70%)",
  },
  {
    icon: "🔒",
    title: "Secure & Trusted",
    text: "Bank-grade encryption on every transaction. Your data is protected with 256-bit SSL, and we're PCI DSS compliant.",
    badge: "256-bit SSL",
    color: "#ff4f6d",
    bg: "rgba(255,79,109,0.08)",
    border: "rgba(255,79,109,0.25)",
    glow: "radial-gradient(ellipse at 0% 0%, rgba(255,79,109,0.08), transparent 70%)",
  },
  {
    icon: "📱",
    title: "One App, All Events",
    text: "Movies, cricket, concerts, comedy nights — manage all your tickets in one place. Apple Wallet & Google Pay supported.",
    badge: "All-in-one",
    color: "#118ab2",
    bg: "rgba(17,138,178,0.08)",
    border: "rgba(17,138,178,0.25)",
    glow: "radial-gradient(ellipse at 0% 0%, rgba(17,138,178,0.08), transparent 70%)",
  },
  {
    icon: "🎁",
    title: "Rewards Every Booking",
    text: "Earn SmartCoins on every ticket. Redeem them for discounts, priority access and exclusive member-only offers.",
    badge: "SmartCoins",
    color: "#ef476f",
    bg: "rgba(239,71,111,0.08)",
    border: "rgba(239,71,111,0.25)",
    glow: "radial-gradient(ellipse at 0% 0%, rgba(239,71,111,0.08), transparent 70%)",
  },
];

const STORY_STEPS = [
  { num: "2019", title: "Founded in Chennai", text: "SmartBook started as a 3-person startup with one goal: make live events accessible to every Indian." },
  { num: "2021", title: "Crossed 500K Users", text: "After partnering with 200+ cinemas and stadiums, we hit 500,000 happy users in just 18 months." },
  { num: "2023", title: "Expanded Pan-India", text: "Launched in all 28 states, covering concerts, sports, theatre and experiences — not just movies." },
  { num: "2026", title: "2M+ Tickets & Growing", text: "Today we're India's fastest-growing event ticketing platform, loved by fans across the country." },
];

const TESTIMONIALS = [
  {
    stars: "★★★★★",
    text: "Booked IPL tickets in literally 45 seconds. Seat view was exactly as shown. This is how ticket booking should feel.",
    name: "Arjun Menon",
    meta: "Chennai · Sports Fan",
    avatar: "🦁",
    avatarBg: "rgba(255,209,102,0.2)",
  },
  {
    stars: "★★★★★",
    text: "Finally an app that shows the real total price upfront. No nasty surprise at checkout. Booked AR Rahman tickets without any stress!",
    name: "Priya Nair",
    meta: "Bengaluru · Concert-goer",
    avatar: "🎵",
    avatarBg: "rgba(108,59,255,0.2)",
  },
  {
    stars: "★★★★★",
    text: "The SmartCoins system is genius. Got ₹400 off my 4th booking without doing anything extra. Absolute loyalty done right.",
    name: "Rahul Sharma",
    meta: "Mumbai · Movie Buff",
    avatar: "🎬",
    avatarBg: "rgba(255,79,109,0.2)",
  },
];

const HOW_STEPS = [
  { icon: "🔍", num: "1", title: "Discover", text: "Browse movies, concerts, sports and more — all in one place, personalised for your city." },
  { icon: "💺", num: "2", title: "Pick Your Seat", text: "See real venue maps. Choose your exact seat with a live view of what you'll see from there." },
  { icon: "💳", num: "3", title: "Pay Securely", text: "UPI, Cards, Wallets — all accepted. Checkout in under 10 seconds with zero hidden fees." },
  { icon: "🎟️", num: "4", title: "Enjoy the Show", text: "Your e-ticket lands instantly. Just scan and walk in — no printing, no queues, no stress." },
];

const TRUST_LOGOS = [
  { icon: "🦁", name: "Chennai Super Kings" },
  { icon: "🎬", name: "PVR Cinemas" },
  { icon: "🏟️", name: "BookMyShow Partner" },
  { icon: "🎵", name: "Sony Music India" },
  { icon: "🏏", name: "BCCI Certified" },
  { icon: "🔒", name: "RBI Compliant" },
];

function useOtpTimer(initial = 30) {
  const [seconds, setSeconds] = useState(initial);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const start = () => { setSeconds(initial); setRunning(true); };
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) { clearInterval(intervalRef.current); setRunning(false); return 0; }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);
  return { seconds, running, start };
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen]   = useState(false);
  const [activeTab, setActiveTab]   = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
const [loggedUsername, setLoggedUsername] = useState(localStorage.getItem('username') || '');
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailKey, setDetailKey]   = useState(null);
  const particlesRef = useRef(null);

  const [signupData, setSignupData] = useState({ name: "", email: "", mobile: "", password: "" });
  const [signupStep, setSignupStep] = useState("form");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpDigits, setOtpDigits]   = useState(["","","","","",""]);
  const [otpError, setOtpError]     = useState("");
  const otpRefs = useRef([]);
  const { seconds, running, start: startTimer } = useOtpTimer(30);

  useEffect(() => {
    const id = "sb-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id; tag.textContent = styles;
      document.head.appendChild(tag);
    }
  }, []);

  useEffect(() => {
    if (!particlesRef.current) return;
    const colors = ["#6c3bff","#ff4f6d","#ffd166","#a07aff","#ffffff"];
    const container = particlesRef.current;
    container.innerHTML = "";
    for (let i = 0; i < 28; i++) {
      const p = document.createElement("div");
      p.className = "sb-particle";
      const size = Math.random() * 5 + 2;
      p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;background:${colors[Math.floor(Math.random()*colors.length)]};animation-duration:${8+Math.random()*12}s;animation-delay:${Math.random()*10}s;`;
      container.appendChild(p);
    }
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") { closeModal(); closeDetail(); } };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const closeModal  = () => { setModalOpen(false); setSignupStep("form"); setOtpDigits(["","","","","",""]); setOtpError(""); };
  const openModal   = (tab = "login") => { setActiveTab(tab); setSignupStep("form"); setOtpDigits(["","","","","",""]); setOtpError(""); setModalOpen(true); };
  const closeDetail = () => { setDetailOpen(false); setDetailKey(null); };
  const openDetail  = (title) => { setDetailKey(title); setDetailOpen(true); };
  const goToHome = () => {
  const token = localStorage.getItem('token');
  if (token) {
    navigate("/home");
  } else {
    openModal("login");
  }
};

  const sendOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp); setOtpDigits(["","","","","",""]); setOtpError(""); setSignupStep("otp"); startTimer();
  };

  const handleSignupSubmit = () => {
    const { name, email, mobile, password } = signupData;
    if (!name.trim() || !email.trim() || !mobile.trim() || !password.trim()) { alert("Please fill in all fields."); return; }
    if (password.length < 8) { alert("Password must be at least 8 characters."); return; }
    sendOtp();
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const nd = [...otpDigits]; nd[index] = value.slice(-1); setOtpDigits(nd); setOtpError("");
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) otpRefs.current[index - 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6);
    const nd = [...otpDigits];
    for (let i = 0; i < 6; i++) nd[i] = pasted[i] || "";
    setOtpDigits(nd);
  };

  const verifyOtp = async () => {
    const entered = otpDigits.join("");
    if (entered.length < 6) { setOtpError("Please enter all 6 digits."); return; }
    if (entered === generatedOtp) {
      try {
  const generatedUsername = signupData.name.split(" ")[0].toLowerCase() + Date.now().toString().slice(-4);
  // Register user in Django
  await fetch('http://127.0.0.1:8000/api/auth/register/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: generatedUsername,
            password: signupData.password,
            email: signupData.email,
            mobile: signupData.mobile.replace(/\D/g,''),
          })
        });
        // Now login to get real token
        const loginRes = await fetch('http://127.0.0.1:8000/api/auth/login/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: generatedUsername,
            password: signupData.password,
          })
        });
        const loginData = await loginRes.json();
        if (loginData.token) {
          localStorage.setItem("token", loginData.token);
          localStorage.setItem("username", loginData.username);
        } else {
          // Fallback
          localStorage.setItem("token", "demo-token-" + Date.now());
          localStorage.setItem("username", signupData.name.split(" ")[0]);
        }
      } catch {
        localStorage.setItem("token", "demo-token-" + Date.now());
        localStorage.setItem("username", signupData.name.split(" ")[0]);
      }
      //const uname = signupData.name.split(" ")[0].toLowerCase() + Date.now().toString().slice(-4);


      closeModal(); goToHome();
    } else {
      setOtpError("❌ Incorrect OTP. Please try again.");
      setOtpDigits(["","","","","",""]); otpRefs.current[0]?.focus();
    }
  };

  const detail = detailKey ? FEATURED_DETAIL[detailKey] : null;

  return (
    <div className="sb-body">

      {/* ══ HERO ══ */}
      <section className="sb-hero">
        <video className="sb-hero-video" autoPlay muted loop playsInline onError={(e) => (e.currentTarget.style.display="none")}>
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div className="sb-hero-fallback" />
        <div className="sb-particles" ref={particlesRef} />
        <div className="sb-overlay" />
        <nav className="sb-nav">
          <div className="sb-logo"><span className="sb-logo-dot" />SMARTBOOK</div>
          <div className="sb-nav-actions">
  {isLoggedIn ? (
    <>
      <span style={{ color:'#a07aff', fontSize:14, fontWeight:500 }}>
        👤 {loggedUsername}
      </span>
      <button className="sb-btn-ghost" onClick={() => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsLoggedIn(false);
        setLoggedUsername('');
      }}>Logout</button>
    </>
  ) : (
    <>
      <button className="sb-btn-ghost" onClick={() => openModal("login")}>Login</button>
      <button className="sb-btn-primary" onClick={() => openModal("signup")}>Sign Up Free</button>
    </>
  )}
</div>
        </nav>
        <div className="sb-hero-content">
          <div className="sb-badge"><span className="sb-badge-dot" />Movies &bull; Events &bull; Sports &bull; More</div>
          <h1 className="sb-title">BOOK YOUR<br /><span className="sb-title-accent">NEXT MOMENT</span></h1>
          <p className="sb-subtitle">From blockbuster films to live concerts — discover, book, and enjoy the best experiences near you.</p>
          <div className="sb-cta-group">
            <button className="sb-btn-cta-main" onClick={() => {
  const token = localStorage.getItem('token');
  if (token) {
    navigate('/home');
  } else {
    openModal("signup");
  }
}}>Get Started →</button>
            <button className="sb-btn-cta-sec" onClick={() => openModal("login")}>I have an account</button>
          </div>
        </div>
        <div className="sb-scroll-hint">Scroll</div>
      </section>

      {/* ══ STATS ══ */}
      <div className="sb-stats">
        {STATS.map((s) => (
          <div className="sb-stat-item" key={s.label}>
            <div className="sb-stat-num">{s.num}</div>
            <div className="sb-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════
          ABOUT / WHY US SECTION (NEW)
      ══════════════════════════════════════ */}
      <div className="sb-about">

        {/* Header */}
        <div className="sb-about-header">
          <div className="sb-about-eyebrow">⭐ Why 2 Million Indians Choose SmartBook</div>
          <div className="sb-about-title">We Don't Just Sell Tickets.<br /><span>We Create Memories.</span></div>
          <p className="sb-about-desc">
            SmartBook was built by fans, for fans. Since 2019, we've been on a mission to make live experiences
            seamless, transparent and accessible for every Indian — from blockbuster premieres to stadium roars.
          </p>
        </div>

        {/* Our Story Timeline */}
        <div className="sb-story-strip">
          {STORY_STEPS.map((step) => (
            <div className="sb-story-step" key={step.num}>
              <div className="sb-story-num">{step.num}</div>
              <div className="sb-story-title">{step.title}</div>
              <div className="sb-story-text">{step.text}</div>
            </div>
          ))}
        </div>

        {/* Feature cards */}
        <div className="sb-features-grid">
          {FEATURES.map((f) => (
            <div
              className="sb-feat-box"
              key={f.title}
              style={{ "--feat-glow": f.glow, "--feat-color": f.color, "--feat-bg": f.bg, "--feat-border": f.border }}
            >
              <span className="sb-feat-box-icon">{f.icon}</span>
              <div className="sb-feat-box-title">{f.title}</div>
              <div className="sb-feat-box-text">{f.text}</div>
              <span className="sb-feat-box-badge">{f.badge}</span>
            </div>
          ))}
        </div>

        {/* Trusted by */}
        <div className="sb-trust-strip">
          <div className="sb-trust-label">Trusted & Partnered With</div>
          <div className="sb-trust-logos">
            {TRUST_LOGOS.map((l) => (
              <div className="sb-trust-logo" key={l.name}>
                <span className="sb-trust-logo-icon">{l.icon}</span>
                {l.name}
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div style={{ marginBottom: 12 }}>
          <div className="sb-section-title" style={{ marginBottom: 6 }}>What Our Users Say</div>
          <div className="sb-section-sub" style={{ marginBottom: 28 }}>Real reviews from real fans across India</div>
        </div>
        <div className="sb-testimonials">
          {TESTIMONIALS.map((t) => (
            <div className="sb-testi-card" key={t.name}>
              <div className="sb-testi-stars">{t.stars}</div>
              <div className="sb-testi-text">"{t.text}"</div>
              <div className="sb-testi-author">
                <div className="sb-testi-avatar" style={{ background: t.avatarBg }}>{t.avatar}</div>
                <div>
                  <div className="sb-testi-name">{t.name}</div>
                  <div className="sb-testi-meta">{t.meta}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="sb-how-section">
          <div className="sb-how-title">How SmartBook Works</div>
          <div className="sb-how-sub">From discovery to entry gate — in 4 simple steps</div>
          <div className="sb-how-steps">
            {HOW_STEPS.map((s) => (
              <div className="sb-how-step" key={s.num}>
                <div className="sb-how-step-icon-wrap">
                  <div className="sb-how-step-icon">{s.icon}</div>
                  <div className="sb-how-step-num">{s.num}</div>
                </div>
                <div className="sb-how-step-title">{s.title}</div>
                <div className="sb-how-step-text">{s.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="sb-cta-banner">
          <div className="sb-cta-banner-bg" />
          <div className="sb-cta-banner-glow" />
          <div className="sb-cta-banner-content">
            <div className="sb-cta-banner-title">Your Next Great Memory<br />Is One Click Away</div>
            <div className="sb-cta-banner-sub">Join 2 million fans. Sign up free — no credit card needed.</div>
            <div className="sb-cta-banner-btns">
              <button className="sb-cta-banner-btn-white" onClick={() => {
  const token = localStorage.getItem('token');
  if (token) { navigate('/home'); } else { openModal("signup"); }
}}>🎟️ Start Booking Free</button>
<button className="sb-cta-banner-btn-outline" onClick={() => {
  const token = localStorage.getItem('token');
  if (token) { navigate('/home'); } else { openModal("login"); }
}}>Already a member? Login</button>
            </div>
          </div>
        </div>

      </div>
      {/* ══ END ABOUT SECTION ══ */}

      {/* ══ CATEGORIES ══ */}
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div className="sb-section">
          <div className="sb-section-title">What's On</div>
          <div className="sb-section-sub">Pick your vibe, we'll handle the tickets</div>
          <div className="sb-cat-grid">
            {CATEGORIES.map((cat) => (
              <div className="sb-cat-card" key={cat.name} onClick={goToHome}>
                <span className="sb-cat-icon">{cat.icon}</span>
                <div className="sb-cat-name">{cat.name}</div>
                <div className="sb-cat-count">{cat.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ FEATURED ══ */}
        <div className="sb-section" style={{ paddingTop:0 }}>
          <div className="sb-section-title">Featured This Week</div>
          <div className="sb-section-sub">Tap any card to explore — Handpicked highlights from across India</div>
          <div className="sb-featured-grid">
            {FEATURED.map((f) => (
              <div
                className={`sb-feat-card${f.large ? " large" : ""}`}
                key={f.title}
                onClick={() => openDetail(f.title)}
              >
                <div className="sb-fc-bg" style={{ background: f.bg }}>{f.icon}</div>
                <div className="sb-fc-overlay" />
                <div className="sb-fc-info">
                  <span className="sb-fc-tag">{f.tag}</span>
                  <div className="sb-fc-title">{f.title}</div>
                  <div className="sb-fc-meta">{f.meta}</div>
                  <div className="sb-fc-tap-hint">TAP TO EXPLORE →</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ FOOTER ══ */}
      <footer className="sb-footer">
        <div className="sb-footer-brand">SMARTBOOK</div>
        <div className="sb-footer-copy">© 2026 SmartBook. All rights reserved.</div>
        <div className="sb-footer-links">
          <a href="#">About</a><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Help</a>
        </div>
      </footer>

      {/* ══ FEATURED DETAIL MODAL ══ */}
      <div
        className={`sb-detail-backdrop${detailOpen ? " open" : ""}`}
        onClick={(e) => { if (e.target.classList.contains("sb-detail-backdrop")) closeDetail(); }}
      >
        {detail && (
          <div className="sb-detail-modal">
            <div className="sb-detail-hero">
              <div className="sb-detail-hero-bg" style={{ background: detail.bg }}>{detail.icon}</div>
              <div className="sb-detail-hero-overlay" />
              <div className="sb-detail-hero-content">
                <span className="sb-detail-tag">{detail.tag}</span>
                <div className="sb-detail-title">{detailKey}</div>
                <div className="sb-detail-subtitle">{detail.subtitle}</div>
              </div>
            </div>
            <button className="sb-detail-close" onClick={closeDetail}>✕</button>
            <div className="sb-detail-body">
              <div className="sb-detail-tags-row">
                {detail.pills.map(p => <span key={p} className="sb-detail-pill">{p}</span>)}
              </div>
              <p className="sb-detail-desc">{detail.desc}</p>
              <div className="sb-detail-stats">
                {detail.stats.map(s => (
                  <div key={s.label} className="sb-detail-stat">
                    <div className="sb-detail-stat-num">{s.num}</div>
                    <div className="sb-detail-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="sb-detail-section-title">Why You'll Love It</div>
              <div className="sb-detail-highlights">
                {detail.highlights.map((h, i) => (
                  <div key={i} className="sb-detail-highlight">
                    <span className="sb-detail-highlight-icon">{h.icon}</span>
                    <span className="sb-detail-highlight-text">{h.text}</span>
                  </div>
                ))}
              </div>
              <div className="sb-detail-section-title">Gallery</div>
              <div className="sb-detail-images">
                {detail.images.map((img, i) => (
                  <div key={i} className="sb-detail-img-box">
                    <span style={{ fontSize: 40 }}>{img.emoji}</span>
                    <div className="sb-detail-img-label">{img.label}</div>
                  </div>
                ))}
              </div>
              <button className="sb-detail-book-btn" onClick={() => { closeDetail(); goToHome(); }}>
                🎟️ {detail.bookLabel}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ══ LOGIN / SIGNUP MODAL ══ */}
      <div
        className={`sb-modal-backdrop${modalOpen ? " open" : ""}`}
        onClick={(e) => { if (e.target.classList.contains("sb-modal-backdrop")) closeModal(); }}
      >
        <div className="sb-modal">
          <button className="sb-modal-close" onClick={closeModal}>✕</button>
          <div className="sb-modal-logo">⬤ SMARTBOOK</div>
          <div className="sb-modal-tagline">Movies, Events &amp; More</div>

          {signupStep !== "otp" && (
            <div className="sb-tab-row">
              <button className={`sb-tab-btn${activeTab==="login"?" active":""}`} onClick={() => setActiveTab("login")}>Login</button>
              <button className={`sb-tab-btn${activeTab==="signup"?" active":""}`} onClick={() => setActiveTab("signup")}>Sign Up</button>
            </div>
          )}

          {activeTab==="login" && signupStep!=="otp" && (
            <div>
              <h2>Welcome Back</h2>
              <p className="sb-modal-hint">Sign in to access your bookings</p>
              <div className="sb-form-group">
                <label className="sb-form-label">Email or Mobile</label>
                <input className="sb-form-input" type="text" placeholder="Enter your username" />
              </div>
              <div className="sb-form-group">
                <label className="sb-form-label">Password</label>
                <input className="sb-form-input" type="password" placeholder="••••••••" />
              </div>
              <div className="sb-form-row">
                <label className="sb-form-check"><input type="checkbox" /> Remember me</label>
                <button className="sb-form-link">Forgot password?</button>
              </div>
              <button className="sb-btn-login" onClick={async () => {
  const emailInput = document.querySelector('.sb-form-input[type="text"]');
  const passInput = document.querySelector('.sb-form-input[type="password"]');
  try {
    const res = await fetch('http://127.0.0.1:8000/api/auth/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: emailInput.value, password: passInput.value, email: emailInput.value })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      setIsLoggedIn(true);
      setLoggedUsername(data.username);
      closeModal();
      navigate('/home');
    } else {
      alert(data.error || 'Login failed. Check credentials.');
    }
  } catch {
    alert('Could not connect to server.');
  }
}}>Login →</button>
              <div className="sb-divider"><span>or continue with</span></div>
              <div className="sb-social-btns">
                <button className="sb-btn-social">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button className="sb-btn-social">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
              </div>
              <div className="sb-modal-footer">Don't have an account?{" "}<button onClick={() => setActiveTab("signup")}>Sign up free</button></div>
            </div>
          )}

          {activeTab==="signup" && signupStep==="form" && (
            <div>
              <h2>Create Account</h2>
              <p className="sb-modal-hint">Join millions booking with SmartBook</p>
              <div className="sb-form-group">
                <label className="sb-form-label">Full Name</label>
                <input className="sb-form-input" type="text" placeholder="Ravi Kumar" value={signupData.name} onChange={e => setSignupData({...signupData, name:e.target.value})} />
              </div>
              <div className="sb-form-group">
                <label className="sb-form-label">Email</label>
                <input className="sb-form-input" type="email" placeholder="you@example.com" value={signupData.email} onChange={e => setSignupData({...signupData, email:e.target.value})} />
              </div>
              <div className="sb-form-group">
                <label className="sb-form-label">Mobile Number</label>
                <input className="sb-form-input" type="tel" placeholder="+91 98765 43210" value={signupData.mobile} onChange={e => setSignupData({...signupData, mobile:e.target.value})} />
              </div>
              <div className="sb-form-group">
                <label className="sb-form-label">Password</label>
                <input className="sb-form-input" type="password" placeholder="Min 8 characters" value={signupData.password} onChange={e => setSignupData({...signupData, password:e.target.value})} />
              </div>
              <button className="sb-btn-login" style={{ marginTop:8 }} onClick={handleSignupSubmit}>Send OTP →</button>
              <div className="sb-modal-footer">Already have an account?{" "}<button onClick={() => setActiveTab("login")}>Login</button></div>
            </div>
          )}

          {activeTab==="signup" && signupStep==="otp" && (
            <div>
              <button className="sb-back-btn" onClick={() => { setSignupStep("form"); setOtpError(""); }}>← Back</button>
              <div className="sb-otp-box">
                <div className="sb-otp-icon">📱</div>
                <div className="sb-otp-title">Verify Your Number</div>
                <div className="sb-otp-desc">We sent a 6-digit OTP to<br /><strong style={{ color:"#fff" }}>{signupData.mobile}</strong></div>
                <div className="sb-demo-otp">🔑 Demo OTP: <strong>{generatedOtp}</strong><br /><span style={{ fontSize:11, opacity:0.7 }}>(Connect real SMS API to hide this)</span></div>
                <div className="sb-otp-inputs" onPaste={handleOtpPaste}>
                  {otpDigits.map((digit, i) => (
                    <input key={i} ref={el => otpRefs.current[i]=el} className="sb-otp-digit" type="text" inputMode="numeric" maxLength={1} value={digit} onChange={e => handleOtpChange(i, e.target.value)} onKeyDown={e => handleOtpKeyDown(i, e)} />
                  ))}
                </div>
                {otpError && <div style={{ color:"#ff4f6d", fontSize:13, marginBottom:12 }}>{otpError}</div>}
                <div className="sb-otp-timer">{running ? `Resend OTP in ${seconds}s` : "Didn't receive the OTP?"}</div>
                <button className="sb-otp-resend" disabled={running} onClick={sendOtp}>Resend OTP</button>
              </div>
              <button className="sb-btn-login" disabled={otpDigits.join("").length < 6} onClick={verifyOtp}>Verify & Create Account ✓</button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}