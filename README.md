# PassINI — La billetterie tunisienne

Frontend-only ticketing marketplace for sports and cultural events in Tunisia. Built as a Vite + React + TypeScript single-page application with no backend or router library.

---

## Tech stack

| Layer | Choice |
|---|---|
| Build | Vite 5 + `@vitejs/plugin-react` |
| Language | TypeScript 5 (strict) |
| UI | React 18 — no component library |
| State | React Context + `useReducer` |
| Styling | Plain CSS (global design tokens) |
| Routing | Custom view-state machine (no router) |

---

## Getting started

```bash
npm install
npm run dev        # dev server at http://localhost:3000
npm run build      # type-check then bundle to dist/
npm run preview    # serve the production build locally
npm run lint       # ESLint
```

---

## Project structure

```
PassINI/
├── index.html
├── vite.config.ts
├── tsconfig.app.json
├── package.json
│
└── src/
    ├── main.tsx              # Entry point — mounts <App> inside <AppProvider>
    ├── App.tsx               # Root component — view router, global effects
    │
    ├── styles/
    │   └── globals.css       # Design tokens (CSS vars), reset, utility classes
    │
    ├── types/
    │   └── index.ts          # All shared TypeScript interfaces and types
    │
    ├── data/
    │   └── events.ts         # 14 seed events, CITIES list, eventById() helper
    │
    ├── utils/
    │   └── formatting.ts     # formatPrice, formatDate, generateOrderId, generateSeatNum
    │
    ├── hooks/
    │   └── useReveal.ts      # IntersectionObserver hook for scroll-reveal animations
    │
    ├── store/                # Global state (Context + useReducer)
    │   ├── AppContext.tsx     # AppProvider, useAppContext
    │   ├── appReducer.ts     # AppState shape + pure reducer + initialState
    │   ├── actions.ts        # AppAction discriminated union
    │   └── index.ts
    │
    ├── components/
    │   ├── ui/               # Stateless, reusable primitives
    │   │   ├── Icon/         # SVG icon system — 30+ named icons (IconName type)
    │   │   ├── EventCard/    # Card used in grids across home and listing
    │   │   ├── EventPoster/  # Gradient poster tile with emoji fallback
    │   │   ├── StarRating/   # Read-only star display
    │   │   ├── HeartButton/  # Save/unsave toggle
    │   │   ├── QrCode/       # Pure-CSS QR placeholder
    │   │   ├── Stepper/      # Quantity +/− control
    │   │   ├── Reveal/       # Scroll-reveal wrapper
    │   │   ├── Field/        # Labelled form input
    │   │   └── index.ts      # Re-exports all primitives
    │   │
    │   └── layout/
    │       ├── Header/       # Sticky nav — SearchPill, UserMenu, cart badge
    │       └── Footer/       # Site footer
    │
    └── features/             # Self-contained feature modules
        ├── home/
        │   ├── components/
        │   │   ├── HomePage.tsx      # Full home view — hero, hot events, by-city grids
        │   │   ├── CategoryStrip.tsx # Sticky scrollable category tabs
        │   │   ├── HeroTicker.tsx    # LED-style animated ticker bar
        │   │   └── WhyStrip.tsx      # 4-column value-proposition strip
        │   └── index.ts
        │
        ├── events/
        │   ├── components/
        │   │   ├── ListingPage.tsx   # Filter sidebar + grid/list results
        │   │   ├── EventDetailPage.tsx # Hero, seat map, ticket tiers, reservation card
        │   │   └── SeatMap.tsx       # SVG seat maps (stadium / arena / amphitheatre / tennis)
        │   └── index.ts
        │
        ├── cart/
        │   ├── components/
        │   │   └── CartDrawer.tsx    # Slide-in side drawer with subtotal + fees
        │   └── index.ts
        │
        ├── checkout/
        │   ├── components/
        │   │   └── CheckoutPage.tsx  # 3-step flow: Info → Payment → Review
        │   └── index.ts
        │
        ├── confirmation/
        │   ├── components/
        │   │   └── ConfirmationPage.tsx # Success hero, e-ticket stubs, QR modal
        │   └── index.ts
        │
        ├── auth/
        │   ├── components/
        │   │   └── AuthModal.tsx     # Login / signup modal with validation
        │   ├── data/
        │   │   └── demo.ts           # DEMO_USER and DEMO_PAYMENT_HISTORY fixtures
        │   └── index.ts
        │
        ├── account/
        │   ├── components/
        │   │   └── AccountPage.tsx   # 6-tab dashboard: tickets, payments, saved, profile, settings
        │   └── index.ts
        │
        └── tweaks/                   # Developer panel (hidden in production)
            ├── components/
            │   └── TweaksPanel.tsx   # Draggable floating panel, activated via postMessage
            ├── data/
            │   └── palettes.ts       # Sports and festival colour palette maps
            ├── hooks/
            │   └── useTweaks.ts      # localStorage-backed tweak values hook
            └── index.ts
```

---

## Routing

There is no router library. Navigation is managed through a `view` object in the reducer:

```ts
type ViewName = 'home' | 'listing' | 'detail' | 'checkout' | 'confirmation' | 'account';

interface View {
  name: ViewName;
  event?: Event;   // set when navigating to 'detail'
  order?: Order;   // set when navigating to 'confirmation'
  tab?: string;    // set when navigating to a specific account tab
}
```

`App.tsx` switches on `state.view.name` to render the correct feature page. All navigation is a `dispatch({ type: 'ROUTE', payload: { name, ...extras } })` call.

---

## State management

All application state lives in a single `AppState` (see [src/store/appReducer.ts](src/store/appReducer.ts)).

```ts
interface AppState {
  view: View;
  activeTab: 'all' | 'sports' | 'festivals';
  cart: CartItem[];
  orders: Order[];
  saved: Set<string>;
  user: User | null;
  authModal: AuthMode | null;
  paymentHistory: Payment[];
  cartOpen: boolean;
  scrolled: boolean;
}
```

Access anywhere with:
```ts
const { state, dispatch } = useAppContext();
```

---

## Design tokens

All CSS custom properties are declared in [src/styles/globals.css](src/styles/globals.css):

| Group | Variables |
|---|---|
| Brand | `--primary`, `--primary-active`, `--primary-disabled` |
| Category | `--sports`, `--sports-soft`, `--festivals`, `--festivals-soft` |
| Surface | `--canvas`, `--surface-soft`, `--surface-strong`, `--surface-ink` |
| Text | `--ink`, `--body`, `--muted`, `--muted-soft` |
| Semantic | `--error`, `--success`, `--warning` |
| Radius | `--r-sm` → `--r-full` |
| Spacing | `--s-xxs` → `--s-section` |
| Shadow | `--shadow-card`, `--shadow-pop` |
| Fonts | `--font-display`, `--font-ui`, `--font-mono` |

Category colours (`--sports`, `--festivals`) are overridden at runtime via the Tweaks panel.

---

## Tweaks panel

A floating developer panel (`TweaksPanel`) is mounted in `App.tsx` and activated by posting a message to the page:

```js
window.postMessage({ type: '__activate_edit_mode' }, '*')
```

It provides live palette switching and one-click navigation to any view/state without needing to click through the UI.
