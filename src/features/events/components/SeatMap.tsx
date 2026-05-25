import type { Event } from '@/types';
import { formatPrice } from '@/utils/formatting';

interface SeatMapProps {
  event: Event;
  selected: string;
  onSelect: (tierId: string) => void;
}

export function SeatMap({ event, selected, onSelect }: SeatMapProps) {
  const isArena = event.id === 'us-monastir-bball';
  const isAmphi = event.type === 'festivals' && !['jcc-2026', 'medina-ramadan'].includes(event.id);
  const isTennis = event.id === 'tennis-tunis-open' || event.id === 'padel-tunis-master';

  if (isTennis) return <SeatMapTennis event={event} selected={selected} onSelect={onSelect}/>;
  if (isArena) return <SeatMapArena event={event} selected={selected} onSelect={onSelect}/>;
  if (isAmphi) return <SeatMapAmphi event={event} selected={selected} onSelect={onSelect}/>;
  return <SeatMapStadium event={event} selected={selected} onSelect={onSelect}/>;
}

const colorFor = (id: string): string => ({ vip: '#8b1c2b', cat1: '#ff385c', cat2: '#0a2540', cat3: '#0f766e' })[id] ?? '#888';

function SeatMapStadium({ event, selected, onSelect }: SeatMapProps) {
  return (
    <div style={{
      background: '#0e2b1a',
      backgroundImage: 'radial-gradient(circle at center, #143a23 0%, #0a1f12 80%)',
      borderRadius: 'var(--r-md)', padding: 36, position: 'relative', overflow: 'hidden',
    }}>
      <svg viewBox="0 0 600 380" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <rect x="180" y="130" width="240" height="120" fill="#1d6a3a" stroke="#fff" strokeWidth="1.5" opacity="0.95"/>
        <line x1="300" y1="130" x2="300" y2="250" stroke="#fff" strokeWidth="1" opacity="0.7"/>
        <circle cx="300" cy="190" r="22" fill="none" stroke="#fff" strokeWidth="1" opacity="0.7"/>
        <text x="300" y="194" textAnchor="middle" fontFamily="DM Sans" fontWeight="600" fontSize="11" fill="#fff" opacity="0.8">PELOUSE</text>
        <SeatBlock id="vip"  selected={selected} onSelect={onSelect} d="M 180 100 L 420 100 L 410 125 L 190 125 Z" event={event}/>
        <SeatBlock id="cat1" selected={selected} onSelect={onSelect} d="M 180 255 L 420 255 L 430 285 L 170 285 Z" event={event}/>
        <SeatBlock id="cat2" selected={selected} onSelect={onSelect} d="M 100 110 L 180 100 L 180 280 L 100 290 Z" event={event}/>
        <SeatBlock id="cat2" selected={selected} onSelect={onSelect} d="M 500 110 L 420 100 L 420 280 L 500 290 Z" event={event} alt/>
        <SeatBlock id="cat3" selected={selected} onSelect={onSelect} d="M 60 130 L 100 110 L 100 290 L 60 310 Z" event={event}/>
        <SeatBlock id="cat3" selected={selected} onSelect={onSelect} d="M 540 130 L 500 110 L 500 290 L 540 310 Z" event={event} alt/>
      </svg>
      <SeatLegend event={event} selected={selected} onSelect={onSelect}/>
    </div>
  );
}

function SeatMapArena({ event, selected, onSelect }: SeatMapProps) {
  return (
    <div style={{ background: '#1a1a1a', borderRadius: 'var(--r-md)', padding: 36 }}>
      <svg viewBox="0 0 600 380" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <rect x="200" y="140" width="200" height="100" rx="6" fill="#c2823b" stroke="#fff" strokeWidth="1.5"/>
        <circle cx="300" cy="190" r="22" fill="none" stroke="#fff" strokeWidth="1.2"/>
        <text x="300" y="194" textAnchor="middle" fontFamily="DM Sans" fontWeight="600" fontSize="11" fill="#fff">PARQUET</text>
        <SeatBlock id="vip"  selected={selected} onSelect={onSelect} d="M 200 245 L 400 245 L 410 270 L 190 270 Z" event={event}/>
        <SeatBlock id="vip"  selected={selected} onSelect={onSelect} d="M 200 110 L 400 110 L 410 135 L 190 135 Z" event={event} alt/>
        <SeatBlock id="cat1" selected={selected} onSelect={onSelect} d="M 100 140 L 200 110 L 200 270 L 100 300 Z" event={event}/>
        <SeatBlock id="cat1" selected={selected} onSelect={onSelect} d="M 500 140 L 400 110 L 400 270 L 500 300 Z" event={event} alt/>
        <SeatBlock id="cat2" selected={selected} onSelect={onSelect} d="M 60 80 L 540 80 L 510 130 L 90 130 Z" event={event}/>
        <SeatBlock id="cat2" selected={selected} onSelect={onSelect} d="M 60 300 L 540 300 L 510 350 L 90 350 Z" event={event} alt/>
      </svg>
      <SeatLegend event={event} selected={selected} onSelect={onSelect}/>
    </div>
  );
}

