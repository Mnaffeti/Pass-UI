import { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';
import { EventCard } from '@/components/ui/EventCard';
import { EventPoster } from '@/components/ui/EventPoster';
import { Reveal } from '@/components/ui/Reveal';
import { EVENTS, eventById } from '@/data/events';
import { formatPrice, formatDate } from '@/utils/formatting';
import type { User, Order, Payment, Event } from '@/types';

interface AccountPageProps {
  orders: Order[];
  saved: Set<string>;
  user: User;
  paymentHistory: Payment[];
  onOpenEvent: (event: Event) => void;
  onToggleSave: (id: string) => void;
  onHome: () => void;
  onLogout: () => void;
  initialTab?: string;
}

type FlatTicket = { eventId: string; tierId: string; tierLabel: string; price: number; qty: number; seatNum?: string; orderId: string; info: Order['info']; paidAt: string };

export function AccountPage({ orders, saved, user, paymentHistory, onOpenEvent, onToggleSave, onHome, onLogout, initialTab }: AccountPageProps) {
  const [tab, setTab] = useState(initialTab ?? 'upcoming');

  useEffect(() => { if (initialTab) setTab(initialTab); }, [initialTab]);

  const allTickets: FlatTicket[] = orders.flatMap((o) =>
    o.tickets.map((t) => ({ ...t, orderId: o.orderId, info: o.info, paidAt: o.paidAt }))
  );

  const now = new Date().toISOString().slice(0, 10);
  const upcoming = allTickets.filter((t) => { const e = eventById(t.eventId); return e && e.date >= now; });
  const past     = allTickets.filter((t) => { const e = eventById(t.eventId); return e && e.date < now; });
  const savedList = EVENTS.filter((e) => saved.has(e.id));
  const totalSpent = (paymentHistory ?? []).filter((p) => p.status === 'success').reduce((s, p) => s + p.amount, 0);

  const TABS: [string, string, number | null, string][] = [
    ['upcoming', 'À venir',         upcoming.length,          'ticket'],
    ['past',     'Historique',       past.length,              'clock'],
    ['payments', 'Paiements',        (paymentHistory ?? []).length, 'wallet'],
    ['saved',    'Favoris',          savedList.length,         'heart'],
    ['profile',  'Profil',           null,                     'user'],
    ['settings', 'Paramètres',       null,                     'sliders'],
  ];

  return (
    <div className="page-fade-enter">
      <section style={{ background: 'linear-gradient(180deg, #fdf8f0 0%, #ffffff 100%)', borderBottom: '1px solid var(--hairline-soft)' }}>
        <div className="container" style={{ paddingTop: 32, paddingBottom: 32 }}>
          <button onClick={onHome} className="btn btn-ghost btn-sm" style={{ paddingLeft: 0, marginBottom: 14 }}>
            <Icon name="arrow-left" size={16}/> Accueil
          </button>
          <div className="row-between" style={{ alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 }}>
            <div className="row gap-base" style={{ alignItems: 'center' }}>
              <div style={{
                width: 88, height: 88, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--festivals))',
                color: '#fff', display: 'grid', placeItems: 'center',
                fontFamily: 'var(--font-display)', fontSize: 38,
                boxShadow: '0 8px 24px rgba(255,56,92,0.25)',
                border: '4px solid #fff',
              }}>
                {user?.avatar ?? user?.firstName?.[0] ?? 'A'}
              </div>
              <div>
                <span className="badge badge-soft" style={{ marginBottom: 6, fontSize: 11 }}>
                  <Icon name="check-circle" size={11}/> Compte vérifié
                </span>
                <h1 className="display-xl" style={{ margin: 0 }}>{user?.firstName} {user?.lastName}</h1>
                <p className="body-md text-muted" style={{ margin: '4px 0 0 0' }}>
                  Membre depuis {formatDate(user?.memberSince ?? '2025-01-01')} · {user?.city}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <ProfileStat n={allTickets.length} label="Billets achetés"/>
              <ProfileStat n={formatPrice(totalSpent).replace(' DT', '')} label="Dépensé (DT)" small/>
              <ProfileStat n={savedList.length} label="Favoris"/>
              <ProfileStat n={upcoming.length} label="À venir"/>
            </div>
          </div>
        </div>
      </section>

      <div className="container" style={{ paddingTop: 28, paddingBottom: 80 }}>
        <div style={{ borderBottom: '1px solid var(--hairline)', marginBottom: 28 }}>
          <div className="row no-scrollbar" style={{ gap: 28, overflowX: 'auto' }}>
            {TABS.map(([k, label, count, icon]) => (
              <button key={k} onClick={() => setTab(k)} style={{
                padding: '14px 0',
                borderBottom: tab === k ? '2px solid var(--ink)' : '2px solid transparent',
                color: tab === k ? 'var(--ink)' : 'var(--muted)',
                fontWeight: tab === k ? 600 : 500,
                fontSize: 15,
                display: 'inline-flex', alignItems: 'center', gap: 8,
                whiteSpace: 'nowrap',
              }}>
                <Icon name={icon as 'ticket' | 'clock' | 'wallet' | 'heart' | 'user' | 'sliders'} size={16}/>
                {label}
                {count != null && (
                  <span style={{
                    background: tab === k ? 'var(--ink)' : 'var(--surface-strong)',
                    color: tab === k ? '#fff' : 'var(--muted)',
                    fontSize: 11, fontWeight: 600,
                    padding: '2px 8px', borderRadius: 999,
                  }}>{count}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {tab === 'upcoming' && (upcoming.length === 0 ? (
          <EmptyState icon="ticket" title="Aucun billet à venir" body="Réservez vos prochains événements pour les voir ici." cta={<button className="btn btn-primary" onClick={onHome}>Explorer les événements</button>}/>
        ) : (
          <Reveal stagger><div className="col gap-base">{upcoming.map((t, i) => <AccountTicketRow key={i} ticket={t}/>)}</div></Reveal>
        ))}

        {tab === 'past' && (past.length === 0 ? (
          <EmptyState icon="ticket" title="Aucun billet passé" body="Votre historique apparaîtra ici."/>
        ) : (
          <div className="col gap-base">{past.map((t, i) => <AccountTicketRow key={i} ticket={t} past/>)}</div>
        ))}

        {tab === 'payments' && <PaymentHistory history={paymentHistory ?? []}/>}

        {tab === 'saved' && (savedList.length === 0 ? (
          <EmptyState icon="heart" title="Aucun favori" body="Cliquez sur le ❤︎ pour sauvegarder un événement."/>
        ) : (
          <Reveal stagger>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
              {savedList.map((e) => (
                <EventCard key={e.id} event={e} onOpen={onOpenEvent} saved={saved.has(e.id)} onToggleSave={() => onToggleSave(e.id)}/>
              ))}
            </div>
          </Reveal>
        ))}

        {tab === 'profile'  && <ProfileTab user={user}/>}
        {tab === 'settings' && <SettingsTab onLogout={onLogout}/>}
      </div>
    </div>
  );
}

function ProfileStat({ n, label, small }: { n: number | string; label: string; small?: boolean }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: small ? 28 : 36, lineHeight: 1 }}>{n}</div>
      <div className="body-sm text-muted" style={{ marginTop: 4 }}>{label}</div>
    </div>
  );
}

function PaymentHistory({ history }: { history: Payment[] }) {
  if (history.length === 0) return <EmptyState icon="wallet" title="Aucun paiement" body="Vos transactions apparaîtront ici."/>;
  const total    = history.filter((p) => p.status === 'success').reduce((s, p) => s + p.amount, 0);
  const refunded = history.filter((p) => p.status === 'refunded').reduce((s, p) => s + p.amount, 0);
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
        <PaymentSummaryCard label="Total dépensé"    value={formatPrice(total)}  icon="wallet"/>
        <PaymentSummaryCard label="Transactions"     value={history.length}      icon="ticket"/>
        <PaymentSummaryCard label="Remboursé"        value={formatPrice(refunded)} icon="check-circle"/>
        <PaymentSummaryCard label="Méthode favorite" value="Flouci"              icon="sparkle"/>
      </div>
      <div style={{ border: '1px solid var(--hairline-soft)', borderRadius: 'var(--r-md)', overflow: 'hidden', background: '#fff' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '110px 1fr 130px 110px 130px', gap: 14,
          padding: '14px 20px', background: 'var(--surface-soft)',
          borderBottom: '1px solid var(--hairline)',
          fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)',
        }}>
          <span>Date</span><span>Description</span><span>Méthode</span><span>Statut</span><span style={{ textAlign: 'right' }}>Montant</span>
        </div>
        {history.map((p, i) => <PaymentRow key={p.id} payment={p} last={i === history.length - 1}/>)}
      </div>
      <div className="row-between" style={{ marginTop: 16 }}>
        <span className="caption text-muted">Affichage des {history.length} dernières transactions</span>
        <button className="btn btn-ghost btn-sm" style={{ border: '1px solid var(--hairline)' }}><Icon name="download" size={14}/> Exporter (CSV)</button>
      </div>
    </div>
  );
}

function PaymentSummaryCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div style={{ padding: 18, background: '#fff', border: '1px solid var(--hairline-soft)', borderRadius: 'var(--r-md)' }}>
      <div className="row-between">
        <span className="caption text-muted" style={{ textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</span>
        <Icon name={icon as 'wallet'} size={16} color="var(--muted)"/>
      </div>
      <div className="display-md" style={{ marginTop: 8 }}>{value}</div>
    </div>
  );
}

function PaymentRow({ payment, last }: { payment: Payment; last: boolean }) {
  const methodMap: Record<string, { label: string; color: string }> = {
    flouci: { label: 'Flouci',       color: '#22c55e' },
    card:   { label: 'Carte ••3456', color: '#1a4ba6' },
    d17:    { label: 'D17 La Poste', color: '#f59e0b' },
  };
  const statusMap: Record<string, { label: string; bg: string; fg: string }> = {
    success:  { label: 'Réussi',     bg: '#dcfce7', fg: '#166534' },
    refunded: { label: 'Remboursé',  bg: '#fef3c7', fg: '#92400e' },
    pending:  { label: 'En attente', bg: '#dbeafe', fg: '#1e40af' },
    failed:   { label: 'Échec',      bg: '#fee2e2', fg: '#991b1b' },
  };
  const method = methodMap[payment.method] ?? { label: payment.method, color: '#888' };
  const status = statusMap[payment.status] ?? { label: payment.status, bg: '#f0f0f0', fg: '#666' };

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '110px 1fr 130px 110px 130px', gap: 14,
      padding: '16px 20px',
      borderBottom: last ? 'none' : '1px solid var(--hairline-soft)',
      alignItems: 'center', transition: 'background-color .15s ease',
    }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-soft)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      <div className="body-sm text-muted">{formatDate(payment.date)}</div>
      <div>
        <div className="title-sm">{payment.label}</div>
        <div className="caption-sm text-muted mono">{payment.id} · {payment.orderRef}</div>
      </div>
      <div className="row gap-xs" style={{ alignItems: 'center' }}>
        <span style={{ width: 8, height: 8, borderRadius: 2, background: method.color }}/>
        <span className="body-sm">{method.label}</span>
      </div>
      <span className="badge" style={{ background: status.bg, color: status.fg, boxShadow: 'none', justifySelf: 'flex-start' }}>{status.label}</span>
      <div style={{
        textAlign: 'right', fontWeight: 600,
        textDecoration: payment.status === 'refunded' ? 'line-through' : 'none',
        color: payment.status === 'refunded' ? 'var(--muted)' : 'var(--ink)',
      }}>{formatPrice(payment.amount)}</div>
    </div>
  );
}

