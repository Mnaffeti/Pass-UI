// ─── Event Domain ────────────────────────────────────────────────────────────

export type TicketTierId = 'vip' | 'cat1' | 'cat2' | 'cat3';
export type EventType = 'sports' | 'festivals';

export interface Ticket {
  id: TicketTierId;
  label: string;
  price: number;
  available: number;
  perks: string[];
}

export interface Event {
  id: string;
  type: EventType;
  title: string;
  subtitle: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  duration: string;
  rating: number;
  reviews: number;
  featured?: boolean;
  hot?: boolean;
  palette: [string, string, string];
  accentText?: string;
  poster: string;
  posterSub?: string;
  description: string;
  organizer: string;
  tickets: Ticket[];
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  eventId: string;
  eventTitle: string;
  tierId: string;
  tierLabel: string;
  price: number;
  qty: number;
  date: string;
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cin?: string;
}

export interface OrderTicket {
  eventId: string;
  tierId: string;
  tierLabel: string;
  price: number;
  qty: number;
  seatNum: string;
}

export interface Order {
  orderId: string;
  info: CheckoutInfo;
  paymentMethod: string;
  total: number;
  tickets: OrderTicket[];
  paidAt: string;
}

// ─── User & Auth ──────────────────────────────────────────────────────────────

export interface UserPreferences {
  newsletter: boolean;
  smsAlerts: boolean;
  favoriteTeam?: string;
  favoriteVenue?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cin?: string;
  city: string;
  memberSince: string;
  avatar?: string;
  preferences: UserPreferences;
}

export type AuthMode = 'login' | 'signup';

// ─── Payments ─────────────────────────────────────────────────────────────────

export type PaymentMethod = 'flouci' | 'card' | 'd17';
export type PaymentStatus = 'success' | 'refunded' | 'pending' | 'failed';

export interface Payment {
  id: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  label: string;
  orderRef: string;
}

// ─── Routing / View ──────────────────────────────────────────────────────────

export type ViewName =
  | 'home'
  | 'listing'
  | 'detail'
  | 'checkout'
  | 'confirmation'
  | 'account';

export interface View {
  name: ViewName;
  event?: Event;
  order?: Order;
  tab?: string;
}

// ─── Tweaks ───────────────────────────────────────────────────────────────────

export type SportsTheme = 'navy' | 'forest' | 'crimson' | 'electric';
export type FestivalsTheme = 'terracotta' | 'saffron' | 'rose' | 'ocean';

export interface TweakValues {
  sportsTheme: SportsTheme;
  festivalsTheme: FestivalsTheme;
  showZellige: boolean;
  denseGrid: boolean;
}

export interface ThemePalette {
  color: string;
  soft: string;
  label: string;
}
