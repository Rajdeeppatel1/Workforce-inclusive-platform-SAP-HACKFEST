/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // ═══════════════════════════════════════════════
      // SkillNav Design System  —  Stitch Reference
      // Black, Blue & White Minimalist
      // ═══════════════════════════════════════════════

      colors: {
        // ── Brand Shorthand (Step 1 spec) ──
        'brandBlack':   '#0A0A0A',
        'brandBlue':    '#2563EB',
        'brandSurface': '#F8FAFC',
        'brandBorder':  '#E2E8F0',

        // ── Primary (Electric Royal Blue) ──
        'primary':          '#2563EB',
        'on-primary':       '#FFFFFF',
        'primary-tint':     '#EEF0FF',
        'on-primary-tint':  '#002A78',
        'primary-soft':     '#DBE1FF',
        'primary-mid':      '#8CA8FF',
        'primary-deep':     '#003EA8',

        // ── Surfaces ──
        'surface':          '#FFFFFF',
        'on-surface':       '#0A0A0A',
        'surface-card':     '#F8FAFC',
        'on-surface-card':  '#0A0A0A',
        'on-surface-muted': '#475569',

        // ── Sidebar (Deep Charcoal Black) ──
        'sidebar':          '#0A0A0A',
        'on-sidebar':       '#FFFFFF',
        'on-sidebar-muted': '#94A3B8',

        // ── Outlines & Borders ──
        'outline':          '#E2E8F0',
        'outline-strong':   '#0A0A0A',

        // ── Semantic ──
        'success':       '#16A34A',
        'success-light': '#DCFCE7',
        'warning':       '#D97706',
        'warning-light': '#FEF3C7',
        'error':         '#DC2626',
        'error-light':   '#FEE2E2',

        // ── SAP brand accent (status badges only) ──
        'sap': '#F0AB00',
      },

      borderRadius: {
        'sm':      '8px',
        DEFAULT:   '12px',
        'md':      '12px',
        'lg':      '16px',
        'full':    '9999px',
      },

      spacing: {
        'gutter-xs':   '4px',
        'gutter-sm':   '8px',
        'gutter-md':   '16px',
        'gutter-lg':   '24px',
        'gutter-xl':   '32px',
        'section':     '48px',
        'page-margin': '32px',
      },

      fontFamily: {
        display:  ['"Inter"', 'sans-serif'],
        headline: ['"Inter"', 'sans-serif'],
        title:    ['"Inter"', 'sans-serif'],
        body:     ['"Inter"', 'sans-serif'],
        label:    ['"Inter"', 'sans-serif'],
      },

      fontSize: {
        'display-lg':        ['40px', { lineHeight: '48px',  letterSpacing: '-0.5px',  fontWeight: '700' }],
        'display-lg-mobile': ['30px', { lineHeight: '36px',  letterSpacing: '-0.25px', fontWeight: '700' }],
        'headline-lg':       ['34px', { lineHeight: '42px',  letterSpacing: '-0.4px',  fontWeight: '700' }],
        'headline-lg-mobile':['26px', { lineHeight: '32px',  letterSpacing: '-0.25px', fontWeight: '700' }],
        'headline-md':       ['24px', { lineHeight: '32px',  letterSpacing: '-0.2px',  fontWeight: '700' }],
        'title-lg':          ['20px', { lineHeight: '28px',  letterSpacing: '-0.1px',  fontWeight: '600' }],
        'title-md':          ['18px', { lineHeight: '26px',  letterSpacing: '0px',     fontWeight: '600' }],
        'body-lg':           ['18px', { lineHeight: '28px',  letterSpacing: '0px',     fontWeight: '400' }],
        'body-md':           ['16px', { lineHeight: '24px',  letterSpacing: '0px',     fontWeight: '400' }],
        'body-sm':           ['14px', { lineHeight: '20px',  letterSpacing: '0px',     fontWeight: '400' }],
        'label-lg':          ['16px', { lineHeight: '22px',  letterSpacing: '0px',     fontWeight: '600' }],
        'label-md':          ['14px', { lineHeight: '20px',  letterSpacing: '0px',     fontWeight: '600' }],
        'label-sm':          ['12px', { lineHeight: '16px',  letterSpacing: '0.2px',   fontWeight: '600' }],
      },

      transitionDuration: {
        'state-change':  '120ms',
        'surface-enter': '200ms',
      },

      transitionTimingFunction: {
        'state-change':  'ease-out',
        'surface-enter': 'cubic-bezier(0.2, 0, 0, 1)',
      },

      boxShadow: {
        'card':       '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.06)',
      },

      minHeight: {
        'touch': '44px',   // WCAG 2.1 AA minimum touch target
      },

      minWidth: {
        'touch': '44px',
      },
    },
  },
  plugins: [],
};
