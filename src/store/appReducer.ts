import type { CartItem, Order, User, Payment, View, AuthMode } from '@/types';
import type { AppAction } from './actions';
import { generateOrderId, generateSeatNum } from '@/utils/formatting';

export interface AppState {
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

export const initialState: AppState = {
  view: { name: 'home' },
  activeTab: 'all',
  cart: [],
  orders: [],
  saved: new Set(['carthage-2026', 'est-ca-2026']),
  user: null,
  authModal: null,
  paymentHistory: [],
  cartOpen: false,
  scrolled: false,
};

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ROUTE':
      return { ...state, view: action.payload, cartOpen: false };

    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };

    case 'ADD_TO_CART': {
      const { event, tierId, qty } = action.payload;
      const tier = event.tickets.find((t) => t.id === tierId);
      if (!tier) return state;
      const existing = state.cart.findIndex(
        (i) => i.eventId === event.id && i.tierId === tierId,
      );
      if (existing >= 0) {
        const copy = [...state.cart];
        copy[existing] = { ...copy[existing], qty: Math.min(10, copy[existing].qty + qty) };
        return { ...state, cart: copy };
      }
      return {
        ...state,
        cart: [
          ...state.cart,
          {
            eventId: event.id,
            eventTitle: event.title,
            tierId,
            tierLabel: tier.label,
            price: tier.price,
            qty,
            date: event.date,
          },
        ],
      };
    }

    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter((_, i) => i !== action.payload) };

    case 'CHANGE_CART_QTY': {
      const { idx, qty } = action.payload;
      if (qty <= 0) return { ...state, cart: state.cart.filter((_, i) => i !== idx) };
      const copy = [...state.cart];
      copy[idx] = { ...copy[idx], qty: Math.min(10, qty) };
      return { ...state, cart: copy };
    }

    case 'CLEAR_CART':
      return { ...state, cart: [] };

    case 'OPEN_CART':
      return { ...state, cartOpen: true };

    case 'CLOSE_CART':
      return { ...state, cartOpen: false };

    case 'TOGGLE_SAVE': {
      const next = new Set(state.saved);
      if (next.has(action.payload)) next.delete(action.payload);
      else next.add(action.payload);
      return { ...state, saved: next };
    }

    case 'SET_USER':
      return { ...state, user: action.payload };

    case 'SET_AUTH_MODAL':
      return { ...state, authModal: action.payload };

    case 'COMPLETE_ORDER': {
      const { info, paymentMethod, total, items } = action.payload;
      const orderId = generateOrderId();
      const tickets = items.map((it) => ({
        eventId: it.eventId,
        tierId: it.tierId,
        tierLabel: it.tierLabel,
        price: it.price,
        qty: it.qty,
        seatNum:
          it.qty === 1
            ? generateSeatNum()
            : `${it.qty} places`,
      }));
      const order: Order = {
        orderId,
        info,
        paymentMethod,
        total,
        tickets,
        paidAt: new Date().toISOString(),
      };
      return {
        ...state,
        orders: [order, ...state.orders],
        cart: [],
        view: { name: 'confirmation', order },
      };
    }

    case 'SET_PAYMENT_HISTORY':
      return { ...state, paymentHistory: action.payload };

    case 'SET_SCROLLED':
      return { ...state, scrolled: action.payload };

    default:
      return state;
  }
}
