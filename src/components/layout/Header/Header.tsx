import { useState } from 'react';
import type { User, AuthMode } from '@/types';
import { Icon } from '@/components/ui/Icon';
import { UserMenu } from './UserMenu';
import { SearchPill, CompactSearchPill } from './SearchPill';

type TabId = 'sports' | 'festivals' | 'all';

const PRODUCT_TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'sports', label: 'Sport', icon: 'football' },
  { id: 'festivals', label: 'Festivals', icon: 'music' },
  { id: 'all', label: 'Tout', icon: 'sparkle' },
];

interface HeaderProps {
  view: string;
  route: (name: string, extra?: Record<string, unknown>) => void;
  cartCount: number;
  onOpenCart: () => void;
  onSearch: (q?: string) => void;
  scrolled: boolean;
  activeTab: TabId;
  onTabChange: (t: TabId) => void;
  user: User | null;
  onLogin: (mode: AuthMode) => void;
  onLogout: () => void;
}

export function Header({
  view, route, cartCount, onOpenCart, onSearch, scrolled,
  activeTab, onTabChange, user, onLogin, onLogout,
}: HeaderProps) {
  const [searchQ, setSearchQ] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const compact = scrolled && view === 'home';

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'saturate(180%) blur(10px)',
        borderBottom: '1px solid var(--hairline)',
        transition: 'background .25s ease, border-color .25s ease',
      }}
    >
      <div
        className="container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          alignItems: 'center',
          gap: 24,
          height: 80,
        }}
      >
        {/* Logo */}
        <button onClick={() => route('home')} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
            <defs>
              <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ff385c" />
                <stop offset="1" stopColor="#e00b41" />
              </linearGradient>
            </defs>
            <path d="M16 2 L29 9 L29 23 L16 30 L3 23 L3 9 Z" fill="url(#logo-grad)" />
            <path
              d="M11 11 L11 22 M11 11 L17 11 Q21 11 21 14.5 Q21 18 17 18 L11 18"
              stroke="#fff"
              strokeWidth="2.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 26, letterSpacing: '-0.02em', fontWeight: 400 }}>
            PassINI
          </span>
        </button>

        {/* Center — tabs or compact search */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {view === 'home' && !compact ? (
            <nav style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
              {PRODUCT_TABS.map((t) => {
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => onTabChange(t.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                      paddingBottom: 14,
                      borderBottom: isActive ? '2px solid var(--ink)' : '2px solid transparent',
                      color: isActive ? 'var(--ink)' : 'var(--muted)',
                      transition: 'color .15s ease',
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    <Icon name={t.icon as Parameters<typeof Icon>[0]['name']} size={22} strokeWidth={1.6} />
                    {t.label}
                  </button>
                );
              })}
            </nav>
          ) : (
            <CompactSearchPill onClick={() => onSearch()} placeholder="Chercher un événement..." />
          )}
        </div>

        {/* Right utilities */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button className="btn btn-ghost btn-sm" style={{ borderRadius: 999, padding: '0 14px', fontWeight: 600 }}>
            Devenir partenaire
          </button>
          <button className="btn-icon" style={{ background: 'transparent' }} aria-label="Langue">
            <Icon name="globe" size={18} />
          </button>

          {/* User menu trigger */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '6px 8px 6px 14px',
                border: '1px solid var(--hairline)',
                borderRadius: 999,
                transition: 'box-shadow .2s ease',
                background: '#fff',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-card)')}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
            >
              <Icon name="menu" size={16} />
              {user ? (
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--festivals))',
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  {user.avatar || user.firstName?.[0]}
                </div>
              ) : (
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    background: 'var(--surface-ink)',
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <Icon name="user" size={16} color="#fff" />
                </div>
              )}
            </button>
            <UserMenu
              open={menuOpen}
              user={user}
              onClose={() => setMenuOpen(false)}
              onNavigate={(target, extra) => {
                if (target === 'login') onLogin('login');
                else if (target === 'signup') onLogin('signup');
                else route(target, extra);
              }}
              onLogout={onLogout}
            />
          </div>

          {/* Cart */}
          <button
            onClick={onOpenCart}
            aria-label="Panier"
            style={{
              position: 'relative',
              width: 44,
              height: 44,
              border: '1px solid var(--hairline)',
              borderRadius: 999,
              display: 'grid',
              placeItems: 'center',
              background: '#fff',
              transition: 'box-shadow .2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-card)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
          >
            <Icon name="cart" size={18} />
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  background: 'var(--primary)',
                  color: '#fff',
                  minWidth: 18,
                  height: 18,
                  padding: '0 5px',
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 700,
                  display: 'grid',
                  placeItems: 'center',
                  border: '2px solid #fff',
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Big pill search bar — home page only */}
      {view === 'home' && !compact && (
        <div className="container" style={{ paddingBottom: 24 }}>
          <SearchPill value={searchQ} onChange={setSearchQ} onSubmit={() => onSearch(searchQ)} />
        </div>
      )}
    </header>
  );
}
