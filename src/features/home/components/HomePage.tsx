import { useState, useMemo } from 'react';
import { EventCard } from '@/components/ui/EventCard';
import { EventPoster } from '@/components/ui/EventPoster';
import { Reveal } from '@/components/ui/Reveal';
import { Icon } from '@/components/ui/Icon';
import { EVENTS } from '@/data/events';
import { HeroTicker } from './HeroTicker';
import { CategoryStrip } from './CategoryStrip';
import { WhyStrip } from './WhyStrip';
import type { Event } from '@/types';

interface HomePageProps {
  activeTab: string;
  saved: Set<string>;
  onToggleSave: (id: string) => void;
  onOpenEvent: (event: Event) => void;
}

export function HomePage({ activeTab, saved, onToggleSave, onOpenEvent }: HomePageProps) {
  const [category, setCategory] = useState('all');
  const hideType = activeTab !== 'all';

  const filteredEvents = useMemo(() => {
    let list = EVENTS;
    if (activeTab !== 'all') list = list.filter((e) => e.type === activeTab);
    return list;
  }, [activeTab]);

  const hot = filteredEvents.filter((e) => e.hot);

  const byCity = useMemo(() => {
    const cities: Record<string, Event[]> = {};
    filteredEvents.forEach((e) => {
      cities[e.city] = cities[e.city] ?? [];
      cities[e.city].push(e);
    });
    return cities;
  }, [filteredEvents]);

  return (
    <div className="page-fade-enter">
      <section style={{
        position: 'relative',
        background: 'linear-gradient(180deg, #faf5ec 0%, #fdf8f0 50%, #ffffff 100%)',
        overflow: 'hidden',
        borderBottom: '1px solid var(--hairline-soft)',
      }}>
        <svg width="100%" height="100%" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true"
          style={{ position: 'absolute', inset: 0, opacity: 0.05, pointerEvents: 'none' }}>
          <defs>
            <pattern id="hero-zellige" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <g transform="translate(60 60)" fill="none" stroke="#7a4a1a" strokeWidth="1">
                <polygon points="0,-40 10,-10 40,0 10,10 0,40 -10,10 -40,0 -10,-10"/>
                <polygon points="0,-40 10,-10 40,0 10,10 0,40 -10,10 -40,0 -10,-10" transform="rotate(22.5)"/>
                <circle r="3" fill="#7a4a1a" stroke="none"/>
              </g>
            </pattern>
          </defs>
          <rect width="1200" height="600" fill="url(#hero-zellige)"/>
        </svg>

        <div aria-hidden="true" style={{
          position: 'absolute', left: '-10%', top: '20%',
          width: 480, height: 480, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,56,92,0.10) 0%, transparent 70%)',
          pointerEvents: 'none', filter: 'blur(20px)',
        }}/>
        <div aria-hidden="true" style={{
          position: 'absolute', right: '20%', bottom: '-10%',
          width: 380, height: 380, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(194,65,12,0.08) 0%, transparent 70%)',
          pointerEvents: 'none', filter: 'blur(20px)',
        }}/>

        <div className="container" style={{ paddingTop: 56, paddingBottom: 56, position: 'relative' }}>
          <div style={{ maxWidth: 760, position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <span className="badge badge-soft" style={{ fontSize: 12 }}>
                <span className="dot" style={{ background: 'var(--primary)' }}/>
                <span>61<sup>e</sup> édition Carthage — Billetterie ouverte</span>
              </span>
            </div>
            <h1 className="display-hero" style={{ margin: 0 }}>
              Toute la Tunisie<br/>
              <span style={{ fontStyle: 'italic', color: 'var(--primary)' }}>vibre ici.</span>
            </h1>
            <p className="body-md text-body" style={{ marginTop: 20, maxWidth: 540, fontSize: 17 }}>
              Réservez votre place pour les derbys mythiques, les festivals d'été et la scène culturelle tunisienne — billet numérique, paiement local, livré en QR sur votre téléphone.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
              <button className="btn btn-primary btn-lg" onClick={() => document.getElementById('grid-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                Explorer les événements
              </button>
              <button className="btn btn-secondary btn-lg">Comment ça marche</button>
            </div>
            <div style={{ display: 'flex', gap: 28, marginTop: 36, flexWrap: 'wrap' }}>
              <HeroStat n="2 480" label="événements en 2026"/>
              <HeroStat n="180k+" label="billets vendus"/>
              <HeroStat n="4,89" label="note moyenne" suffix={<Icon name="star" size={14} color="#222"/>}/>
            </div>
          </div>

          <div className="hero-collage" style={{
            position: 'absolute', right: -20, top: 40, width: 460, height: 420,
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(3, 1fr)',
            gap: 16, zIndex: 1, pointerEvents: 'none',
          }}>
            {filteredEvents.slice(0, 4).map((e, i) => (
              <div key={e.id} style={{
                borderRadius: 'var(--r-md)', overflow: 'hidden',
                boxShadow: 'var(--shadow-pop)',
                transform: `rotate(${i % 2 === 0 ? -2 : 3}deg) translateY(${i * -4}px)`,
                gridRow: i === 0 ? '1 / 3' : 'auto',
                animation: `pulse ${4 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.4}s`,
              }}>
                <EventPoster event={e} size="card"/>
              </div>
            ))}
          </div>
        </div>

        <HeroTicker/>
      </section>

      <CategoryStrip active={category} onChange={setCategory}/>

      {hot.length > 0 && (
        <section className="section-sm" id="grid-section">
          <div className="container">
            <Reveal>
              <div className="row-between" style={{ marginBottom: 28 }}>
                <div>
                  <h2 className="display-lg" style={{ margin: 0 }}>À la une cette semaine</h2>
                  <p className="body-md text-muted" style={{ margin: '4px 0 0 0' }}>Les événements les plus réservés en ce moment</p>
                </div>
                <button className="btn btn-ghost btn-sm" style={{ borderRadius: 999, fontWeight: 600 }}>
                  Tout voir <Icon name="arrow-right" size={14}/>
                </button>
              </div>
            </Reveal>
            <Reveal stagger>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 28 }}>
                {hot.map((e) => (
                  <EventCard key={e.id} event={e} onOpen={onOpenEvent} saved={saved.has(e.id)} onToggleSave={() => onToggleSave(e.id)} hideTypeBadge={hideType}/>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <section className="section-sm">
        <div className="container">
          <CategoryCards/>
        </div>
      </section>

      {Object.entries(byCity).map(([city, evts]) => evts.length >= 1 && (
        <section className="section-sm" key={city}>
          <div className="container">
            <Reveal>
              <div className="row-between" style={{ marginBottom: 20 }}>
                <h3 className="display-md" style={{ margin: 0 }}>Événements à {city}</h3>
                <button className="btn btn-ghost btn-sm" style={{ borderRadius: 999 }}>
                  Voir tout <Icon name="chevron-right" size={14}/>
                </button>
              </div>
            </Reveal>
            <Reveal stagger>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
                {evts.map((e) => (
                  <EventCard key={e.id} event={e} onOpen={onOpenEvent} saved={saved.has(e.id)} onToggleSave={() => onToggleSave(e.id)} hideTypeBadge={hideType}/>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      ))}

      <WhyStrip/>
    </div>
  );
}

function HeroStat({ n, label, suffix }: { n: string; label: string; suffix?: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, lineHeight: 1, display: 'flex', alignItems: 'baseline', gap: 6 }}>
        {n} {suffix}
      </div>
      <div className="body-sm text-muted" style={{ marginTop: 4 }}>{label}</div>
    </div>
  );
}

function CategoryCards() {
  return (
    <Reveal stagger>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
        <CategoryCard type="sports" title="Sport" subtitle="Derbys, qualifications, finales — l'adrénaline tunisienne au stade." accent="var(--sports)" accentSoft="var(--sports-soft)" icon="football" stats="48 événements à venir"/>
        <CategoryCard type="festivals" title="Festivals" subtitle="Carthage, Hammamet, Tabarka, JCC — vivez la scène culturelle d'été." accent="var(--festivals)" accentSoft="var(--festivals-soft)" icon="music" stats="124 dates programmées"/>
      </div>
    </Reveal>
  );
}

function CategoryCard({ title, subtitle, accent, accentSoft, icon, stats }: { type: string; title: string; subtitle: string; accent: string; accentSoft: string; icon: string; stats: string }) {
  return (
    <div style={{
      position: 'relative', borderRadius: 'var(--r-lg)', overflow: 'hidden',
      background: accentSoft, padding: 32, minHeight: 260,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      cursor: 'pointer', transition: 'transform .25s ease, box-shadow .25s ease',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-pop)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <svg width="240" height="240" viewBox="0 0 100 100" style={{ position: 'absolute', right: -40, top: -40, opacity: 0.18 }}>
        <g transform="translate(50 50)" fill="none" stroke={accent} strokeWidth="0.6">
          {[0, 22.5, 45, 67.5].map((r) => (
            <polygon key={r} points="0,-40 12,-12 40,0 12,12 0,40 -12,12 -40,0 -12,-12" transform={`rotate(${r})`}/>
          ))}
        </g>
      </svg>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ width: 56, height: 56, borderRadius: 999, background: accent, color: '#fff', display: 'grid', placeItems: 'center', marginBottom: 20 }}>
          <Icon name={icon as 'football' | 'music'} size={26} strokeWidth={1.6}/>
        </div>
        <h3 className="display-lg" style={{ margin: 0, color: accent }}>{title}</h3>
        <p className="body-md" style={{ margin: '8px 0 0 0', color: 'var(--body)', maxWidth: 360 }}>{subtitle}</p>
      </div>
      <div className="row-between" style={{ position: 'relative', zIndex: 1, marginTop: 28 }}>
        <span className="caption text-muted">{stats}</span>
        <span style={{ width: 44, height: 44, borderRadius: 999, background: accent, color: '#fff', display: 'grid', placeItems: 'center' }}>
          <Icon name="arrow-right" size={18} color="#fff" strokeWidth={2.2}/>
        </span>
      </div>
    </div>
  );
}
