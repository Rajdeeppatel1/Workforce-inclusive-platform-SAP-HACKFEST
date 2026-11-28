import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccessibility } from '../context/AccessibilityContext';
import { useProfile } from '../context/ProfileContext';
import OnboardingPipelinePanel from '../components/OnboardingPipelinePanel';
import {
  Mic,
  MicOff,
  Sparkles,
  ShieldCheck,
  Check,
  Plus,
  X,
  ArrowRight,
  Accessibility,
  Radio,
  Lock,
} from 'lucide-react';

const PATHWAYS = [
  { id: 'First-Gen Student', labelEn: 'First-Gen Student', labelHi: 'प्रथम पीढ़ी का छात्र' },
  { id: 'Self-Taught', labelEn: 'Self-Taught', labelHi: 'स्व-प्रशिक्षित (Self-Taught)' },
  { id: 'Career Returner', labelEn: 'Career Returner', labelHi: 'करियर रिटर्नर (Career Returner)' },
  { id: 'Reskilling', labelEn: 'Reskilling', labelHi: 'रीस्किलिंग (Reskilling)' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { settings, toggleLanguage, setIsDrawerOpen } = useAccessibility();
  const { profile, addSkill, removeSkill, setPathway } = useProfile();

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState(
    settings.language === 'hi'
      ? '"मैं भोपाल से हूँ, मुझे Python, React, FastAPI और SQL आता है"'
      : '"I am from Bhopal, I have built projects with Python, React, FastAPI, and SQL"'
  );
  const [detectedLang, setDetectedLang] = useState('English (en-IN)');
  const [newSkillInput, setNewSkillInput] = useState('');
  const recognitionRef = useRef(null);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = settings.language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        setDetectedLang(settings.language === 'hi' ? 'Hindi (hi-IN)' : 'English (en-IN)');
        parseSkillsFromTranscript(currentTranscript);
      };

      recognition.onerror = (e) => {
        console.warn('Speech recognition error:', e.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [settings.language]);

  // Skill extraction from voice transcript
  const parseSkillsFromTranscript = (text) => {
    const commonSkills = [
      'python',
      'react',
      'fastapi',
      'sql',
      'docker',
      'javascript',
      'typescript',
      'tailwind',
      'sap',
      'hana',
      'git',
      'rest apis',
      'node',
    ];
    const lower = text.toLowerCase();
    commonSkills.forEach((skill) => {
      if (lower.includes(skill)) {
        addSkill(skill.toUpperCase() === 'SQL' ? 'SQL' : skill.charAt(0).toUpperCase() + skill.slice(1));
      }
    });
  };

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert(
        'Speech recognition is not supported in this browser. Use the Demo Voice Input button below!'
      );
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.lang = settings.language === 'hi' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
      } catch (e) {
        console.warn('Mic start error:', e);
      }
    }
  };

  // Instant Voice Input Simulation
  const triggerDemoHindiVoice = () => {
    const demoNatural = 'Fullstack software developer with hands-on experience in Python, React, FastAPI, SQL, and Docker containerization';
    setTranscript(`"${demoNatural}"`);
    setDetectedLang('Natural Language Voice Input Processed');
    ['Python', 'React', 'FastAPI', 'Docker', 'SQL'].forEach(addSkill);
  };

  const handleAddSkillKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (newSkillInput.trim()) {
        addSkill(newSkillInput.trim());
        setNewSkillInput('');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] -m-6 md:-m-8 grid grid-cols-1 lg:grid-cols-10 bg-white">
      {/* ═══════════════════════════════════════════════
          Left Panel (40%) — Deep Charcoal Black
          ═══════════════════════════════════════════════ */}
      <aside className="lg:col-span-4 bg-sidebar text-on-sidebar p-8 lg:p-12 flex flex-col justify-between gap-10 border-r border-outline/10">
        <div className="flex flex-col gap-8">
          {/* Top Logo & Language Switcher Pill */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                <rect width="36" height="36" rx="8" fill="#2563EB" />
                <path d="M11 23L17.5 11L25 23H11Z" stroke="#FFFFFF" strokeWidth="2.5" strokeLinejoin="round" />
                <circle cx="18" cy="20" r="2" fill="#FFFFFF" />
              </svg>
              <div className="flex flex-col">
                <span className="font-title text-title-lg text-on-sidebar">SkillNav</span>
                <span className="font-label text-label-sm text-on-sidebar-muted">
                  Opportunity Navigator
                </span>
              </div>
            </div>

            {/* Language Switcher Pill */}
            <div
              role="group"
              aria-label="Language switcher"
              className="inline-flex items-center rounded-full border border-on-sidebar-muted/40 p-1 bg-sidebar"
            >
              <button
                type="button"
                onClick={() => toggleLanguage('en')}
                className={`px-3 py-1 rounded-full font-label text-label-sm transition-colors duration-state-change ${
                  settings.language === 'en'
                    ? 'bg-primary text-on-primary'
                    : 'text-on-sidebar hover:text-white'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => toggleLanguage('hi')}
                className={`px-3 py-1 rounded-full font-label text-label-sm transition-colors duration-state-change ${
                  settings.language === 'hi'
                    ? 'bg-primary text-on-primary'
                    : 'text-on-sidebar hover:text-white'
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>

          {/* Bold Tagline */}
          <div className="flex flex-col gap-3 pt-2">
            <h1 className="font-display text-display-lg text-on-sidebar text-balance leading-tight">
              {settings.language === 'hi'
                ? 'कौशल सबसे पहले। सभी के लिए निष्पक्ष।'
                : 'Skills-first. Fair for everyone.'}
            </h1>
            <p className="font-body text-body-lg text-on-sidebar-muted leading-relaxed text-pretty">
              {settings.language === 'hi'
                ? 'कोई बायोडाटा पूर्वाग्रह नहीं, कोई कॉलेज-टियर फ़िल्टर नहीं। अपनी भाषा में साबित करें कि आप क्या बना सकते हैं।'
                : 'No resume bias, no college-tier filters. Show what you can build in your own words.'}
            </p>
          </div>

          {/* 3 Numbered Steps with White Icons */}
          <ol className="flex flex-col gap-5 pt-2">
            {[
              {
                num: '1',
                titleEn: '1. Speak or type your skills',
                titleHi: '1. अपने कौशल बोलें या लिखें',
              },
              {
                num: '2',
                titleEn: '2. Blind matching without bias',
                titleHi: '2. बिना पूर्वाग्रह के ब्लाइंड मैचिंग',
              },
              {
                num: '3',
                titleEn: '3. Get a clear roadmap',
                titleHi: '3. स्पष्ट करियर रोडमैप पाएं',
              },
            ].map((step, idx) => (
              <li key={idx} className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-sm border border-on-sidebar-muted/40 flex items-center justify-center shrink-0 text-white font-bold text-sm bg-white/5">
                  {step.num}
                </span>
                <span className="font-title text-title-md text-on-sidebar">
                  {settings.language === 'hi' ? step.titleHi : step.titleEn}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-white/10 flex items-center gap-2.5 text-on-sidebar-muted text-xs">
          <Lock className="w-4 h-4 text-primary shrink-0" />
          <span className="font-body text-body-sm">
            WCAG 2.1 AA Accessible • Voice &amp; Screen-Reader Ready
          </span>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════
          Right Panel (60%) — Pure White Interactive Onboarding
          ═══════════════════════════════════════════════ */}
      <main className="lg:col-span-6 bg-surface text-on-surface p-8 lg:p-12 flex flex-col justify-between gap-8">
        {/* Top Bar: Accessibility & Blind Pill */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <span
            role="status"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-tint text-on-primary-tint font-label text-label-sm border border-blue-200"
          >
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Blind Matching Active</span>
          </span>

          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="sn-btn-secondary py-1.5 px-3.5 text-sm flex items-center gap-2 border-outline hover:border-outline-strong"
          >
            <Accessibility className="w-4 h-4 text-primary" />
            <span>Accessibility &amp; Language (EN / हिंदी)</span>
          </button>
        </header>

        {/* 4-Step Progress Bar */}
        <nav aria-label="Onboarding steps" className="grid grid-cols-4 gap-3">
          <div className="flex flex-col gap-2">
            <div className="h-1.5 rounded-full bg-primary" />
            <span className="font-label text-label-sm text-on-surface">1. Language</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-1.5 rounded-full bg-primary" />
            <span className="font-label text-label-sm text-on-surface">2. Privacy</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-1.5 rounded-full bg-primary ring-2 ring-primary/20" />
            <span className="font-label text-label-sm text-primary font-bold">3. Skills</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-1.5 rounded-full bg-outline" />
            <span className="font-label text-label-sm text-on-surface-muted">4. Evidence</span>
          </div>
        </nav>

        {/* Centerpiece Card */}
        <section className="bg-surface-card border border-outline rounded p-8 flex flex-col gap-6">
          {/* Mic Button & Title */}
          <div className="flex flex-col items-center text-center gap-3">
            <div className="relative">
              <button
                type="button"
                id="mic-btn"
                onClick={toggleMic}
                aria-label="Speak your skills in Hindi or English"
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
                  isRecording
                    ? 'bg-error text-white animate-pulse ring-8 ring-error/20'
                    : 'bg-primary text-white hover:bg-primary-deep'
                }`}
              >
                {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="font-title text-title-lg text-on-surface">
                {settings.language === 'hi'
                  ? 'हिंदी या अंग्रेज़ी में अपने कौशल बताएं'
                  : 'Speak your skills in Hindi or English'}
              </h2>
              <p className="font-body text-body-sm text-on-surface-muted">
                {settings.language === 'hi'
                  ? 'माइक दबाकर बोलें या नीचे लिखें — स्किलनैव स्वचालित रूप से कौशल निकालेगा।'
                  : 'Tap the microphone or type below — SkillNav extracts verified skills automatically.'}
              </p>
            </div>

            {/* Instant Hackathon Demo Button */}
            <button
              type="button"
              onClick={triggerDemoHindiVoice}
              className="mt-1 inline-flex items-center gap-2 px-4 py-1.5 bg-primary-tint text-primary hover:bg-blue-100 rounded-full text-xs font-label font-semibold border border-blue-200 transition-colors"
            >
              <Radio className="w-3.5 h-3.5 text-primary animate-pulse" />
              Demo Hindi Voice Input (भोपाल से हूँ...)
            </button>
          </div>

          {/* Live Transcript Box */}
          <div className="bg-surface border border-outline rounded p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-label text-label-sm text-primary flex items-center gap-1.5 font-semibold">
                <Sparkles className="w-4 h-4 text-primary" />
                Live Voice Transcript
              </span>
              <span className="font-label text-label-sm text-on-surface-muted">
                {detectedLang}
              </span>
            </div>
            <p className="font-body text-body-lg text-on-surface font-medium leading-relaxed italic">
              {transcript}
            </p>
          </div>

          {/* Extracted Skills Chips */}
          <div className="space-y-2">
            <label className="font-label text-label-md text-on-surface">
              Extracted Skills ({profile.skills.length})
            </label>
            <div className="flex flex-wrap gap-2 min-h-[38px] p-2 bg-surface border border-outline rounded-sm">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary text-white rounded-full text-xs font-label font-medium shadow-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-red-200 transition-colors"
                    aria-label={`Remove ${skill}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
              {profile.skills.length === 0 && (
                <span className="text-xs text-on-surface-muted self-center">
                  No skills extracted yet. Speak or type below.
                </span>
              )}
            </div>
          </div>

          {/* Text Input to Add More Skills */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              onKeyDown={handleAddSkillKey}
              placeholder="Type a skill (e.g. Docker, SAP BTP, TypeScript) and press Enter..."
              className="sn-input"
            />
            <button
              type="button"
              onClick={() => {
                if (newSkillInput.trim()) {
                  addSkill(newSkillInput.trim());
                  setNewSkillInput('');
                }
              }}
              className="sn-btn-primary px-5 shrink-0"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          {/* Selectable Pathway Pills */}
          <div className="flex flex-col gap-3">
            <span className="font-label text-label-md text-on-surface">
              Select your learning pathway (optional)
            </span>
            <div className="flex flex-wrap gap-2.5">
              {PATHWAYS.map((p) => {
                const isActive = profile.pathway === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPathway(p.id)}
                    className={isActive ? 'sn-pill-active' : 'sn-pill'}
                  >
                    <span>{settings.language === 'hi' ? p.labelHi : p.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Verified Onboarding Pipeline (Resume Upload, Redaction, AI Extract, Match & PDF) */}
        <OnboardingPipelinePanel
          profile={profile}
          transcript={transcript}
          onSkillsConfirmed={(skillsList) => {
            skillsList.forEach((sk) => addSkill(sk));
          }}
        />

        {/* Bottom Continue CTA */}
        <footer className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <span className="font-body text-body-sm text-on-surface-muted">
            Step 3 of 4 • Your identity stays hidden from employers
          </span>
          <button
            type="button"
            onClick={() => navigate('/evidence')}
            className="sn-btn-primary"
          >
            <span>Continue to Evidence</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </footer>
      </main>
    </div>
  );
}
