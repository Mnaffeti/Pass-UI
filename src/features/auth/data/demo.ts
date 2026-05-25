import type { User, Payment } from '@/types';

export const DEMO_USER: User = {
  id: 'usr_ahmed',
  firstName: 'Ahmed',
  lastName: 'Ben Salem',
  email: 'ahmed.bensalem@example.tn',
  phone: '+216 22 123 456',
  cin: '01234567',
  city: 'Tunis',
  memberSince: '2025-03-14',
  avatar: 'A',
  preferences: {
    newsletter: true,
    smsAlerts: true,
    favoriteTeam: 'Espérance Sportive de Tunis',
    favoriteVenue: 'Théâtre Romain de Carthage',
  },
};

export const DEMO_PAYMENT_HISTORY: Payment[] = [
  { id: 'PAY-9482', date: '2026-03-22', amount: 285, method: 'flouci',  status: 'success',  label: 'Festival Carthage · 2 billets',         orderRef: 'TN82HM4P' },
  { id: 'PAY-7621', date: '2026-02-18', amount: 130, method: 'card',    status: 'success',  label: 'Étoile Sahel vs CSS · 2 billets',        orderRef: 'TN77KP2R' },
  { id: 'PAY-7104', date: '2026-01-30', amount: 70,  method: 'd17',     status: 'refunded', label: 'Tabarka Jazz · 1 billet (annulé)',        orderRef: 'TN71YQ8M' },
  { id: 'PAY-6553', date: '2025-12-12', amount: 240, method: 'card',    status: 'success',  label: 'Match amical Tunisie · 4 billets',        orderRef: 'TN65WX3L' },
  { id: 'PAY-5928', date: '2025-11-04', amount: 90,  method: 'flouci',  status: 'success',  label: 'JCC Cérémonie · 1 billet',               orderRef: 'TN59BN6K' },
  { id: 'PAY-4811', date: '2025-09-19', amount: 180, method: 'card',    status: 'success',  label: 'Hammamet · A. Brahem · 2 billets',        orderRef: 'TN48VC1J' },
];
