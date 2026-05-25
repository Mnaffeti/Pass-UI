import type { User } from '@/types';
import { Icon } from '@/components/ui/Icon';

interface UserMenuProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onNavigate: (target: string, extra?: Record<string, unknown>) => void;
  onLogout: () => void;
}

export function UserMenu({ open, user, onClose, onNavigate, onLogout }: UserMenuProps) {
  if (!open) return null;

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60 }} />
      <div
        style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          background: '#fff',
          borderRadius: 'var(--r-md)',
          boxShadow: 'var(--shadow-pop)',
          border: '1px solid var(--hairline-soft)',
          minWidth: 260,
          padding: 8,
          zIndex: 70,
          animation: 'authPop .18s cubic-bezier(.2,.7,.2,1)',
        }}
      >
        {user ? (
          <>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--hairline-soft)' }}>
              <div className="title-sm">{user.firstName} {user.lastName}</div>
              <div className="caption text-muted" style={{ marginTop: 2 }}>{user.email}</div>
            </div>
            <MenuItem icon="ticket" label="Mes billets" onClick={() => { onNavigate('account', { tab: 'upcoming' }); onClose(); }} />
            <MenuItem icon="wallet" label="Historique de paiements" onClick={() => { onNavigate('account', { tab: 'payments' }); onClose(); }} />
            <MenuItem icon="heart" label="Mes favoris" onClick={() => { onNavigate('account', { tab: 'saved' }); onClose(); }} />
            <MenuItem icon="user" label="Mon profil" onClick={() => { onNavigate('account', { tab: 'profile' }); onClose(); }} />
            <MenuItem icon="sliders" label="Paramètres" onClick={() => { onNavigate('account', { tab: 'settings' }); onClose(); }} />
            <div style={{ height: 1, background: 'var(--hairline-soft)', margin: '4px 0' }} />
            <MenuItem icon="logout" label="Se déconnecter" onClick={() => { onLogout(); onClose(); }} danger />
          </>
        ) : (
          <>
            <MenuItem icon="user" label="Se connecter" onClick={() => { onNavigate('login'); onClose(); }} bold />
            <MenuItem icon="sparkle" label="Créer un compte" onClick={() => { onNavigate('signup'); onClose(); }} />
            <div style={{ height: 1, background: 'var(--hairline-soft)', margin: '4px 0' }} />
            <MenuItem icon="ticket" label="Devenir partenaire" onClick={onClose} />
            <MenuItem icon="globe" label="Aide & contact" onClick={onClose} />
          </>
        )}
      </div>
    </>
  );
}

interface MenuItemProps {
  icon: Parameters<typeof Icon>[0]['name'];
  label: string;
  onClick: () => void;
  danger?: boolean;
  bold?: boolean;
}

function MenuItem({ icon, label, onClick, danger, bold }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        padding: '10px 14px',
        borderRadius: 'var(--r-sm)',
        fontWeight: bold ? 600 : 500,
        fontSize: 14,
        color: danger ? 'var(--error)' : 'var(--ink)',
        textAlign: 'left',
        transition: 'background-color .12s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-soft)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      <Icon name={icon} size={16} color={danger ? 'var(--error)' : 'var(--ink)'} />
      {label}
    </button>
  );
}
