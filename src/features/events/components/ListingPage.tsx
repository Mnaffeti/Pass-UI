import { useState, useMemo } from 'react';
import { Icon } from '@/components/ui/Icon';
import { EventCard } from '@/components/ui/EventCard';
import { StarRating } from '@/components/ui/StarRating';
import { EventPoster } from '@/components/ui/EventPoster';
import { HeartButton } from '@/components/ui/HeartButton';
import { Reveal } from '@/components/ui/Reveal';
import { EVENTS } from '@/data/events';
import { formatPrice, formatDate } from '@/utils/formatting';
import type { Event } from '@/types';

interface ListingPageProps {
  activeTab: string;
  onOpenEvent: (event: Event) => void;
  saved: Set<string>;
  onToggleSave: (id: string) => void;
  onBack: () => void;
}

export function ListingPage({ activeTab, onOpenEvent, saved, onToggleSave, onBack }: ListingPageProps) {
  const [sort, setSort] = useState('date');
  const [city, setCity] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [type, setType] = useState(activeTab !== 'all' ? activeTab : 'all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = useMemo(() => {
    let list = [...EVENTS];
    if (type !== 'all') list = list.filter((e) => e.type === type);
    if (city !== 'all') list = list.filter((e) => e.city === city);
    list = list.filter((e) => {
      const min = Math.min(...e.tickets.map((t) => t.price));
      return min >= priceRange[0] && min <= priceRange[1];
    });
    if (sort === 'date') list.sort((a, b) => a.date.localeCompare(b.date));
    if (sort === 'price') list.sort((a, b) => Math.min(...a.tickets.map((t) => t.price)) - Math.min(...b.tickets.map((t) => t.price)));
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [type, city, priceRange, sort]);

  return (
    <div className="page-fade-enter">
      <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
        <div style={{ marginBottom: 24 }}>
          <button onClick={onBack} className="btn btn-ghost btn-sm" style={{ paddingLeft: 0 }}>
            <Icon name="arrow-left" size={16}/> Accueil
          </button>
          <h1 className="display-lg" style={{ margin: '10px 0 4px 0' }}>
            {type === 'sports' ? 'Sport en Tunisie' : type === 'festivals' ? 'Festivals & culture' : 'Tous les événements'}
          </h1>
          <p className="body-md text-muted" style={{ margin: 0 }}>
            {filtered.length} événements · billetterie ouverte
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 36, alignItems: 'start' }}>
          <aside style={{
            position: 'sticky', top: 96,
            background: '#fff',
            border: '1px solid var(--hairline)',
            borderRadius: 'var(--r-md)',
            padding: 20,
          }}>
            <h3 className="title-md" style={{ marginTop: 0 }}>Filtres</h3>

            <FilterGroup label="Catégorie">
              {([['all', 'Tout', EVENTS.length], ['sports', 'Sport', EVENTS.filter((e) => e.type === 'sports').length], ['festivals', 'Festivals', EVENTS.filter((e) => e.type === 'festivals').length]] as [string, string, number][]).map(([id, lab, n]) => (
                <FilterRadio key={id} checked={type === id} onChange={() => setType(id)} label={lab} count={n}/>
              ))}
            </FilterGroup>

            <FilterGroup label="Ville">
              <select value={city} onChange={(e) => setCity(e.target.value)} className="field-select" style={{ height: 44 }}>
                <option value="all">Toutes les villes</option>
                {[...new Set(EVENTS.map((e) => e.city))].sort().map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </FilterGroup>

            <FilterGroup label="Prix">
              <div className="row-between" style={{ marginBottom: 8 }}>
                <span className="body-sm">{priceRange[0]} DT</span>
                <span className="body-sm">{priceRange[1]} DT</span>
              </div>
              <input type="range" min={0} max={500} step={10} value={priceRange[1]}
                onChange={(e) => setPriceRange([0, +e.target.value])}
                style={{ width: '100%', accentColor: 'var(--primary)' }}
              />
            </FilterGroup>

            <FilterGroup label="Date">
              {['Cette semaine', 'Ce mois', 'Été 2026', 'Toutes les dates'].map((d) => (
                <FilterRadio key={d} checked={d === 'Toutes les dates'} label={d}/>
              ))}
            </FilterGroup>

            <button className="btn btn-secondary btn-block btn-sm" style={{ marginTop: 8 }}
              onClick={() => { setType('all'); setCity('all'); setPriceRange([0, 500]); }}
            >
              Réinitialiser
            </button>
          </aside>

          <div>
            <div className="row-between" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="body-sm text-muted">Trier par</span>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="field-select" style={{ height: 40, width: 'auto', paddingRight: 36 }}>
                  <option value="date">Date (proche → loin)</option>
                  <option value="price">Prix (croissant)</option>
                  <option value="rating">Mieux notés</option>
                </select>
              </div>
              <div style={{ display: 'flex', border: '1px solid var(--hairline)', borderRadius: 999, overflow: 'hidden', padding: 3 }}>
                {(['grid', 'list'] as const).map((m) => (
                  <button key={m} onClick={() => setViewMode(m)} style={{
                    padding: '6px 14px', borderRadius: 999,
                    background: viewMode === m ? 'var(--surface-ink)' : 'transparent',
                    color: viewMode === m ? '#fff' : 'var(--ink)',
                    fontSize: 13, fontWeight: 600,
                  }}>{m === 'grid' ? 'Grille' : 'Liste'}</button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div style={{ padding: 60, textAlign: 'center', border: '1px dashed var(--hairline)', borderRadius: 'var(--r-md)' }}>
                <Icon name="search" size={32} color="var(--muted)"/>
                <h3 className="display-sm" style={{ margin: '14px 0 4px 0' }}>Aucun événement</h3>
                <p className="body-sm text-muted">Élargissez vos filtres pour voir plus de résultats.</p>
              </div>
            ) : viewMode === 'grid' ? (
              <Reveal stagger>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 28 }}>
                  {filtered.map((e) => (
                    <EventCard key={e.id} event={e} onOpen={onOpenEvent} saved={saved.has(e.id)} onToggleSave={() => onToggleSave(e.id)} hideTypeBadge={type !== 'all'}/>
                  ))}
                </div>
              </Reveal>
            ) : (
              <Reveal stagger>
                <div className="col gap-base">
                  {filtered.map((e) => (
                    <ListingRow key={e.id} event={e} onOpen={onOpenEvent} saved={saved.has(e.id)} onToggleSave={() => onToggleSave(e.id)} hideTypeBadge={type !== 'all'}/>
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ paddingTop: 16, paddingBottom: 16, borderTop: '1px solid var(--hairline-soft)' }}>
      <div className="caption text-muted" style={{ marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.08em' }}>{label}</div>
      <div className="col gap-sm">{children}</div>
    </div>
  );
}

function FilterRadio({ checked, onChange, label, count }: { checked: boolean; onChange?: () => void; label: string; count?: number }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '2px 0' }}>
      <span style={{
        width: 18, height: 18, borderRadius: '50%',
        border: `1.5px solid ${checked ? 'var(--ink)' : 'var(--hairline)'}`,
        background: checked ? 'radial-gradient(circle, var(--ink) 0 4px, #fff 4px)' : '#fff',
        flexShrink: 0,
      }}/>
      <input type="radio" checked={!!checked} onChange={onChange ?? (() => {})} style={{ display: 'none' }}/>
      <span className="body-sm" style={{ flex: 1 }}>{label}</span>
      {count != null && <span className="body-sm text-muted">{count}</span>}
    </label>
  );
}

