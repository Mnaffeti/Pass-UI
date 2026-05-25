import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { EventPoster } from '@/components/ui/EventPoster';
import { StarRating } from '@/components/ui/StarRating';
import { Stepper } from '@/components/ui/Stepper';
import { Reveal } from '@/components/ui/Reveal';
import { formatPrice, formatDate } from '@/utils/formatting';
import { SeatMap } from './SeatMap';
import type { Event } from '@/types';

interface EventDetailPageProps {
  event: Event;
  onBack: () => void;
  onAddToCart: (event: Event, tierId: string, qty: number) => void;
  saved: boolean;
  onToggleSave: () => void;
  onOpenCart: () => void;
}

export function EventDetailPage({ event, onBack, onAddToCart, saved, onToggleSave, onOpenCart }: EventDetailPageProps) {
  const [qty, setQty] = useState<Record<string, number>>(
    Object.fromEntries(event.tickets.map((t) => [t.id, 0]))
  );
  const [selectedTier, setSelectedTier] = useState(event.tickets[1]?.id ?? event.tickets[0].id);

  const totalQty = Object.values(qty).reduce((a, b) => a + b, 0);
  const subtotal = event.tickets.reduce((sum, t) => sum + (qty[t.id] ?? 0) * t.price, 0);
  const fees = Math.round(subtotal * 0.04);

  const setTier = (tid: string, n: number) => {
    setQty((prev) => ({ ...prev, [tid]: Math.max(0, Math.min(10, n)) }));
  };

  const addAll = () => {
    Object.entries(qty).forEach(([tid, n]) => { if (n > 0) onAddToCart(event, tid, n); });
    setQty(Object.fromEntries(event.tickets.map((t) => [t.id, 0])));
    onOpenCart();
  };

  return (
    <div className="page-fade-enter">
      <section style={{ position: 'relative' }}>
        <div className="container" style={{ paddingTop: 20 }}>
          <button onClick={onBack} className="btn btn-ghost btn-sm" style={{ paddingLeft: 0, marginBottom: 14 }}>
            <Icon name="arrow-left" size={16}/> Retour aux événements
          </button>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '21 / 9', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
            <EventPoster event={event} size="hero"/>
            <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 10 }}>
              <button onClick={onToggleSave} style={{
                height: 44, padding: '0 14px 0 12px',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 999, fontWeight: 600, fontSize: 13,
              }}>
                <Icon name={saved ? 'heart-fill' : 'heart'} color={saved ? '#ff385c' : '#222'} size={16}/>
                {saved ? 'Sauvegardé' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-sm">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: 48, alignItems: 'start' }}>
          <div>
            <Reveal>
              <div>
                <div className="row gap-sm" style={{ marginBottom: 8 }}>
                  <span className={`badge ${event.type === 'sports' ? 'badge-sports' : 'badge-festivals'}`}>
                    {event.type === 'sports' ? 'Sport' : 'Festival'}
                  </span>
                  <span className="badge badge-soft">{event.subtitle}</span>
                </div>
                <h1 className="display-xl" style={{ margin: '4px 0 12px 0' }}>{event.title}</h1>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, color: 'var(--body)' }}>
                  <span className="body-md row gap-xs"><Icon name="calendar" size={16}/> {formatDate(event.date, { long: true })}</span>
                  <span className="body-md row gap-xs"><Icon name="clock" size={16}/> {event.time} · {event.duration}</span>
                  <span className="body-md row gap-xs"><Icon name="map-pin" size={16}/> {event.venue}, {event.city}</span>
                  <StarRating value={event.rating} reviews={event.reviews}/>
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div style={{ marginTop: 28, padding: 20, border: '1px solid var(--hairline-soft)', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: 999, background: 'linear-gradient(135deg, var(--primary), var(--festivals))', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontSize: 22 }}>
                  {event.organizer.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="caption text-muted">Organisé par</div>
                  <div className="title-md">{event.organizer}</div>
                </div>
                <span className="badge badge-soft"><Icon name="check-circle" size={11}/> Vérifié</span>
              </div>
            </Reveal>

            <Reveal>
              <div style={{ marginTop: 36, paddingTop: 36, borderTop: '1px solid var(--hairline)' }}>
                <h2 className="display-sm" style={{ margin: '0 0 12px 0' }}>À propos de cet événement</h2>
                <p className="body-md text-body" style={{ margin: 0, fontSize: 17, lineHeight: 1.7 }}>{event.description}</p>
              </div>
            </Reveal>

            <Reveal>
              <div style={{ marginTop: 36, paddingTop: 36, borderTop: '1px solid var(--hairline)' }}>
                <div className="row-between" style={{ marginBottom: 16 }}>
                  <h2 className="display-sm" style={{ margin: 0 }}>Plan de l'enceinte</h2>
                  <span className="caption text-muted">Cliquez sur une zone pour la sélectionner</span>
                </div>
                <SeatMap event={event} selected={selectedTier} onSelect={setSelectedTier}/>
              </div>
            </Reveal>

            <Reveal>
              <div style={{ marginTop: 36, paddingTop: 36, borderTop: '1px solid var(--hairline)' }}>
                <h2 className="display-sm" style={{ margin: '0 0 16px 0' }}>Catégories de billets</h2>
                <div className="col gap-md">
                  {event.tickets.map((t) => (
                    <TicketTier
                      key={t.id} tier={t} qty={qty[t.id] ?? 0}
                      selected={selectedTier === t.id}
                      onSelect={() => setSelectedTier(t.id)}
                      onChange={(n) => { setTier(t.id, n); setSelectedTier(t.id); }}
                    />
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal>
              <div style={{ marginTop: 36, paddingTop: 36, borderTop: '1px solid var(--hairline)' }}>
                <h2 className="display-sm" style={{ margin: '0 0 16px 0' }}>Informations pratiques</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                  <InfoTile icon="ticket" title="E-billet" body="QR code par email + SMS. Présentez-le à l'entrée."/>
                  <InfoTile icon="shield" title="Garantie PassINI" body="Annulable jusqu'à 72h avant l'événement."/>
                  <InfoTile icon="check-circle" title="Accès facilité" body="Espace PMR, vestiaire, parking sécurisé."/>
                  <InfoTile icon="map-pin" title="Localisation" body={`${event.venue}, ${event.city} · 12 min depuis le centre-ville`}/>
                </div>
              </div>
            </Reveal>
          </div>

          <aside style={{ position: 'sticky', top: 96 }}>
            <div className="card" style={{ boxShadow: 'var(--shadow-pop)', padding: 24, borderRadius: 'var(--r-md)' }}>
              <div className="row-between" style={{ alignItems: 'baseline' }}>
                <div>
                  <span className="display-md">{formatPrice(Math.min(...event.tickets.map((t) => t.price)))}</span>
                  <span className="body-md text-muted"> dès</span>
                </div>
                <StarRating value={event.rating} reviews={event.reviews} small/>
              </div>
              <div style={{ marginTop: 16, border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                  <ResField label="Date" value={formatDate(event.date)}/>
                  <ResField label="Horaire" value={event.time} borderLeft/>
                </div>
                <div style={{ borderTop: '1px solid var(--hairline)', padding: '12px 14px' }}>
                  <div className="caption text-muted" style={{ marginBottom: 4 }}>BILLETS SÉLECTIONNÉS</div>
                  {totalQty === 0 ? (
                    <div className="body-sm text-muted">Aucun billet sélectionné</div>
                  ) : (
                    <div className="col gap-xs">
                      {event.tickets.filter((t) => (qty[t.id] ?? 0) > 0).map((t) => (
                        <div key={t.id} className="row-between">
                          <span className="body-sm">{qty[t.id]} × {t.label}</span>
                          <span className="body-sm" style={{ fontWeight: 600 }}>{formatPrice((qty[t.id] ?? 0) * t.price)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button className="btn btn-primary btn-block btn-lg" disabled={totalQty === 0} onClick={addAll} style={{ marginTop: 16 }}>
                {totalQty === 0 ? 'Sélectionnez vos billets' : `Ajouter au panier (${totalQty})`}
              </button>
              <div className="caption-sm text-muted" style={{ textAlign: 'center', marginTop: 10 }}>
                Vous ne serez débité qu'à la confirmation
              </div>
              {totalQty > 0 && (
                <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--hairline)' }} className="col gap-xs">
                  <div className="row-between body-sm text-muted"><span>Sous-total</span><span>{formatPrice(subtotal)}</span></div>
                  <div className="row-between body-sm text-muted"><span>Frais de service (4%)</span><span>{formatPrice(fees)}</span></div>
                  <div className="row-between" style={{ paddingTop: 8, borderTop: '1px solid var(--hairline)', marginTop: 6, fontWeight: 600, fontSize: 16 }}>
                    <span>Total</span><span>{formatPrice(subtotal + fees)}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="row gap-sm" style={{ marginTop: 16, justifyContent: 'center', color: 'var(--muted)' }}>
              <Icon name="shield" size={14}/><span className="caption-sm">Paiement sécurisé · TND</span>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function ResField({ label, value, borderLeft }: { label: string; value: string; borderLeft?: boolean }) {
  return (
    <div style={{ padding: '12px 14px', borderLeft: borderLeft ? '1px solid var(--hairline)' : 'none' }}>
      <div className="caption text-muted" style={{ marginBottom: 2, textTransform: 'uppercase', letterSpacing: '.08em', fontSize: 10 }}>{label}</div>
      <div className="body-sm" style={{ fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function InfoTile({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div style={{ padding: 16, border: '1px solid var(--hairline-soft)', borderRadius: 'var(--r-sm)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surface-soft)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <Icon name={icon} size={18}/>
      </div>
      <div>
        <div className="title-sm" style={{ marginBottom: 2 }}>{title}</div>
        <div className="body-sm text-muted" style={{ lineHeight: 1.45 }}>{body}</div>
      </div>
    </div>
  );
}

function TicketTier({ tier, qty, selected, onSelect, onChange }: { tier: { id: string; label: string; price: number; available: number; perks: string[] }; qty: number; selected: boolean; onSelect: () => void; onChange: (n: number) => void }) {
  const lowStock = tier.available < 50;
  return (
    <div onClick={onSelect} style={{
      display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, padding: 18,
      border: `1.5px solid ${selected ? 'var(--ink)' : 'var(--hairline)'}`,
      borderRadius: 'var(--r-md)', cursor: 'pointer',
      background: selected ? 'var(--surface-soft)' : '#fff',
      transition: 'all .15s ease', alignItems: 'center',
    }}>
      <div>
        <div className="row gap-sm" style={{ marginBottom: 6 }}>
          <span className="title-md">{tier.label}</span>
          {lowStock && (
            <span className="badge" style={{ background: '#fff5e6', color: '#b85c00', boxShadow: 'none' }}>
              <Icon name="flame" size={11} color="#b85c00"/> Plus que {tier.available}
            </span>
          )}
        </div>
        <div className="body-sm text-muted">{tier.perks.length > 0 ? tier.perks.join(' · ') : 'Place libre, ambiance garantie'}</div>
        <div className="title-md" style={{ marginTop: 8 }}>{formatPrice(tier.price)} <span className="body-sm text-muted" style={{ fontWeight: 400 }}>par billet</span></div>
      </div>
      <Stepper value={qty} onChange={onChange} max={Math.min(tier.available, 10)}/>
    </div>
  );
}
