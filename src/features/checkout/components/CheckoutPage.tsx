import { useState, Fragment } from 'react';
import { Field } from '@/components/ui/Field';
import { Icon } from '@/components/ui/Icon';
import { QrCode } from '@/components/ui/QrCode';
import { EventPoster } from '@/components/ui/EventPoster';
import { eventById } from '@/data/events';
import { formatPrice, formatDate } from '@/utils/formatting';
import type { CartItem, CheckoutInfo } from '@/types';

interface CheckoutPageProps {
  items: CartItem[];
  onBack: () => void;
  onComplete: (data: { info: CheckoutInfo; paymentMethod: string; total: number }) => void;
}

type CardInfo = { number: string; name: string; expiry: string; cvc: string };

export function CheckoutPage({ items, onBack, onComplete }: CheckoutPageProps) {
  const [step, setStep] = useState(1);
  const [info, setInfo] = useState<CheckoutInfo>({ firstName: '', lastName: '', email: '', phone: '+216 ', cin: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<string>('flouci');
  const [card, setCard] = useState<CardInfo>({ number: '', name: '', expiry: '', cvc: '' });
  const [acceptTos, setAcceptTos] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const fees = Math.round(subtotal * 0.04);
  const total = subtotal + fees;

  const validateInfo = () => {
    const e: Record<string, string> = {};
    if (!info.firstName.trim()) e.firstName = 'Prénom requis';
    if (!info.lastName.trim()) e.lastName = 'Nom requis';
    if (!/\S+@\S+\.\S+/.test(info.email)) e.email = 'Email invalide';
    if (!/^\+?216\s?\d{2}\s?\d{3}\s?\d{3}$/.test(info.phone.replace(/\s+/g, ' '))) e.phone = 'N° tunisien requis (+216)';
    if (info.cin && !/^\d{8}$/.test(info.cin)) e.cin = 'CIN à 8 chiffres';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e: Record<string, string> = {};
    if (paymentMethod === 'card') {
      if (!/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/.test(card.number)) e.number = 'Numéro à 16 chiffres';
      if (!card.name.trim()) e.name = 'Nom requis';
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) e.expiry = 'Format MM/AA';
      if (!/^\d{3}$/.test(card.cvc)) e.cvc = 'CVC à 3 chiffres';
    }
    if (!acceptTos) e.tos = 'Vous devez accepter les conditions';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 1 && validateInfo()) { setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    else if (step === 2 && validatePayment()) { setStep(3); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    else if (step === 3) { onComplete({ info, paymentMethod, total }); }
  };

  return (
    <div className="page-fade-enter">
      <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>
        <button onClick={onBack} className="btn btn-ghost btn-sm" style={{ paddingLeft: 0, marginBottom: 12 }}>
          <Icon name="arrow-left" size={16}/> Retour
        </button>

        <CheckoutStepper step={step}/>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) 380px',
          gap: 40,
          marginTop: 32,
        }}>
          <div>
            {step === 1 && <CheckoutInfo info={info} setInfo={setInfo} errors={errors}/>}
            {step === 2 && (
              <CheckoutPayment
                paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
                card={card} setCard={setCard}
                acceptTos={acceptTos} setAcceptTos={setAcceptTos}
                errors={errors} total={total}
              />
            )}
            {step === 3 && <CheckoutReview info={info} paymentMethod={paymentMethod} card={card} items={items} total={total}/>}

            <div className="row" style={{ marginTop: 28, gap: 12, justifyContent: 'space-between' }}>
              {step > 1 ? (
                <button className="btn btn-ghost" onClick={() => setStep(step - 1)}>
                  <Icon name="arrow-left" size={16}/> Étape précédente
                </button>
              ) : <span/>}
              <button className="btn btn-primary btn-lg" onClick={next}>
                {step < 3 ? 'Continuer' : `Payer ${formatPrice(total)}`}
                <Icon name="arrow-right" size={16} color="#fff"/>
              </button>
            </div>
          </div>

          <aside style={{ position: 'sticky', top: 96 }}>
            <OrderSummary items={items} subtotal={subtotal} fees={fees} total={total}/>
          </aside>
        </div>
      </div>
    </div>
  );
}

