import { useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Stepper } from '@/components/ui/Stepper';
import { EventPoster } from '@/components/ui/EventPoster';
import { eventById } from '@/data/events';
import { formatPrice, formatDate } from '@/utils/formatting';
import type { CartItem } from '@/types';

interface CartDrawerProps {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onRemove: (idx: number) => void;
  onChangeQty: (idx: number, qty: number) => void;
  onCheckout: () => void;
}

export function CartDrawer({ open, items, onClose, onRemove, onChangeQty, onCheckout }: CartDrawerProps) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const fees = Math.round(subtotal * 0.04);
  const total = subtotal + fees;

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 90,
          animation: 'fadeIn .25s ease',
        }}
      />
      <aside style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(460px, 100vw)',
        background: '#fff',
        zIndex: 100,
        display: 'flex', flexDirection: 'column',
        animation: 'slideIn .3s cubic-bezier(.2,.7,.2,1)',
        boxShadow: '-20px 0 40px rgba(0,0,0,0.15)',
      }}>
        <div className="row-between" style={{ padding: '20px 24px', borderBottom: '1px solid var(--hairline)' }}>
          <div>
            <h2 className="display-md" style={{ margin: 0 }}>Mon panier</h2>
            <span className="caption text-muted">{items.length} événement{items.length > 1 ? 's' : ''}</span>
          </div>
          <button onClick={onClose} className="btn-icon" style={{ background: 'var(--surface-soft)' }}>
            <Icon name="close" size={18}/>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {items.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center' }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'var(--surface-soft)',
                display: 'grid', placeItems: 'center',
                margin: '0 auto 16px',
              }}>
                <Icon name="cart" size={32} color="var(--muted)"/>
              </div>
              <h3 className="display-sm" style={{ margin: '0 0 6px 0' }}>Votre panier est vide</h3>
              <p className="body-sm text-muted">Parcourez les événements et ajoutez vos billets.</p>
              <button className="btn btn-primary" onClick={onClose} style={{ marginTop: 16 }}>
                Explorer les événements
              </button>
            </div>
          ) : (
            items.map((item, idx) => (
              <CartItemRow
                key={`${item.eventId}-${item.tierId}-${idx}`}
                item={item}
                onRemove={() => onRemove(idx)}
                onChangeQty={(n) => onChangeQty(idx, n)}
              />
            ))
          )}
        </div>

        {items.length > 0 && (
          <div style={{
            borderTop: '1px solid var(--hairline)',
            padding: 24,
            background: 'var(--surface-soft)',
          }}>
            <div className="col gap-xs" style={{ marginBottom: 16 }}>
              <div className="row-between body-sm text-muted">
                <span>Sous-total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="row-between body-sm text-muted">
                <span>Frais de service (4%)</span>
                <span>{formatPrice(fees)}</span>
              </div>
              <div className="row-between" style={{ paddingTop: 10, borderTop: '1px solid var(--hairline)', marginTop: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 16 }}>Total</span>
                <span style={{ fontWeight: 700, fontSize: 22, fontFamily: 'var(--font-display)' }}>{formatPrice(total)}</span>
              </div>
            </div>
            <button className="btn btn-primary btn-block btn-lg" onClick={onCheckout}>
              Passer au paiement <Icon name="arrow-right" size={16} color="#fff"/>
            </button>
            <div className="row gap-sm" style={{ marginTop: 12, justifyContent: 'center', color: 'var(--muted)' }}>
              <Icon name="shield" size={12}/>
              <span className="caption-sm">Transaction sécurisée · 3D Secure</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

function CartItemRow({ item, onRemove, onChangeQty }: { item: CartItem; onRemove: () => void; onChangeQty: (n: number) => void }) {
  const event = eventById(item.eventId);
  if (!event) return null;
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '72px 1fr auto',
      gap: 14,
      padding: '14px 24px',
      borderBottom: '1px solid var(--hairline-soft)',
    }}>
      <div style={{ width: 72, height: 72, borderRadius: 'var(--r-sm)', overflow: 'hidden' }}>
        <EventPoster event={event} size="thumb"/>
      </div>
      <div style={{ minWidth: 0 }}>
        <div className="title-sm" style={{
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          marginBottom: 2,
        }}>{event.title}</div>
        <div className="caption text-muted" style={{ marginBottom: 6 }}>
          {item.tierLabel} · {formatDate(event.date)}
        </div>
        <div className="row gap-sm">
          <Stepper value={item.qty} onChange={onChangeQty} max={10}/>
          <button
            onClick={onRemove}
            style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'underline' }}
          >Retirer</button>
        </div>
      </div>
      <div style={{ textAlign: 'right', fontWeight: 600 }}>
        {formatPrice(item.qty * item.price)}
      </div>
    </div>
  );
}
