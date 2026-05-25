import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';

const CATEGORIES: { id: string; label: string; icon: IconName }[] = [
  { id: 'all',      label: 'Tendances', icon: 'flame' },
  { id: 'football', label: 'Football',  icon: 'football' },
  { id: 'padel',    label: 'Padel',     icon: 'padel' },
  { id: 'concert',  label: 'Concerts',  icon: 'music' },
  { id: 'jazz',     label: 'Jazz',      icon: 'jazz' },
  { id: 'cinema',   label: 'Cinéma',    icon: 'cinema' },
  { id: 'theatre',  label: 'Théâtre',   icon: 'theater' },
  { id: 'basket',   label: 'Basket',    icon: 'basket' },
  { id: 'tennis',   label: 'Tennis',    icon: 'tennis' },
  { id: 'culture',  label: 'Patrimoine', icon: 'heritage' },
  { id: 'running',  label: 'Course',    icon: 'running' },
];

interface CategoryStripProps {
  active: string;
  onChange: (id: string) => void;
}

export function CategoryStrip({ active, onChange }: CategoryStripProps) {
  return (
    <div style={{
      borderBottom: '1px solid var(--hairline)',
      background: '#fff',
      position: 'sticky', top: 80, zIndex: 20,
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <div className="no-scrollbar" style={{
          display: 'flex', alignItems: 'center',
          gap: 28, overflowX: 'auto',
          padding: '16px 0', flex: 1,
        }}>
          {CATEGORIES.map((c) => {
            const isActive = active === c.id;
            return (
              <button key={c.id} onClick={() => onChange(c.id)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                minWidth: 64, paddingBottom: 8,
                color: isActive ? 'var(--ink)' : 'var(--muted)',
                borderBottom: isActive ? '2px solid var(--ink)' : '2px solid transparent',
                fontWeight: isActive ? 600 : 500,
                fontSize: 12, whiteSpace: 'nowrap',
                opacity: isActive ? 1 : 0.7,
                transition: 'all .15s ease',
              }}>
                <Icon name={c.icon} size={22} strokeWidth={1.5}/>
                {c.label}
              </button>
            );
          })}
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 18px',
          border: '1px solid var(--hairline)',
          borderRadius: 'var(--r-sm)',
          fontWeight: 500, fontSize: 14, whiteSpace: 'nowrap',
        }}>
          <Icon name="sliders" size={14}/> Filtres
        </button>
      </div>
    </div>
  );
}
