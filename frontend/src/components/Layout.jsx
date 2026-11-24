import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccessibility } from '../context/AccessibilityContext';
import AccessibilityDrawer from './AccessibilityDrawer';
import {
  Sparkles,
  LayoutDashboard,
  FileCheck2,
  Briefcase,
  ShieldAlert,
  BarChart3,
  Accessibility,
  CheckCircle2,
  Activity,
  Menu,
  X,
  Lock,
} from 'lucide-react';
import axios from 'axios';

export default function Layout({ children }) {
  const { t } = useTranslation();
  const { settings, setIsDrawerOpen } = useAccessibility();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sapStatus, setSapStatus] = useState({
    hana: { connected: false },
    aicore: { configured: false },
    label: 'Checking SAP Status...',
    mode: 'checking',
  });

  // Fetch Live SAP Status from GET /api/sap/status
  useEffect(() => {
    let isMounted = true;
    const fetchStatus = async () => {
      try {
        const res = await axios.get('/api/sap/status');
        if (isMounted) setSapStatus(res.data);
      } catch (e) {
        if (isMounted) {
          setSapStatus({
            hana: { connected: false },
            aicore: { configured: false },
            label: 'Running Locally (SAP Offline Fallback)',
            mode: 'local',
          });
        }
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // 30s poll
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const navLinks = [
    {
      to: '/onboarding',
      labelEn: 'Onboarding',
      labelHi: 'ऑनबोर्डिंग',
      icon: Sparkles,
    },
    {
      to: '/dashboard',
      labelEn: 'Dashboard',
      labelHi: 'डैशबोर्ड',
      icon: LayoutDashboard,
    },
    {
      to: '/evidence',
      labelEn: 'My Evidence',
      labelHi: 'मेरे प्रमाण',
      icon: FileCheck2,
    },
    {
      to: '/matches',
      labelEn: 'Fair Job Match',
      labelHi: 'निष्पक्ष मिलान',
      icon: Briefcase,
    },
    {
      to: '/jd-checker',
      labelEn: 'Inclusive JD Checker',
      labelHi: 'JD बायस चेकर',
      icon: ShieldAlert,
    },
    {
      to: '/sap-view',
      labelEn: 'AI Readiness & SAP View',
      labelHi: 'AI रेडिनेस और SAP व्यू',
      icon: BarChart3,
    },
  ];

  const getLabel = (item) => (settings.language === 'hi' ? item.labelHi : item.labelEn);

  return (
    <div className="min-h-screen flex bg-surface text-on-surface">
      {/* ═══════════════════════════════════════════════
          1. Solid #0A0A0A Left Sidebar
          ═══════════════════════════════════════════════ */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-sidebar text-on-sidebar flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo & Product Brand */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg width="34" height="34" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                <rect width="36" height="36" rx="8" fill="#2563EB" />
                <path d="M11 23L17.5 11L25 23H11Z" stroke="#FFFFFF" strokeWidth="2.5" strokeLinejoin="round" />
                <circle cx="18" cy="20" r="2" fill="#FFFFFF" />
              </svg>
              <div className="flex flex-col">
                <span className="font-title text-title-md text-on-sidebar tracking-tight">
                  SkillNav
                </span>
                <span className="font-label text-label-sm text-on-sidebar-muted">
                  Workforce Navigator
                </span>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden text-on-sidebar-muted hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5" aria-label="Sidebar navigation">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive ? 'sn-sidebar-item-active' : 'sn-sidebar-item'
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{getLabel(item)}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with Trust Indicators */}
        <div className="p-5 border-t border-white/10 space-y-3 text-xs text-on-sidebar-muted">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-primary" />
            <span className="font-label text-label-sm text-white">Blind Matching Active</span>
          </div>
          <p className="font-body text-body-sm leading-relaxed text-gray-400">
            Protected demographic attributes are stripped at schema level.
          </p>
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500">
            <span>WCAG 2.1 AA</span>
            <span>SAP BTP Ready</span>
          </div>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════
          2. Right Content Wrapper (Header + Main)
          ═══════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top White Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-outline px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-on-surface-muted hover:text-on-surface"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Blind Matching Active Pill */}
            <span
              role="status"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-tint text-on-primary-tint font-label text-label-sm border border-blue-200"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              <span>Blind Matching Active</span>
            </span>

            {/* Live SAP Status Pill */}
            <div
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-card border border-outline text-xs font-label text-on-surface-muted"
              title={sapStatus.label}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  sapStatus.mode === 'live'
                    ? 'bg-success animate-pulse'
                    : sapStatus.mode === 'hybrid'
                    ? 'bg-warning animate-pulse'
                    : 'bg-primary'
                }`}
              />
              <span className="font-medium text-on-surface">
                {sapStatus.mode === 'live'
                  ? 'SAP AI Core: Connected • HANA Vector: Active'
                  : sapStatus.mode === 'hybrid'
                  ? 'SAP Partial Connection • In-Memory Active'
                  : 'SAP In-Memory Engine (Offline Resilient)'}
              </span>
            </div>
          </div>

          {/* Accessibility & Language (EN / हिंदी) Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="sn-btn-secondary py-1.5 px-3.5 text-sm flex items-center gap-2 font-semibold border-outline shadow-sm hover:border-outline-strong"
              aria-label="Open accessibility and language drawer"
            >
              <Accessibility className="w-4 h-4 text-primary" />
              <span>Accessibility &amp; Language (EN / हिंदी)</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-8 bg-surface-card/40">{children}</main>
      </div>

      {/* 3. Slide-Over Accessibility Drawer */}
      <AccessibilityDrawer />
    </div>
  );
}
