// ═══════════════════════════════════════════════════
// SkillNav Design System  —  Single Source of Truth
// Synced with Stitch reference & tailwind.config.js
// ═══════════════════════════════════════════════════

export const colors = {
  // ── Primary (Electric Royal Blue) ──
  primary:       '#2563EB',
  onPrimary:     '#FFFFFF',
  primaryTint:   '#EEF0FF',
  onPrimaryTint: '#002A78',
  primarySoft:   '#DBE1FF',
  primaryMid:    '#8CA8FF',
  primaryDeep:   '#003EA8',

  // ── Surfaces ──
  surface:         '#FFFFFF',
  onSurface:       '#0A0A0A',
  surfaceCard:     '#F8FAFC',
  onSurfaceCard:   '#0A0A0A',
  onSurfaceMuted:  '#475569',

  // ── Sidebar ──
  sidebar:        '#0A0A0A',
  onSidebar:      '#FFFFFF',
  onSidebarMuted: '#94A3B8',

  // ── Outlines ──
  outline:       '#E2E8F0',
  outlineStrong: '#0A0A0A',

  // ── Semantic ──
  success:      '#16A34A',
  successLight: '#DCFCE7',
  warning:      '#D97706',
  warningLight: '#FEF3C7',
  error:        '#DC2626',
  errorLight:   '#FEE2E2',

  // ── SAP brand ──
  sap: '#F0AB00',
};

export const typography = {
  displayLg:       { size: '40px', lineHeight: '48px',  weight: 700, tracking: '-0.5px'  },
  displayLgMobile: { size: '30px', lineHeight: '36px',  weight: 700, tracking: '-0.25px' },
  headlineLg:      { size: '34px', lineHeight: '42px',  weight: 700, tracking: '-0.4px'  },
  headlineMd:      { size: '24px', lineHeight: '32px',  weight: 700, tracking: '-0.2px'  },
  titleLg:         { size: '20px', lineHeight: '28px',  weight: 600, tracking: '-0.1px'  },
  titleMd:         { size: '18px', lineHeight: '26px',  weight: 600, tracking: '0px'     },
  bodyLg:          { size: '18px', lineHeight: '28px',  weight: 400, tracking: '0px'     },
  bodyMd:          { size: '16px', lineHeight: '24px',  weight: 400, tracking: '0px'     },
  bodySm:          { size: '14px', lineHeight: '20px',  weight: 400, tracking: '0px'     },
  labelLg:         { size: '16px', lineHeight: '22px',  weight: 600, tracking: '0px'     },
  labelMd:         { size: '14px', lineHeight: '20px',  weight: 600, tracking: '0px'     },
  labelSm:         { size: '12px', lineHeight: '16px',  weight: 600, tracking: '0.2px'   },
};

export const tokens = {
  borderRadius: { sm: '8px', md: '12px', lg: '16px', full: '9999px' },
  minTouchTarget: '44px',
  transition: {
    stateChange:  '120ms ease-out',
    surfaceEnter: '200ms cubic-bezier(0.2, 0, 0, 1)',
  },
  sidebar: { width: '260px' },
  topBar:  { height: '56px' },
};

export default { colors, typography, tokens };
