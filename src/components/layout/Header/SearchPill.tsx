import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

interface SearchPillProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}

export function SearchPill({ value, onChange, onSubmit }: SearchPillProps) {
  const [focus, setFocus] = useState<string | null>(null);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1px 1fr 1px 1fr 1px 1fr auto',
        alignItems: 'center',
        height: 70,
        maxWidth: 880,
        margin: '0 auto',
        border: '1px solid var(--hairline)',
        borderRadius: 999,
        background: '#fff',
        boxShadow: focus ? 'var(--shadow-pop)' : 'var(--shadow-card)',
        transition: 'box-shadow .2s ease',
      }}
    >
      <SearchSegment label="Que cherchez-vous ?" placeholder="Concerts, derby, théâtre..." value={value} onChange={onChange} onFocus={() => setFocus('q')} onBlur={() => setFocus(null)} active={focus === 'q'} />
      <div style={{ width: 1, height: 32, background: 'var(--hairline)' }} />
      <SearchSegment label="Où" placeholder="Toute la Tunisie" onFocus={() => setFocus('where')} onBlur={() => setFocus(null)} active={focus === 'where'} />
      <div style={{ width: 1, height: 32, background: 'var(--hairline)' }} />
      <SearchSegment label="Quand" placeholder="Toutes les dates" onFocus={() => setFocus('when')} onBlur={() => setFocus(null)} active={focus === 'when'} />
      <div style={{ width: 1, height: 32, background: 'var(--hairline)' }} />
      <SearchSegment label="Combien" placeholder="Nombre de billets" onFocus={() => setFocus('who')} onBlur={() => setFocus(null)} active={focus === 'who'} />

      <button
        onClick={onSubmit}
        aria-label="Rechercher"
        style={{
          width: 56,
          height: 56,
          background: 'var(--primary)',
          color: '#fff',
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          marginRight: 8,
          transition: 'background-color .15s ease, transform .15s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--primary-active)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--primary)')}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <Icon name="search" size={20} color="#fff" strokeWidth={2.4} />
      </button>
    </div>
  );
}

interface SearchSegmentProps {
  label: string;
  placeholder: string;
  value?: string;
  onChange?: (v: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  active?: boolean;
}

function SearchSegment({ label, placeholder, value, onChange, onFocus, onBlur, active }: SearchSegmentProps) {
  return (
    <label
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '12px 24px',
        borderRadius: 999,
        background: active ? '#fff' : 'transparent',
        boxShadow: active ? 'var(--shadow-card)' : 'none',
        cursor: 'text',
        height: 64,
        transition: 'background .15s ease',
      }}
    >
      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>{label}</span>
      <input
        type="text"
        placeholder={placeholder}
        value={onChange ? value || '' : undefined}
        defaultValue={!onChange ? '' : undefined}
        onChange={onChange ? (e) => onChange(e.target.value) : () => {}}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{
          border: 'none',
          outline: 'none',
          background: 'transparent',
          padding: 0,
          marginTop: 2,
          fontSize: 14,
          color: 'var(--ink)',
          width: '100%',
        }}
      />
    </label>
  );
}

interface CompactSearchPillProps {
  onClick: () => void;
  placeholder: string;
}

export function CompactSearchPill({ onClick, placeholder }: CompactSearchPillProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        height: 48,
        padding: '0 8px 0 20px',
        border: '1px solid var(--hairline)',
        borderRadius: 999,
        background: '#fff',
        boxShadow: 'var(--shadow-card)',
        minWidth: 320,
        fontWeight: 600,
        fontSize: 14,
      }}
    >
      <span>{placeholder}</span>
      <span style={{ flex: 1 }} />
      <span
        style={{
          width: 32,
          height: 32,
          borderRadius: 999,
          background: 'var(--primary)',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <Icon name="search" size={14} color="#fff" strokeWidth={2.4} />
      </span>
    </button>
  );
}
