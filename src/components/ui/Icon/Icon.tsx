import type { SVGProps } from 'react';

export type IconName =
  | 'search' | 'cart' | 'heart' | 'heart-fill' | 'user' | 'menu' | 'globe'
  | 'arrow-right' | 'arrow-left' | 'chevron-down' | 'chevron-right' | 'chevron-left'
  | 'close' | 'plus' | 'minus' | 'calendar' | 'map-pin' | 'clock' | 'ticket'
  | 'check' | 'check-circle' | 'shield' | 'star' | 'flame' | 'sliders' | 'sparkle'
  | 'qr' | 'download' | 'logout' | 'wallet' | 'football' | 'music' | 'padel'
  | 'jazz' | 'cinema' | 'theater' | 'basket' | 'tennis' | 'heritage' | 'running';

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 20, color = 'currentColor', strokeWidth = 1.8, ...rest }: IconProps) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    ...rest,
  };

  switch (name) {
    case 'search':       return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
    case 'cart':         return <svg {...props}><path d="M3 4h2l2.5 11h11l2-8H6.5"/><circle cx="9" cy="20" r="1.5"/><circle cx="17" cy="20" r="1.5"/></svg>;
    case 'heart':        return <svg {...props}><path d="M12 20s-7-4.5-9.5-9.5C1 7 4 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 3 0 6 3 4.5 6.5C19 15.5 12 20 12 20Z"/></svg>;
    case 'heart-fill':   return <svg {...props} fill={color} stroke="#fff"><path d="M12 20s-7-4.5-9.5-9.5C1 7 4 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 3 0 6 3 4.5 6.5C19 15.5 12 20 12 20Z"/></svg>;
    case 'user':         return <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>;
    case 'menu':         return <svg {...props}><path d="M3 6h18M3 12h18M3 18h18"/></svg>;
    case 'globe':        return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14 0 18M12 3c-3 3.5-3 14 0 18"/></svg>;
    case 'arrow-right':  return <svg {...props}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
    case 'arrow-left':   return <svg {...props}><path d="M19 12H5M11 5l-7 7 7 7"/></svg>;
    case 'chevron-down': return <svg {...props}><path d="m6 9 6 6 6-6"/></svg>;
    case 'chevron-right':return <svg {...props}><path d="m9 6 6 6-6 6"/></svg>;
    case 'chevron-left': return <svg {...props}><path d="m15 6-6 6 6 6"/></svg>;
    case 'close':        return <svg {...props}><path d="M6 6 18 18M18 6 6 18"/></svg>;
    case 'plus':         return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case 'minus':        return <svg {...props}><path d="M5 12h14"/></svg>;
    case 'calendar':     return <svg {...props}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>;
    case 'map-pin':      return <svg {...props}><path d="M12 22s-7-7-7-12a7 7 0 1 1 14 0c0 5-7 12-7 12Z"/><circle cx="12" cy="10" r="2.5"/></svg>;
    case 'clock':        return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case 'ticket':       return <svg {...props}><path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-2V9z"/><path d="M9 7v10"/></svg>;
    case 'check':        return <svg {...props}><path d="M5 12l4 4 10-10"/></svg>;
    case 'check-circle': return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg>;
    case 'shield':       return <svg {...props}><path d="M12 3 4 6v6c0 5 4 8 8 9 4-1 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>;
    case 'star':         return <svg {...props} fill={color} stroke="none"><path d="m12 3 2.6 5.6 6 .8-4.4 4.2 1.1 6L12 16.8 6.7 19.6l1.1-6L3.4 9.4l6-.8L12 3Z"/></svg>;
    case 'flame':        return <svg {...props}><path d="M12 3c2 3 5 5 5 9a5 5 0 1 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3 1-5 1-8Z"/></svg>;
    case 'sliders':      return <svg {...props}><path d="M4 6h10M18 6h2M4 12h2M10 12h10M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="8" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg>;
    case 'sparkle':      return <svg {...props}><path d="M12 3v6m0 6v6M3 12h6m6 0h6"/></svg>;
    case 'qr':           return <svg {...props}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM14 19h3M19 14v7M14 21h3"/></svg>;
    case 'download':     return <svg {...props}><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg>;
    case 'logout':       return <svg {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>;
    case 'wallet':       return <svg {...props}><path d="M3 7a2 2 0 0 1 2-2h14v4H5a2 2 0 0 0-2 2V7Z"/><path d="M3 11v6a2 2 0 0 0 2 2h14v-4h-4a2 2 0 0 1 0-4h4v-2H5a2 2 0 0 0-2 2Z"/></svg>;
    case 'football':     return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 3l3 4-1 5-5 1-4-3M12 3l-3 4M21 12l-6 0M15 7l3-1M9 8 6 6M8 13l-3 4M14 17l1 4M12 21l-3-4"/></svg>;
    case 'music':        return <svg {...props}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>;
    case 'padel':        return <svg {...props}><ellipse cx="9" cy="9" rx="5.5" ry="6.5" transform="rotate(-30 9 9)"/><path d="M5.8 6.5 L12.2 11.5 M5 9 L11 13 M7.5 5 L13.5 9.5"/><path d="m13 13 6 6"/><rect x="18" y="17.5" width="3" height="5" rx="1" transform="rotate(-45 19.5 20)"/></svg>;
    case 'jazz':         return <svg {...props}><path d="M8 19V6l9-2v13"/><circle cx="5" cy="19" r="2.5"/><circle cx="14" cy="17" r="2.5"/><path d="M17 6.5 L21 5"/></svg>;
    case 'cinema':       return <svg {...props}><rect x="3" y="6" width="18" height="13" rx="1.5"/><circle cx="7" cy="9" r="1.2"/><circle cx="12" cy="9" r="1.2"/><circle cx="17" cy="9" r="1.2"/><path d="M3 13h18"/></svg>;
    case 'theater':      return <svg {...props}><path d="M4 5h7v9a3.5 3.5 0 0 1-7 0V5Z"/><path d="M13 8h7v6a3.5 3.5 0 0 1-7 0V8Z"/><path d="M6.5 9v1M8.5 9v1M15.5 11v1M17.5 11v1"/></svg>;
    case 'basket':       return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18M5.5 5.5c4 3 9 3 13 0M5.5 18.5c4-3 9-3 13 0"/></svg>;
    case 'tennis':       return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M5 6c3 2 5 5 5 9s-2 7-5 9M19 6c-3 2-5 5-5 9s2 7 5 9"/></svg>;
    case 'heritage':     return <svg {...props}><path d="M3 21h18M5 21V10M19 21V10M9 21V10M15 21V10M3 10h18l-9-6-9 6Z"/></svg>;
    case 'running':      return <svg {...props}><circle cx="14" cy="4.5" r="2"/><path d="M9 21l3-6-3-3 4-5 3 4 3 1M6 12l3-2M5 17h3"/></svg>;
    default:             return null;
  }
}
