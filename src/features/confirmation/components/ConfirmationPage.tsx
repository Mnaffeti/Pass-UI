import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { QrCode } from '@/components/ui/QrCode';
import { EventPoster } from '@/components/ui/EventPoster';
import { Reveal } from '@/components/ui/Reveal';
import { eventById } from '@/data/events';
import { formatPrice, formatDate } from '@/utils/formatting';
import type { Order, OrderTicket } from '@/types';

interface ConfirmationPageProps {
  order: Order;
  onHome: () => void;
  onAccount: () => void;
}

export function ConfirmationPage({ order, onHome, onAccount }: ConfirmationPageProps) {
  const [showTicket, setShowTicket] = useState<OrderTicket | null>(null);

  return (
    <div className="page-fade-enter">
      <style>{`
        @keyframes popIn    { from { transform: scale(0.4); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes confetti { 0% { transform: translateY(-20px) rotate(0deg); opacity: 0; } 20% { opacity: 1; } 100% { transform: translateY(400px) rotate(720deg); opacity: 0; } }
        @keyframes fadeIn   { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      <section style={{ background: 'linear-gradient(180deg, #f0fdf4 0%, #fff 100%)', borderBottom: '1px solid var(--hairline-soft)' }}>
        <div className="container" style={{ paddingTop: 56, paddingBottom: 56, textAlign: 'center', maxWidth: 720 }}>
          <div style={{
            width: 88, height: 88, borderRadius: '50%',
            background: '#16a34a', display: 'grid', placeItems: 'center',
            margin: '0 auto 24px',
            animation: 'popIn .5s cubic-bezier(.2,.7,.2,1)',
            boxShadow: '0 8px 24px rgba(22,163,74,0.3)',
          }}>
            <Icon name="check" size={44} color="#fff" strokeWidth={3}/>
          </div>

          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, pointerEvents: 'none', height: 400, overflow: 'hidden' }}>
            {[...Array(30)].map((_, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: `${(i * 13) % 100}%`,
                top: -20, width: 8, height: 12,
                background: (['#ff385c', '#0a2540', '#c2410c', '#16a34a', '#facc15'] as const)[i % 5],
                borderRadius: 2,
                animation: `confetti ${3 + (i % 4)}s ease-in ${i * 0.08}s infinite`,
              }}/>
            ))}
          </div>

          <h1 className="display-xl" style={{ margin: '0 0 12px 0', position: 'relative' }}>Commande confirmée !</h1>
          <p className="body-md text-body" style={{ margin: 0, fontSize: 17, position: 'relative' }}>
            Vos billets ont été envoyés à <strong>{order.info.email}</strong>. Présentez le QR à l'entrée — c'est tout.
          </p>

          <div className="row" style={{ justifyContent: 'center', gap: 12, marginTop: 24, position: 'relative', flexWrap: 'wrap' }}>
            <span className="badge badge-soft"><Icon name="ticket" size={11}/> N° <span className="mono">{order.orderId}</span></span>
            <span className="badge badge-soft"><Icon name="wallet" size={11}/> {formatPrice(order.total)} payés</span>
            <span className="badge badge-soft"><Icon name="calendar" size={11}/> {formatDate(new Date().toISOString().slice(0, 10))}</span>
          </div>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <Reveal>
            <h2 className="display-lg" style={{ margin: '0 0 8px 0' }}>Vos billets</h2>
            <p className="body-md text-muted" style={{ margin: '0 0 28px 0' }}>Téléchargez ou montrez-les depuis votre téléphone. Hors-ligne compatible.</p>
          </Reveal>
          <Reveal stagger>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 20 }}>
              {order.tickets.map((t, i) => (
                <ETicketCard key={i} ticket={t} order={order} onShow={() => setShowTicket(t)}/>
              ))}
            </div>
          </Reveal>
          <div className="row" style={{ justifyContent: 'center', gap: 12, marginTop: 36, flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={onAccount}><Icon name="ticket" size={16}/> Mes billets</button>
            <button className="btn btn-primary" onClick={onHome}>Explorer plus d'événements</button>
          </div>
        </div>
      </section>

      <section className="section-sm" style={{ background: 'var(--surface-soft)' }}>
        <div className="container">
          <Reveal stagger>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
              <ConfirmStep n="01" title="Reçu par email" body="Le récapitulatif et la facture sont déjà dans votre boîte."/>
              <ConfirmStep n="02" title="SMS de rappel" body="Vous recevrez un SMS 24h avant l'événement avec l'accès."/>
              <ConfirmStep n="03" title="Au stade / festival" body="QR scanné à l'entrée, accès direct. Pensez à votre CIN."/>
              <ConfirmStep n="04" title="Souvenirs" body="Votre billet reste dans Mes billets pour les souvenirs."/>
            </div>
          </Reveal>
        </div>
      </section>

      {showTicket && <TicketModal ticket={showTicket} order={order} onClose={() => setShowTicket(null)}/>}
    </div>
  );
}

function ConfirmStep({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--primary)', lineHeight: 1 }}>{n}</div>
      <h4 className="title-md" style={{ margin: '10px 0 4px 0' }}>{title}</h4>
      <p className="body-sm text-body" style={{ margin: 0, lineHeight: 1.5 }}>{body}</p>
    </div>
  );
}

function ETicketCard({ ticket, order, onShow }: { ticket: OrderTicket; order: Order; onShow: () => void }) {
  const event = eventById(ticket.eventId);
  if (!event) return null;
  const qrValue = `PASSINI-${order.orderId}-${ticket.eventId}-${ticket.tierId}-${ticket.seatNum ?? ''}`;

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr auto',
      background: '#fff', borderRadius: 'var(--r-md)', overflow: 'hidden',
      border: '1px solid var(--hairline)', boxShadow: 'var(--shadow-card)',
      position: 'relative',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 90, position: 'relative', overflow: 'hidden' }}>
          <EventPoster event={event} size="thumb"/>
        </div>
        <div style={{ padding: 18, flex: 1 }}>
          <div className="caption text-muted" style={{ textTransform: 'uppercase', letterSpacing: '.1em' }}>
            {event.type === 'sports' ? 'Sport · ' : 'Festival · '}{event.subtitle}
          </div>
          <h3 className="title-md" style={{ margin: '4px 0 0 0' }}>{event.title}</h3>
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <TicketMeta label="Date" value={formatDate(event.date)}/>
            <TicketMeta label="Horaire" value={event.time}/>
            <TicketMeta label="Lieu" value={event.venue}/>
            <TicketMeta label="Catégorie" value={ticket.tierLabel}/>
            <TicketMeta label="Titulaire" value={`${order.info.firstName} ${order.info.lastName}`}/>
            <TicketMeta label="N° place" value={ticket.seatNum ?? 'Libre'}/>
          </div>
          <div className="row" style={{ marginTop: 14, gap: 8 }}>
            <button className="btn btn-dark btn-sm" onClick={onShow}><Icon name="qr" size={14} color="#fff"/> Afficher le billet</button>
            <button className="btn btn-ghost btn-sm" style={{ border: '1px solid var(--hairline)' }}><Icon name="download" size={14}/> PDF</button>
          </div>
        </div>
      </div>
      <div style={{
        width: 140, background: 'var(--surface-soft)',
        borderLeft: '2px dashed var(--hairline)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 14, position: 'relative',
      }}>
        <span style={{ position: 'absolute', left: -10, top: -10, width: 20, height: 20, borderRadius: '50%', background: 'var(--surface-soft, #f7f7f7)' }}/>
        <span style={{ position: 'absolute', left: -10, bottom: -10, width: 20, height: 20, borderRadius: '50%', background: 'var(--surface-soft, #f7f7f7)' }}/>
        <QrCode value={qrValue} size={108}/>
        <div className="mono" style={{ marginTop: 8, fontSize: 10, textAlign: 'center', color: 'var(--muted)' }}>
          {qrValue.slice(0, 16)}…
        </div>
      </div>
    </div>
  );
}

function TicketMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="caption-sm text-muted" style={{ textTransform: 'uppercase', letterSpacing: '.08em', fontSize: 10 }}>{label}</div>
      <div className="body-sm" style={{ fontWeight: 600, marginTop: 2 }}>{value}</div>
    </div>
  );
}

function TicketModal({ ticket, order, onClose }: { ticket: OrderTicket; order: Order; onClose: () => void }) {
  const event = eventById(ticket.eventId);
  if (!event) return null;
  const qrValue = `PASSINI-${order.orderId}-${ticket.eventId}-${ticket.tierId}-${ticket.seatNum ?? ''}`;
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.7)',
      zIndex: 200, display: 'grid', placeItems: 'center',
      padding: 24, animation: 'fadeIn .25s ease',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        maxWidth: 420, width: '100%',
        background: '#fff', borderRadius: 'var(--r-lg)', overflow: 'hidden',
        animation: 'popIn .35s cubic-bezier(.2,.7,.2,1)',
      }}>
        <div style={{ height: 180, position: 'relative' }}>
          <EventPoster event={event} size="thumb"/>
          <button onClick={onClose} className="btn-icon" style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(255,255,255,0.95)' }}>
            <Icon name="close" size={18}/>
          </button>
        </div>
        <div style={{ padding: 24, textAlign: 'center' }}>
          <div className="caption text-muted" style={{ textTransform: 'uppercase', letterSpacing: '.1em' }}>{event.subtitle}</div>
          <h2 className="display-md" style={{ margin: '4px 0 0 0' }}>{event.title}</h2>
          <p className="body-sm text-muted" style={{ marginTop: 4 }}>{formatDate(event.date, { long: true })} · {event.time}</p>
          <div style={{ margin: '20px auto', padding: 18, background: '#fff', border: '2px solid var(--ink)', borderRadius: 'var(--r-md)', display: 'inline-block' }}>
            <QrCode value={qrValue} size={220}/>
          </div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{qrValue}</div>
          <div className="row" style={{ justifyContent: 'center', gap: 18, marginTop: 18, flexWrap: 'wrap' }}>
            <TicketMeta label="Catégorie" value={ticket.tierLabel}/>
            <TicketMeta label="Place" value={ticket.seatNum ?? 'Libre'}/>
            <TicketMeta label="Titulaire" value={`${order.info.firstName} ${order.info.lastName}`}/>
          </div>
        </div>
      </div>
    </div>
  );
}
