import type { ReactNode } from 'react';
import type { Event } from '@/types';
import { Icon } from '@/components/ui/Icon';
import { formatDate } from '@/utils/formatting';

type PosterSize = 'card' | 'hero' | 'detail' | 'thumb';

interface EventPosterProps {
  event: Event;
  size?: PosterSize;
  hideTypeBadge?: boolean;
  children?: ReactNode;
}

export function EventPoster({ event, size = 'card', hideTypeBadge, children }: EventPosterProps) {
  const [c1, c2, c3] = event.palette;
  const isLarge = size === 'hero' || size === 'detail';
  const isCard = size === 'card';

  return (
    <div
      className="poster"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, ${c3} 0%, ${c1} 70%, ${c2} 100%)`,
        overflow: 'hidden',
        color: event.accentText || '#fff',
      }}
    >
      {/* Tunisian motif overlay */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, opacity: 0.16 }}
      >
        <defs>
          <pattern
            id={`zellige-${event.id}-${size}`}
            x="0"
            y="0"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <g transform="translate(40 40)" fill="none" stroke={c2} strokeWidth="1.2">
              <polygon points="0,-30 8,-8 30,0 8,8 0,30 -8,8 -30,0 -8,-8" />
              <polygon points="0,-30 8,-8 30,0 8,8 0,30 -8,8 -30,0 -8,-8" transform="rotate(22.5)" />
            </g>
          </pattern>
        </defs>
        <rect width="400" height="400" fill={`url(#zellige-${event.id}-${size})`} />
      </svg>

      {/* Soft vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(120% 80% at 50% 100%, ${c3}cc 0%, transparent 70%)`,
        }}
      />

      {/* Type stack */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: isLarge ? 'flex-end' : 'space-between',
          padding: isLarge ? 32 : isCard ? 16 : 12,
        }}
      >
        {!isLarge && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            {hideTypeBadge ? (
              <span />
            ) : (
              <div className="badge" style={{ background: 'rgba(255,255,255,0.92)', color: '#111', boxShadow: 'none' }}>
                <span className="dot" style={{ background: event.type === 'sports' ? 'var(--sports)' : 'var(--festivals)' }} />
                {event.type === 'sports' ? 'Sport' : 'Festival'}
              </div>
            )}
            {event.hot && (
              <div className="badge badge-ink" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
                <Icon name="flame" size={12} color={event.accentText} /> Hot
              </div>
            )}
          </div>
        )}

        <div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontSize: isLarge ? 'clamp(64px, 9vw, 120px)' : isCard ? 44 : 32,
              lineHeight: 0.9,
              letterSpacing: '-0.03em',
              color: event.accentText || '#fff',
              textShadow: '0 2px 24px rgba(0,0,0,0.25)',
            }}
          >
            {event.poster}
          </div>
          {event.posterSub && (
            <div
              style={{
                fontFamily: 'var(--font-ui)',
                fontWeight: 500,
                fontSize: isLarge ? 16 : isCard ? 12 : 11,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                marginTop: isLarge ? 12 : 6,
                color: event.accentText || '#fff',
                opacity: 0.9,
              }}
            >
              {event.posterSub}
            </div>
          )}
          {isLarge && (
            <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div
                className="badge"
                style={{
                  background: 'rgba(255,255,255,0.18)',
                  color: event.accentText,
                  backdropFilter: 'blur(10px)',
                  boxShadow: 'none',
                  border: '1px solid rgba(255,255,255,0.25)',
                }}
              >
                <Icon name="calendar" size={12} /> {formatDate(event.date, { long: true })}
              </div>
              <div
                className="badge"
                style={{
                  background: 'rgba(255,255,255,0.18)',
                  color: event.accentText,
                  backdropFilter: 'blur(10px)',
                  boxShadow: 'none',
                  border: '1px solid rgba(255,255,255,0.25)',
                }}
              >
                <Icon name="map-pin" size={12} /> {event.venue}
              </div>
            </div>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}
