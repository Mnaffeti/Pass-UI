import { Icon } from '@/components/ui/Icon';

interface StepperProps {
  value: number;
  onChange: (n: number) => void;
  max?: number;
}

export function Stepper({ value, onChange, max = 10 }: StepperProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        border: '1px solid var(--hairline)',
        borderRadius: 999,
        padding: 4,
        gap: 4,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => onChange((value || 0) - 1)}
        disabled={(value || 0) <= 0}
        style={{
          width: 34,
          height: 34,
          borderRadius: 999,
          background: (value || 0) <= 0 ? 'transparent' : 'var(--surface-soft)',
          color: (value || 0) <= 0 ? 'var(--muted-soft)' : 'var(--ink)',
          display: 'grid',
          placeItems: 'center',
          cursor: (value || 0) <= 0 ? 'not-allowed' : 'pointer',
        }}
      >
        <Icon name="minus" size={14} />
      </button>
      <div style={{ minWidth: 24, textAlign: 'center', fontWeight: 600 }}>{value || 0}</div>
      <button
        onClick={() => onChange((value || 0) + 1)}
        disabled={(value || 0) >= max}
        style={{
          width: 34,
          height: 34,
          borderRadius: 999,
          background: (value || 0) >= max ? 'transparent' : 'var(--surface-ink)',
          color: (value || 0) >= max ? 'var(--muted-soft)' : '#fff',
          display: 'grid',
          placeItems: 'center',
          cursor: (value || 0) >= max ? 'not-allowed' : 'pointer',
        }}
      >
        <Icon name="plus" size={14} color={(value || 0) >= max ? 'var(--muted-soft)' : '#fff'} />
      </button>
    </div>
  );
}