function CheckoutStepper({ step }: { step: number }) {
  const steps = ['Informations', 'Paiement', 'Confirmation'];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, maxWidth: 680 }}>
      {steps.map((label, i) => {
        const n = i + 1;
        const done = step > n;
        const active = step === n;
        return (
          <Fragment key={label}>
            <div className="row gap-sm" style={{ alignItems: 'center' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: done ? 'var(--surface-ink)' : active ? 'var(--primary)' : 'var(--surface-strong)',
                color: done || active ? '#fff' : 'var(--muted)',
                display: 'grid', placeItems: 'center',
                fontWeight: 600, fontSize: 14,
                transition: 'all .2s ease',
              }}>
                {done ? <Icon name="check" size={16} color="#fff" strokeWidth={2.5}/> : n}
              </div>
              <span style={{
                fontWeight: active || done ? 600 : 500,
                color: active || done ? 'var(--ink)' : 'var(--muted)',
                fontSize: 14,
              }}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 2, background: done ? 'var(--surface-ink)' : 'var(--hairline)',
                borderRadius: 2,
              }}/>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

function CheckoutInfo({ info, setInfo, errors }: { info: CheckoutInfo; setInfo: (i: CheckoutInfo) => void; errors: Record<string, string> }) {
  const set = (k: keyof CheckoutInfo) => (e: React.ChangeEvent<HTMLInputElement>) => setInfo({ ...info, [k]: e.target.value });
  return (
    <div>
      <h1 className="display-lg" style={{ margin: '0 0 8px 0' }}>Vos informations</h1>
      <p className="body-md text-muted" style={{ margin: '0 0 28px 0' }}>
        Le billet sera émis au nom du titulaire. Présentez votre CIN à l'entrée.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Field label="Prénom" required error={errors.firstName}>
          <input className={`field-input ${errors.firstName ? 'error' : ''}`} placeholder="Ahmed" value={info.firstName} onChange={set('firstName')}/>
        </Field>
        <Field label="Nom" required error={errors.lastName}>
          <input className={`field-input ${errors.lastName ? 'error' : ''}`} placeholder="Ben Salem" value={info.lastName} onChange={set('lastName')}/>
        </Field>
        <Field label="Email" required error={errors.email}>
          <input className={`field-input ${errors.email ? 'error' : ''}`} type="email" placeholder="ahmed@example.tn" value={info.email} onChange={set('email')}/>
        </Field>
        <Field label="Téléphone" required error={errors.phone}>
          <input className={`field-input ${errors.phone ? 'error' : ''}`} placeholder="+216 22 123 456" value={info.phone} onChange={set('phone')}/>
        </Field>
        <Field label="CIN (Carte d'identité)" hint="8 chiffres, optionnel" error={errors.cin}>
          <input className={`field-input ${errors.cin ? 'error' : ''}`} placeholder="01234567" maxLength={8} value={info.cin ?? ''} onChange={set('cin')}/>
        </Field>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <div style={{
            padding: 14, background: 'var(--surface-soft)',
            borderRadius: 'var(--r-sm)', width: '100%',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <Icon name="shield" size={18}/>
            <span className="body-sm">Vos infos sont chiffrées et conformes RGPD.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PaymentProps {
  paymentMethod: string;
  setPaymentMethod: (m: string) => void;
  card: CardInfo;
  setCard: (c: CardInfo) => void;
  acceptTos: boolean;
  setAcceptTos: (v: boolean) => void;
  errors: Record<string, string>;
  total: number;
}

function CheckoutPayment({ paymentMethod, setPaymentMethod, card, setCard, acceptTos, setAcceptTos, errors, total }: PaymentProps) {
  const setC = (k: keyof CardInfo) => (e: React.ChangeEvent<HTMLInputElement>) => setCard({ ...card, [k]: e.target.value });
  return (
    <div>
      <h1 className="display-lg" style={{ margin: '0 0 8px 0' }}>Méthode de paiement</h1>
      <p className="body-md text-muted" style={{ margin: '0 0 24px 0' }}>
        Paiement en Dinar tunisien (TND). Aucun frais caché.
      </p>
      <div className="col gap-sm">
        <PaymentOption id="flouci" active={paymentMethod === 'flouci'} onSelect={setPaymentMethod} label="Flouci" subtitle="Paiement instantané · App Flouci" icon={<FlouciLogo/>} badge="Recommandé"/>
        <PaymentOption id="card" active={paymentMethod === 'card'} onSelect={setPaymentMethod} label="Carte bancaire" subtitle="Visa · Mastercard · e-Dinar" icon={<CardLogo/>}>
          {paymentMethod === 'card' && <CardForm card={card} setC={setC} errors={errors}/>}
        </PaymentOption>
        <PaymentOption id="d17" active={paymentMethod === 'd17'} onSelect={setPaymentMethod} label="D17 — La Poste" subtitle="Carte e-DINAR / e-Wallet La Poste" icon={<D17Logo/>}/>
      </div>

      {paymentMethod === 'flouci' && (
        <div style={{
          marginTop: 24, padding: 20,
          background: 'var(--surface-soft)',
          border: '1px dashed var(--hairline)',
          borderRadius: 'var(--r-md)',
          display: 'flex', alignItems: 'center', gap: 18,
        }}>
          <div style={{ width: 96, height: 96, background: '#fff', borderRadius: 'var(--r-sm)', padding: 8 }}>
            <QrCode value={`flouci-${total}`} size={80}/>
          </div>
          <div>
            <div className="title-md">Scannez avec votre app Flouci</div>
            <p className="body-sm text-muted" style={{ margin: '4px 0 0 0', maxWidth: 320 }}>
              À l'étape suivante, vous serez redirigé vers l'app Flouci pour confirmer le paiement de <strong>{formatPrice(total)}</strong>.
            </p>
          </div>
        </div>
      )}

      {paymentMethod === 'd17' && (
        <div style={{
          marginTop: 24, padding: 20,
          background: '#fff8e6', border: '1px solid #f5d77a',
          borderRadius: 'var(--r-md)',
        }}>
          <div className="title-md" style={{ marginBottom: 4 }}>D17 — Paiement en ligne La Poste</div>
          <p className="body-sm text-body" style={{ margin: 0 }}>
            Vous serez redirigé vers le portail sécurisé de la Poste Tunisienne pour saisir votre carte e-DINAR.
          </p>
        </div>
      )}

      <label style={{
        display: 'flex', gap: 12,
        marginTop: 28, padding: 16,
        border: `1px solid ${errors.tos ? 'var(--error)' : 'var(--hairline-soft)'}`,
        borderRadius: 'var(--r-sm)',
        cursor: 'pointer',
        alignItems: 'flex-start',
      }}>
        <input type="checkbox" checked={acceptTos} onChange={(e) => setAcceptTos(e.target.checked)} style={{ marginTop: 2, width: 18, height: 18, accentColor: 'var(--primary)' }}/>
        <span className="body-sm">
          J'accepte les <a href="#" style={{ textDecoration: 'underline' }}>conditions de vente</a> et la{' '}
          <a href="#" style={{ textDecoration: 'underline' }}>politique de remboursement</a> de PassINI. Le billet est nominatif et non-cessible sans accord préalable.
        </span>
      </label>
      {errors.tos && <div className="field-error" style={{ marginTop: 4 }}>{errors.tos}</div>}
    </div>
  );
}

function PaymentOption({ id, active, onSelect, label, subtitle, icon, badge, children }: {
  id: string; active: boolean; onSelect: (id: string) => void;
  label: string; subtitle: string; icon: React.ReactNode; badge?: string; children?: React.ReactNode;
}) {
  return (
    <div onClick={() => onSelect(id)} style={{
      border: `1.5px solid ${active ? 'var(--ink)' : 'var(--hairline)'}`,
      borderRadius: 'var(--r-md)', padding: 18, cursor: 'pointer',
      transition: 'all .15s ease',
      boxShadow: active ? 'var(--shadow-card)' : 'none',
    }}>
      <div className="row" style={{ gap: 14 }}>
        <span style={{
          width: 22, height: 22, borderRadius: '50%',
          border: `2px solid ${active ? 'var(--ink)' : 'var(--hairline)'}`,
          background: active ? 'radial-gradient(circle, var(--ink) 0 5px, #fff 5px)' : '#fff',
          flexShrink: 0,
        }}/>
        <div style={{ width: 56, height: 36 }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div className="row gap-sm">
            <span className="title-md">{label}</span>
            {badge && <span className="badge" style={{ background: 'var(--festivals-soft)', color: 'var(--festivals)', boxShadow: 'none' }}>{badge}</span>}
          </div>
          <div className="body-sm text-muted">{subtitle}</div>
        </div>
      </div>
      {children}
    </div>
  );
}

function CardForm({ card, setC, errors }: { card: CardInfo; setC: (k: keyof CardInfo) => (e: React.ChangeEvent<HTMLInputElement>) => void; errors: Record<string, string> }) {
  return (
    <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} onClick={(e) => e.stopPropagation()}>
      <div style={{ gridColumn: '1 / -1' }}>
        <Field label="Numéro de carte" required error={errors.number}>
          <input className={`field-input ${errors.number ? 'error' : ''}`}
            placeholder="4242 4242 4242 4242"
            value={card.number} maxLength={19}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})/g, '$1 ').trim();
              setC('number')({ target: { value: v } } as React.ChangeEvent<HTMLInputElement>);
            }}
          />
        </Field>
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <Field label="Nom sur la carte" required error={errors.name}>
          <input className={`field-input ${errors.name ? 'error' : ''}`} placeholder="AHMED BEN SALEM" value={card.name} onChange={setC('name')}/>
        </Field>
      </div>
      <Field label="Expiration" required error={errors.expiry}>
        <input className={`field-input ${errors.expiry ? 'error' : ''}`} placeholder="MM/AA" maxLength={5} value={card.expiry}
          onChange={(e) => {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2, 4);
            setC('expiry')({ target: { value: v } } as React.ChangeEvent<HTMLInputElement>);
          }}
        />
      </Field>
      <Field label="CVC" required error={errors.cvc}>
        <input className={`field-input ${errors.cvc ? 'error' : ''}`} placeholder="123" maxLength={3} value={card.cvc}
          onChange={(e) => setC('cvc')({ target: { value: e.target.value.replace(/\D/g, '') } } as React.ChangeEvent<HTMLInputElement>)}
        />
      </Field>
    </div>
  );
}