function ListingRow({ event, onOpen, saved, onToggleSave, hideTypeBadge }: { event: Event; onOpen: (e: Event) => void; saved: boolean; onToggleSave: () => void; hideTypeBadge: boolean }) {
  const minPrice = Math.min(...event.tickets.map((t) => t.price));
  return (
    <div onClick={() => onOpen(event)} style={{
      display: 'grid', gridTemplateColumns: '180px 1fr auto', gap: 24,
      padding: 16, borderRadius: 'var(--r-md)',
      border: '1px solid var(--hairline-soft)', background: '#fff',
      cursor: 'pointer', transition: 'box-shadow .2s ease',
    }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-card)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
    >
      <div style={{ width: 180, height: 180, borderRadius: 'var(--r-sm)', overflow: 'hidden', position: 'relative' }}>
        <EventPoster event={event} size="card"/>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          {!hideTypeBadge && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
              <span className={`badge ${event.type === 'sports' ? 'badge-sports' : 'badge-festivals'}`}>
                {event.type === 'sports' ? 'Sport' : 'Festival'}
              </span>
              {event.hot && <span className="badge badge-ink"><Icon name="flame" size={11} color="#fff"/> Hot</span>}
            </div>
          )}
          {hideTypeBadge && event.hot && (
            <div style={{ marginBottom: 6 }}>
              <span className="badge badge-ink"><Icon name="flame" size={11} color="#fff"/> Hot</span>
            </div>
          )}
          <h3 className="display-md" style={{ margin: 0 }}>{event.title}</h3>
          <p className="body-sm text-muted" style={{ margin: '2px 0 0 0' }}>{event.subtitle}</p>
        </div>
        <div className="row" style={{ gap: 18, color: 'var(--body)', flexWrap: 'wrap' }}>
          <span className="body-sm row gap-xs"><Icon name="calendar" size={14}/> {formatDate(event.date)} · {event.time}</span>
          <span className="body-sm row gap-xs"><Icon name="map-pin" size={14}/> {event.venue}</span>
          <StarRating value={event.rating} reviews={event.reviews} small/>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <button onClick={(e) => { e.stopPropagation(); onToggleSave(); }} className="btn-icon" style={{ border: '1px solid var(--hairline)' }}>
          <Icon name={saved ? 'heart-fill' : 'heart'} color={saved ? '#ff385c' : '#222'} size={18}/>
        </button>
        <div style={{ textAlign: 'right' }}>
          <div className="caption text-muted">à partir de</div>
          <div className="display-md" style={{ marginTop: 2 }}>{formatPrice(minPrice)}</div>
          <button className="btn btn-primary btn-sm" style={{ marginTop: 8 }}>
            Voir les billets <Icon name="arrow-right" size={14} color="#fff"/>
          </button>
        </div>
      </div>
    </div>
  );
}