function ProfileTab({ user }: { user: User }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
      <Reveal>
        <div style={{ padding: 24, border: '1px solid var(--hairline-soft)', borderRadius: 'var(--r-md)', background: '#fff' }}>
          <div className="row-between" style={{ marginBottom: 18 }}>
            <h3 className="display-sm" style={{ margin: 0 }}>Informations personnelles</h3>
            <button className="btn btn-ghost btn-sm" style={{ border: '1px solid var(--hairline)' }}>Modifier</button>
          </div>
          <div className="col gap-base">
            <ProfileRow label="Prénom"    value={user?.firstName}/>
            <ProfileRow label="Nom"       value={user?.lastName}/>
            <ProfileRow label="Email"     value={user?.email}/>
            <ProfileRow label="Téléphone" value={user?.phone}/>
            <ProfileRow label="CIN"       value={user?.cin ? `••••${user.cin.slice(-4)}` : '—'}/>
            <ProfileRow label="Ville"     value={user?.city}/>
          </div>
        </div>
      </Reveal>
      <Reveal>
        <div style={{ padding: 24, border: '1px solid var(--hairline-soft)', borderRadius: 'var(--r-md)', background: '#fff' }}>
          <div className="row-between" style={{ marginBottom: 18 }}>
            <h3 className="display-sm" style={{ margin: 0 }}>Préférences événements</h3>
          </div>
          <div className="col gap-base">
            <ProfileRow label="Équipe favorite" value={user?.preferences?.favoriteTeam}/>
            <ProfileRow label="Lieu favori"     value={user?.preferences?.favoriteVenue}/>
            <ProfileRow label="Newsletter"       value={user?.preferences?.newsletter ? 'Activée' : 'Désactivée'}/>
            <ProfileRow label="SMS rappels"      value={user?.preferences?.smsAlerts ? 'Activés' : 'Désactivés'}/>
          </div>
        </div>
      </Reveal>
      <Reveal>
        <div style={{ padding: 24, border: '1px solid var(--hairline-soft)', borderRadius: 'var(--r-md)', background: '#fff' }}>
          <h3 className="display-sm" style={{ margin: '0 0 18px 0' }}>Sécurité</h3>
          <div className="col gap-base">
            <ProfileRow label="Mot de passe"          value="Modifié il y a 3 mois"/>
            <ProfileRow label="Authentification 2FA"  value={<span className="badge badge-soft" style={{ background: '#fef3c7', color: '#92400e' }}>Non activée</span>}/>
            <ProfileRow label="Sessions actives"      value="2 appareils"/>
          </div>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: 16 }}>
            <Icon name="shield" size={14}/> Activer l'authentification 2FA
          </button>
        </div>
      </Reveal>
      <Reveal>
        <div style={{ padding: 24, background: 'linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%)', borderRadius: 'var(--r-md)', border: '1px solid #fde68a', position: 'relative', overflow: 'hidden' }}>
          <svg width="180" height="180" viewBox="0 0 100 100" style={{ position: 'absolute', right: -30, top: -30, opacity: 0.15 }}>
            <g transform="translate(50 50)" fill="none" stroke="#92400e" strokeWidth="0.6">
              {[0, 22.5, 45, 67.5].map((r) => (<polygon key={r} points="0,-40 12,-12 40,0 12,12 0,40 -12,12 -40,0 -12,-12" transform={`rotate(${r})`}/>))}
            </g>
          </svg>
          <div style={{ position: 'relative' }}>
            <span className="badge badge-ink">PassINI+ </span>
            <h3 className="display-sm" style={{ margin: '12px 0 6px 0' }}>Passez à PassINI+</h3>
            <p className="body-sm text-body" style={{ margin: 0, marginBottom: 16, maxWidth: 280 }}>Pré-vente sur les gros événements, frais de service offerts, billets prioritaires.</p>
            <button className="btn btn-dark btn-sm">Découvrir PassINI+</button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="row-between" style={{ alignItems: 'flex-start', gap: 16 }}>
      <span className="body-sm text-muted">{label}</span>
      <span className="body-sm" style={{ fontWeight: 500, textAlign: 'right' }}>{value ?? '—'}</span>
    </div>
  );
}

