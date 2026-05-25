import type { ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--hairline)', background: 'var(--surface-soft)', marginTop: 60 }}>
      <div className="container" style={{ padding: '56px 24px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 36 }}>
          <div>
            <div className="row gap-sm" style={{ marginBottom: 14 }}>
              <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
                <path d="M16 2 L29 9 L29 23 L16 30 L3 23 L3 9 Z" fill="#ff385c" />
                <path d="M11 11 L11 22 M11 11 L17 11 Q21 11 21 14.5 Q21 18 17 18 L11 18" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>PassINI</span>
            </div>
            <p className="body-sm text-body" style={{ maxWidth: 280, margin: 0 }}>
              La billetterie tunisienne. Sport, festivals, culture — un billet, une nuit, mille souvenirs.
            </p>
            <div className="row" style={{ marginTop: 18, gap: 8 }}>
              <SocialIcon path="M22 5.8c-.7.3-1.5.6-2.3.7.8-.5 1.5-1.3 1.8-2.2-.8.5-1.6.8-2.5 1A4 4 0 0 0 12 9.5c0 .3 0 .6.1 1A11.4 11.4 0 0 1 3 5.6c-.4.6-.6 1.3-.6 2 0 1.4.7 2.6 1.8 3.3-.7 0-1.3-.2-1.8-.5v.1c0 2 1.4 3.6 3.3 4-.4.1-.7.2-1.1.2-.3 0-.5 0-.8-.1.5 1.6 2 2.8 3.8 2.8a8.2 8.2 0 0 1-6 1.7A11.5 11.5 0 0 0 8.4 21c7.4 0 11.4-6.1 11.4-11.4v-.5c.8-.6 1.5-1.4 2.1-2.3Z" />
              <SocialIcon path="M12 2A10 10 0 0 0 2 12c0 4.8 3.4 8.7 8 9.7v-7H7.5V12H10V9.6c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.8H13v7c4.7-.9 8-4.9 8-9.7 0-5.5-4.5-10-10-10Z" />
              <SocialIcon path="M12 2c-2.7 0-3 0-4.1.1-1.1.1-1.8.2-2.4.4-.7.3-1.3.6-1.9 1.2A5.1 5.1 0 0 0 2.5 5.5c-.2.7-.4 1.4-.4 2.4C2 9 2 9.3 2 12s0 3 .1 4.1c.1 1.1.2 1.8.4 2.4.3.7.6 1.3 1.2 1.9.6.6 1.2.9 1.9 1.2.7.2 1.4.4 2.4.4 1.1.1 1.4.1 4.1.1s3 0 4.1-.1c1.1-.1 1.8-.2 2.4-.4.7-.3 1.3-.6 1.9-1.2.6-.6.9-1.2 1.2-1.9.2-.7.4-1.4.4-2.4.1-1.1.1-1.4.1-4.1s0-3-.1-4.1c-.1-1.1-.2-1.8-.4-2.4a5.1 5.1 0 0 0-1.2-1.9 5.1 5.1 0 0 0-1.9-1.2c-.7-.2-1.4-.4-2.4-.4C15 2 14.7 2 12 2Zm0 5.4a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2Zm0 1.6a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.4-2.3a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z" />
            </div>
          </div>

          <FooterCol title="Découvrir">
            <FLink>Tous les événements</FLink>
            <FLink>Sport en Tunisie</FLink>
            <FLink>Festivals d'été</FLink>
            <FLink>Cartes cadeaux</FLink>
            <FLink>Application mobile</FLink>
          </FooterCol>

          <FooterCol title="Aide">
            <FLink>Centre d'aide</FLink>
            <FLink>Politique de remboursement</FLink>
            <FLink>Signaler un problème</FLink>
            <FLink>Contact organisateur</FLink>
            <FLink>WhatsApp PassINI</FLink>
          </FooterCol>

          <FooterCol title="PassINI">
            <FLink>Devenir partenaire</FLink>
            <FLink>Vendre vos billets</FLink>
            <FLink>Notre histoire</FLink>
            <FLink>Carrières</FLink>
            <FLink>Presse</FLink>
          </FooterCol>
        </div>

        <div
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: '1px solid var(--hairline)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div className="caption-sm text-muted">
            © 2026 PassINI SARL · Avenue Habib Bourguiba, Tunis · MF: 1234567/A
          </div>
          <div className="row" style={{ gap: 18 }}>
            <button className="caption-sm row gap-xs">
              <Icon name="globe" size={12} /> Français (TN)
            </button>
            <button className="caption-sm">TND — Dinar Tunisien</button>
            <a href="#" className="caption-sm">Mentions légales</a>
            <a href="#" className="caption-sm">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="title-sm" style={{ marginTop: 0, marginBottom: 14 }}>{title}</h4>
      <div className="col gap-sm">{children}</div>
    </div>
  );
}

function FLink({ children }: { children: ReactNode }) {
  return <a href="#" className="body-sm" style={{ color: 'var(--body)' }}>{children}</a>;
}

function SocialIcon({ path }: { path: string }) {
  return (
    <a
      href="#"
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: '#fff',
        border: '1px solid var(--hairline)',
        display: 'grid',
        placeItems: 'center',
        color: 'var(--ink)',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d={path} />
      </svg>
    </a>
  );
}
