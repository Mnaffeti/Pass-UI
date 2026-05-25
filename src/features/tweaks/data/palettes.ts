import type { TweakValues, ThemePalette, SportsTheme, FestivalsTheme } from '@/types';

export const TWEAK_DEFAULTS: TweakValues = {
  sportsTheme: 'navy',
  festivalsTheme: 'terracotta',
  showZellige: true,
  denseGrid: false,
};

export const SPORTS_PALETTES: Record<SportsTheme, ThemePalette> = {
  navy:     { color: '#0a2540', soft: '#e8eef6', label: 'Stadium Navy' },
  forest:   { color: '#14532d', soft: '#dcfce7', label: 'Stade Forêt' },
  crimson:  { color: '#7f1d1d', soft: '#fef2f2', label: 'Cramoisi' },
  electric: { color: '#1d4ed8', soft: '#dbeafe', label: 'Bleu électrique' },
};

export const FESTIVAL_PALETTES: Record<FestivalsTheme, ThemePalette> = {
  terracotta: { color: '#c2410c', soft: '#fdf2eb', label: 'Terracotta' },
  saffron:    { color: '#b45309', soft: '#fef3c7', label: 'Safran' },
  rose:       { color: '#9d174d', soft: '#fce7f3', label: 'Rose Méditerranée' },
  ocean:      { color: '#0c4a6e', soft: '#e0f2fe', label: 'Bleu Carthage' },
};
