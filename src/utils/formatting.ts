export function formatPrice(amount: number): string {
  return (
    new Intl.NumberFormat('fr-TN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    }).format(amount) + ' DT'
  );
}

type FormatDateOptions = { short?: boolean; long?: boolean };

export function formatDate(iso: string, opts: FormatDateOptions = {}): string {
  const d = new Date(iso + 'T00:00:00');
  const months = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'];
  const days = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];
  if (opts.short) return `${d.getDate()} ${months[d.getMonth()]}`;
  if (opts.long)
    return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function generateOrderId(): string {
  return 'TN' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function generateSeatNum(): string {
  return `R${Math.floor(Math.random() * 30) + 1}-S${Math.floor(Math.random() * 40) + 1}`;
}
