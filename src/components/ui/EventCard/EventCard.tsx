import type { Event } from '@/types';
import { EventPoster } from '@/components/ui/EventPoster';
import { HeartButton } from '@/components/ui/HeartButton';
import { StarRating } from '@/components/ui/StarRating';
import { formatDate, formatPrice } from '@/utils/formatting';

interface EventCardProps {
  event: Event;
  onOpen: (event: Event) => void;
  saved: boolean;
  onToggleSave: () => void;
  compact?: boolean;
  hideTypeBadge?: boolean;
}

export function EventCard({ event, onOpen, saved, onToggleSave, compact, hideTypeBadge }: EventCardProps) {
  const minPrice = Math.min(...event.tickets.map((t) => t.price));

  return (
    <div
      className="card"
      onClick={() => onOpen(event)}
      style={{
        cursor: 'pointer',
        background: 'transparent',
        border: 'none',
        overflow: 'visible',
        transition: 'transform .2s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    >
      <div
        style={{
          position: 'relative',
          borderRadius: 'var(--r-md)',
          overflow: 'hidden',
          aspectRatio: compact ? '4 / 5' : '5 / 4',
        }}
      >
        <EventPoster event={event} size="card" hideTypeBadge={hideTypeBadge} />
        <HeartButton saved={saved} onClick={onToggleSave} />
      </div>

      <div style={{ padding: '14px 4px 0 4px' }}>
        <div className="row-between" style={{ alignItems: 'flex-start', gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              className="title-md"
              style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {event.title}
            </div>
            <div className="body-sm text-muted" style={{ marginTop: 2 }}>
              {event.venue} · {event.city}
            </div>
            <div className="body-sm text-muted">
              {formatDate(event.date)} · {event.time}
            </div>
          </div>
          <StarRating value={event.rating} small />
        </div>
        <div style={{ marginTop: 8, fontSize: 15 }}>
          <span style={{ fontWeight: 600 }}>à partir de {formatPrice(minPrice)}</span>
        </div>
      </div>
    </div>
  );
}
