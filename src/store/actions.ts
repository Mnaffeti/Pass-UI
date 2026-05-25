import type { Event, CartItem, CheckoutInfo, User, Payment, View, AuthMode } from '@/types';

export type AppAction =
  | { type: 'ROUTE'; payload: View }
  | { type: 'SET_ACTIVE_TAB'; payload: 'all' | 'sports' | 'festivals' }
  | { type: 'ADD_TO_CART'; payload: { event: Event; tierId: string; qty: number } }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'CHANGE_CART_QTY'; payload: { idx: number; qty: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'TOGGLE_SAVE'; payload: string }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTH_MODAL'; payload: AuthMode | null }
  | { type: 'COMPLETE_ORDER'; payload: { info: CheckoutInfo; paymentMethod: string; total: number; items: CartItem[] } }
  | { type: 'SET_PAYMENT_HISTORY'; payload: Payment[] }
  | { type: 'SET_SCROLLED'; payload: boolean };
