import { useEffect, useCallback } from 'react';
import { useAppContext } from '@/store';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/features/cart';
import { AuthModal } from '@/features/auth';
import { DEMO_USER, DEMO_PAYMENT_HISTORY } from '@/features/auth';
import { HomePage } from '@/features/home';
import { ListingPage, EventDetailPage } from '@/features/events';
import { CheckoutPage } from '@/features/checkout';
import { ConfirmationPage } from '@/features/confirmation';
import { AccountPage } from '@/features/account';
import { TweaksPanel, TweakSection, TweakSelect, TweakButton, useTweaks, TWEAK_DEFAULTS, SPORTS_PALETTES, FESTIVAL_PALETTES } from '@/features/tweaks';
import { EVENTS } from '@/data/events';
import type { Event, ViewName } from '@/types';

export function App() {
  const { state, dispatch } = useAppContext();

  const route = useCallback((name: ViewName, extras: Record<string, unknown> = {}) => {
    dispatch({ type: 'ROUTE', payload: { name, ...extras } as Parameters<typeof dispatch>[0]['payload'] });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dispatch]);

  const openEvent = useCallback((event: Event) => {
    dispatch({ type: 'ROUTE', payload: { name: 'detail', event } });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dispatch]);

  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    const sportsP = SPORTS_PALETTES[tweaks.sportsTheme] ?? SPORTS_PALETTES.navy;
    const festP   = FESTIVAL_PALETTES[tweaks.festivalsTheme] ?? FESTIVAL_PALETTES.terracotta;
    document.documentElement.style.setProperty('--sports', sportsP.color);
    document.documentElement.style.setProperty('--sports-soft', sportsP.soft);
    document.documentElement.style.setProperty('--festivals', festP.color);
    document.documentElement.style.setProperty('--festivals-soft', festP.soft);
  }, [tweaks.sportsTheme, tweaks.festivalsTheme]);

  useEffect(() => {
    let isScrolled = window.scrollY > 200;
    dispatch({ type: 'SET_SCROLLED', payload: isScrolled });
    const onScroll = () => {
      const y = window.scrollY;
      const next = isScrolled ? y > 80 : y > 200;
      if (next !== isScrolled) {
        isScrolled = next;
        dispatch({ type: 'SET_SCROLLED', payload: next });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [dispatch]);

  const cartCount = state.cart.reduce((s, i) => s + i.qty, 0);

  const goCheckout = () => {
    dispatch({ type: 'CLOSE_CART' });
    dispatch({ type: 'ROUTE', payload: { name: 'checkout' } });
  };

  return (
    <>
      <Header
        view={state.view.name}
        route={(n) => dispatch({ type: 'ROUTE', payload: { name: n as ViewName } })}
        cartCount={cartCount}
        onOpenCart={() => dispatch({ type: 'OPEN_CART' })}
        onSearch={() => dispatch({ type: 'ROUTE', payload: { name: 'listing' } })}
        scrolled={state.scrolled}
        activeTab={state.activeTab}
        onTabChange={(t) => {
          dispatch({ type: 'SET_ACTIVE_TAB', payload: t as 'all' | 'sports' | 'festivals' });
          if (t !== 'all') dispatch({ type: 'ROUTE', payload: { name: 'listing' } });
        }}
        user={state.user}
        onLogin={(mode) => dispatch({ type: 'SET_AUTH_MODAL', payload: (mode ?? 'login') as 'login' | 'signup' })}
        onLogout={() => {
          dispatch({ type: 'SET_USER', payload: null });
          dispatch({ type: 'ROUTE', payload: { name: 'home' } });
        }}
      />

      <main key={state.view.name + (state.view.event?.id ?? '')}>
        {state.view.name === 'home' && (
          <HomePage
            activeTab={state.activeTab}
            saved={state.saved}
            onToggleSave={(id) => dispatch({ type: 'TOGGLE_SAVE', payload: id })}
            onOpenEvent={openEvent}
          />
        )}
        {state.view.name === 'listing' && (
          <ListingPage
            activeTab={state.activeTab}
            onOpenEvent={openEvent}
            saved={state.saved}
            onToggleSave={(id) => dispatch({ type: 'TOGGLE_SAVE', payload: id })}
            onBack={() => dispatch({ type: 'ROUTE', payload: { name: 'home' } })}
          />
        )}
        {state.view.name === 'detail' && state.view.event && (
          <EventDetailPage
            event={state.view.event}
            onBack={() => dispatch({ type: 'ROUTE', payload: { name: 'listing' } })}
            onAddToCart={(event, tierId, qty) => dispatch({ type: 'ADD_TO_CART', payload: { event, tierId, qty } })}
            saved={state.saved.has(state.view.event.id)}
            onToggleSave={() => dispatch({ type: 'TOGGLE_SAVE', payload: state.view.event!.id })}
            onOpenCart={() => dispatch({ type: 'OPEN_CART' })}
          />
        )}
        {state.view.name === 'checkout' && (
          <CheckoutPage
            items={state.cart}
            onBack={() => dispatch({ type: 'ROUTE', payload: { name: 'home' } })}
            onComplete={(data) => dispatch({ type: 'COMPLETE_ORDER', payload: { info: data.info, paymentMethod: data.paymentMethod, total: data.total, items: state.cart } })}
          />
        )}
        {state.view.name === 'confirmation' && state.view.order && (
          <ConfirmationPage
            order={state.view.order}
            onHome={() => dispatch({ type: 'ROUTE', payload: { name: 'home' } })}
            onAccount={() => dispatch({ type: 'ROUTE', payload: { name: 'account' } })}
          />
        )}
        {state.view.name === 'account' && (
          <AccountPage
            orders={state.orders}
            saved={state.saved}
            user={state.user ?? DEMO_USER}
            paymentHistory={state.paymentHistory.length ? state.paymentHistory : DEMO_PAYMENT_HISTORY}
            onOpenEvent={openEvent}
            onToggleSave={(id) => dispatch({ type: 'TOGGLE_SAVE', payload: id })}
            onHome={() => dispatch({ type: 'ROUTE', payload: { name: 'home' } })}
            onLogout={() => {
              dispatch({ type: 'SET_USER', payload: null });
              dispatch({ type: 'ROUTE', payload: { name: 'home' } });
            }}
            initialTab={state.view.tab}
          />
        )}
      </main>

      <Footer/>

      <CartDrawer
        open={state.cartOpen}
        items={state.cart}
        onClose={() => dispatch({ type: 'CLOSE_CART' })}
        onRemove={(idx) => dispatch({ type: 'REMOVE_FROM_CART', payload: idx })}
        onChangeQty={(idx, qty) => dispatch({ type: 'CHANGE_CART_QTY', payload: { idx, qty } })}
        onCheckout={goCheckout}
      />

      <AuthModal
        open={!!state.authModal}
        mode={state.authModal ?? 'login'}
        onClose={() => dispatch({ type: 'SET_AUTH_MODAL', payload: null })}
        onLogin={(u) => {
          dispatch({ type: 'SET_USER', payload: u });
          dispatch({ type: 'SET_PAYMENT_HISTORY', payload: DEMO_PAYMENT_HISTORY });
          dispatch({ type: 'SET_AUTH_MODAL', payload: null });
          dispatch({ type: 'ROUTE', payload: { name: 'account', tab: 'upcoming' } });
        }}
        onSwitchMode={(m) => dispatch({ type: 'SET_AUTH_MODAL', payload: m })}
      />

      <TweaksPanel>
        <TweakSection title="Identité catégorie">
          <TweakSelect
            label="Couleur Sport"
            value={tweaks.sportsTheme}
            onChange={(v) => setTweak('sportsTheme', v as typeof tweaks.sportsTheme)}
            options={Object.entries(SPORTS_PALETTES).map(([id, p]) => ({ value: id, label: p.label }))}
          />
          <TweakSelect
            label="Couleur Festivals"
            value={tweaks.festivalsTheme}
            onChange={(v) => setTweak('festivalsTheme', v as typeof tweaks.festivalsTheme)}
            options={Object.entries(FESTIVAL_PALETTES).map(([id, p]) => ({ value: id, label: p.label }))}
          />
        </TweakSection>

        <TweakSection title="Navigation rapide">
          <TweakButton label="🏠 Accueil" onClick={() => dispatch({ type: 'ROUTE', payload: { name: 'home' } })}/>
          <TweakButton label="🔐 Modal connexion" onClick={() => dispatch({ type: 'SET_AUTH_MODAL', payload: 'login' })}/>
          <TweakButton label="🆕 Modal inscription" onClick={() => dispatch({ type: 'SET_AUTH_MODAL', payload: 'signup' })}/>
          <TweakButton label="⚽ Listing Sport" onClick={() => { dispatch({ type: 'SET_ACTIVE_TAB', payload: 'sports' }); dispatch({ type: 'ROUTE', payload: { name: 'listing' } }); }}/>
          <TweakButton label="🎭 Listing Festivals" onClick={() => { dispatch({ type: 'SET_ACTIVE_TAB', payload: 'festivals' }); dispatch({ type: 'ROUTE', payload: { name: 'listing' } }); }}/>
          <TweakButton label="🏟️ Détail (Derby Tunis)" onClick={() => dispatch({ type: 'ROUTE', payload: { name: 'detail', event: EVENTS[0] } })}/>
          <TweakButton label="🎵 Détail (Carthage)" onClick={() => dispatch({ type: 'ROUTE', payload: { name: 'detail', event: EVENTS.find((e) => e.id === 'carthage-2026') } })}/>
          <TweakButton label="💳 Checkout (avec panier)" onClick={() => {
            const e = EVENTS.find((ev) => ev.id === 'carthage-2026')!;
            const tier = e.tickets[1];
            dispatch({ type: 'ADD_TO_CART', payload: { event: e, tierId: tier.id, qty: 2 } });
            dispatch({ type: 'ROUTE', payload: { name: 'checkout' } });
          }}/>
          <TweakButton label="🎫 Confirmation (e-ticket)" onClick={() => {
            const e  = EVENTS.find((ev) => ev.id === 'carthage-2026')!;
            const e2 = EVENTS.find((ev) => ev.id === 'est-ca-2026')!;
            const fakeOrder = {
              orderId: 'TN82HM4P',
              info: { firstName: 'Ahmed', lastName: 'Ben Salem', email: 'ahmed@example.tn', phone: '+216 22 123 456', cin: '' },
              paymentMethod: 'flouci', total: 285,
              tickets: [
                { eventId: e.id,  tierId: 'cat1', tierLabel: 'Catégorie 1',        price: 90, qty: 2, seatNum: 'R3-S14' },
                { eventId: e2.id, tierId: 'cat2', tierLabel: 'Latérale couverte',  price: 45, qty: 1, seatNum: 'R8-S22' },
              ],
              paidAt: new Date().toISOString(),
            };
            dispatch({ type: 'ROUTE', payload: { name: 'confirmation', order: fakeOrder } });
          }}/>
          <TweakButton label="👤 Mes billets" onClick={() => {
            dispatch({ type: 'SET_USER', payload: DEMO_USER });
            dispatch({ type: 'SET_PAYMENT_HISTORY', payload: DEMO_PAYMENT_HISTORY });
            dispatch({ type: 'ROUTE', payload: { name: 'account', tab: 'upcoming' } });
          }}/>
          <TweakButton label="💰 Historique paiements" onClick={() => {
            dispatch({ type: 'SET_USER', payload: DEMO_USER });
            dispatch({ type: 'SET_PAYMENT_HISTORY', payload: DEMO_PAYMENT_HISTORY });
            dispatch({ type: 'ROUTE', payload: { name: 'account', tab: 'payments' } });
          }}/>
        </TweakSection>
      </TweaksPanel>
    </>
  );
}