function SeatMapAmphi({ event, selected, onSelect }: SeatMapProps) {
  return (
    <div style={{
      background: '#2a1810',
      backgroundImage: 'radial-gradient(circle at 50% 100%, #4a2818 0%, #1a0e08 70%)',
      borderRadius: 'var(--r-md)', padding: 36,
    }}>
      <svg viewBox="0 0 600 380" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <rect x="200" y="60" width="200" height="40" rx="4" fill="#1a1a1a" stroke="#fff" strokeWidth="1"/>
        <text x="300" y="86" textAnchor="middle" fontFamily="DM Sans" fontWeight="600" fontSize="12" fill="#fff">SCÈNE</text>
        <SeatBlock id="vip"  selected={selected} onSelect={onSelect} d="M 220 120 Q 300 110 380 120 L 380 145 Q 300 135 220 145 Z" event={event}/>
        <SeatBlock id="cat1" selected={selected} onSelect={onSelect} d="M 180 155 Q 300 140 420 155 L 425 195 Q 300 180 175 195 Z" event={event}/>
        <SeatBlock id="cat2" selected={selected} onSelect={onSelect} d="M 140 205 Q 300 188 460 205 L 470 255 Q 300 235 130 255 Z" event={event}/>
        {event.tickets.find((t) => t.id === 'cat3') && (
          <SeatBlock id="cat3" selected={selected} onSelect={onSelect} d="M 90 265 Q 300 245 510 265 L 525 320 Q 300 297 75 320 Z" event={event}/>
        )}
      </svg>
      <SeatLegend event={event} selected={selected} onSelect={onSelect}/>
    </div>
  );
}

function SeatMapTennis({ event, selected, onSelect }: SeatMapProps) {
  return (
    <div style={{ background: '#1a3a2a', borderRadius: 'var(--r-md)', padding: 36 }}>
      <svg viewBox="0 0 600 380" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <rect x="240" y="140" width="120" height="100" fill="#b25a3c" stroke="#fff" strokeWidth="1.5"/>
        <line x1="240" y1="190" x2="360" y2="190" stroke="#fff" strokeWidth="1.2"/>
        <text x="300" y="194" textAnchor="middle" fontFamily="DM Sans" fontWeight="600" fontSize="10" fill="#fff">COURT</text>
        <SeatBlock id="vip"  selected={selected} onSelect={onSelect} d="M 230 110 L 370 110 L 380 135 L 220 135 Z" event={event}/>
        <SeatBlock id="vip"  selected={selected} onSelect={onSelect} d="M 230 245 L 370 245 L 380 270 L 220 270 Z" event={event} alt/>
        <SeatBlock id="cat1" selected={selected} onSelect={onSelect} d="M 140 130 L 230 110 L 230 270 L 140 290 Z" event={event}/>
        <SeatBlock id="cat1" selected={selected} onSelect={onSelect} d="M 460 130 L 370 110 L 370 270 L 460 290 Z" event={event} alt/>
        <SeatBlock id="cat2" selected={selected} onSelect={onSelect} d="M 80 110 L 140 130 L 140 290 L 80 310 Z" event={event}/>
        <SeatBlock id="cat2" selected={selected} onSelect={onSelect} d="M 520 110 L 460 130 L 460 290 L 520 310 Z" event={event} alt/>
      </svg>
      <SeatLegend event={event} selected={selected} onSelect={onSelect}/>
    </div>
  );
}

function SeatBlock({ id, d, selected, onSelect, event, alt }: { id: string; d: string; selected: string; onSelect: (id: string) => void; event: Event; alt?: boolean }) {
  const tier = event.tickets.find((t) => t.id === id);
  if (!tier) return null;
  const isSelected = selected === id;
  return (
    <g style={{ cursor: 'pointer' }} onClick={() => onSelect(id)}>
      <path d={d} fill={colorFor(id)} opacity={isSelected ? 1 : 0.78} stroke={isSelected ? '#fff' : 'transparent'} strokeWidth="2" style={{ transition: 'all .2s ease' }}/>
      {!alt && (
        <text x={d.match(/[ML] (\d+)/)?.[1] ?? '100'} y={d.match(/[ML] \d+ (\d+)/)?.[1] ?? '100'} fontFamily="DM Sans" fontSize="10" fontWeight="600" fill="#fff" opacity="0.9" pointerEvents="none"/>
      )}
    </g>
  );
}

function SeatLegend({ event, selected, onSelect }: SeatMapProps) {
  return (
    <div style={{ marginTop: 18, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
      {event.tickets.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 14px',
            borderRadius: 999,
            background: selected === t.id ? '#fff' : 'rgba(255,255,255,0.1)',
            color: selected === t.id ? 'var(--ink)' : '#fff',
            border: `1px solid ${selected === t.id ? '#fff' : 'rgba(255,255,255,0.2)'}`,
            fontWeight: 600, fontSize: 13,
            transition: 'all .15s ease',
          }}
        >
          <span className="dot" style={{ background: colorFor(t.id), width: 10, height: 10 }}/>
          {t.label}
          <span style={{ opacity: 0.7, fontWeight: 500 }}>{formatPrice(t.price)}</span>
        </button>
      ))}
    </div>
  );
}
