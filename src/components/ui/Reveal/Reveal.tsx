import type { ElementType, ReactNode } from 'react';
import { useReveal } from '@/hooks/useReveal';

interface RevealProps {
  children: ReactNode;
  stagger?: boolean;
  as?: ElementType;
  className?: string;
  [key: string]: unknown;
}

export function Reveal({ children, stagger, as: As = 'div', className = '', ...rest }: RevealProps) {
  const ref = useReveal();
  return (
    <As ref={ref} className={`${stagger ? 'reveal-stagger' : 'reveal'} ${className}`} {...rest}>
      {children}
    </As>
  );
}
