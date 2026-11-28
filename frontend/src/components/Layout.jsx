import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccessibility } from '../context/AccessibilityContext';
import { useProfile } from '../context/ProfileContext';
import AccessibilityDrawer from './AccessibilityDrawer';
import VoiceNavigator from './VoiceNavigator';
import {
  Sparkles,
  LayoutDashboard,
  FileCheck2,
  Briefcase,
  ShieldAlert,
  BarChart3,
  Accessibility,
  CheckCircle2,
  Menu,
  X,
  Lock,
  User,
  LogIn,
  GraduationCap,
  ArrowRight,
  BookOpen,
  FileQuestion,
  Users,
  Languages,
  ExternalLink,
  Scale,
} from 'lucide-react';

export default function Layout({ children }) {
  const { t } = useTranslation();
  const { settings, setIsDrawerOpen, toggleLanguage } = useAccessibility();
  const { profile, loginMock, loading: profileLoading } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Close modals on Escape key press for accessible keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showStatusModal) setShowStatusModal(false);
        if (mobileMenuOpen) setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showStatusModal, mobileMenuOpen]);

  const handleMockSignIn = async () => {
    setSigningIn(true);
    await loginMock('seed_rajdeep_patel_01');
    setSigningIn(false);
    // Show Fresher vs Employed choice modal right after login
    setShowStatusModal(true);
  };

  const handleSelectStatus = (path) => {
    setShowStatusModal(false);
    navigate(path);
  };

  const navLinks = [
    {
      to: '/onboarding',
      labelEn: 'Onboarding',
      labelHi: 'ऑनबोर्डिंग',
      icon: Sparkles,
    },
    {
      to: '/fresher',
      labelEn: 'Fresher Track',
      labelHi: 'फ्रेशर ट्रैक',
      icon: GraduationCap,
    },
    {
      to: '/fresher/test',
      labelEn: 'Skill Quiz (5 MCQs)',
      labelHi: 'स्किल टेस्ट (5 MCQs)',
      icon: FileQuestion,
    },
    {
      to: '/fresher/prepare',
      labelEn: 'Practice & Prepare',
      labelHi: 'अभ्यास और सामग्री',
      icon: BookOpen,
    },
    {
      to: '/learning-hub',
      labelEn: 'Learning Hub',
      labelHi: 'लर्निंग हब',
      icon: ExternalLink,
    },
    {
      to: '/employed',
      labelEn: 'Employed Track',
      labelHi: 'एम्प्लॉयड ट्रैक',
      icon: Briefcase,
    },
    {
      to: '/employed/audit',
      labelEn: 'Workforce Equity Audit',
      labelHi: 'वर्कफ़ोर्स समानता ऑडिट',
      icon: Scale,
    },
    {
      to: '/profile',
      labelEn: 'Profile & Experience',
      labelHi: 'प्रोफ़ाइल और अनुभव',
      icon: User,
    },
    {
      to: '/mentors',
      labelEn: 'Mentors & Doubt Box',
      labelHi: 'मेंटर और डाउट बॉक्स',
      icon: Users,
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
      labelEn: 'Job Match',
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
      labelEn: 'AI Readiness View',
      labelHi: 'AI रेडिनेस व्यू',
      icon: BarChart3,
    },
  ];

  const getLabel = (item) => (settings.language === 'hi' ? item.labelHi : item.labelEn);

  return (
    <div className="min-h-screen flex bg-surface text-on-surface">
      {/* ── Accessible Keyboard Navigation: Skip to Main Content ── */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-primary focus:text-white focus:font-semibold focus:rounded-sm focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary min-h-[44px] flex items-center"
      >
        {settings.language === 'hi' ? 'मुख्य सामग्री पर जाएं (Skip to main content)' : 'Skip to main content'}
      </a>
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
                  Universal Career Navigator
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

          {/* User Status Card in Sidebar */}
          <div className="p-4 mx-4 mt-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  {profile.name ? profile.name.charAt(0) : 'R'}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white truncate max-w-[110px]">
                    {profile.name}
                  </div>
                  <div className="text-[10px] text-blue-300 font-medium">Candidate Profile</div>
                </div>
              </div>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded ${
                  profile.consent_given
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {profile.consent_given ? 'Consented' : 'No Consent'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-270px)]" aria-label="Sidebar navigation">
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
            <span>Universal AI</span>
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
          </div>

          {/* Action Buttons: Language Switcher, Sign In & Accessibility (44px Minimum Touch Target) */}
          <div className="flex items-center gap-2.5">
            {/* Direct Hindi/English Switch Button */}
            <button
              type="button"
              onClick={() => toggleLanguage()}
              className="min-h-[44px] min-w-[44px] px-3.5 py-2 bg-surface hover:bg-surface-card text-on-surface border border-outline hover:border-outline-strong rounded-sm text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary shadow-xs"
              aria-label={settings.language === 'hi' ? 'Switch to English' : 'हिंदी में बदलें (Switch to Hindi)'}
              title={settings.language === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
            >
              <Languages className="w-4 h-4 text-primary shrink-0" />
              <span className="font-bold">{settings.language === 'hi' ? 'हिंदी (HI)' : 'English (EN)'}</span>
            </button>

            {/* Seeded Sign In Button */}
            <button
              type="button"
              onClick={handleMockSignIn}
              disabled={signingIn || profileLoading}
              className="min-h-[44px] min-w-[44px] px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-sm text-xs font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              title="Loads candidate profile (Rajdeep Patel) and prompts status selection"
            >
              <LogIn className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{signingIn ? 'Signing In...' : 'Sign In (Rajdeep)'}</span>
            </button>

            {/* Accessibility Drawer Toggle */}
            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              className="min-h-[44px] min-w-[44px] sn-btn-secondary px-3.5 py-2 text-xs flex items-center gap-2 font-semibold border-outline shadow-sm hover:border-outline-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label="Open accessibility drawer"
            >
              <Accessibility className="w-4 h-4 text-primary shrink-0" />
              <span className="hidden sm:inline">{settings.language === 'hi' ? 'सुगम्यता सेटिंग्स' : 'Accessibility'}</span>
            </button>
          </div>
        </header>

        {/* Main Content Area with Landmark ID for Skip Link */}
        <main id="main-content" tabIndex={-1} className="flex-1 p-6 md:p-8 bg-surface-card/40 focus:outline-none">
          {children}
        </main>
      </div>

      {/* ═══════════════════════════════════════════════
          3. Post-Login Status Choice Modal (Fresher vs Employed)
          ═══════════════════════════════════════════════ */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-black rounded-lg max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowStatusModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-blue-50 text-blue-900 border border-blue-200 rounded">
                Candidate Sign-In
              </span>
              <h2 className="text-xl font-bold text-neutral-900 mt-2">
                Select Your Career Pathway
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Choose your pathway for tailored skills-first navigation and opportunities:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Fresher Option */}
              <button
                onClick={() => handleSelectStatus('/fresher')}
                className="p-4 border-2 border-neutral-200 hover:border-blue-600 rounded-lg text-left transition-all hover:bg-blue-50/50 group flex flex-col justify-between h-40 cursor-pointer"
              >
                <div>
                  <div className="w-10 h-10 rounded bg-blue-100 text-blue-600 flex items-center justify-center mb-2.5">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-neutral-900 group-hover:text-blue-600">
                    Fresher
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                    Students, self-taught developers, and early-career job seekers.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600">
                  <span>Go to Fresher Track</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Employed Option */}
              <button
                onClick={() => handleSelectStatus('/employed')}
                className="p-4 border-2 border-neutral-200 hover:border-black rounded-lg text-left transition-all hover:bg-neutral-50 group flex flex-col justify-between h-40 cursor-pointer"
              >
                <div>
                  <div className="w-10 h-10 rounded bg-black text-white flex items-center justify-center mb-2.5">
                    <Briefcase className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-sm font-bold text-neutral-900 group-hover:text-black">
                    Employed
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                    Working professionals, career transitioners, and reskilling developers.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-900">
                  <span>Go to Employed Track</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Voice Assistant Floating Navigator */}
      <VoiceNavigator />

      {/* 5. Slide-Over Accessibility Drawer */}
      <AccessibilityDrawer />
    </div>
  );
}
