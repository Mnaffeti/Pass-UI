const TICKER_ITEMS = [
  'Espérance vs Club Africain — 12 juin',
  'Festival International de Carthage — 14 juil',
  'Tunisie 🇹🇳 vs Algérie 🇩🇿 — 4 sept',
  'Tabarka Jazz · Marcus Miller — 8 août',
  'JCC Carthage — Cérémonie 1er nov',
  'US Monastir — BAL Finale 29 mai',
  'Hammamet · Anouar Brahem — 26 juil',
  'Festival de la Médina — 12 mars',
  'Tunis Padel Master — 16 mai',
];

export function HeroTicker() {
  const full = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div style={{
      position: 'relative',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      background: '#0a0a0a',
      padding: '16px 0',
      overflow: 'hidden',
      zIndex: 2,
      color: '#fff',
    }}>
      <style>{`
        @keyframes tickerDots {
          0%   { background-position: 0 0, 4px 4px; }
          100% { background-position: 8px 0, 12px 4px; }
        }
        @keyframes tickerSweep {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          radial-gradient(circle at 1px 1px, rgba(255,255,255,0.10) 1px, transparent 1.5px),
          radial-gradient(circle at 1px 1px, rgba(255,56,92,0.18) 1px, transparent 1.5px)
        `,
        backgroundSize: '8px 8px, 8px 8px',
        backgroundPosition: '0 0, 4px 4px',
        animation: 'tickerDots 4s linear infinite',
        opacity: 0.55,
        pointerEvents: 'none',
      }}/>
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, transparent 0%, rgba(255,56,92,0.18) 50%, transparent 100%)',
        animation: 'tickerSweep 6s linear infinite',
        pointerEvents: 'none',
      }}/>
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, #0a0a0a 0%, transparent 6%, transparent 94%, #0a0a0a 100%)',
        pointerEvents: 'none',
        zIndex: 1,
      }}/>
      <div className="marquee" style={{ position: 'relative', zIndex: 2 }}>
        {full.map((s, i) => (
          <span key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            fontWeight: 500, fontSize: 14,
            color: '#fff',
            textShadow: '0 0 12px rgba(255,56,92,0.35)',
          }}>
            <span className="dot" style={{ background: '#ff385c', width: 7, height: 7, boxShadow: '0 0 8px rgba(255,56,92,0.8)' }}/>
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
