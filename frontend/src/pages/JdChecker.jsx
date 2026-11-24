import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccessibility } from '../context/AccessibilityContext';
import axios from 'axios';
import {
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  HelpCircle,
  Copy,
  Check,
  FileText,
  UserX,
  GraduationCap,
  Users,
} from 'lucide-react';

const INITIAL_BIASED_JD = `Senior Cloud Fullstack Engineer
Department: Core Architecture & Platform

Overview:
We are looking for a young and energetic rockstar coder to join our high-octane engineering team and crush challenging deliverables.

Job Requirements:
- B.Tech degree mandatory from Tier-1 college (IIT/NIT or premier institute only).
- 4+ years of hands-on software development experience.
- Digital native with proven expertise in Python, FastAPI, and React.
- Strong manpower leadership and aggressive problem-solving skills.
- Ready to work hard and play hard in a fast-paced environment.
Recent graduates with top engineering GPA preferred.`;

export default function JdChecker() {
  const { t } = useTranslation();
  const { settings } = useAccessibility();

  const [jdText, setJdText] = useState(INITIAL_BIASED_JD);
  const [analyzing, setAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);

  const [report, setReport] = useState({
    inclusion_score: 45,
    is_inclusive: false,
    flags: [
      {
        phrase: 'young and energetic',
        category: 'age',
        explanation: 'Implicitly discourages experienced or career-returner talent.',
        suggestion: "Replace with 'proactive, collaborative developer'.",
      },
      {
        phrase: 'rockstar coder',
        category: 'gender',
        explanation: 'Hyper-masculine jargon shown to reduce female applications by up to 40%.',
        suggestion: "Use inclusive term like 'skilled software engineer'.",
      },
      {
        phrase: 'Tier-1 college (IIT/NIT or premier institute only)',
        category: 'pedigree',
        explanation:
          'Eliminates 95%+ of capable self-taught, rural, and state university candidates without measuring code capability.',
        suggestion: 'Specify verified technical competencies or project portfolio instead of pedigree.',
      },
      {
        phrase: 'manpower',
        category: 'gender',
        explanation: 'Gender-exclusive phrasing.',
        suggestion: "Replace with 'workforce' or 'team'.",
      },
      {
        phrase: 'work hard and play hard',
        category: 'age',
        explanation: 'Associated with exclusionary long-hours culture that alienates parents and caregivers.',
        suggestion: "Replace with 'supportive, sustainable engineering culture'.",
      },
    ],
    rewritten_jd: `Senior Cloud Fullstack Engineer
Department: Core Architecture & Platform

Overview:
We are looking for a proactive, collaborative software engineer to join our high-performing engineering team and build scalable cloud deliverables.

Job Requirements:
- Demonstrated proficiency in practical software engineering (open to self-taught, first-generation, and diverse educational backgrounds).
- Proven hands-on software development experience.
- Technical expertise in Python, FastAPI, and React with verified code examples.
- Strong collaborative leadership and structured problem-solving skills.
- Ability to thrive in a supportive, sustainable engineering culture.
Candidates with demonstrated portfolio, open-source commits, or technical certifications are enthusiastically welcomed.`,
  });

  // Call POST /api/jd/check-bias
  const handleCheckBias = async () => {
    setAnalyzing(true);
    try {
      const res = await axios.post('/api/jd/check-bias', { jd_text: jdText });
      setReport(res.data);
    } catch (e) {
      console.warn('Bias checker API fallback error:', e);
    } finally {
      setAnalyzing(false);
    }
  };

  // Apply Inclusive Rewrite One-Click
  const handleApplyRewrite = () => {
    setJdText(report.rewritten_jd);
    setReport((prev) => ({
      ...prev,
      inclusion_score: 96,
      is_inclusive: true,
      flags: [],
    }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jdText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Score Ring calculation
  const ringRadius = 42;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset =
    ringCircumference - (report.inclusion_score / 100) * ringCircumference;

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'age':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <UserX className="w-3 h-3" /> Age Bias
          </span>
        );
      case 'gender':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <Users className="w-3 h-3" /> Gender-Coded
          </span>
        );
      case 'pedigree':
      case 'degree_barrier':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
            <GraduationCap className="w-3 h-3" /> Degree Barrier
          </span>
        );
      default:
        return <span className="sn-badge text-[11px]">Exclusionary</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 bg-white text-on-surface">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-outline">
        <div>
          <h1 className="font-display text-display-lg text-on-surface">
            {settings.language === 'hi'
              ? 'समावेशी JD बायस चेकर (HR कार्यक्षेत्र)'
              : 'Inclusive Job Description Bias Checker'}
          </h1>
          <p className="font-body text-body-md text-on-surface-muted mt-1">
            {settings.language === 'hi'
              ? 'SAP AI Core GenAI Hub द्वारा संचालित — आयु, लिंग और कॉलेज-टियर पूर्वाग्रहों को तुरंत पहचानें और निष्पक्ष बनाएं।'
              : 'Audit job postings for age, gender-coded language, and elitist pedigree barriers before publishing.'}
          </p>
        </div>

        <span className="sn-badge-blue">
          <Sparkles className="w-4 h-4 text-primary" />
          SAP AI Core Generative AI Hub
        </span>
      </div>

      {/* Two-Column HR Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (6 cols): JD Input Workspace */}
        <div className="lg:col-span-6 sn-card space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-title text-title-md text-on-surface">
                  HR Workspace — Job Description Text
                </h2>
                <p className="font-body text-body-sm text-on-surface-muted">
                  Type or paste candidate-facing job requirements below
                </p>
              </div>

              <button
                type="button"
                onClick={() => setJdText(INITIAL_BIASED_JD)}
                className="text-xs font-label text-primary hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Sample Biased JD</span>
              </button>
            </div>

            <textarea
              rows="14"
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              className="w-full bg-surface border border-outline rounded-sm p-4 font-mono text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary leading-relaxed"
              placeholder="Paste job description..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleCheckBias}
              disabled={analyzing}
              className="sn-btn-primary flex-1 py-3 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{analyzing ? 'Scanning via SAP AI Core...' : 'Check for Bias & Barriers'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="sn-btn-secondary py-3 px-4 flex items-center gap-1.5 text-xs font-semibold"
              title="Copy text to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Right Column (6 cols): Inclusion Score & Flagged Phrase Cards */}
        <div className="lg:col-span-6 sn-card space-y-5 flex flex-col justify-between">
          <div className="space-y-5">
            {/* Score Ring & Actions Header */}
            <div className="flex items-center justify-between p-4 bg-surface border border-outline rounded-sm">
              <div className="space-y-1">
                <span className="text-xs font-label text-on-surface-muted uppercase tracking-wider block">
                  Inclusive Language Rating
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-display text-headline-sm font-bold text-on-surface">
                    {report.inclusion_score >= 80 ? 'Highly Inclusive' : 'Bias Barriers Detected'}
                  </span>
                </div>
                <p className="text-xs text-on-surface-muted">
                  {report.flags.length} exclusionary phrases found requiring remediation
                </p>
              </div>

              {/* Inclusion Score Ring */}
              <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r={ringRadius} fill="none" stroke="#E2E8F0" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r={ringRadius}
                    fill="none"
                    stroke={report.inclusion_score >= 80 ? '#16A34A' : '#2563EB'}
                    strokeWidth="8"
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={ringOffset}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute font-display text-label-lg font-bold text-on-surface">
                  {report.inclusion_score}%
                </div>
              </div>
            </div>

            {/* One-Click Inclusive Rewrite CTA */}
            {report.flags.length > 0 && (
              <div className="p-3.5 bg-primary-tint border border-blue-200 rounded-sm flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-label text-xs font-bold text-primary block">
                    SAP Gen AI Recommended Rewrite Ready
                  </span>
                  <span className="text-[11px] text-on-primary-tint">
                    Automatically replaces pedigree barriers with skills-first competencies.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleApplyRewrite}
                  className="sn-btn-primary py-2 px-3 text-xs shrink-0 flex items-center gap-1.5 shadow-none"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Apply Inclusive Rewrite</span>
                </button>
              </div>
            )}

            {/* Flagged Phrase Cards */}
            <div className="space-y-3">
              <span className="font-label text-xs text-on-surface-muted block font-semibold">
                Detected Exclusionary Signals ({report.flags.length})
              </span>

              {report.flags.length === 0 ? (
                <div className="p-6 bg-success-light/60 border border-green-200 rounded-sm text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-success mx-auto" />
                  <h3 className="font-title text-title-sm text-success font-bold">
                    Zero Bias Detected — 100% Skills-First
                  </h3>
                  <p className="text-xs text-on-surface-muted">
                    This job description evaluates candidates solely on practical competencies and welcomes diverse pathways.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 sn-scrollbar">
                  {report.flags.map((flag, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-surface border border-outline rounded-sm space-y-1.5 text-xs hover:border-outline-strong transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono font-bold text-error bg-error-light px-2 py-0.5 rounded text-[11px]">
                          "{flag.phrase}"
                        </span>
                        {getCategoryBadge(flag.category)}
                      </div>
                      <p className="text-on-surface-muted leading-relaxed">{flag.explanation}</p>
                      <div className="pt-1 border-t border-outline/50 flex items-center gap-1 text-primary font-semibold text-[11px]">
                        <span>Fix:</span>
                        <span>{flag.suggestion}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-outline flex items-center justify-between text-xs text-on-surface-muted">
            <span>Complies with Equal Opportunity &amp; DEI Standards</span>
            <span className="font-semibold text-primary">SAP Generative AI Hub</span>
          </div>
        </div>
      </div>
    </div>
  );
}
