import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const AccessibilityContext = createContext(null);

const STORAGE_KEY = 'skillnav_accessibility_settings';

const DEFAULT_SETTINGS = {
  fontSizePercent: 100, // 100% to 140%
  highContrast: false,
  dyslexicFont: false,
  voiceReadAloud: false,
  language: 'en',
};

export function AccessibilityProvider({ children }) {
  const { i18n } = useTranslation();
  const [settings, setSettings] = useState(() => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return DEFAULT_SETTINGS;
      }
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return DEFAULT_SETTINGS;
      const parsed = JSON.parse(stored);
      return parsed && typeof parsed === 'object'
        ? { ...DEFAULT_SETTINGS, ...parsed }
        : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Sync settings to localStorage and DOM
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Could not save accessibility settings to localStorage', e);
    }

    // Apply font size scale
    const root = document.documentElement;
    root.style.fontSize = `${(settings.fontSizePercent / 100) * 16}px`;

    // High Contrast class
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Dyslexic Font class
    if (settings.dyslexicFont) {
      root.classList.add('dyslexia-font');
    } else {
      root.classList.remove('dyslexia-font');
    }

    // Language sync
    if (settings.language && i18n.language !== settings.language) {
      i18n.changeLanguage(settings.language);
    }
  }, [settings, i18n]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const toggleLanguage = (lang) => {
    const target = lang || (settings.language === 'en' ? 'hi' : 'en');
    updateSetting('language', target);
    i18n.changeLanguage(target);
  };

  // Web Speech API Read Aloud
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel(); // Stop current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = settings.language === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSetting,
        toggleLanguage,
        speakText,
        isDrawerOpen,
        setIsDrawerOpen,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
}
