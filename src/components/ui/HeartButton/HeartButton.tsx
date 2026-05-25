import { Icon } from '@/components/ui/Icon';

interface HeartButtonProps {
  saved: boolean;
  onClick?: () => void;
  size?: number;
}

export function HeartButton({ saved, onClick, size = 32 }: HeartButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      aria-label="Sauvegarder"
      style={{
        position: 'absolute',
        top: 12,
        right: 12,
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'transparent',
        display: 'grid',
        placeItems: 'center',
        transition: 'transform .15s ease',
      }}
      onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.9)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      <Icon
        name={saved ? 'heart-fill' : 'heart'}
        size={24}
        color={saved ? '#ff385c' : 'rgba(255,255,255,0.95)'}
        strokeWidth={2}
        style={{ filter: saved ? 'none' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }}
      />
    </button>
  );
}