function SettingsTab({ onLogout }: { onLogout: () => void }) {
  return (
    <div style={{ maxWidth: 640 }}>
      <Reveal>
        <h3 className="display-sm" style={{ margin: '0 0 16px 0' }}>Notifications</h3>
        <div style={{ border: '1px solid var(--hairline-soft)', borderRadius: 'var(--r-md)', background: '#fff', overflow: 'hidden' }}>
          <ToggleRow label="Nouveaux événements" body="Recevoir un email quand un événement de votre catégorie favorite est annoncé." defaultOn/>
          <ToggleRow label="Rappels 24h"         body="SMS de rappel 24 heures avant chaque événement."                              defaultOn/>
          <ToggleRow label="Offres partenaires"  body="Promotions des organisateurs et partenaires PassINI."/>
          <ToggleRow label="Newsletter mensuelle" body="Le meilleur de la programmation tunisienne."                                 defaultOn last/>
        </div>
      </Reveal>
      <Reveal>
        <h3 className="display-sm" style={{ margin: '32px 0 16px 0' }}>Confidentialité</h3>
        <div style={{ border: '1px solid var(--hairline-soft)', borderRadius: 'var(--r-md)', background: '#fff', overflow: 'hidden' }}>
          <SettingsAction label="Télécharger mes données" desc="Recevoir une archive de votre compte (RGPD)." cta="Demander" icon="download"/>
          <SettingsAction label="Supprimer mon compte" desc="Action irréversible. Tous vos billets restent valides." cta="Supprimer" icon="close" danger last/>
        </div>
      </Reveal>
      <Reveal>
        <h3 className="display-sm" style={{ margin: '32px 0 16px 0' }}>Compte</h3>
        <button className="btn btn-secondary" onClick={onLogout}><Icon name="logout" size={16}/> Se déconnecter</button>
      </Reveal>
    </div>
  );
}