function CheckoutReview({ info, paymentMethod, card, items, total }: { info: CheckoutInfo; paymentMethod: string; card: CardInfo; items: CartItem[]; total: number }) {
  return (
    <div>
      <h1 className="display-lg" style={{ margin: '0 0 8px 0' }}>Vérifiez votre commande</h1>
      <p className="body-md text-muted" style={{ margin: '0 0 24px 0' }}>Une dernière vérification avant validation.</p>
      <ReviewBlock title="Titulaire">
        <div className="title-sm">{info.firstName} {info.lastName}</div>
        <div className="body-sm text-muted">{info.email} · {info.phone}</div>
        {info.cin && <div className="body-sm text-muted">CIN: {info.cin}</div>}
      </ReviewBlock>
      <ReviewBlock title="Paiement">
        <div className="row gap-sm">
          {paymentMethod === 'flouci' && <FlouciLogo/>}
          {paymentMethod === 'card' && <CardLogo/>}
          {paymentMethod === 'd17' && <D17Logo/>}
          <div>
            <div className="title-sm">
              {paymentMethod === 'flouci' ? 'Flouci' :
               paymentMethod === 'card' ? `Carte •••• ${card.number.replace(/\s/g, '').slice(-4)}` : 'D17 La Poste'}
            </div>
            <div className="body-sm text-muted">{formatPrice(total)}</div>
          </div>
        </div>
      </ReviewBlock>
      <ReviewBlock title="Billets">
        <div className="col gap-sm">
          {items.map((it, i) => (
            <div key={i} className="row-between">
              <div>
                <div className="title-sm">{it.qty} × {it.tierLabel}</div>
                <div className="body-sm text-muted">{it.eventTitle} · {formatDate(it.date)}</div>
              </div>
              <div style={{ fontWeight: 600 }}>{formatPrice(it.qty * it.price)}</div>
            </div>
          ))}
        </div>
      </ReviewBlock>
    </div>
  );
}

function ReviewBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: 20, marginBottom: 14, border: '1px solid var(--hairline-soft)', borderRadius: 'var(--r-md)' }}>
      <div className="caption text-muted" style={{ textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>{title}</div>
      {children}
    </div>
  );
}

function OrderSummary({ items, subtotal, fees, total }: { items: CartItem[]; subtotal: number; fees: number; total: number }) {
  return (
    <div className="card" style={{ padding: 20, boxShadow: 'var(--shadow-card)' }}>
      <h3 className="title-md" style={{ marginTop: 0, marginBottom: 14 }}>Récapitulatif</h3>
      <div className="col gap-md">
        {items.map((it, i) => {
          const event = eventById(it.eventId);
          return (
            <div key={i} className="row" style={{ gap: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 48, height: 48, borderRadius: 'var(--r-sm)', overflow: 'hidden', flexShrink: 0 }}>
                {event && <EventPoster event={event} size="thumb"/>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="body-sm" style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {it.eventTitle}
                </div>
                <div className="caption text-muted">{it.qty} × {it.tierLabel}</div>
              </div>
              <div className="body-sm" style={{ fontWeight: 600 }}>{formatPrice(it.qty * it.price)}</div>
            </div>
          );
        })}
      </div>
      <div style={{ borderTop: '1px solid var(--hairline)', marginTop: 16, paddingTop: 14 }} className="col gap-xs">
        <div className="row-between body-sm text-muted"><span>Sous-total</span><span>{formatPrice(subtotal)}</span></div>
        <div className="row-between body-sm text-muted"><span>Frais de service</span><span>{formatPrice(fees)}</span></div>
        <div className="row-between" style={{ marginTop: 8, paddingTop: 10, borderTop: '1px solid var(--hairline)' }}>
          <span style={{ fontWeight: 600 }}>Total à payer</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 24 }}>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}

function FlouciLogo() {
  return <div style={{ width: 56, height: 36, background: '#22c55e', borderRadius: 8, display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700, fontSize: 12, letterSpacing: '0.05em' }}>flouci</div>;
}
function CardLogo() {
  return (
    <div style={{ width: 56, height: 36, display: 'flex', gap: 4 }}>
      <div style={{ flex: 1, background: '#1a4ba6', borderRadius: 4, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 10, fontWeight: 700, fontStyle: 'italic' }}>VISA</div>
      <div style={{ flex: 1, background: '#eb001b', borderRadius: 4, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 8, fontWeight: 700 }}>MC</div>
    </div>
  );
}
function D17Logo() {
  return <div style={{ width: 56, height: 36, background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 8, display: 'grid', placeItems: 'center', color: '#92400e', fontWeight: 800, fontSize: 14 }}>D17</div>;
}
