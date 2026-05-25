import { Icon } from '@/components/ui/Icon';

interface StarRatingProps {
  value: number;
  reviews?: number;
  small?: boolean;
}

export function StarRating({ value, reviews, small }: StarRatingProps) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <Icon name="star" size={small ? 12 : 14} color="#222" />
      <span style={{ fontSize: small ? 13 : 14, fontWeight: 600 }}>{value.toFixed(2)}</span>
      {reviews != null && (
        <span className="text-muted" style={{ fontSize: small ? 13 : 14 }}>
          · {reviews.toLocaleString('fr-FR')}
        </span>
      )}
    </div>
  );
}
