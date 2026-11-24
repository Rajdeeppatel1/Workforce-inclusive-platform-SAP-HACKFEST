import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAccessibility } from '../context/AccessibilityContext';
import {
  X,
  Volume2,
  Eye,
  Sliders,
  Type,
  ShieldCheck,
  Languages,
  Check,
} from 'lucide-react';

export default function AccessibilityDrawer() {
  const { t } = useTranslation();
  const {
    settings,
    updateSetting,
    toggleLanguage,
    speakText,
    isDrawerOpen,
    setIsDrawerOpen,
  } = useAccessibility();

  if (!isDrawerOpen) return null;

  const handleTestSpeech = () => {
    const testMsg =
      settings.language === 'hi'
        ? 'स्किलनैव में आपका स्वागत है। आपकी योग्यता सर्वोपरि है।'
        : 'Welcome to SkillNav. Skills-first, fair opportunity navigator.';
    speakText(testMsg);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-outline shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-outline flex items-center justify-between bg-surface-card">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-primary-tint text-primary flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </span>
              <div>
                <h2 id="accessibility-drawer-title" className="font-title text-title-md text-on-surface">
                  {settings.language === 'hi' ? 'सुगम्यता और भाषा' : 'Accessibility & Language'}
                </h2>
                <p className="font-body text-body-sm text-on-surface-muted">
                  WCAG 2.1 AA Persistent Controls
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsDrawerOpen(false)}
              aria-label="Close drawer"
              className="p-2 rounded-sm text-on-surface-muted hover:text-on-surface hover:bg-outline/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* 1. Language Toggle */}
            <div className="space-y-2">
              <label className="font-label text-label-md text-on-surface flex items-center gap-2">
                <Languages className="w-4 h-4 text-primary" />
                {settings.language === 'hi' ? 'भाषा चुनें (Language)' : 'Language Selection'}
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-surface-card border border-outline rounded-sm">
                <button
                  type="button"
                  onClick={() => toggleLanguage('en')}
                  className={`py-2.5 px-3 rounded-sm font-label text-label-sm transition-all flex items-center justify-center gap-2 ${
                    settings.language === 'en'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-on-surface hover:bg-white'
                  }`}
                >
                  English {settings.language === 'en' && <Check className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => toggleLanguage('hi')}
                  className={`py-2.5 px-3 rounded-sm font-label text-label-sm transition-all flex items-center justify-center gap-2 ${
                    settings.language === 'hi'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-on-surface hover:bg-white'
                  }`}
                >
                  हिंदी {settings.language === 'hi' && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* 2. Text Size Slider */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="font-label text-label-md text-on-surface flex items-center gap-2">
                  <Type className="w-4 h-4 text-primary" />
                  {settings.language === 'hi' ? 'फ़ॉन्ट आकार (Text Size)' : 'Text Size Scaling'}
                </label>
                <span className="font-label text-label-sm text-primary font-bold">
                  {settings.fontSizePercent}%
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="140"
                step="5"
                value={settings.fontSizePercent}
                onChange={(e) => updateSetting('fontSizePercent', Number(e.target.value))}
                className="w-full accent-primary h-2 bg-outline rounded-lg cursor-pointer"
                aria-label="Text size slider from 100% to 140%"
              />
              <div className="flex justify-between text-xs text-on-surface-muted font-body">
                <span>100% (Default)</span>
                <span>120%</span>
                <span>140% (Max)</span>
              </div>
            </div>

            {/* 3. High Contrast Mode */}
            <div className="pt-2 flex items-center justify-between p-3.5 bg-surface-card border border-outline rounded-sm">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-sm bg-sidebar text-white flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </span>
                <div>
                  <p className="font-label text-label-md text-on-surface">
                    {settings.language === 'hi' ? 'उच्च कंट्रास्ट (High Contrast)' : 'High Contrast Mode'}
                  </p>
                  <p className="font-body text-body-sm text-on-surface-muted">
                    Solid #0A0A0A borders & deep contrast
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.highContrast}
                onChange={(e) => updateSetting('highContrast', e.target.checked)}
                className="w-5 h-5 rounded text-primary focus:ring-primary cursor-pointer"
                aria-label="Toggle High Contrast"
              />
            </div>

            {/* 4. Dyslexia-Friendly Font */}
            <div className="flex items-center justify-between p-3.5 bg-surface-card border border-outline rounded-sm">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-sm bg-primary-tint text-primary flex items-center justify-center font-bold text-xs">
                  Aa
                </span>
                <div>
                  <p className="font-label text-label-md text-on-surface">
                    {settings.language === 'hi' ? 'डिस्लेक्सिया-अनुकूल फ़ॉन्ट' : 'Dyslexia-Friendly Font'}
                  </p>
                  <p className="font-body text-body-sm text-on-surface-muted">
                    Weighted baseline & extra letter spacing
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.dyslexicFont}
                onChange={(e) => updateSetting('dyslexicFont', e.target.checked)}
                className="w-5 h-5 rounded text-primary focus:ring-primary cursor-pointer"
                aria-label="Toggle Dyslexia-friendly font"
              />
            </div>

            {/* 5. Voice Read-Aloud (Web Speech TTS) */}
            <div className="p-4 bg-surface-card border border-outline rounded-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Volume2 className="w-4 h-4 text-primary" />
                  <span className="font-label text-label-md text-on-surface">
                    {settings.language === 'hi' ? 'वॉइस रीड-अलाउड (TTS)' : 'Voice Read-Aloud (TTS)'}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.voiceReadAloud}
                  onChange={(e) => updateSetting('voiceReadAloud', e.target.checked)}
                  className="w-5 h-5 rounded text-primary focus:ring-primary cursor-pointer"
                  aria-label="Toggle Voice Read Aloud"
                />
              </div>
              <p className="font-body text-body-sm text-on-surface-muted">
                {settings.language === 'hi'
                  ? 'स्क्रीन पर टेक्स्ट को हिंदी/अंग्रेज़ी में बोलकर सुनाएं।'
                  : 'Reads interactive screen text aloud using your browser speech engine.'}
              </p>
              <button
                type="button"
                onClick={handleTestSpeech}
                className="sn-btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5 text-primary" />
                {settings.language === 'hi' ? 'आवाज़ का परीक्षण करें' : 'Test Speech Engine'}
              </button>
            </div>
          </div>

          {/* Privacy Notice Footer (STRICT PRD REQUIREMENT) */}
          <div className="p-5 border-t border-outline bg-surface-card space-y-2">
            <div className="flex items-start gap-2.5 text-success">
              <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-label text-label-sm text-on-surface font-semibold">
                  {settings.language === 'hi' ? 'गोपनीयता की गारंटी' : 'Client-Side Privacy Guarantee'}
                </p>
                <p className="font-body text-body-sm text-on-surface-muted leading-relaxed">
                  {settings.language === 'hi'
                    ? 'ये सेटिंग्स केवल आपके स्थानीय ब्राउज़र में सहेजी जाती हैं और कभी भी SAP बैकएंड API या मैचिंग इंजन को नहीं भेजी जाती हैं।'
                    : 'These accessibility and language settings are stored strictly in your local browser (localStorage) and are NEVER transmitted to SAP HANA or any backend matching API.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