function ToggleRow({ label, body, defaultOn, last }: { label: string; body: string; defaultOn?: boolean; last?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div onClick={() => setOn(!on)} style={{
      display: 'flex', alignItems: 'center', gap: 16, padding: 18,
      borderBottom: last ? 'none' : '1px solid var(--hairline-soft)',
      cursor: 'pointer',
    }}>
      <div style={{ flex: 1 }}>
        <div className="title-sm">{label}</div>
        <div className="body-sm text-muted" style={{ marginTop: 2 }}>{body}</div>
      </div>
      <div style={{ width: 44, height: 26, borderRadius: 999, background: on ? 'var(--ink)' : 'var(--surface-strong)', padding: 3, transition: 'background-color .2s ease' }}>
        <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', transform: on ? 'translateX(18px)' : 'translateX(0)', transition: 'transform .2s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}/>
      </div>
    </div>
  );
}

function SettingsAction({ label, desc, cta, icon, danger, last }: { label: string; desc: string; cta: string; icon: string; danger?: boolean; last?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 18, borderBottom: last ? 'none' : '1px solid var(--hairline-soft)' }}>
      <div style={{ flex: 1 }}>
        <div className="title-sm" style={{ color: danger ? 'var(--error)' : 'var(--ink)' }}>{label}</div>
        <div className="body-sm text-muted" style={{ marginTop: 2 }}>{desc}</div>
      </div>
      <button className={`btn btn-sm ${danger ? '' : 'btn-secondary'}`} style={danger ? { color: 'var(--error)', border: '1px solid var(--error)', background: '#fff' } : {}}>
        <Icon name={icon as 'download' | 'close'} size={14} color={danger ? 'var(--error)' : 'currentColor'}/> {cta}
      </button>
    </div>
  );
}

function AccountTicketRow({ ticket, past }: { ticket: FlatTicket; past?: boolean }) {
  const event = eventById(ticket.eventId);
  if (!event) return null;
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 18,
      padding: 16, border: '1px solid var(--hairline-soft)', borderRadius: 'var(--r-md)',
      background: '#fff', opacity: past ? 0.65 : 1,
    }}>
      <div style={{ width: 120, height: 120, borderRadius: 'var(--r-sm)', overflow: 'hidden' }}>
        <EventPoster event={event} size="card"/>
      </div>
      <div>
        <div className="caption text-muted" style={{ textTransform: 'uppercase', letterSpacing: '.08em' }}>
          {event.type === 'sports' ? 'Sport' : 'Festival'} · N° <span className="mono">{ticket.orderId}</span>
        </div>
        <h3 className="title-md" style={{ margin: '4px 0 0 0' }}>{event.title}</h3>
        <div className="body-sm text-muted">{event.venue}, {event.city}</div>
        <div className="row" style={{ marginTop: 8, gap: 14, flexWrap: 'wrap' }}>
          <span className="body-sm row gap-xs"><Icon name="calendar" size={12}/> {formatDate(event.date)}</span>
          <span className="body-sm row gap-xs"><Icon name="clock" size={12}/> {event.time}</span>
          <span className="body-sm row gap-xs"><Icon name="ticket" size={12}/> {ticket.tierLabel}</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        {!past ? (
          <>
            <span className="badge badge-soft" style={{ background: '#dcfce7', color: '#166534' }}><Icon name="check-circle" size={11}/> Validé</span>
            <button className="btn btn-dark btn-sm"><Icon name="qr" size={14} color="#fff"/> Voir le QR</button>
          </>
        ) : (
          <span className="caption text-muted">Événement passé</span>
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon, title, body, cta }: { icon: string; title: string; body: string; cta?: React.ReactNode }) {
  return (
    <div style={{ padding: '64px 24px', textAlign: 'center', border: '1px dashed var(--hairline)', borderRadius: 'var(--r-md)' }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--surface-soft)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
        <Icon name={icon as 'ticket'} size={28} color="var(--muted)"/>
      </div>
      <h3 className="display-sm" style={{ margin: '0 0 4px 0' }}>{title}</h3>
      <p className="body-sm text-muted" style={{ marginBottom: 16 }}>{body}</p>
      {cta}
    </div>
  );
}
