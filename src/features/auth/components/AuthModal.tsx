import { useState, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Field } from '@/components/ui/Field';
import { DEMO_USER } from '../data/demo';
import type { AuthMode, User } from '@/types';

interface AuthModalProps {
  open: boolean;
  mode: AuthMode;
  onClose: () => void;
  onLogin: (user: User) => void;
  onSwitchMode: (mode: AuthMode) => void;
}

export function AuthModal({ open, mode, onClose, onLogin, onSwitchMode }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('+216 ');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) {
      setEmail(''); setPassword(''); setFirstName(''); setLastName('');
      setPhone('+216 '); setErrors({}); setLoading(false);
    }
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const isLogin = mode === 'login';

  const validate = () => {
    const e: Record<string, string> = {};
    if (!isLogin) {
      if (!firstName.trim()) e.firstName = 'Prénom requis';
      if (!lastName.trim()) e.lastName = 'Nom requis';
      if (!/^\+?216\s?\d{2}\s?\d{3}\s?\d{3}$/.test(phone.replace(/\s+/g, ' '))) e.phone = 'N° tunisien requis';
    }
    if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Email invalide';
    if (password.length < 6) e.password = '6 caractères minimum';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    setLoading(true);
    setTimeout(() => {
      const user = isLogin
        ? DEMO_USER
        : { ...DEMO_USER, firstName: firstName || DEMO_USER.firstName, lastName: lastName || DEMO_USER.lastName, email: email || DEMO_USER.email, phone: phone || DEMO_USER.phone };
      onLogin(user);
      setLoading(false);
    }, 600);
  };

  const handleSubmit = () => { if (validate()) submit(); };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.55)',
        zIndex: 200,
        display: 'grid', placeItems: 'center',
        padding: 24,
        animation: 'authFade .25s ease',
      }}
    >
      <style>{`
        @keyframes authFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes authPop  { from { transform: scale(0.95) translateY(10px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 440, width: '100%',
          background: '#fff',
          borderRadius: 'var(--r-lg)',
          overflow: 'hidden',
          animation: 'authPop .3s cubic-bezier(.2,.7,.2,1)',
          maxHeight: '90vh',
          display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--hairline)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span className="title-md">{isLogin ? 'Connexion' : 'Créer un compte'}</span>
          <button onClick={onClose} className="btn-icon" style={{ background: 'transparent' }}>
            <Icon name="close" size={18}/>
          </button>
        </div>

        <div style={{ padding: 28, overflowY: 'auto' }}>
          <h2 className="display-md" style={{ margin: 0, marginBottom: 6 }}>
            {isLogin ? 'Bienvenue sur PassINI' : 'Rejoignez la communauté'}
          </h2>
          <p className="body-sm text-muted" style={{ margin: 0, marginBottom: 22 }}>
            {isLogin
              ? 'Connectez-vous pour accéder à vos billets et favoris.'
              : 'Quelques infos suffisent pour démarrer.'}
          </p>

          {!isLogin && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <Field label="Prénom" required error={errors.firstName}>
                <input className={`field-input ${errors.firstName ? 'error' : ''}`}
                  placeholder="Ahmed" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
              </Field>
              <Field label="Nom" required error={errors.lastName}>
                <input className={`field-input ${errors.lastName ? 'error' : ''}`}
                  placeholder="Ben Salem" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
              </Field>
            </div>
          )}

          <div style={{ marginBottom: 12 }}>
            <Field label="Email" required error={errors.email}>
              <input className={`field-input ${errors.email ? 'error' : ''}`}
                type="email" placeholder="ahmed@example.tn"
                value={email} onChange={(e) => setEmail(e.target.value)}/>
            </Field>
          </div>

          {!isLogin && (
            <div style={{ marginBottom: 12 }}>
              <Field label="Téléphone" required error={errors.phone}>
                <input className={`field-input ${errors.phone ? 'error' : ''}`}
                  placeholder="+216 22 123 456"
                  value={phone} onChange={(e) => setPhone(e.target.value)}/>
              </Field>
            </div>
          )}

          <div style={{ marginBottom: 8 }}>
            <Field label="Mot de passe" required error={errors.password}>
              <input className={`field-input ${errors.password ? 'error' : ''}`}
                type="password" placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)}/>
            </Field>
          </div>

          {isLogin && (
            <div style={{ textAlign: 'right', marginBottom: 14 }}>
              <a href="#" style={{ fontSize: 13, fontWeight: 500, textDecoration: 'underline' }}>
                Mot de passe oublié ?
              </a>
            </div>
          )}

          <button
            className="btn btn-primary btn-block btn-lg"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? 'Connexion…' : isLogin ? 'Se connecter' : 'Créer mon compte'}
          </button>

          {isLogin && (
            <button
              className="btn btn-ghost btn-block btn-sm"
              style={{ marginTop: 10, border: '1px dashed var(--hairline)', fontWeight: 500 }}
              onClick={submit}
            >
              <Icon name="sparkle" size={14}/> Connexion démo (Ahmed Ben Salem)
            </button>
          )}

          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            margin: '20px 0',
            color: 'var(--muted-soft)',
            fontSize: 12,
          }}>
            <span style={{ flex: 1, height: 1, background: 'var(--hairline)' }}/>
            ou
            <span style={{ flex: 1, height: 1, background: 'var(--hairline)' }}/>
          </div>

          <div className="col gap-sm">
            <SocialBtn icon="google" label="Continuer avec Google"/>
            <SocialBtn icon="facebook" label="Continuer avec Facebook"/>
            <SocialBtn icon="apple" label="Continuer avec Apple"/>
          </div>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13 }}>
            <span className="text-muted">
              {isLogin ? 'Nouveau sur PassINI ?' : 'Vous avez déjà un compte ?'}
            </span>{' '}
            <button
              onClick={() => onSwitchMode(isLogin ? 'signup' : 'login')}
              style={{ fontWeight: 600, textDecoration: 'underline' }}
            >
              {isLogin ? 'Créer un compte' : 'Se connecter'}
            </button>
          </div>

          {!isLogin && (
            <p className="caption-sm text-muted" style={{ textAlign: 'center', marginTop: 14, lineHeight: 1.4 }}>
              En créant un compte, vous acceptez les{' '}
              <a href="#" style={{ textDecoration: 'underline' }}>conditions d'utilisation</a>{' '}
              et la <a href="#" style={{ textDecoration: 'underline' }}>politique de confidentialité</a>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function SocialBtn({ icon, label }: { icon: string; label: string }) {
  return (
    <button
      style={{
        height: 48, width: '100%',
        borderRadius: 'var(--r-sm)',
        border: '1px solid var(--ink)',
        background: '#fff',
        color: 'var(--ink)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        fontWeight: 500, fontSize: 14,
        transition: 'background-color .15s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-soft)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
    >
      <SocialMark icon={icon}/>
      {label}
    </button>
  );
}

function SocialMark({ icon }: { icon: string }) {
  if (icon === 'google') return (
    <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 1 1-3.3-13l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.4-.4-3.5Z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8A12 12 0 0 1 24 12c3 0 5.9 1.1 8 3l5.7-5.7A20 20 0 0 0 6.3 14.7Z"/><path fill="#4CAF50" d="M24 44a20 20 0 0 0 13.5-5.2l-6.2-5.3a12 12 0 0 1-17.6-6.3l-6.6 5A20 20 0 0 0 24 44Z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4 5.5l6.2 5.3c-.4.4 6.5-4.8 6.5-14.8 0-1.2-.1-2.4-.4-3.5Z"/></svg>
  );
  if (icon === 'facebook') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M22 12a10 10 0 1 0-11.6 9.9V15h-2.5v-3h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 3h-2.3v6.9A10 10 0 0 0 22 12Z"/></svg>
  );
  if (icon === 'apple') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#000"><path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.7 0-2-.9-3.2-.9-1.7 0-3.2.9-4 2.4-1.7 3-.4 7.4 1.2 9.9.8 1.2 1.8 2.5 3.1 2.5 1.2 0 1.7-.8 3.2-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.7s-2.6-1-2.7-3.9Zm-2.5-7.2c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.2-.6 2.8-1.4Z"/></svg>
  );
  return null;
}
