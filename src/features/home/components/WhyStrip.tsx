import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import type { IconName } from '@/components/ui/Icon';

export function WhyStrip() {
  return (
    <section className="section-sm" style={{ background: 'var(--surface-soft)', marginTop: 32 }}>
      <div className="container">
        <Reveal>
          <h2 className="display-lg" style={{ margin: 0, marginBottom: 32, maxWidth: 640 }}>
            La billetterie tunisienne, repensée pour 2026.
          </h2>
        </Reveal>
        <Reveal stagger>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32 }}>
            <WhyItem icon="shield"       title="Billet 100 % sécurisé"   body="QR code unique, anti-doublon, scellé à votre identité. Aucune revente non autorisée."/>
            <WhyItem icon="wallet"       title="Paiement local"           body="Flouci, Carte e-Dinar, D17 — vos modes de paiement habituels, en TND, sans frais cachés."/>
            <WhyItem icon="ticket"       title="E-ticket instantané"      body="Reçu en moins de 30 secondes par email et SMS. Téléchargeable hors-ligne."/>
            <WhyItem icon="check-circle" title="Annulation flexible"      body="Remboursement intégral jusqu'à 72h avant la majorité des événements."/>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function WhyItem({ icon, title, body }: { icon: IconName; title: string; body: string }) {
  return (
    <div>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: '#fff', border: '1px solid var(--hairline)',
        display: 'grid', placeItems: 'center', marginBottom: 14,
      }}>
        <Icon name={icon} size={22}/>
      </div>
      <h4 className="title-md" style={{ margin: '0 0 6px 0' }}>{title}</h4>
      <p className="body-sm text-body" style={{ margin: 0, lineHeight: 1.5 }}>{body}</p>
    </div>
  );
}
